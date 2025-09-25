import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function SessionNotesPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [notes, setNotes] = useState('')
  const [vitals, setVitals] = useState('')
  const [contra, setContra] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) load()
  }, [user?.id])

  const load = async () => {
    if (!user) return
    setLoading(true)
    const asg = await api.getAssignments(user.id)
    setAssignments(asg as any)
    setLoading(false)
  }

  const fetchNotes = async (assignment_id: string) => {
    const data = await api.getSessionNotes(assignment_id)
    setHistory(data as any)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedAssignment || !notes) return
    const payload = {
      assignment_id: selectedAssignment,
      practitioner_id: user.id,
      soap_notes: notes,
      vitals: vitals ? JSON.parse(vitals) : null,
      contraindications: contra || null,
    }
    await api.createSessionNote(payload)
    setNotes('')
    setVitals('')
    setContra('')
    await fetchNotes(selectedAssignment)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Session Notes (SOAP)</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Assignment</label>
          <select className="w-full border rounded px-3 py-2" value={selectedAssignment} onChange={async (e) => { setSelectedAssignment(e.target.value); await fetchNotes(e.target.value) }} required>
            <option value="">Select assignment</option>
            {assignments.map((a: any) => (
              <option key={a.id} value={a.id}>{a.student_profile?.full_name || a.student_id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SOAP Notes</label>
          <textarea className="w-full border rounded px-3 py-2" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Subjective, Objective, Assessment, Plan" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vitals (JSON)</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={vitals} onChange={(e) => setVitals(e.target.value)} placeholder='{"HR":70,"BP":"120/80"}' />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraindications</label>
          <input className="w-full border rounded px-3 py-2" value={contra} onChange={(e) => setContra(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Save Note</button>
        </div>
      </form>

      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b font-semibold">Recent Notes</div>
        <div className="divide-y">
          {history.map((h) => (
            <div key={h.id} className="p-4">
              <div className="text-sm text-gray-500">{new Date(h.created_at).toLocaleString()}</div>
              <div className="whitespace-pre-wrap text-sm mt-1">{h.soap_notes}</div>
              {h.vitals && <div className="text-xs text-gray-600 mt-2">Vitals: {JSON.stringify(h.vitals)}</div>}
              {h.contraindications && <div className="text-xs text-gray-600">Contraindications: {h.contraindications}</div>}
            </div>
          ))}
          {history.length === 0 && <div className="p-6 text-center text-gray-500">No notes yet.</div>}
        </div>
      </div>
    </div>
  )
}

