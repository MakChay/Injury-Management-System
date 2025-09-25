import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Plus, MapPin } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

interface AppointmentForm {
  practitioner_id: string
  appointment_date: string
  duration_minutes: number
  location?: string
  notes?: string
}

export function AppointmentsPage() {
  const { user, isStudent, isPractitioner, isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AppointmentForm>({
    practitioner_id: '',
    appointment_date: '',
    duration_minutes: 45,
    location: '',
    notes: ''
  })
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [assignedStudents, setAssignedStudents] = useState<any[]>([])
  // const [allStudents, setAllStudents] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    fetchAppointments()
    preloadSelectors()
  }, [user])

  const fetchAppointments = async () => {
    if (!user) return
    try {
      setLoading(true)
      const role = isStudent ? 'student' : isPractitioner ? 'practitioner' : 'admin'
      const data = await api.getAppointments(user.id, role as any)
      setAppointments(data)
    } finally {
      setLoading(false)
    }
  }

  const preloadSelectors = async () => {
    if (!user) return
    if (isStudent || isAdmin) {
      const pracs = await api.getUsers('practitioner')
      setPractitioners(pracs)
    }
    if (isPractitioner) {
      const [assignments, students] = await Promise.all([
        api.getAssignments(user.id),
        api.getUsers('student'),
      ])
      const assignedIds = new Set(assignments.map((a: any) => a.student_id))
      setAssignedStudents(students.filter((s: any) => assignedIds.has(s.id)))
    } else if (isAdmin) {
      // Admin selector deferred
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const payload = {
      student_id: isStudent ? user.id : form.practitioner_id,
      practitioner_id: isStudent ? form.practitioner_id : user.id,
      appointment_date: form.appointment_date,
      duration_minutes: form.duration_minutes,
      location: form.location || null,
      notes: form.notes || null,
    }
    await api.createAppointment(payload)
    setShowForm(false)
    await fetchAppointments()
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
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-gray-600">View and schedule your appointments</p>
        </div>
        {(isStudent || isPractitioner) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </motion.button>
        )}
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="bg-white p-4 rounded-lg border space-y-4"
        >
          {isStudent && (
            <div>
              <label className="block text-sm font-medium mb-1">Practitioner</label>
              <select
                value={form.practitioner_id}
                onChange={(e) => setForm({ ...form, practitioner_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select practitioner</option>
                {practitioners.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>
            </div>
          )}
          {isPractitioner && (
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                value={form.practitioner_id}
                onChange={(e) => setForm({ ...form, practitioner_id: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select student</option>
                {assignedStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (min)</label>
              <input
                type="number"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                min={15}
                step={15}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Room / Venue"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
          </div>
        </motion.form>
      )}

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Your Appointments</h2>
        </div>
        <div className="divide-y">
          {appointments.map((apt) => (
            <div key={apt.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">{new Date(apt.appointment_date).toLocaleString()}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{apt.duration_minutes} min</span>
                    {isStudent && (
                      <>
                        <span>•</span>
                        <span>With Practitioner: {practitioners.find(p => p.id === apt.practitioner_id)?.full_name || apt.practitioner_id}</span>
                      </>
                    )}
                    {isPractitioner && (
                      <>
                        <span>•</span>
                        <span>With Student: {assignedStudents.find(s => s.id === apt.student_id)?.full_name || apt.student_id}</span>
                      </>
                    )}
                    {apt.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-4 h-4" />
                        <span>{apt.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">{apt.status}</span>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="p-6 text-center text-gray-500">No appointments yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

