import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertTriangle, Calendar, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { pushToast } from '../../components/Toaster'
import { useAsyncOperation } from '../../hooks/useErrorHandler'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const injurySchema = z.object({
  injuryType: z.string().min(1, 'Injury type is required'),
  bodyPart: z.string().min(1, 'Body part is required'),
  severity: z.enum(['mild', 'moderate', 'severe', 'critical']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dateOccurred: z.string().min(1, 'Date occurred is required'),
  activityWhenInjured: z.string().optional(),
  painLevel: z.number().min(0).max(10).optional(),
})

type InjuryFormData = z.infer<typeof injurySchema>

export function ReportInjuryPage() {
  const { user } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InjuryFormData>({
    resolver: zodResolver(injurySchema),
  })

  const { execute: submitInjury, loading } = useAsyncOperation(
    async (data: InjuryFormData) => {
      if (!user) throw new Error('User not authenticated')
      
      const injuryData = {
        student_id: user.id,
        injury_type: data.injuryType,
        body_part: data.bodyPart,
        severity: data.severity,
        description: data.description,
        date_occurred: data.dateOccurred,
        activity_when_injured: data.activityWhenInjured,
        pain_level: data.painLevel,
      }

      return await api.createInjury(injuryData)
    },
    {
      onSuccess: () => {
        pushToast({ type: 'success', message: 'Injury reported successfully!' })
        reset()
      },
      showSuccessToast: false, // We're handling success manually
    }
  )

  const onSubmit = (data: InjuryFormData) => {
    submitInjury(data)
  }

  const severityOptions = [
    { value: 'mild', label: 'Mild', color: 'text-yellow-600' },
    { value: 'moderate', label: 'Moderate', color: 'text-orange-600' },
    { value: 'severe', label: 'Severe', color: 'text-red-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-800' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Injury</h1>
          <p className="text-gray-600">Report a new injury to get help from our medical team</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Injury Details</h2>
          <p className="text-sm text-gray-600 mt-1">Please provide detailed information about your injury</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Injury Type *
              </label>
              <input
                {...register('injuryType')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Ankle sprain, Hamstring strain"
              />
              {errors.injuryType && (
                <p className="mt-1 text-sm text-red-600">{errors.injuryType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Part *
              </label>
              <input
                {...register('bodyPart')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Left ankle, Right knee"
              />
              {errors.bodyPart && (
                <p className="mt-1 text-sm text-red-600">{errors.bodyPart.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {severityOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    {...register('severity')}
                    type="radio"
                    value={option.value}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm font-medium ${option.color}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.severity && (
              <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your injury in detail, including symptoms and how it occurred..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Injury *
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('dateOccurred')}
                  type="date"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.dateOccurred && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOccurred.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity When Injured
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  {...register('activityWhenInjured')}
                  type="text"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Rugby practice, Gym workout"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pain Level (0-10)
            </label>
            <div className="flex items-center space-x-4">
              <input
                {...register('painLevel', { valueAsNumber: true })}
                type="range"
                min="0"
                max="10"
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-[2rem] text-center">
                {register('painLevel').value || 0}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No pain</span>
              <span>Severe pain</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="Reporting Injury..." />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Report Injury</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}