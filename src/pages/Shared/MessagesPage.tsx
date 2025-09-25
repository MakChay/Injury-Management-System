import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Search, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { type Message } from '../../lib/mockData'

export function MessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchMessages()
    }
  }, [user])

  const fetchMessages = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await api.getMessages(user.id)
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim() || !selectedConversation) return

    try {
      await api.sendMessage({
        sender_id: user.id,
        receiver_id: selectedConversation,
        message: newMessage,
        read: false,
      })
      setNewMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Group messages by conversation
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.sender_id === user?.id ? message.receiver_id : message.sender_id
    if (!acc[otherUserId]) {
      acc[otherUserId] = []
    }
    acc[otherUserId].push(message)
    return acc
  }, {} as Record<string, Message[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Communicate with your team</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Start a conversation</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>
          {Object.keys(conversations).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(conversations).map(([otherUserId, conversationMessages]) => {
                const lastMessage = conversationMessages[conversationMessages.length - 1]
                const unreadCount = conversationMessages.filter(m => 
                  m.receiver_id === user?.id && !m.read
                ).length
                
                return (
                  <button
                    key={otherUserId}
                    onClick={() => setSelectedConversation(otherUserId)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedConversation === otherUserId ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">User {otherUserId.slice(-4)}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.message}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No conversations yet</p>
            </div>
          )}
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          {selectedConversation ? (
            <div className="h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversations[selectedConversation]?.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.sent_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}