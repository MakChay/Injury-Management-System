import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function DailyCheckInPage() {
  const { user } = useAuth()
  const [pain, setPain] = useState(0)
  const [swelling, setSwelling] = useState(0)
  const [rom, setRom] = useState(0)
  const [notes, setNotes] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) load()
  }, [user?.id])

  const load = async () => {
    if (!user) return
    const data = await api.getDailyCheckins(user.id)
    setHistory(data)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await api.createDailyCheckin({ student_id: user.id, pain_level: pain, swelling, rom, notes })
    setSaving(false)
    setNotes('')
    await load()
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={submit} className="bg-white border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Daily Check-in</h2>
        <div>
          <label className="block text-sm">Pain (0-10)</label>
          <input type="range" min={0} max={10} value={pain} onChange={(e) => setPain(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">{pain}</div>
        </div>
        <div>
          <label className="block text-sm">Swelling (0-10)</label>
          <input type="range" min={0} max={10} value={swelling} onChange={(e) => setSwelling(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">{swelling}</div>
        </div>
        <div>
          <label className="block text-sm">ROM (0-10)</label>
          <input type="range" min={0} max={10} value={rom} onChange={(e) => setRom(Number(e.target.value))} className="w-full" />
          <div className="text-sm text-gray-600">{rom}</div>
        </div>
        <div>
          <label className="block text-sm">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</button>
        </div>
      </form>
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b font-semibold">Recent Check-ins</div>
        <div className="divide-y">
          {history.map((h) => (
            <div key={h.id} className="p-4 text-sm text-gray-700 flex items-center justify-between">
              <div>
                <div className="font-medium">{new Date(h.created_at).toLocaleString()}</div>
                <div>Pain {h.pain_level} • Swelling {h.swelling} • ROM {h.rom}</div>
                {h.notes && <div className="text-gray-500">{h.notes}</div>}
              </div>
            </div>
          ))}
          {history.length === 0 && <div className="p-6 text-center text-gray-500">No check-ins yet.</div>}
        </div>
      </div>
    </div>
  )
}

