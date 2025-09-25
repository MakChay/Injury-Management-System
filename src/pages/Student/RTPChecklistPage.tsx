import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

const defaultCriteria = [
  { key: 'pain_free', label: 'Pain-free at rest and activity', done: false },
  { key: 'full_rom', label: 'Full range of motion', done: false },
  { key: 'strength_90', label: 'Strength ≥ 90% of contralateral', done: false },
  { key: 'sport_drills', label: 'Completed sport-specific drills', done: false },
]

export function RTPChecklistPage() {
  const { user, profile } = useAuth()
  const [items, setItems] = useState<any[]>(defaultCriteria)
  const [status, setStatus] = useState<'in_progress' | 'ready' | 'cleared'>('in_progress')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) load()
  }, [user?.id])

  const load = async () => {
    if (!user) return
    setLoading(true)
    const data = await api.getRtpChecklist(user.id)
    if (data) {
      setItems(Array.isArray(data.criteria) ? data.criteria : defaultCriteria)
      setStatus(data.status)
    }
    setLoading(false)
  }

  const toggle = (idx: number) => {
    const next = [...items]
    next[idx] = { ...next[idx], done: !next[idx].done }
    setItems(next)
  }

  const save = async () => {
    if (!user) return
    const ready = items.every((i) => i.done)
    const nextStatus = ready ? 'ready' : 'in_progress'
    await api.upsertRtpChecklist({ student_id: user.id, sport: profile?.sport || null, criteria: items, status: nextStatus })
    setStatus(nextStatus)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Return-to-Play Checklist</h1>
      <div className="bg-white border rounded-lg p-4 space-y-3">
        {items.map((item, idx) => (
          <label key={item.key} className="flex items-center space-x-3">
            <input type="checkbox" checked={!!item.done} onChange={() => toggle(idx)} />
            <span>{item.label}</span>
          </label>
        ))}
        <div className="flex justify-between items-center pt-2 mt-2 border-t">
          <span className="text-sm text-gray-600">Status: <span className="font-medium">{status.replace('_',' ')}</span></span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}

