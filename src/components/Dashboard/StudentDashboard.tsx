import { motion } from 'framer-motion'
import { Plus, Activity, Calendar, MessageSquare, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logger } from '../../lib/logger'
import { type Injury } from '../../lib/mockData'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

export function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeInjuries: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
    totalInjuries: 0
  })
  const [recentInjuries, setRecentInjuries] = useState<Injury[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch injuries
      const injuries = await api.getInjuries(user.id)
      const activeInjuries = injuries.filter(i => 
        ['reported', 'assigned', 'in_treatment', 'recovering'].includes(i.status)
      )
      
      // Fetch appointments
      const appointments = await api.getAppointments(user.id, 'student')
      const upcomingAppointments = appointments.filter(apt => 
        new Date(apt.appointment_date) > new Date() && apt.status === 'scheduled'
      )
      
      // Fetch messages
      const messages = await api.getMessages(user.id)
      const unreadMessages = messages.filter(msg => 
        msg.receiver_id === user.id && !msg.read
      )

      setStats({
        activeInjuries: activeInjuries.length,
        upcomingAppointments: upcomingAppointments.length,
        unreadMessages: unreadMessages.length,
        totalInjuries: injuries.length
      })
      
      setRecentInjuries(injuries.slice(0, 3))
    } catch (error) {
      logger.error('Error fetching dashboard data:', error as Error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800'
      case 'moderate': return 'bg-orange-100 text-orange-800'
      case 'severe': return 'bg-red-100 text-red-800'
      case 'critical': return 'bg-red-200 text-red-900'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800'
      case 'assigned': return 'bg-purple-100 text-purple-800'
      case 'in_treatment': return 'bg-indigo-100 text-indigo-800'
      case 'recovering': return 'bg-green-100 text-green-800'
      case 'resolved': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your injury recovery and manage appointments</p>
        </div>
        <Link to="/report-injury">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Report Injury</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Injuries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeInjuries}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Injuries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInjuries}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Injuries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Injuries</h2>
        </div>
        <div className="p-6">
          {recentInjuries.length > 0 ? (
            <div className="space-y-4">
              {recentInjuries.map((injury) => (
                <div key={injury.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{injury.injury_type}</h3>
                    <p className="text-sm text-gray-600 mt-1">{injury.body_part}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Reported: {new Date(injury.date_reported).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(injury.severity)}`}>
                      {injury.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(injury.status)}`}>
                      {injury.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No injuries reported</h3>
              <p className="text-gray-600 mb-4">Keep up the good work staying injury-free!</p>
              <Link to="/report-injury">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Report an Injury
                </button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}