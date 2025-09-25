import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, Eye, MessageSquare, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { type Assignment, type User, type Injury } from '../../lib/mockData'

interface AthleteWithDetails extends User {
  assignments: Assignment[]
  latestInjury?: Injury
}

export function AssignedAthletesPage() {
  const { user } = useAuth()
  const [athletes, setAthletes] = useState<AthleteWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    if (user) {
      fetchAssignedAthletes()
    }
  }, [user])

  const fetchAssignedAthletes = async () => {
    if (!user) return

    try {
      setLoading(true)
      const assignments = await api.getAssignments(user.id)
      
      // Get unique athletes from assignments
      const athleteIds = [...new Set(assignments.map(a => a.student_id))]
      const athleteDetails = await Promise.all(
        athleteIds.map(async (athleteId) => {
          const athlete = await api.getUsers().then(users => 
            users.find(u => u.id === athleteId)
          )
          const athleteAssignments = assignments.filter(a => a.student_id === athleteId)
          const injuries = await api.getInjuries(athleteId)
          const latestInjury = injuries.sort((a, b) => 
            new Date(b.date_reported).getTime() - new Date(a.date_reported).getTime()
          )[0]
          
          return {
            ...athlete!,
            assignments: athleteAssignments,
            latestInjury
          }
        })
      )
      
      setAthletes(athleteDetails)
    } catch (error) {
      console.error('Error fetching assigned athletes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterStatus === 'active') {
      return matchesSearch && athlete.assignments.some(a => a.active)
    }
    if (filterStatus === 'completed') {
      return matchesSearch && athlete.assignments.every(a => !a.active)
    }
    
    return matchesSearch
  })

  const getInjuryStatusColor = (status: string) => {
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
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assigned Athletes</h1>
          <p className="text-gray-600">Manage your assigned student-athletes and their recovery</p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search athletes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Athletes</option>
              <option value="active">Active Cases</option>
              <option value="completed">Completed Cases</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Athletes List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAthletes.map((athlete, index) => (
          <motion.div
            key={athlete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {athlete.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{athlete.full_name}</h3>
                  <p className="text-sm text-gray-600">{athlete.email}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {athlete.latestInjury && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Latest Injury</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInjuryStatusColor(athlete.latestInjury.status)}`}>
                    {athlete.latestInjury.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{athlete.latestInjury.injury_type}</p>
                <p className="text-xs text-gray-500">
                  {athlete.latestInjury.body_part} • {new Date(athlete.latestInjury.date_occurred).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Assignments</span>
                <span className="font-medium text-gray-900">
                  {athlete.assignments.filter(a => a.active).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Cases</span>
                <span className="font-medium text-gray-900">
                  {athlete.assignments.length}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Message
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAthletes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No athletes found' : 'No assigned athletes'}
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'You don\'t have any assigned athletes yet. Contact an administrator to get assigned to cases.'
            }
          </p>
        </motion.div>
      )}
    </div>
  )
}