import { useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import { api } from '../lib/api'
import { pushToast } from '../components/Toaster'

export function useReminders() {
  const { user, profile } = useAuth()
  const notifiedIdsRef = useRef<Set<string>>(new Set())
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!user || !profile) return
      try {
        const prefs = await api.getNotificationPreferences(user.id)
        if (!prefs?.email_reminders) return
        const role = profile.role
        const appointments = await api.getAppointments(user.id, role)
        const now = Date.now()
        const windowMs = (prefs.reminder_window_minutes || 120) * 60 * 1000
        appointments.forEach((apt: any) => {
          const when = new Date(apt.appointment_date).getTime()
          const soon = when - now
          if (soon > 0 && soon <= windowMs && apt.status === 'scheduled') {
            if (!notifiedIdsRef.current.has(apt.id)) {
              notifiedIdsRef.current.add(apt.id)
              pushToast({ type: 'info', message: `Upcoming appointment at ${new Date(when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` })
            }
          }
        })
      } catch {
        // ignore reminder errors
      }
    }

    // initial and interval
    run()
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(run, 60 * 1000) as unknown as number
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [user?.id, profile?.role])
}

