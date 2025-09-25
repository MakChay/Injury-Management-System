import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { supabase, isSupabaseEnabled } from '../../lib/supabase'

export function MessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [receiverId, setReceiverId] = useState('')
  const [contacts, setContacts] = useState<any[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!user) return
    fetchMessages()
    preloadContacts()
    const unsubscribe = api.onMessageRealtime(user.id, (msg) => {
      setMessages((prev) => [msg, ...prev])
    })
    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    if (!user) return
    const data = await api.getMessages(user.id)
    setMessages(data)
  }

  const preloadContacts = async () => {
    if (!user || !isSupabaseEnabled || !supabase) return
    const { data } = await supabase.from('profiles').select('id, full_name, role').neq('id', user.id)
    setContacts(data || [])
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !text || !receiverId) return
    await api.sendMessage({ sender_id: user.id, receiver_id: receiverId, message: text })
    setText('')
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Start a conversation</h2>
        <form onSubmit={send} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Receiver</label>
            <select
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select user</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name} ({c.role})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type a message"
              required
            />
            <motion.button whileTap={{ scale: 0.98 }} className="bg-blue-600 text-white px-3 py-2 rounded">
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </div>
      <div className="lg:col-span-2 bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
          {[...messages].reverse().map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg ${m.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                <div className="text-sm">{m.message}</div>
                <div className="text-[10px] opacity-70 mt-1">{new Date(m.sent_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}

