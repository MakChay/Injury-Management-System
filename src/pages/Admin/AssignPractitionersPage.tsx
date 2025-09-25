import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Activity, Check, Wand2 } from 'lucide-react'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

export function AssignPractitionersPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<any[]>([])
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [injuries, setInjuries] = useState<any[]>([])
  const [form, setForm] = useState({ student_id: '', practitioner_id: '', injury_id: '', notes: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const [stu, prac, inj] = await Promise.all([
      api.getUsers('student'),
      api.getUsers('practitioner'),
      api.getInjuries(),
    ])
    setStudents(stu)
    setPractitioners(prac)
    setInjuries(inj)
    setLoading(false)
  }

  const assign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    await api.assignPractitioner({ ...form, assigned_by: user.id })
    setForm({ student_id: '', practitioner_id: '', injury_id: '', notes: '' })
  }

  const autoAssign = () => {
    // naive heuristic: pick earliest 'reported' injury and least-loaded practitioner
    const candidateInjury = injuries.find((i) => i.status === 'reported') || injuries[0]
    if (!candidateInjury) return
    const studentId = candidateInjury.student_id
    const loadMap: Record<string, number> = {}
    practitioners.forEach((p) => { loadMap[p.id] = 0 })
    // derive loads by sport/specialization match (mock heuristic)
    practitioners.forEach((p) => {
      loadMap[p.id] += (p.specialization && candidateInjury.injury_type && p.specialization.toLowerCase().includes('physio')) ? 0 : 1
    })
    const best = practitioners.sort((a, b) => (loadMap[a.id] || 0) - (loadMap[b.id] || 0))[0]
    setForm({ student_id: studentId, practitioner_id: best?.id || '', injury_id: candidateInjury.id, notes: 'Auto-assigned' })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-gray-600">Assign practitioners to student injuries</p>
        </div>
        <button onClick={autoAssign} className="px-3 py-2 border rounded flex items-center space-x-2 hover:bg-gray-50"><Wand2 className="w-4 h-4" /><span>Auto-assign</span></button>
      </div>

      <form onSubmit={assign} className="bg-white border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} className="w-full border rounded px-3 py-2" required>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Practitioner</label>
            <select value={form.practitioner_id} onChange={(e) => setForm({ ...form, practitioner_id: e.target.value })} className="w-full border rounded px-3 py-2" required>
              <option value="">Select practitioner</option>
              {practitioners.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Injury</label>
            <select value={form.injury_id} onChange={(e) => setForm({ ...form, injury_id: e.target.value })} className="w-full border rounded px-3 py-2" required>
              <option value="">Select injury</option>
              {injuries.map((i) => (
                <option key={i.id} value={i.id}>{i.injury_type} • {i.severity}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex justify-end">
          <motion.button whileTap={{ scale: 0.98 }} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Assign</span>
          </motion.button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b flex items-center space-x-2"><Users className="w-5 h-5 text-blue-600" /><h2 className="font-semibold">Students</h2></div>
          <div className="divide-y">
            {students.map((s) => (
              <div key={s.id} className="p-4">{s.full_name} <span className="text-xs text-gray-500">{s.email}</span></div>
            ))}
          </div>
        </div>
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b flex items-center space-x-2"><Activity className="w-5 h-5 text-purple-600" /><h2 className="font-semibold">Recent Injuries</h2></div>
          <div className="divide-y">
              {injuries.slice(0, 8).map((i) => (
              <div key={i.id} className="p-4">{i.injury_type} • {i.severity} • {new Date(i.date_reported).toLocaleDateString()}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

