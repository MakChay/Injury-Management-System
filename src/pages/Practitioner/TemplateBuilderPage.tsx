import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export function TemplateBuilderPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [name, setName] = useState('')
  const [injuryType, setInjuryType] = useState('')
  const [sport, setSport] = useState('')
  const [phases, setPhases] = useState<any[]>([{ title: 'Phase 1', exercises: [] }])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const tpls = await api.getPlanTemplates()
    setTemplates(tpls as any)
    setLoading(false)
  }

  const addExercise = (idx: number) => {
    const next = [...phases]
    next[idx].exercises.push({ name: 'New Exercise' })
    setPhases(next)
  }

  const addPhase = () => setPhases([...phases, { title: `Phase ${phases.length + 1}`, exercises: [] }])

  const save = async () => {
    const payload = { name, injury_type: injuryType, sport: sport || null, phases }
    await api.createPlanTemplate(payload)
    setName(''); setInjuryType(''); setSport(''); setPhases([{ title: 'Phase 1', exercises: [] }])
    await load()
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Create Template</h2>
        <input className="w-full border rounded px-3 py-2" placeholder="Template name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Injury type" value={injuryType} onChange={(e) => setInjuryType(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Sport (optional)" value={sport} onChange={(e) => setSport(e.target.value)} />
        <div className="space-y-2">
          {phases.map((p, idx) => (
            <div key={idx} className="border rounded p-3 space-y-2">
              <input className="w-full border rounded px-2 py-1" value={p.title} onChange={(e) => { const next = [...phases]; next[idx].title = e.target.value; setPhases(next) }} />
              <div className="space-y-1">
                {p.exercises.map((ex: any, i: number) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input className="flex-1 border rounded px-2 py-1" value={ex.name} onChange={(e) => { const next = [...phases]; next[idx].exercises[i].name = e.target.value; setPhases(next) }} />
                    <input className="w-28 border rounded px-2 py-1" placeholder="video url" value={ex.video_url || ''} onChange={(e) => { const next = [...phases]; next[idx].exercises[i].video_url = e.target.value; setPhases(next) }} />
                  </div>
                ))}
              </div>
              <button className="px-3 py-1 border rounded" onClick={() => addExercise(idx)}>Add exercise</button>
            </div>
          ))}
          <button className="px-3 py-1 border rounded" onClick={addPhase}>Add phase</button>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={save} disabled={!name || !injuryType}>Save Template</button>
        </div>
      </div>
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b font-semibold">Existing Templates</div>
        <div className="divide-y">
          {templates.map((t: any) => (
            <div key={t.id} className="p-4">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-gray-600">{t.injury_type}{t.sport ? ` • ${t.sport}` : ''}</div>
            </div>
          ))}
          {templates.length === 0 && <div className="p-6 text-center text-gray-500">No templates yet.</div>}
        </div>
      </div>
    </div>
  )
}

