import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Stethoscope, NotebookPen, ClipboardList, FilePlus, PlayCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { MediaLibrary } from '../../components/MediaLibrary'

export function TreatmentPlansPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [creating, setCreating] = useState(false)
  const [createdPlan, setCreatedPlan] = useState<any | null>(null)
  const [editing, setEditing] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [future, setFuture] = useState<any[]>([])

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
      setHistory([]); setFuture([])
      setEditing(true)
    } finally {
      setCreating(false)
    }
  }

  const pushHistory = (nextPlan: any) => {
    setHistory((h) => [...h, createdPlan])
    setFuture([])
    setCreatedPlan(nextPlan)
  }

  const undo = () => {
    if (!history.length) return
    const prev = history[history.length - 1]
    setHistory(history.slice(0, -1))
    setFuture((f) => [createdPlan, ...f])
    setCreatedPlan(prev)
  }

  const redo = () => {
    if (!future.length) return
    const next = future[0]
    setFuture(future.slice(1))
    setHistory((h) => [...h, createdPlan])
    setCreatedPlan(next)
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
                  <ul className="ml-5 text-sm text-gray-700 space-y-2">
                    {p.exercises.map((ex: any, i: number) => (
                      <li key={i} className="list-none flex items-center space-x-2">
                        {editing ? (
                          <>
                            <input className="border rounded px-2 py-1 w-56" value={ex.name} onChange={(e) => { const next = { ...createdPlan }; next.phases[idx].exercises[i].name = e.target.value; pushHistory(next) }} />
                            <input type="number" className="border rounded px-2 py-1 w-20" placeholder="sets" value={ex.sets || ''} onChange={(e) => { const next = { ...createdPlan }; next.phases[idx].exercises[i].sets = Number(e.target.value)||undefined; pushHistory(next) }} />
                            <input type="number" className="border rounded px-2 py-1 w-20" placeholder="reps" value={ex.reps || ''} onChange={(e) => { const next = { ...createdPlan }; next.phases[idx].exercises[i].reps = Number(e.target.value)||undefined; pushHistory(next) }} />
                            <input className="border rounded px-2 py-1 flex-1" placeholder="video url" value={ex.video_url || ''} onChange={(e) => { const next = { ...createdPlan }; next.phases[idx].exercises[i].video_url = e.target.value; pushHistory(next) }} />
                          </>
                        ) : (
                          <>
                            {ex.video_url && <a className="text-blue-600 flex items-center space-x-1" href={ex.video_url} target="_blank" rel="noreferrer"><PlayCircle className="w-4 h-4" /><span>Video</span></a>}
                            <span>{ex.name}{ex.sets ? ` • ${ex.sets}x${ex.reps || ''}` : ''}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  {editing && (
                    <div className="mt-2">
                      <MediaLibrary onSelect={(m) => { const next = { ...createdPlan }; next.phases[idx].exercises.push({ name: m.name, video_url: m.video_url }); pushHistory(next) }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              {!editing ? (
                <button className="px-3 py-2 border rounded" onClick={() => setEditing(true)}>Edit</button>
              ) : (
                <>
                  <button className="px-3 py-2 border rounded" onClick={undo} disabled={!history.length}>Undo</button>
                  <button className="px-3 py-2 border rounded" onClick={redo} disabled={!future.length}>Redo</button>
                  <button className="px-3 py-2 border rounded" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={async () => { const saved = await api.updateTreatmentPlan(createdPlan.id, { phases: createdPlan.phases, title: createdPlan.title }); setCreatedPlan(saved); setEditing(false) }}>Save Changes</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

