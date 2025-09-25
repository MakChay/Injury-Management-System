import { motion } from 'framer-motion'
import { Users, Activity, TrendingUp, AlertTriangle, Calendar, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { mockAPI, mockUsers, mockInjuries, mockAppointments } from '../../lib/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPractitioners: 0,
    activeInjuries: 0,
    pendingAssignments: 0,
    totalAppointments: 0,
    recoveryRate: 0
  })
  const [injuryTrends, setInjuryTrends] = useState<any[]>([])
  const [severityData, setSeverityData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user statistics
      const students = await mockAPI.getUsers('student')
      const practitioners = await mockAPI.getUsers('practitioner')
      const injuries = await mockAPI.getInjuries()
      const assignments = await mockAPI.getAssignments()
      const appointments = await mockAPI.getAppointments('', 'admin')

      const activeInjuries = injuries.filter(i => 
        ['reported', 'assigned', 'in_treatment', 'recovering'].includes(i.status)
      ).length

      const pendingAssignments = injuries.filter(i => i.status === 'reported').length
      const resolvedInjuries = injuries.filter(i => i.status === 'resolved').length
      const recoveryRate = injuries.length > 0 ? Math.round((resolvedInjuries / injuries.length) * 100) : 0

      setStats({
        totalStudents: students.length,
        totalPractitioners: practitioners.length,
        activeInjuries,
        pendingAssignments,
        totalAppointments: appointments.length,
        recoveryRate
      })

      // Process injury trends by month
      const monthlyData = injuries.reduce((acc: any, injury) => {
        const month = new Date(injury.date_reported).toLocaleString('default', { month: 'short' })
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {})

      const trendsData = Object.entries(monthlyData).map(([month, count]) => ({
        month,
        injuries: count
      }))

      setInjuryTrends(trendsData)

      // Process severity distribution
      const severityCount = injuries.reduce((acc: any, injury) => {
        acc[injury.severity] = (acc[injury.severity] || 0) + 1
        return acc
      }, {})

      const severityColors = {
        mild: '#fbbf24',
        moderate: '#fb923c',
        severe: '#ef4444',
        critical: '#dc2626'
      }

      const severityChartData = Object.entries(severityCount).map(([severity, count]) => ({
        name: severity,
        value: count,
        color: severityColors[severity as keyof typeof severityColors]
      }))

      setSeverityData(severityChartData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">System overview and analytics</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/assign-practitioners">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Assign Practitioner</span>
            </motion.button>
          </Link>
          <Link to="/analytics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Full Analytics</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
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
              <p className="text-sm font-medium text-gray-600">Practitioners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPractitioners}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Active Injuries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeInjuries}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600" />
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
              <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recoveryRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Injury Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Injury Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={injuryTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="injuries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Injury Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Injury Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}