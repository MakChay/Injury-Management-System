import { supabase, isSupabaseEnabled } from './supabase'
import { mockAPI } from './mockData'

export const api = {
  async getInjuries(studentId?: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getInjuries(studentId)
    const query = supabase.from('injuries').select('*').order('date_reported', { ascending: false })
    const { data, error } = studentId ? await query.eq('student_id', studentId) : await query
    if (error) throw error
    return data
  },

  async createInjury(injuryData: any) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.createInjury(injuryData)
    const { data, error } = await supabase.from('injuries').insert(injuryData).select('*').single()
    if (error) throw error
    return data
  },

  async getAssignments(practitionerId?: string, studentId?: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getAssignments(practitionerId, studentId)
    let query = supabase.from('practitioner_assignments').select('*')
    if (practitionerId) query = query.eq('practitioner_id', practitionerId)
    if (studentId) query = query.eq('student_id', studentId)
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getAppointments(userId: string, role: 'student' | 'practitioner' | 'admin') {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getAppointments(userId, role)
    let query = supabase.from('appointments').select('*')
    if (role === 'student') query = query.eq('student_id', userId)
    if (role === 'practitioner') query = query.eq('practitioner_id', userId)
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getMessages(userId: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getMessages(userId)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('sent_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getUsers(role?: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getUsers(role)
    let query = supabase.from('profiles').select('*')
    if (role) query = query.eq('role', role)
    const { data, error } = await query
    if (error) throw error
    return data
  },
}

