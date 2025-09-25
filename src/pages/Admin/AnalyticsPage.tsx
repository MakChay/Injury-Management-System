import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts'

export function AnalyticsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [injuries, setInjuries] = useState<any[]>([])
  const [filters, setFilters] = useState({ season: 'all', sport: 'all', severity: 'all' })
  const [trend, setTrend] = useState<any[]>([])
  const [cohorts, setCohorts] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    compute()
  }, [students, injuries, filters])

  const load = async () => {
    const [students, injuries] = await Promise.all([api.getUsers('student'), api.getAllInjuries()])
    setStudents(students as any)
    setInjuries(injuries as any)
  }

  const compute = () => {
    const season = filters.season
    const sport = filters.sport
    const severity = filters.severity

    const filtered = (injuries as any[]).filter((inj: any) => {
      const yr = new Date(inj.date_reported).getFullYear().toString()
      if (season !== 'all' && yr !== season) return false
      if (severity !== 'all' && inj.severity !== severity) return false
      if (sport !== 'all') {
        const s = (students as any[]).find((st: any) => st.id === inj.student_id)
        if ((s?.sport || 'Unknown') !== sport) return false
      }
      return true
    })

    const monthly: Record<string, number> = {}
    filtered.forEach((inj: any) => {
      const d = new Date(inj.date_reported)
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`
      monthly[key] = (monthly[key] || 0) + 1
    })
    setTrend(Object.entries(monthly).sort(([a],[b]) => a.localeCompare(b)).map(([month, value]) => ({ month, value })))

    const cohortMap: Record<string, { name: string; value: number }> = {}
    filtered.forEach((inj: any) => {
      const s = (students as any[]).find((st: any) => st.id === inj.student_id)
      const key = s?.sport || 'Unknown'
      cohortMap[key] = cohortMap[key] ? { name: key, value: cohortMap[key].value + 1 } : { name: key, value: 1 }
    })
    setCohorts(Object.values(cohortMap))
  }

  const exportCsv = () => {
    const headers = ['id','student_id','injury_type','severity','body_part','date_reported','date_returned','days_lost','status']
    const rows = injuries.map((i: any) => headers.map((h) => JSON.stringify(i[h] ?? '')).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics_injuries.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Season (Year)</label>
            <select className="w-full border rounded px-3 py-2" value={filters.season} onChange={(e) => setFilters({ ...filters, season: e.target.value })}>
              <option value="all">All</option>
              {[...new Set(injuries.map((i: any) => new Date(i.date_reported).getFullYear()))].sort().map((y: any) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sport</label>
            <select className="w-full border rounded px-3 py-2" value={filters.sport} onChange={(e) => setFilters({ ...filters, sport: e.target.value })}>
              <option value="all">All</option>
              {[...new Set(students.map((s: any) => s.sport || 'Unknown'))].sort().map((s: any) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Severity</label>
            <select className="w-full border rounded px-3 py-2" value={filters.severity} onChange={(e) => setFilters({ ...filters, severity: e.target.value })}>
              <option value="all">All</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex items-end justify-end">
            <button className="px-4 py-2 border rounded" onClick={exportCsv}>Export CSV</button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Monthly Incidence (Filtered)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Cohort Comparison (Injuries by Sport)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cohorts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

