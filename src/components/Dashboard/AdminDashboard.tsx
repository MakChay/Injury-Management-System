import { motion } from 'framer-motion'
import { Users, Activity, TrendingUp, AlertTriangle, Calendar, UserPlus } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
//
import { api } from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function AdminDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPractitioners: 0,
    activeInjuries: 0,
    pendingAssignments: 0,
    totalAppointments: 0,
    recoveryRate: 0
  })
  const [injuryTrends, setInjuryTrends] = useState<any[]>([])
  const [severityData, setSeverityData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [workload, setWorkload] = useState<any[]>([])
  const [sportData, setSportData] = useState<any[]>([])
  const [incidenceBySport, setIncidenceBySport] = useState<any[]>([])
  const [timeLossBySeverity, setTimeLossBySeverity] = useState<any[]>([])
  const [recurrenceRate, setRecurrenceRate] = useState(0)
  const [rtpTime, setRtpTime] = useState<number | null>(null)
  const [filteredExport, setFilteredExport] = useState<any[]>([])
  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd] = useState('')
  const [filterSport, setFilterSport] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const fs = params.get('start') || ''
    const fe = params.get('end') || ''
    const sp = params.get('sport') || 'all'
    const sv = params.get('severity') || 'all'
    setFilterStart(fs)
    setFilterEnd(fe)
    setFilterSport(sp)
    setFilterSeverity(sv)
    fetchDashboardData(fs, fe, sp, sv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const fetchDashboardData = async (
    start = filterStart,
    end = filterEnd,
    sport = filterSport,
    severity = filterSeverity,
  ) => {
    try {
      setLoading(true)
      
      // Fetch user statistics
      const [students, practitioners, injuries] = await Promise.all([
        api.getUsers('student'),
        api.getUsers('practitioner'),
        api.getInjuries(),
      ])
      const appointments = await api.getAppointments('', 'admin' as any)
      const allInjuries = await api.getAllInjuries()
      const allRtp = await api.getAllRtpChecklists()

      // Filters
      const startDate = start ? new Date(start) : null
      const endDate = end ? new Date(end) : null
      const filteredInjuries = (injuries as any[]).filter((inj: any) => {
        const d = new Date(inj.date_reported)
        if (startDate && d < startDate) return false
        if (endDate && d > endDate) return false
        if (severity !== 'all' && inj.severity !== severity) return false
        if (sport !== 'all') {
          const s = (students as any[]).find((st: any) => st.id === inj.student_id)
          const sport = s?.sport || 'Unknown'
          if (sport !== sport) return false
        }
        return true
      })
      setFilteredExport(filteredInjuries)

      const activeInjuries = injuries.filter(i => 
        ['reported', 'assigned', 'in_treatment', 'recovering'].includes(i.status)
      ).length

      const pendingAssignments = injuries.filter(i => i.status === 'reported').length
      const resolvedInjuries = injuries.filter(i => i.status === 'resolved').length
      const recoveryRate = injuries.length > 0 ? Math.round((resolvedInjuries / injuries.length) * 100) : 0

      setStats({
        totalStudents: students.length,
        totalPractitioners: practitioners.length,
        activeInjuries,
        pendingAssignments,
        totalAppointments: appointments.length,
        recoveryRate
      })

      // Process injury trends by month (filtered)
      const monthlyData: Record<string, number> = {}
      ;(filteredInjuries as any[]).forEach((injury: any) => {
        const d = new Date(injury.date_reported)
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
        monthlyData[key] = (monthlyData[key] || 0) + 1
      })

      const trendsData = Object.entries(monthlyData)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, injuries: count }))

      setInjuryTrends(trendsData)

      // Process severity distribution (filtered)
      const severityCount: Record<string, number> = {}
      ;(filteredInjuries as any[]).forEach((injury: any) => {
        const key = injury.severity as string
        severityCount[key] = (severityCount[key] || 0) + 1
      })

      const severityColors = {
        mild: '#fbbf24',
        moderate: '#fb923c',
        severe: '#ef4444',
        critical: '#dc2626'
      }

      const severityChartData = Object.entries(severityCount).map(([severity, count]) => ({
        name: severity,
        value: count,
        color: severityColors[severity as keyof typeof severityColors]
      }))

      setSeverityData(severityChartData)

      // Incidence by sport (filtered)
      const sportMap: Record<string, number> = {}
      ;(filteredInjuries as any[]).forEach((inj: any) => {
        const s = students.find((st: any) => st.id === inj.student_id)
        const key = (s?.sport || 'Unknown') as string
        sportMap[key] = (sportMap[key] || 0) + 1
      })
      setIncidenceBySport(Object.entries(sportMap).map(([name, value]) => ({ name, value })))

      // Actual time-loss by severity using date_returned/days_lost when available
      const lossAgg: Record<string, number> = {}
      ;(filteredInjuries as any[]).forEach((inj: any) => {
        let days = 0
        if (typeof inj.days_lost === 'number') {
          days = inj.days_lost
        } else if (inj.date_returned) {
          const from = new Date(inj.date_occurred || inj.date_reported)
          const to = new Date(inj.date_returned)
          days = Math.max(0, Math.round((to.getTime() - from.getTime()) / (1000*60*60*24)))
        } else {
          days = 0
        }
        const sv = inj.severity || 'mild'
        lossAgg[sv] = (lossAgg[sv] || 0) + days
      })
      setTimeLossBySeverity(Object.entries(lossAgg).map(([name, value]) => ({ name, value })))

      // Recurrence: same injury_type reported more than once by same student
      const keyCount: Record<string, number> = {}
      ;(allInjuries as any[]).forEach((inj: any) => {
        const key = `${inj.student_id}:${inj.injury_type}`
        keyCount[key] = (keyCount[key] || 0) + 1
      })
      const recurrences = Object.values(keyCount).filter((c) => c > 1).length
      setRecurrenceRate(allInjuries.length ? Math.round((recurrences / allInjuries.length) * 100) : 0)

      // RTP time: difference between created_at and cleared_at for cleared checklists
      const cleared = (allRtp as any[]).filter((r: any) => r.status === 'cleared' && r.cleared_at)
      if (cleared.length) {
        const avg = Math.round(
          cleared.reduce((sum: number, r: any) => sum + (new Date(r.cleared_at).getTime() - new Date(r.created_at).getTime()), 0) / cleared.length / (1000*60*60*24)
        )
        setRtpTime(avg)
      } else {
        setRtpTime(null)
      }

      // Per-sport distribution
      const studentSports = students.reduce((acc: any, s: any) => {
        const key = s.sport || 'Unknown'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
      setSportData(Object.entries(studentSports).map(([name, value]) => ({ name, value })))

      // Practitioner workload: number of active assignments per practitioner
      const assignments = await api.getAssignments()
      const workloadMap: Record<string, number> = {}
      ;(assignments as any[]).forEach((a: any) => {
        if (a.active) workloadMap[a.practitioner_id] = (workloadMap[a.practitioner_id] || 0) + 1
      })
      const practitionerMap = new Map((practitioners as any[]).map((p: any) => [p.id, p.full_name]))
      setWorkload(Object.entries(workloadMap).map(([id, count]) => ({ name: practitionerMap.get(id) || id, value: count })))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={filterStart} onChange={(e) => setFilterStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={filterEnd} onChange={(e) => setFilterEnd(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sport</label>
            <select className="w-full border rounded px-3 py-2" value={filterSport} onChange={(e) => setFilterSport(e.target.value)}>
              <option value="all">All</option>
              <option value="Rugby">Rugby</option>
              <option value="Soccer">Soccer</option>
              <option value="Athletics">Athletics</option>
              <option value="Basketball">Basketball</option>
              <option value="Swimming">Swimming</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Severity</label>
            <select className="w-full border rounded px-3 py-2" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
              <option value="all">All</option>
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 border rounded" onClick={() => {
            const params = new URLSearchParams()
            if (filterStart) params.set('start', filterStart)
            if (filterEnd) params.set('end', filterEnd)
            if (filterSport !== 'all') params.set('sport', filterSport)
            if (filterSeverity !== 'all') params.set('severity', filterSeverity)
            navigate({ search: params.toString() })
          }}>Apply</button>
          <button className="ml-2 px-4 py-2 border rounded" onClick={() => {
            setFilterStart(''); setFilterEnd(''); setFilterSport('all'); setFilterSeverity('all');
            navigate({ search: '' })
          }}>Reset</button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and analytics</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/assign-practitioners">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Assign Practitioner</span>
            </motion.button>
          </Link>
          <Link to="/analytics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Full Analytics</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practitioners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPractitioners}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Injuries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeInjuries}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recoveryRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Injury Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Injury Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={injuryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="injuries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Injury Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Injury Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Students by Sport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Students by Sport</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Practitioner Workload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Practitioner Workload (Active Assignments)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workload}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Incidence by Sport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Injury Incidence by Sport</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidenceBySport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time-loss by Severity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimated Time-loss by Severity (days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeLossBySeverity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* KPI Row: Recurrence and RTP time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Recurrence Rate</div>
          <div className="text-3xl font-bold">{recurrenceRate}%</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-sm text-gray-600">Avg. RTP Time</div>
          <div className="text-3xl font-bold">{rtpTime !== null ? `${rtpTime} days` : '—'}</div>
        </div>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button className="px-4 py-2 border rounded" onClick={() => {
          const headers = ['id','student_id','injury_type','severity','body_part','date_reported','date_returned','days_lost','status']
          const rows = filteredExport.map((i: any) => headers.map((h) => JSON.stringify(i[h] ?? '')).join(','))
          const csv = [headers.join(','), ...rows].join('\n')
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'injuries_export.csv'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }}>Export CSV</button>
      </div>
    </div>
  )
}