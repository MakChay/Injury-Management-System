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

  async updateInjuryStatus(injuryId: string, status: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase
      .from('injuries')
      .update({ status })
      .eq('id', injuryId)
      .select('*')
      .single()
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

  async createAppointment(payload: {
    student_id: string
    practitioner_id: string
    assignment_id?: string | null
    appointment_date: string
    duration_minutes?: number
    location?: string | null
    notes?: string | null
  }) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...payload,
        duration_minutes: payload.duration_minutes ?? 45,
      })
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  async sendMessage(payload: { sender_id: string; receiver_id: string; assignment_id?: string | null; message: string }) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase.from('messages').insert(payload).select('*').single()
    if (error) throw error
    return data
  },

  async uploadFile(file: File, path: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase.storage.from('user-files').upload(path, file, { upsert: true })
    if (error) throw error
    return data
  },

  async linkFileRow(payload: { uploaded_by: string; assignment_id?: string | null; file_url: string; file_type: string }) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase.from('files').insert(payload).select('*').single()
    if (error) throw error
    return data
  },

  async assignPractitioner(payload: { student_id: string; practitioner_id: string; injury_id: string; assigned_by?: string; notes?: string }) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase
      .from('practitioner_assignments')
      .insert({ ...payload, active: true })
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  onMessageRealtime(userId: string, cb: (payload: any) => void) {
    if (!isSupabaseEnabled || !supabase) return () => {}
    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const row = payload.new as any
        if (row.sender_id === userId || row.receiver_id === userId) cb(row)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  },
}

