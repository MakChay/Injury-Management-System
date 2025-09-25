import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Calendar, Save, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { pushToast } from '../../components/Toaster'

export function DailyCheckInPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    painLevel: 0,
    swelling: 0,
    rom: 0,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await api.createDailyCheckIn({
        student_id: user.id,
        pain_level: formData.painLevel,
        swelling: formData.swelling,
        rom: formData.rom,
        notes: formData.notes,
      })
      
      pushToast({ type: 'success', message: 'Daily check-in submitted successfully!' })
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting check-in:', error)
      pushToast({ type: 'error', message: 'Failed to submit check-in. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your daily check-in. Your progress has been recorded.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({ painLevel: 0, swelling: 0, rom: 0, notes: '' })
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Check-in
          </button>
        </motion.div>
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
          <Activity className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Check-in</h1>
          <p className="text-gray-600">Track your daily recovery progress</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pain Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pain Level: {formData.painLevel}/10
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                value={formData.painLevel}
                onChange={(e) => setFormData({ ...formData, painLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>No pain</span>
                <span>Severe pain</span>
              </div>
            </div>
          </div>

          {/* Swelling */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Swelling: {formData.swelling}/10
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                value={formData.swelling}
                onChange={(e) => setFormData({ ...formData, swelling: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>No swelling</span>
                <span>Severe swelling</span>
              </div>
            </div>
          </div>

          {/* Range of Motion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Range of Motion: {formData.rom}/10
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                value={formData.rom}
                onChange={(e) => setFormData({ ...formData, rom: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>No movement</span>
                <span>Full range</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional observations about your recovery today..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Submit Check-in</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}