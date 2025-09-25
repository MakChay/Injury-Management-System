import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Activity, Calendar, User, MessageSquare, FileText, Clock, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { type Injury } from '../../lib/mockData'
import { api } from '../../lib/api'

export function MyInjuriesPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [injuries, setInjuries] = useState<Injury[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInjury, setSelectedInjury] = useState<Injury | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
      // Clear the message after 5 seconds
      setTimeout(() => setMessage(''), 5000)
    }
  }, [location.state])

  useEffect(() => {
    if (user) {
      fetchInjuries()
    }
  }, [user])

  const fetchInjuries = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await api.getInjuries(user.id)
      setInjuries(
        (data as Injury[]).sort(
          (a: Injury, b: Injury) => new Date(b.date_reported).getTime() - new Date(a.date_reported).getTime()
        )
      )
    } catch (error) {
      console.error('Error fetching injuries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'severe': return 'bg-red-100 text-red-800 border-red-200'
      case 'critical': return 'bg-red-200 text-red-900 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'in_treatment': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'recovering': return 'bg-green-100 text-green-800 border-green-200'
      case 'resolved': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported': return <Clock className="w-4 h-4" />
      case 'assigned': return <User className="w-4 h-4" />
      case 'in_treatment': return <Activity className="w-4 h-4" />
      case 'recovering': return <Activity className="w-4 h-4" />
      case 'resolved': return <Activity className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Injuries</h1>
        <p className="text-gray-600 mt-2">
          Track your injury reports and recovery progress
        </p>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
        >
          {message}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Injuries List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Injury History</h2>
            </div>
            <div className="p-6">
              {injuries.length > 0 ? (
                <div className="space-y-4">
                  {injuries.map((injury) => (
                    <motion.div
                      key={injury.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedInjury(injury)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedInjury?.id === injury.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{injury.injury_type}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(injury.severity)}`}>
                              {injury.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{injury.body_part}</p>
                          <p className="text-xs text-gray-500">
                            Reported: {new Date(injury.date_reported).toLocaleDateString()}
                          </p>
                          {injury.activity_when_injured && (
                            <p className="text-xs text-gray-500">
                              During: {injury.activity_when_injured}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(injury.status)}`}>
                            {getStatusIcon(injury.status)}
                            <span>{injury.status.replace('_', ' ')}</span>
                          </span>
                          {injury.pain_level && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">Pain: {injury.pain_level}/10</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No injuries reported</h3>
                  <p className="text-gray-600">Keep up the good work staying injury-free!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Injury Details */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Injury Details</h2>
            </div>
            <div className="p-6">
              {selectedInjury ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">{selectedInjury.injury_type}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(selectedInjury.severity)}`}>
                        {selectedInjury.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(selectedInjury.status)}`}>
                        {getStatusIcon(selectedInjury.status)}
                        <span>{selectedInjury.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Body Part:</span>
                      <span className="font-medium">{selectedInjury.body_part}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date Occurred:</span>
                      <span className="font-medium">{new Date(selectedInjury.date_occurred).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date Reported:</span>
                      <span className="font-medium">{new Date(selectedInjury.date_reported).toLocaleDateString()}</span>
                    </div>
                    {selectedInjury.activity_when_injured && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Activity:</span>
                        <span className="font-medium">{selectedInjury.activity_when_injured}</span>
                      </div>
                    )}
                    {selectedInjury.pain_level && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pain Level:</span>
                        <span className="font-medium">{selectedInjury.pain_level}/10</span>
                      </div>
                    )}
                  </div>

                  {selectedInjury.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedInjury.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Book Appointment</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select an injury to view details</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}