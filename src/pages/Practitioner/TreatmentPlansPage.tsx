import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stethoscope, NotebookPen } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function TreatmentPlansPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  const load = async () => {
    if (!user) return
    setLoading(true)
    const data = await api.getAssignments(user.id)
    setAssignments(data)
    setLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Stethoscope className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Treatment Plans</h1>
      </div>
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b font-semibold">Your Active Assignments</div>
        <div className="divide-y">
          {assignments.map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Assignment {a.id.slice(0,8)}</div>
                <div className="text-sm text-gray-500">Student: {a.student_profile?.full_name || a.student_id.slice(0,8)}</div>
              </div>
              <a className="text-sm text-blue-600 flex items-center space-x-1" href="/recovery-logs">
                <NotebookPen className="w-4 h-4" />
                <span>Add Recovery Log</span>
              </a>
            </div>
          ))}
          {assignments.length === 0 && <div className="p-6 text-center text-gray-500">No active assignments.</div>}
        </div>
      </div>
    </div>
  )
}

