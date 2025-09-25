import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileText } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

export function FilesPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<File | null>(null)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  const load = async () => {
    if (!user) return
    const data = await api.getFiles(user.id)
    setFiles(data)
  }

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selected) return
    try {
      setUploading(true)
      const storagePath = `${user.id}/${Date.now()}_${selected.name}`
      await api.uploadFile(selected, storagePath)
      await api.linkFileRow({ uploaded_by: user.id, file_url: storagePath, file_type: selected.type || 'application/octet-stream' })
      setSelected(null)
      await load()
      // @ts-ignore
      const { pushToast } = await import('../../components/Toaster')
      pushToast({ type: 'success', message: 'File uploaded' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Files</h1>
          <p className="text-gray-600">Upload and manage your files</p>
        </div>
      </div>

      <form onSubmit={upload} className="bg-white border rounded-lg p-4 flex items-center justify-between">
        <input type="file" onChange={(e) => setSelected(e.target.files?.[0] || null)} />
        <motion.button whileTap={{ scale: 0.98 }} disabled={!selected || uploading} className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded flex items-center space-x-2">
          <UploadCloud className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </motion.button>
      </form>

      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Your Files</h2>
        </div>
        <div className="divide-y">
          {files.map((f) => (
            <div key={f.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium break-all">{f.file_url}</div>
                  <div className="text-xs text-gray-500">{f.file_type}</div>
                </div>
              </div>
              <a
                className="text-blue-600 text-sm"
                href={"#"}
                onClick={async (e) => {
                  e.preventDefault()
                  const url = await api.getSignedUrl(f.file_url)
                  window.open(url, '_blank')
                }}
              >
                Open
              </a>
            </div>
          ))}
          {files.length === 0 && (
            <div className="p-6 text-center text-gray-500">No files yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

