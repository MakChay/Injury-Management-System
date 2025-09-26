import { useState, useEffect } from 'react'
import { logger } from '../../lib/logger'
import { motion } from 'framer-motion'
import { AlertTriangle, Calendar, Activity, Eye, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { type Injury } from '../../lib/mockData'

export function MyInjuriesPage() {
  const { user } = useAuth()
  const [injuries, setInjuries] = useState<Injury[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

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
      setInjuries(data)
    } catch (error) {
      logger.error('Error fetching injuries:', error as Error)
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

  const filteredInjuries = injuries.filter(injury => {
    if (filter === 'active') {
      return ['reported', 'assigned', 'in_treatment', 'recovering'].includes(injury.status)
    }
    if (filter === 'resolved') {
      return injury.status === 'resolved'
    }
    return true
  })

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
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Injuries</h1>
            <p className="text-gray-600">Track and manage your injury reports</p>
          </div>
        </div>
        <Link to="/report-injury">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Report New Injury</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Injuries', count: injuries.length },
            { key: 'active', label: 'Active', count: injuries.filter(i => ['reported', 'assigned', 'in_treatment', 'recovering'].includes(i.status)).length },
            { key: 'resolved', label: 'Resolved', count: injuries.filter(i => i.status === 'resolved').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Injuries List */}
      <div className="space-y-4">
        {filteredInjuries.length > 0 ? (
          filteredInjuries.map((injury, index) => (
            <motion.div
              key={injury.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {injury.injury_type}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(injury.severity)}`}>
                      {injury.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(injury.status)}`}>
                      {injury.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{injury.body_part}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {injury.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Occurred: {new Date(injury.date_occurred).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Reported: {new Date(injury.date_reported).toLocaleDateString()}</span>
                    </div>
                    {injury.pain_level && (
                      <div className="flex items-center space-x-1">
                        <span>Pain Level: {injury.pain_level}/10</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No injuries reported' : `No ${filter} injuries`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? 'You haven\'t reported any injuries yet.' 
                : `You don't have any ${filter} injuries at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/report-injury">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Report Your First Injury
                </button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}