import { motion } from 'framer-motion'
import { Users, Calendar, ClipboardList, Clock, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { logger } from '../../lib/logger'
import { mockAPI, mockUsers, type Assignment, type Appointment, type User } from '../../lib/mockData'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

interface AssignmentWithDetails extends Assignment {
  student?: User
  injury?: {
    injury_type: string
    severity: string
    body_part: string
  }
}

interface AppointmentWithDetails extends Appointment {
  student?: User
}

export function PractitionerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    assignedAthletes: 0,
    todayAppointments: 0,
    pendingUpdates: 0,
    completedTreatments: 0
  })
  const [recentAssignments, setRecentAssignments] = useState<AssignmentWithDetails[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentWithDetails[]>([])
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
      
      // Fetch assignments
      const assignments = await api.getAssignments(user.id)
      const activeAssignments = assignments.filter(a => a.active)
      
      // Enrich assignments with student and injury data
      const enrichedAssignments: AssignmentWithDetails[] = activeAssignments.map(assignment => {
        const student = mockUsers.find(u => u.id === assignment.student_id)
        return {
          ...assignment,
          student,
          injury: {
            injury_type: 'Ankle Sprain', // Mock data
            severity: 'moderate',
            body_part: 'Left Ankle'
          }
        }
      })
      
      // Fetch appointments
      const appointments = await api.getAppointments(user.id, 'practitioner')
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointments.filter(apt => 
        apt.appointment_date.startsWith(today)
      )
      
      // Enrich appointments with student data
      const enrichedAppointments: AppointmentWithDetails[] = appointments
        .filter(apt => new Date(apt.appointment_date) >= new Date())
        .slice(0, 3)
        .map(appointment => ({
          ...appointment,
          student: mockUsers.find(u => u.id === appointment.student_id)
        }))
      
      // Fetch recovery logs
      const recoveryLogs = await mockAPI.getRecoveryLogs(user.id)
      
      setStats({
        assignedAthletes: activeAssignments.length,
        todayAppointments: todayAppointments.length,
        pendingUpdates: Math.max(0, activeAssignments.length - recoveryLogs.length),
        completedTreatments: recoveryLogs.length
      })
      
      setRecentAssignments(enrichedAssignments.slice(0, 3))
      setUpcomingAppointments(enrichedAppointments)
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
          <h1 className="text-3xl font-bold text-gray-900">Practitioner Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your athletes and track their recovery progress</p>
        </div>
        <Link to="/recovery-logs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <ClipboardList className="w-5 h-5" />
            <span>Add Recovery Log</span>
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
              <p className="text-sm font-medium text-gray-600">Assigned Athletes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.assignedAthletes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Pending Updates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingUpdates}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
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
              <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTreatments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Athletes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Assignments</h2>
          </div>
          <div className="p-6">
            {recentAssignments.length > 0 ? (
              <div className="space-y-4">
                {recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{assignment.student?.full_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {assignment.injury?.injury_type} - {assignment.injury?.body_part}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(assignment.injury?.severity || 'mild')}`}>
                      {assignment.injury?.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No athletes assigned yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{appointment.student?.full_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(appointment.appointment_date).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Duration: {appointment.duration_minutes} minutes
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming appointments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}