import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Activity, AlertTriangle, FileText, Clock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

const injuryTypes = [
  'Ankle Sprain', 'Knee Injury', 'Hamstring Strain', 'Shoulder Dislocation',
  'Concussion', 'Back Strain', 'Wrist Fracture', 'Hip Flexor Strain',
  'Achilles Tendon Injury', 'Groin Pull', 'Shin Splints', 'Other'
]

const bodyParts = [
  'Head', 'Neck', 'Shoulder', 'Arm', 'Elbow', 'Wrist', 'Hand',
  'Chest', 'Back', 'Abdomen', 'Hip', 'Thigh', 'Knee', 'Calf',
  'Ankle', 'Foot', 'Other'
]

const activities = [
  'Rugby Practice', 'Soccer Practice', 'Basketball Practice', 'Athletics Training',
  'Swimming Training', 'Gym Workout', 'Competition/Match', 'Warm-up',
  'Cool-down', 'Individual Training', 'Other'
]

export function ReportInjuryPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    injury_type: '',
    custom_injury_type: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe' | 'critical',
    description: '',
    body_part: '',
    custom_body_part: '',
    date_occurred: '',
    time_occurred: '',
    activity_when_injured: '',
    custom_activity: '',
    pain_level: 5,
    immediate_treatment: '',
    witnesses: '',
    previous_injury: false,
    previous_injury_details: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const injuryData = {
        student_id: user.id,
        injury_type: formData.injury_type === 'Other' ? formData.custom_injury_type : formData.injury_type,
        severity: formData.severity,
        description: formData.description,
        body_part: formData.body_part === 'Other' ? formData.custom_body_part : formData.body_part,
        date_occurred: formData.date_occurred,
        activity_when_injured: formData.activity_when_injured === 'Other' ? formData.custom_activity : formData.activity_when_injured,
        pain_level: formData.pain_level,
        immediate_treatment: formData.immediate_treatment,
        witnesses: formData.witnesses,
        previous_injury: formData.previous_injury,
        previous_injury_details: formData.previous_injury_details
      }

      await api.createInjury(injuryData)
      navigate('/my-injuries', { 
        state: { message: 'Injury reported successfully! A health coordinator will review and assign a practitioner.' }
      })
    } catch (error) {
      console.error('Error reporting injury:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'border-yellow-300 bg-yellow-50'
      case 'moderate': return 'border-orange-300 bg-orange-50'
      case 'severe': return 'border-red-300 bg-red-50'
      case 'critical': return 'border-red-500 bg-red-100'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Report Injury</h1>
        <p className="text-gray-600 mt-2">
          Please provide detailed information about your injury to help us assign the right practitioner and create an effective treatment plan.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Injury Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              Basic Injury Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Injury *
                </label>
                <select
                  value={formData.injury_type}
                  onChange={(e) => setFormData({ ...formData, injury_type: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select injury type</option>
                  {injuryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {formData.injury_type === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={formData.custom_injury_type}
                    onChange={(e) => setFormData({ ...formData, custom_injury_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Part Affected *
                </label>
                <select
                  value={formData.body_part}
                  onChange={(e) => setFormData({ ...formData, body_part: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select body part</option>
                  {bodyParts.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
                {formData.body_part === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={formData.custom_body_part}
                    onChange={(e) => setFormData({ ...formData, custom_body_part: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                    required
                  />
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['mild', 'moderate', 'severe', 'critical'] as const).map((severity) => (
                  <label
                    key={severity}
                    className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.severity === severity
                        ? getSeverityColor(severity) + ' ring-2 ring-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={severity}
                      checked={formData.severity === severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium capitalize">{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Level (1-10) *
              </label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">1 (Mild)</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.pain_level}
                  onChange={(e) => setFormData({ ...formData, pain_level: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500">10 (Severe)</span>
                <div className="w-12 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-blue-700">{formData.pain_level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 text-blue-500 mr-2" />
              When & Where
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Injury *
                </label>
                <input
                  type="date"
                  value={formData.date_occurred}
                  onChange={(e) => setFormData({ ...formData, date_occurred: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time of Injury
                </label>
                <input
                  type="time"
                  value={formData.time_occurred}
                  onChange={(e) => setFormData({ ...formData, time_occurred: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity When Injured *
              </label>
              <select
                value={formData.activity_when_injured}
                onChange={(e) => setFormData({ ...formData, activity_when_injured: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select activity</option>
                {activities.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
              {formData.activity_when_injured === 'Other' && (
                <input
                  type="text"
                  placeholder="Please specify the activity"
                  value={formData.custom_activity}
                  onChange={(e) => setFormData({ ...formData, custom_activity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
                  required
                />
              )}
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 text-green-500 mr-2" />
              Detailed Description
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did the injury occur? *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Please describe in detail how the injury happened, what you were doing, and any immediate symptoms you experienced..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immediate Treatment Received
                </label>
                <textarea
                  value={formData.immediate_treatment}
                  onChange={(e) => setFormData({ ...formData, immediate_treatment: e.target.value })}
                  rows={3}
                  placeholder="Describe any first aid or immediate treatment you received (ice, rest, medication, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Witnesses
                </label>
                <input
                  type="text"
                  value={formData.witnesses}
                  onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                  placeholder="Names of any witnesses (coaches, teammates, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Previous Injury History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-6 h-6 text-purple-500 mr-2" />
              Previous Injury History
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="previous_injury"
                  checked={formData.previous_injury}
                  onChange={(e) => setFormData({ ...formData, previous_injury: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="previous_injury" className="ml-2 text-sm text-gray-700">
                  I have had a similar injury before
                </label>
              </div>

              {formData.previous_injury && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Injury Details
                  </label>
                  <textarea
                    value={formData.previous_injury_details}
                    onChange={(e) => setFormData({ ...formData, previous_injury_details: e.target.value })}
                    rows={3}
                    placeholder="Please describe your previous similar injury, when it occurred, and how it was treated"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Report Injury'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}