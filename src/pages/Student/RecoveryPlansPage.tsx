import { useState, useEffect } from 'react'
import { logger } from '../../lib/logger'
import { motion } from 'framer-motion'
import { Activity, Calendar, CheckCircle, Clock, Play } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'

interface RecoveryPlan {
  id: string
  title: string
  phases: Array<{
    title: string
    completed: boolean
    exercises: Array<{
      name: string
      done: boolean
      notes?: string
    }>
  }>
  created_at: string
}

export function RecoveryPlansPage() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<RecoveryPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPlans()
    }
  }, [user])

  const fetchPlans = async () => {
    if (!user) return

    try {
      setLoading(true)
      // Mock data for now - in real app, fetch from API
      const mockPlans: RecoveryPlan[] = [
        {
          id: 'plan-1',
          title: 'Ankle Sprain Recovery Plan',
          phases: [
            {
              title: 'Phase 1: Acute Recovery (Days 1-3)',
              completed: true,
              exercises: [
                { name: 'Rest, Ice, Compression, Elevation', done: true },
                { name: 'Ankle Alphabet Exercises', done: true },
                { name: 'Gentle Range of Motion', done: false },
              ]
            },
            {
              title: 'Phase 2: Subacute Recovery (Days 4-10)',
              completed: false,
              exercises: [
                { name: 'Calf Raises (3x15)', done: false },
                { name: 'Single-leg Balance (2x30s)', done: false },
                { name: 'Ankle Circles (3x10 each direction)', done: false },
              ]
            },
            {
              title: 'Phase 3: Return to Activity (Days 11-21)',
              completed: false,
              exercises: [
                { name: 'Lunges (3x10 each leg)', done: false },
                { name: 'Jump Rope (5 minutes)', done: false },
                { name: 'Sport-specific Drills', done: false },
              ]
            }
          ],
          created_at: '2024-01-20T10:00:00Z'
        }
      ]
      setPlans(mockPlans)
    } catch (error) {
      logger.error('Error fetching recovery plans:', error as Error)
    } finally {
      setLoading(false)
    }
  }

  const toggleExercise = (planId: string, phaseIndex: number, exerciseIndex: number) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const updatedPhases = [...plan.phases]
        updatedPhases[phaseIndex] = {
          ...updatedPhases[phaseIndex],
          exercises: updatedPhases[phaseIndex].exercises.map((exercise, idx) => 
            idx === exerciseIndex ? { ...exercise, done: !exercise.done } : exercise
          )
        }
        return { ...plan, phases: updatedPhases }
      }
      return plan
    }))
  }

  const getPhaseProgress = (phase: RecoveryPlan['phases'][0]) => {
    const completed = phase.exercises.filter(ex => ex.done).length
    return (completed / phase.exercises.length) * 100
  }

  const getOverallProgress = (plan: RecoveryPlan) => {
    const totalExercises = plan.phases.reduce((acc, phase) => acc + phase.exercises.length, 0)
    const completedExercises = plan.phases.reduce((acc, phase) => 
      acc + phase.exercises.filter(ex => ex.done).length, 0
    )
    return (completedExercises / totalExercises) * 100
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
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recovery Plans</h1>
          <p className="text-gray-600">Follow your personalized recovery program</p>
        </div>
      </motion.div>

      {plans.length > 0 ? (
        <div className="space-y-6">
          {plans.map((plan, planIndex) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: planIndex * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{plan.title}</h2>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(getOverallProgress(plan))}%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getOverallProgress(plan)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Phases */}
              <div className="space-y-4">
                {plan.phases.map((phase, phaseIndex) => {
                  const phaseProgress = getPhaseProgress(phase)
                  
                  return (
                    <div key={phaseIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{phase.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {Math.round(phaseProgress)}%
                          </span>
                          {phase.completed && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                        <motion.div
                          className="bg-green-500 h-1 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${phaseProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      <div className="space-y-2">
                        {phase.exercises.map((exercise, exerciseIndex) => (
                          <div
                            key={exerciseIndex}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <button
                              onClick={() => toggleExercise(plan.id, phaseIndex, exerciseIndex)}
                              className="flex-shrink-0"
                            >
                              {exercise.done ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                              )}
                            </button>
                            <span className={`flex-1 ${exercise.done ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {exercise.name}
                            </span>
                            {exercise.done && (
                              <Clock className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recovery Plans</h3>
          <p className="text-gray-600 mb-4">
            You don't have any active recovery plans yet. Your practitioner will create one for you after your injury assessment.
          </p>
        </motion.div>
      )}
    </div>
  )
}