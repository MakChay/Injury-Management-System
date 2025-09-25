import { useEffect, useState } from 'react'
import { supabase, isSupabaseEnabled } from '../../lib/supabase'

type Check = { name: string; status: 'ok' | 'fail' | 'skip'; message?: string }

export function SystemStatusPage() {
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      if (!isSupabaseEnabled || !supabase) {
        setChecks([
          { name: 'Supabase client', status: 'fail', message: 'VITE_SUPABASE_* not configured' },
        ])
        setLoading(false)
        return
      }
      const results: Check[] = []
      try {
        const { data: authData, error: authError } = await supabase.auth.getSession()
        results.push({ name: 'Auth session', status: authError ? 'fail' : 'ok', message: authError?.message || (authData.session ? 'Session active' : 'No session') })
      } catch (e: any) {
        results.push({ name: 'Auth session', status: 'fail', message: e?.message })
      }
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1)
        results.push({ name: 'Database (profiles)', status: error ? 'fail' : 'ok', message: error?.message })
      } catch (e: any) {
        results.push({ name: 'Database (profiles)', status: 'fail', message: e?.message })
      }
      try {
        const { data, error } = await supabase.storage.from('user-files').list('', { limit: 1 })
        results.push({ name: 'Storage (user-files)', status: error ? 'fail' : 'ok', message: error?.message || `${(data || []).length} item(s)` })
      } catch (e: any) {
        results.push({ name: 'Storage (user-files)', status: 'fail', message: e?.message })
      }
      try {
        const client = supabase
        const channel = client.channel('status-check')
        await new Promise((resolve) => setTimeout(resolve, 200))
        client.removeChannel(channel)
        results.push({ name: 'Realtime', status: 'ok' })
      } catch (e: any) {
        results.push({ name: 'Realtime', status: 'fail', message: e?.message })
      }
      setChecks(results)
      setLoading(false)
    }
    run()
  }, [])

  if (loading) return <div className="p-6">Running checks...</div>

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">System Status</h1>
      <div className="bg-white border rounded-lg divide-y">
        {checks.map((c) => (
          <div key={c.name} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              {c.message && <div className="text-sm text-gray-600">{c.message}</div>}
            </div>
            <div className={`px-2 py-1 text-xs rounded ${c.status === 'ok' ? 'bg-green-50 text-green-700' : c.status === 'fail' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}`}>{c.status.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

