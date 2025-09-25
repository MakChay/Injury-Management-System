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
    }
  }
}