import { useEffect, useState } from 'react'

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string }

let pushToastExternal: ((t: Omit<Toast, 'id'>) => void) | null = null
export function pushToast(t: Omit<Toast, 'id'>) {
  if (pushToastExternal) pushToastExternal(t)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    pushToastExternal = (t) => {
      const toast: Toast = { id: Date.now(), ...t }
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== toast.id))
      }, 3000)
    }
    return () => { pushToastExternal = null }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className={`px-4 py-3 rounded shadow text-white ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}

