import { supabase, isSupabaseEnabled } from './supabase'
import { mockAPI } from './mockData'

export const api = {
  async getInjuries(studentId?: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getInjuries(studentId)
    const query = supabase.from('injuries').select('*').order('date_reported', { ascending: false })
    const { data, error } = studentId ? await query.eq('student_id', studentId) : await query
    if (error) throw error
    const ids = Array.from(new Set((data || []).map((i: any) => i.student_id)))
    const { data: students } = await supabase.from('profiles').select('id, full_name, sport').in('id', ids)
    const map = new Map((students || []).map((s: any) => [s.id, s]))
    return (data || []).map((i: any) => ({ ...i, student_profile: map.get(i.student_id) || null }))
  },
  async upsertProfileOnboarding(payload: { id: string; sport?: string | null; position?: string | null; dominant_side?: string | null; injury_history?: any | null }) {
    if (!isSupabaseEnabled || !supabase) return payload
    const { data, error } = await supabase.from('profiles').update(payload).eq('id', payload.id).select('*').single()
    if (error) throw error
    return data
  },
  async createDailyCheckin(payload: { student_id: string; pain_level?: number; swelling?: number; rom?: number; notes?: string }) {
    if (!isSupabaseEnabled || !supabase) return { id: `chk-${Date.now()}`, ...payload }
    const { data, error } = await supabase.from('daily_checkins').insert(payload).select('*').single()
    if (error) throw error
    return data
  },
  async getDailyCheckins(student_id: string) {
    if (!isSupabaseEnabled || !supabase) return []
    const { data, error } = await supabase.from('daily_checkins').select('*').eq('student_id', student_id).order('checkin_date', { ascending: false })
    if (error) throw error
    return data
  },
  async upsertRtpChecklist(payload: { id?: string; student_id: string; sport?: string | null; criteria: any; status?: 'in_progress' | 'ready' | 'cleared'; cleared_by?: string | null; cleared_at?: string | null }) {
    if (!isSupabaseEnabled || !supabase) return { id: payload.id || `rtp-${Date.now()}`, ...payload }
    const { data, error } = await supabase.from('rtp_checklists').upsert(payload).select('*').single()
    if (error) throw error
    return data
  },
  async getRtpChecklist(student_id: string) {
    if (!isSupabaseEnabled || !supabase) return null
    const { data } = await supabase.from('rtp_checklists').select('*').eq('student_id', student_id).limit(1).single()
    return data
  },
  async createSessionNote(payload: { assignment_id: string; practitioner_id: string; soap_notes: string; vitals?: any; contraindications?: string }) {
    if (!isSupabaseEnabled || !supabase) return { id: `note-${Date.now()}`, ...payload }
    const { data, error } = await supabase.from('session_notes').insert(payload).select('*').single()
    if (error) throw error
    return data
  },
  async getSessionNotes(assignment_id: string) {
    if (!isSupabaseEnabled || !supabase) return []
    const { data, error } = await supabase.from('session_notes').select('*').eq('assignment_id', assignment_id).order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createInjury(injuryData: any) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.createInjury(injuryData)
    const { data, error } = await supabase.from('injuries').insert(injuryData).select('*').single()
    if (error) throw error
    return data
  },

  async getInjuriesByIds(ids: string[]) {
    if (!isSupabaseEnabled || !supabase) {
      // Fallback: filter mock by ids
      const all = await mockAPI.getInjuries()
      return all.filter((i: any) => ids.includes(i.id))
    }
    const { data, error } = await supabase.from('injuries').select('*').in('id', ids)
    if (error) throw error
    const studentIds = Array.from(new Set((data || []).map((i: any) => i.student_id)))
    const { data: students } = await supabase.from('profiles').select('id, full_name, sport').in('id', studentIds)
    const map = new Map((students || []).map((s: any) => [s.id, s]))
    return (data || []).map((i: any) => ({ ...i, student_profile: map.get(i.student_id) || null }))
  },
  async getStudentTreatmentPlans(student_id: string) {
    if (!isSupabaseEnabled || !supabase) {
      // derive via assignments
      const assignments = await mockAPI.getAssignments(undefined, student_id)
      // no mock plans persisted; return empty
      return []
    }
    // find assignments for student
    const { data: asg } = await supabase.from('practitioner_assignments').select('id').eq('student_id', student_id)
    const ids = (asg || []).map((a: any) => a.id)
    if (ids.length === 0) return []
    const { data, error } = await supabase.from('treatment_plans').select('*').in('assignment_id', ids).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getAssignments(practitionerId?: string, studentId?: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getAssignments(practitionerId, studentId)
    let query = supabase.from('practitioner_assignments').select('*')
    if (practitionerId) query = query.eq('practitioner_id', practitionerId)
    if (studentId) query = query.eq('student_id', studentId)
    const { data, error } = await query
    if (error) throw error
    const ids = new Set<string>()
    data?.forEach((a: any) => { ids.add(a.student_id); ids.add(a.practitioner_id) })
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').in('id', Array.from(ids))
    const map = new Map((profiles || []).map((p: any) => [p.id, p]))
    return (data || []).map((a: any) => ({
      ...a,
      student_profile: map.get(a.student_id) || null,
      practitioner_profile: map.get(a.practitioner_id) || null,
    }))
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
    const ids = new Set<string>()
    data?.forEach((row: any) => {
      if (row.student_id) ids.add(row.student_id)
      if (row.practitioner_id) ids.add(row.practitioner_id)
    })
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').in('id', Array.from(ids))
    const map = new Map((profiles || []).map((p: any) => [p.id, p]))
    return (data || []).map((row: any) => ({
      ...row,
      student_profile: map.get(row.student_id) || null,
      practitioner_profile: map.get(row.practitioner_id) || null,
    }))
  },

  async getMessages(userId: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getMessages(userId)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('sent_at', { ascending: false })
    if (error) throw error
    const ids = new Set<string>()
    data?.forEach((m: any) => { ids.add(m.sender_id); ids.add(m.receiver_id) })
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, role').in('id', Array.from(ids))
    const map = new Map((profiles || []).map((p: any) => [p.id, p]))
    return (data || []).map((m: any) => ({
      ...m,
      sender_profile: map.get(m.sender_id) || null,
      receiver_profile: map.get(m.receiver_id) || null,
    }))
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
    const client = supabase
    const channel = client
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const row = payload.new as any
        if (row.sender_id === userId || row.receiver_id === userId) cb(row)
      })
      .subscribe()
    return () => {
      client.removeChannel(channel)
    }
  },
  async getRecoveryLogs(filters?: { practitioner_id?: string; assignment_id?: string }) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getRecoveryLogs(filters?.practitioner_id)
    let query = supabase.from('recovery_logs').select('*').order('date_logged', { ascending: false })
    if (filters?.practitioner_id) query = query.eq('practitioner_id', filters.practitioner_id)
    if (filters?.assignment_id) query = query.eq('assignment_id', filters.assignment_id)
    const { data, error } = await query
    if (error) throw error
    const assignmentIds = Array.from(new Set((data || []).map((l: any) => l.assignment_id)))
    const practitionerIds = Array.from(new Set((data || []).map((l: any) => l.practitioner_id)))
    const [{ data: assignments }, { data: practitioners }] = await Promise.all([
      supabase.from('practitioner_assignments').select('*').in('id', assignmentIds),
      supabase.from('profiles').select('id, full_name').in('id', practitionerIds),
    ])
    const assignmentMap = new Map((assignments || []).map((a: any) => [a.id, a]))
    const practitionerMap = new Map((practitioners || []).map((p: any) => [p.id, p]))
    const studentIds = Array.from(new Set((assignments || []).map((a: any) => a.student_id)))
    const { data: students } = await supabase.from('profiles').select('id, full_name').in('id', studentIds)
    const studentMap = new Map((students || []).map((s: any) => [s.id, s]))
    return (data || []).map((l: any) => ({
      ...l,
      practitioner_profile: practitionerMap.get(l.practitioner_id) || null,
      assignment: assignmentMap.get(l.assignment_id) || null,
      assignment_student_profile: assignmentMap.get(l.assignment_id)
        ? studentMap.get(assignmentMap.get(l.assignment_id).student_id)
        : null,
    }))
  },
  async getFiles(uploadedBy?: string) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    let query = supabase.from('files').select('*').order('uploaded_at', { ascending: false })
    if (uploadedBy) query = query.eq('uploaded_by', uploadedBy)
    const { data, error } = await query
    if (error) throw error
    return data
  },
  async getSignedUrl(storagePath: string, expiresInSeconds = 3600) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase.storage.from('user-files').createSignedUrl(storagePath, expiresInSeconds)
    if (error) throw error
    return data.signedUrl
  },
  // duplicate removed: using enriched getRecoveryLogs above
  async addRecoveryLog(payload: {
    assignment_id: string
    practitioner_id: string
    progress_notes: string
    exercises?: string | null
    pain_level?: number | null
    mobility_score?: number | null
    next_session_plan?: string | null
  }) {
    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase required')
    const { data, error } = await supabase.from('recovery_logs').insert(payload).select('*').single()
    if (error) throw error
    return data
  },

  async getPlanTemplates() {
    if (!isSupabaseEnabled || !supabase) return mockAPI.getPlanTemplates()
    const { data, error } = await supabase.from('plan_templates').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async createPlanFromTemplate(assignment_id: string, template_id: string, title?: string) {
    if (!isSupabaseEnabled || !supabase) return mockAPI.createPlanFromTemplate(assignment_id, template_id, title)
    const { data: template, error: tErr } = await supabase.from('plan_templates').select('*').eq('id', template_id).single()
    if (tErr) throw tErr
    const phases = template?.phases || []
    const payload = { assignment_id, template_id, title: title || template?.name || 'Plan', phases }
    const { data, error } = await supabase.from('treatment_plans').insert(payload).select('*').single()
    if (error) throw error
    return data
  },
  async updateTreatmentPlan(planId: string, updates: { title?: string; phases?: any }) {
    if (!isSupabaseEnabled || !supabase) return { id: planId, ...updates }
    const { data, error } = await supabase.from('treatment_plans').update(updates).eq('id', planId).select('*').single()
    if (error) throw error
    return data
  },
  async getPractitionerPlans(practitioner_id: string) {
    if (!isSupabaseEnabled || !supabase) return []
    const { data: asg } = await supabase.from('practitioner_assignments').select('id').eq('practitioner_id', practitioner_id)
    const ids = (asg || []).map((a: any) => a.id)
    if (ids.length === 0) return []
    const { data, error } = await supabase.from('treatment_plans').select('*').in('assignment_id', ids).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getNotificationPreferences(userId: string) {
    if (!isSupabaseEnabled || !supabase) {
      return { id: userId, email_reminders: true, sms_reminders: false, reminder_window_minutes: 120 }
    }
    const { data, error } = await supabase.from('notification_preferences').select('*').eq('id', userId).single()
    if (error && (error as any).code !== 'PGRST116') throw error
    if (!data) return { id: userId, email_reminders: true, sms_reminders: false, reminder_window_minutes: 120 }
    return data
  },

  async upsertNotificationPreferences(prefs: { id: string; email_reminders?: boolean; sms_reminders?: boolean; reminder_window_minutes?: number }) {
    if (!isSupabaseEnabled || !supabase) return prefs
    const { data, error } = await supabase.from('notification_preferences').upsert(prefs).select('*').single()
    if (error) throw error
    return data
  },
}

