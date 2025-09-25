import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Vite env types can be unavailable to static analysis; cast import.meta
const envMeta = (import.meta as any)?.env || {}
const supabaseUrl: string | undefined = envMeta.VITE_SUPABASE_URL
const supabaseAnonKey: string | undefined = envMeta.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseEnabled = Boolean(supabase)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'student' | 'practitioner' | 'admin'
          profile_pic: string | null
          phone: string | null
          student_number: string | null
          position: string | null
          dominant_side: string | null
          injury_history: any | null
          specialization: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'student' | 'practitioner' | 'admin'
          profile_pic?: string | null
          phone?: string | null
          student_number?: string | null
          position?: string | null
          dominant_side?: string | null
          injury_history?: any | null
          specialization?: string | null
          bio?: string | null
        }
        Update: {
          full_name?: string
          email?: string
          role?: 'student' | 'practitioner' | 'admin'
          profile_pic?: string | null
          phone?: string | null
          student_number?: string | null
          position?: string | null
          dominant_side?: string | null
          injury_history?: any | null
          specialization?: string | null
          bio?: string | null
        }
      }
      injuries: {
        Row: {
          id: string
          student_id: string
          injury_type: string
          severity: 'mild' | 'moderate' | 'severe' | 'critical'
          description: string
          body_part: string
          date_occurred: string
          date_reported: string
          status: 'reported' | 'assigned' | 'in_treatment' | 'recovering' | 'resolved'
          activity_when_injured: string | null
          pain_level: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          injury_type: string
          severity?: 'mild' | 'moderate' | 'severe' | 'critical'
          description: string
          body_part: string
          date_occurred: string
          activity_when_injured?: string | null
          pain_level?: number | null
        }
        Update: {
          injury_type?: string
          severity?: 'mild' | 'moderate' | 'severe' | 'critical'
          description?: string
          body_part?: string
          date_occurred?: string
          status?: 'reported' | 'assigned' | 'in_treatment' | 'recovering' | 'resolved'
          activity_when_injured?: string | null
          pain_level?: number | null
        }
      }
      , plan_templates: {
        Row: {
          id: string
          name: string
          injury_type: string
          sport: string | null
          phases: any
          created_by: string | null
          created_at: string
        }
        Insert: {
          name: string
          injury_type: string
          sport?: string | null
          phases: any
          created_by?: string | null
        }
        Update: {
          name?: string
          injury_type?: string
          sport?: string | null
          phases?: any
        }
      }
      , treatment_plans: {
        Row: {
          id: string
          assignment_id: string
          template_id: string | null
          title: string
          phases: any
          created_at: string
        }
        Insert: {
          assignment_id: string
          template_id?: string | null
          title: string
          phases: any
        }
        Update: {
          title?: string
          phases?: any
        }
      }
      , notification_preferences: {
        Row: {
          id: string
          email_reminders: boolean
          sms_reminders: boolean
          reminder_window_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email_reminders?: boolean
          sms_reminders?: boolean
          reminder_window_minutes?: number
        }
        Update: {
          email_reminders?: boolean
          sms_reminders?: boolean
          reminder_window_minutes?: number
        }
      }
      , daily_checkins: {
        Row: {
          id: string
          student_id: string
          checkin_date: string
          pain_level: number | null
          swelling: number | null
          rom: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          student_id: string
          checkin_date?: string
          pain_level?: number | null
          swelling?: number | null
          rom?: number | null
          notes?: string | null
        }
        Update: {
          pain_level?: number | null
          swelling?: number | null
          rom?: number | null
          notes?: string | null
        }
      }
      , rtp_checklists: {
        Row: {
          id: string
          student_id: string
          sport: string | null
          criteria: any
          status: 'in_progress' | 'ready' | 'cleared'
          cleared_by: string | null
          cleared_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          sport?: string | null
          criteria: any
          status?: 'in_progress' | 'ready' | 'cleared'
        }
        Update: {
          sport?: string | null
          criteria?: any
          status?: 'in_progress' | 'ready' | 'cleared'
          cleared_by?: string | null
          cleared_at?: string | null
        }
      }
      , session_notes: {
        Row: {
          id: string
          assignment_id: string
          practitioner_id: string
          soap_notes: string
          vitals: any | null
          contraindications: string | null
          created_at: string
        }
        Insert: {
          assignment_id: string
          practitioner_id: string
          soap_notes: string
          vitals?: any | null
          contraindications?: string | null
        }
        Update: {
          soap_notes?: string
          vitals?: any | null
          contraindications?: string | null
        }
      }
    }
  }
}