import { motion } from 'framer-motion'
import { UserPlus, Users, Search } from 'lucide-react'

export function AssignPractitionersPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assign Practitioners</h1>
          <p className="text-gray-600">Assign practitioners to student-athletes</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Interface</h3>
          <p className="text-gray-600">
            This page will contain the interface for assigning practitioners to students.
          </p>
        </div>
      </motion.div>
    </div>
  )
}