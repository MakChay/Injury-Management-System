import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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