import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
//

export function RecoveryLogsPage() {
  const { user, isPractitioner } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    assignment_id: '',
    progress_notes: '',
    exercises: '',
    pain_level: 5,
    mobility_score: 5,
    next_session_plan: ''
  })
  const [assignments, setAssignments] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    load()
    preloadAssignments()
  }, [user])

  const load = async () => {
    if (!user) return
    const data = await api.getRecoveryLogs({ practitioner_id: user.id })
    setLogs(data)
  }

  const preloadAssignments = async () => {
    if (!user) return
    const data = await api.getAssignments(user.id)
    setAssignments(data)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !isPractitioner) return
    try {
      await api.addRecoveryLog({
        assignment_id: form.assignment_id,
        practitioner_id: user.id,
        progress_notes: form.progress_notes,
        exercises: form.exercises || null,
        pain_level: form.pain_level,
        mobility_score: form.mobility_score,
        next_session_plan: form.next_session_plan || null,
      })
      // @ts-ignore
      const { pushToast } = await import('../../components/Toaster')
      pushToast({ type: 'success', message: 'Recovery log added' })
      setShowForm(false)
      await load()
    } catch (e) {
      // @ts-ignore
      const { pushToast } = await import('../../components/Toaster')
      pushToast({ type: 'error', message: 'Failed to add recovery log' })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recovery Logs</h1>
          <p className="text-gray-600">Add progress updates for your assigned athletes</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Log</span>
        </motion.button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assignment</label>
            <select
              value={form.assignment_id}
              onChange={(e) => setForm({ ...form, assignment_id: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select assignment</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>{a.id.slice(0,8)} • {a.student_profile?.full_name || a.student_id.slice(0,8)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Progress Notes</label>
            <textarea
              value={form.progress_notes}
              onChange={(e) => setForm({ ...form, progress_notes: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Exercises</label>
              <input value={form.exercises} onChange={(e) => setForm({ ...form, exercises: e.target.value })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pain Level</label>
              <input type="number" min={0} max={10} value={form.pain_level} onChange={(e) => setForm({ ...form, pain_level: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mobility Score</label>
              <input type="number" min={0} max={10} value={form.mobility_score} onChange={(e) => setForm({ ...form, mobility_score: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Session Plan</label>
            <input value={form.next_session_plan} onChange={(e) => setForm({ ...form, next_session_plan: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          </div>
        </form>
      )}

      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b flex items-center space-x-2">
          <ClipboardList className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold">Recent Logs</h2>
        </div>
        <div className="divide-y">
          {logs.map((log) => (
            <div key={log.id} className="p-4">
              <div className="font-medium">{new Date(log.date_logged).toLocaleString()}</div>
              <div className="text-sm text-gray-700 mt-1">{log.progress_notes}</div>
              <div className="text-xs text-gray-500 mt-1">Pain: {log.pain_level ?? 'N/A'} • Mobility: {log.mobility_score ?? 'N/A'}</div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-6 text-center text-gray-500">No recovery logs yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

