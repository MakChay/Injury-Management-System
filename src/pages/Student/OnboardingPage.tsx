import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, GraduationCap, Shield, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const onboardingSteps = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your personal information, sport, and contact details',
    icon: User,
    completed: false,
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    description: 'Add emergency contact information for safety',
    icon: Shield,
    completed: false,
  },
  {
    id: 'medical',
    title: 'Medical Information',
    description: 'Provide medical history and current conditions',
    icon: GraduationCap,
    completed: false,
  },
]

export function OnboardingPage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId)
  const allStepsCompleted = completedSteps.length === onboardingSteps.length

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DUT Athletic Injury Management</h1>
        <p className="text-gray-600">Let's get you set up with your profile and preferences</p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Setup Progress</h2>
          <span className="text-sm text-gray-600">
            {completedSteps.length} of {onboardingSteps.length} completed
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.length / onboardingSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {onboardingSteps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = isStepCompleted(step.id)
            const isCurrent = index === currentStep
            
            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isCompleted
                    ? 'border-green-200 bg-green-50'
                    : isCurrent
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isCurrent
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Current Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            {React.createElement(onboardingSteps[currentStep].icon, { className: "w-6 h-6 text-blue-600" })}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {onboardingSteps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {onboardingSteps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 0 && <ProfileStep onComplete={() => handleStepComplete('profile')} />}
        {currentStep === 1 && <EmergencyStep onComplete={() => handleStepComplete('emergency')} />}
        {currentStep === 2 && <MedicalStep onComplete={() => handleStepComplete('medical')} />}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < onboardingSteps.length - 1 ? (
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                // Complete onboarding
                console.log('Onboarding completed!')
              }}
              disabled={!allStepsCompleted}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Setup</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Step Components
function ProfileStep({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    sport: '',
    position: '',
    dominantSide: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save profile data
    console.log('Profile data:', formData)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
          <select
            value={formData.sport}
            onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
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
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Forward, Midfielder"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dominant Side</label>
          <select
            value={formData.dominantSide}
            onChange={(e) => setFormData({ ...formData, dominantSide: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select dominant side</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="ambidextrous">Ambidextrous</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+27 82 123 4567"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Profile Information
      </button>
    </form>
  )
}

function EmergencyStep({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    emergencyContact: '',
    emergencyPhone: '',
    relationship: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Emergency contact data:', formData)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
        <input
          type="text"
          value={formData.emergencyContact}
          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Full name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+27 82 123 4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
          <select
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select relationship</option>
            <option value="parent">Parent</option>
            <option value="guardian">Guardian</option>
            <option value="spouse">Spouse</option>
            <option value="sibling">Sibling</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Emergency Contact
      </button>
    </form>
  )
}

function MedicalStep({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    medicalHistory: '',
    currentConditions: '',
    medications: '',
    allergies: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Medical data:', formData)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
        <textarea
          value={formData.medicalHistory}
          onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any previous injuries, surgeries, or medical conditions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Medical Conditions</label>
        <textarea
          value={formData.currentConditions}
          onChange={(e) => setFormData({ ...formData, currentConditions: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any ongoing medical conditions..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
          <textarea
            value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="List any medications you're currently taking..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
          <textarea
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="List any allergies..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Medical Information
      </button>
    </form>
  )
}