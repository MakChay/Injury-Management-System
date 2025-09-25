import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stethoscope, PlayCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function RecoveryPlansPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  const load = async () => {
    if (!user) return
    setLoading(true)
    // find assignments where current user is a student, then get logs
    const assignments = await api.getAssignments(undefined, user.id)
    const allLogs: any[] = []
    for (const a of assignments) {
      const logs = await api.getRecoveryLogs({ assignment_id: a.id })
      allLogs.push(...logs)
    }
    setLogs(allLogs.sort((a, b) => new Date(b.date_logged).getTime() - new Date(a.date_logged).getTime()))
    const pl = await api.getStudentTreatmentPlans(user.id)
    setPlans(pl)
    setLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Stethoscope className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold">Recovery Plans</h1>
      </div>
      {/* Treatment Plans */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b font-semibold">My Treatment Plans</div>
        <div className="divide-y">
          {plans.map((p) => (
            <div key={p.id} className="p-4">
              <div className="font-medium">{p.title}</div>
              {Array.isArray(p.phases) && (
                <div className="mt-2 space-y-2">
                  {p.phases.map((ph: any, idx: number) => (
                    <div key={idx} className="border rounded p-3">
                      <div className="font-medium">{ph.title}</div>
                      <ul className="list-disc ml-5 text-sm text-gray-700">
                        {(ph.exercises || []).map((ex: any, i: number) => (
                          <li key={i} className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {ex.video_url && (
                                <a className="text-blue-600 flex items-center space-x-1" href={ex.video_url} target="_blank" rel="noreferrer">
                                  <PlayCircle className="w-4 h-4" />
                                  <span>Video</span>
                                </a>
                              )}
                              <span>{ex.name}{ex.sets ? ` • ${ex.sets}x${ex.reps || ''}` : ''}</span>
                            </div>
                            {ex.video_url && (
                              <video controls className="w-full max-w-md rounded border">
                                <source src={ex.video_url} />
                              </video>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {plans.length === 0 && <div className="p-6 text-center text-gray-500">No treatment plans yet.</div>}
        </div>
      </div>
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b font-semibold">Practitioner Notes & Exercises</div>
        <div className="divide-y">
          {logs.map((log) => (
            <div key={log.id} className="p-4">
              <div className="text-sm text-gray-500">{new Date(log.date_logged).toLocaleString()}</div>
              <div className="font-medium mt-1">{log.progress_notes}</div>
              {log.exercises && <div className="text-sm text-gray-700 mt-1">Exercises: {log.exercises}</div>}
              {log.next_session_plan && <div className="text-sm text-gray-700 mt-1">Next: {log.next_session_plan}</div>}
            </div>
          ))}
          {logs.length === 0 && <div className="p-6 text-center text-gray-500">No recovery plans yet.</div>}
        </div>
      </div>
    </div>
  )
}

