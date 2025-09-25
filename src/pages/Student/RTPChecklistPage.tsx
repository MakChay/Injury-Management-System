import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, AlertTriangle, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const rtpCriteria = [
  { id: 'pain-free', label: 'Pain-free at rest', category: 'Pain Management' },
  { id: 'minimal-pain', label: 'Minimal pain with activity', category: 'Pain Management' },
  { id: 'full-rom', label: 'Full range of motion', category: 'Mobility' },
  { id: 'strength-90', label: '90% of pre-injury strength', category: 'Strength' },
  { id: 'balance', label: 'Good balance and proprioception', category: 'Function' },
  { id: 'sport-specific', label: 'Sport-specific movements', category: 'Function' },
  { id: 'cardiovascular', label: 'Cardiovascular fitness maintained', category: 'Fitness' },
  { id: 'psychological', label: 'Confident to return to play', category: 'Psychology' },
]

export function RTPChecklistPage() {
  const { user } = useAuth()
  const [completedCriteria, setCompletedCriteria] = useState<string[]>([])
  const [sport, setSport] = useState('')

  const toggleCriterion = (criterionId: string) => {
    setCompletedCriteria(prev => 
      prev.includes(criterionId) 
        ? prev.filter(id => id !== criterionId)
        : [...prev, criterionId]
    )
  }

  const isReady = completedCriteria.length === rtpCriteria.length
  const progress = (completedCriteria.length / rtpCriteria.length) * 100

  const categories = [...new Set(rtpCriteria.map(c => c.category))]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Return to Play Checklist</h1>
          <p className="text-gray-600">Track your readiness to return to competitive play</p>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
          <span className="text-sm text-gray-600">
            {completedCriteria.length} of {rtpCriteria.length} criteria met
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className={`h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-blue-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isReady ? 'Ready to Return' : 'Not Yet Ready'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </motion.div>

      {/* Sport Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sport Selection</h3>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your sport</option>
          <option value="rugby">Rugby</option>
          <option value="soccer">Soccer</option>
          <option value="athletics">Athletics</option>
          <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option>
          <option value="other">Other</option>
        </select>
      </motion.div>

      {/* Criteria by Category */}
      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
            <div className="space-y-3">
              {rtpCriteria
                .filter(criterion => criterion.category === category)
                .map((criterion) => {
                  const isCompleted = completedCriteria.includes(criterion.id)
                  
                  return (
                    <div
                      key={criterion.id}
                      onClick={() => toggleCriterion(criterion.id)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <button className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <span className={`flex-1 ${isCompleted ? 'text-gray-900' : 'text-gray-700'}`}>
                        {criterion.label}
                      </span>
                    </div>
                  )
                })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status Message */}
      {isReady && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Ready to Return!</h3>
              <p className="text-green-700">
                You've met all the criteria for return to play. Please consult with your practitioner before resuming competitive activities.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}