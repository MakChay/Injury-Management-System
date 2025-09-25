import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase, isSupabaseEnabled } from '../../lib/supabase'

export function ProfilePage() {
  const { profile, setProfile } = useProfileWrapper()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    sport: (profile as any)?.sport || '',
    specialization: (profile as any)?.specialization || '',
    bio: (profile as any)?.bio || '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      sport: (profile as any)?.sport || '',
      specialization: (profile as any)?.specialization || '',
      bio: (profile as any)?.bio || '',
    })
  }, [profile])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !isSupabaseEnabled || !supabase) return
    try {
      setSaving(true)
      const { error } = await supabase.from('profiles').update({
        full_name: form.full_name,
        phone: form.phone || null,
        sport: form.sport || null,
        specialization: form.specialization || null,
        bio: form.bio || null,
        updated_at: new Date().toISOString(),
      }).eq('id', profile.id)
      if (error) throw error
      // @ts-ignore
      const { pushToast } = await import('../../components/Toaster')
      pushToast({ type: 'success', message: 'Profile updated' })
      setProfile?.({ ...profile, ...form })
    } catch (e) {
      // @ts-ignore
      const { pushToast } = await import('../../components/Toaster')
      pushToast({ type: 'error', message: 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={save} className="space-y-4 bg-white border rounded-lg p-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        {profile?.role === 'student' && (
          <div>
            <label className="block text-sm font-medium mb-1">Sport</label>
            <input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
        )}
        {profile?.role === 'practitioner' && (
          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div className="flex justify-end">
          <motion.button whileTap={{ scale: 0.98 }} disabled={saving} className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded">
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

function useProfileWrapper() {
  const auth = useAuth() as any
  // expose setProfile for local optimistic UI
  return { ...auth, setProfile: auth?.setProfile }
}

