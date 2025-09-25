import { motion } from 'framer-motion'
import { ClipboardList, Plus } from 'lucide-react'

export function TreatmentPlansPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treatment Plans</h1>
            <p className="text-gray-600">Manage patient treatment plans and progress</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Create Plan</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Treatment Plans</h3>
          <p className="text-gray-600">
            This page will contain the treatment plans interface for practitioners.
          </p>
        </div>
      </motion.div>
    </div>
  )
}