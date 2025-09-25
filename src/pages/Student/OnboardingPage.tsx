import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function OnboardingPage() {
  const { user, profile, setProfile } = useAuth() as any
  const [form, setForm] = useState({ sport: '', position: '', dominant_side: '', injury_history: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        sport: profile.sport || '',
        position: profile.position || '',
        dominant_side: profile.dominant_side || '',
        injury_history: profile.injury_history ? JSON.stringify(profile.injury_history) : '',
      })
    }
  }, [profile])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const payload = {
      id: user.id,
      sport: form.sport || null,
      position: form.position || null,
      dominant_side: form.dominant_side || null,
      injury_history: form.injury_history ? JSON.parse(form.injury_history) : null,
    }
    const updated = await api.upsertProfileOnboarding(payload)
    setProfile(updated)
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Personalized Onboarding</h1>
      <form onSubmit={save} className="bg-white border rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sport</label>
          <input className="w-full border rounded px-3 py-2" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <input className="w-full border rounded px-3 py-2" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dominant Side</label>
          <select className="w-full border rounded px-3 py-2" value={form.dominant_side} onChange={(e) => setForm({ ...form, dominant_side: e.target.value })}>
            <option value="">Select</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="ambidextrous">Ambidextrous</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Injury History (JSON)</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} value={form.injury_history} onChange={(e) => setForm({ ...form, injury_history: e.target.value })} placeholder='[{"injury":"Ankle Sprain","year":2024}]' />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}

