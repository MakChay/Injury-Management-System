import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Filter, Calendar, MessageSquare, Activity, Clock, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { mockAPI, mockUsers, type Assignment, type User as UserType } from '../../lib/mockData'

interface AssignmentWithDetails extends Assignment {
  student?: UserType
  injury?: {
    injury_type: string
    severity: string
    body_part: string
    status: string
    date_occurred: string
  }
}

export function AssignedAthletesPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<AssignmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAthlete, setSelectedAthlete] = useState<AssignmentWithDetails | null>(null)

  useEffect(() => {
    if (user) {
      fetchAssignments()
    }
  }, [user])

  useEffect(() => {
    filterAssignments()
  }, [assignments, searchTerm, statusFilter])

  const fetchAssignments = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await mockAPI.getAssignments(user.id)
      
      // Enrich assignments with student and injury data
      const enrichedAssignments: AssignmentWithDetails[] = data.map(assignment => {
        const student = mockUsers.find(u => u.id === assignment.student_id)
        return {
          ...assignment,
          student,
          injury: {
            injury_type: 'Ankle Sprain', // Mock data - would come from injury table
            severity: 'moderate',
            body_part: 'Left Ankle',
            status: 'in_treatment',
            date_occurred: '2024-01-20'
          }
        }
      })
      
      setAssignments(enrichedAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAssignments = () => {
    let filtered = assignments

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.student?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.injury?.injury_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.injury?.body_part.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.injury?.status === statusFilter)
    }

    setFilteredAssignments(filtered)
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
        <h1 className="text-3xl font-bold text-gray-900">Assigned Athletes</h1>
        <p className="text-gray-600 mt-2">
          Manage your assigned athletes and track their recovery progress
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search athletes, injuries, or body parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="assigned">Assigned</option>
                <option value="in_treatment">In Treatment</option>
                <option value="recovering">Recovering</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Athletes List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Athletes ({filteredAssignments.length})
              </h2>
            </div>
            <div className="p-6">
              {filteredAssignments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <motion.div
                      key={assignment.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedAthlete(assignment)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAthlete?.id === assignment.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{assignment.student?.full_name}</h3>
                            <p className="text-sm text-gray-600">{assignment.student?.email}</p>
                            {assignment.student?.student_number && (
                              <p className="text-xs text-gray-500">Student #: {assignment.student.student_number}</p>
                            )}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-sm font-medium text-gray-700">{assignment.injury?.injury_type}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">{assignment.injury?.body_part}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(assignment.injury?.severity || 'mild')}`}>
                            {assignment.injury?.severity}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(assignment.injury?.status || 'assigned')}`}>
                            {assignment.injury?.status.replace('_', ' ')}
                          </span>
                          <p className="text-xs text-gray-500">
                            Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No athletes found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'No athletes have been assigned to you yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Athlete Details */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Athlete Details</h2>
            </div>
            <div className="p-6">
              {selectedAthlete ? (
                <div className="space-y-6">
                  {/* Athlete Info */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">{selectedAthlete.student?.full_name}</h3>
                    <p className="text-sm text-gray-600">{selectedAthlete.student?.email}</p>
                    {selectedAthlete.student?.phone && (
                      <p className="text-sm text-gray-600">{selectedAthlete.student.phone}</p>
                    )}
                  </div>

                  {/* Injury Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Current Injury</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Type:</span>
                        <span className="text-sm font-medium">{selectedAthlete.injury?.injury_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Body Part:</span>
                        <span className="text-sm font-medium">{selectedAthlete.injury?.body_part}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Severity:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getSeverityColor(selectedAthlete.injury?.severity || 'mild')}`}>
                          {selectedAthlete.injury?.severity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(selectedAthlete.injury?.status || 'assigned')}`}>
                          {selectedAthlete.injury?.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date Occurred:</span>
                        <span className="text-sm font-medium">
                          {selectedAthlete.injury?.date_occurred ? new Date(selectedAthlete.injury.date_occurred).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assignment Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Assignment Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Assigned:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedAthlete.assigned_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${selectedAthlete.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedAthlete.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {selectedAthlete.notes && (
                        <div>
                          <span className="text-sm text-gray-500">Notes:</span>
                          <p className="text-sm text-gray-700 mt-1">{selectedAthlete.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Activity className="w-4 h-4" />
                      <span>Add Recovery Log</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Schedule</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select an athlete to view details</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}