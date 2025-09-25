import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stethoscope, NotebookPen, ClipboardList, FilePlus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function TreatmentPlansPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdPlan, setCreatedPlan] = useState<any | null>(null)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  const load = async () => {
    if (!user) return
    setLoading(true)
    const [data, tpls] = await Promise.all([
      api.getAssignments(user.id),
      api.getPlanTemplates(),
    ])
    setAssignments(data as any)
    setTemplates(tpls as any)
    setLoading(false)
  }

  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignment || !selectedTemplate) return
    setCreating(true)
    try {
      const plan = await api.createPlanFromTemplate(selectedAssignment, selectedTemplate)
      setCreatedPlan(plan)
    } finally {
      setCreating(false)
    }
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

      <motion.form onSubmit={createPlan} className="bg-white border rounded-lg p-4 space-y-4">
        <div className="p-2 border-b font-semibold flex items-center space-x-2"><FilePlus className="w-4 h-4 text-green-600" /><span>Create Plan from Template</span></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assignment</label>
            <select value={selectedAssignment} onChange={(e) => setSelectedAssignment(e.target.value)} className="w-full border rounded px-3 py-2" required>
              <option value="">Select athlete assignment</option>
              {assignments.map((a: any) => (
                <option key={a.id} value={a.id}>{a.student_profile?.full_name || a.student_id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Template</label>
            <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="w-full border rounded px-3 py-2" required>
              <option value="">Select template</option>
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <motion.button whileTap={{ scale: 0.98 }} disabled={creating} className="bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-2 disabled:opacity-50">
            <FilePlus className="w-4 h-4" />
            <span>{creating ? 'Creating...' : 'Create Plan'}</span>
          </motion.button>
        </div>
      </motion.form>

      {createdPlan && (
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b flex items-center space-x-2"><ClipboardList className="w-5 h-5 text-green-600" /><h2 className="font-semibold">New Plan</h2></div>
          <div className="p-4 space-y-2">
            <div className="font-medium">{createdPlan.title}</div>
            <div className="space-y-3">
              {createdPlan.phases.map((p: any, idx: number) => (
                <div key={idx} className="border rounded p-3">
                  <div className="font-medium">{p.title}</div>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {p.exercises.map((ex: any, i: number) => (
                      <li key={i}>{ex.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

