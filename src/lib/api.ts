import { mockAPI } from './mockData'
import { supabase, isSupabaseEnabled } from './supabase'
import { type Injury, type Assignment, type Appointment, type Message, type RecoveryLog, type User, type TreatmentPlanTemplate, type TreatmentPlanInstance } from './mockData'
import { logger } from './logger'

class APIClient {
  // Injuries
  async getInjuries(studentId?: string): Promise<Injury[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        let query = supabase.from('injuries').select('*')
        
        if (studentId) {
          query = query.eq('student_id', studentId)
        }
        
        const { data, error } = await query
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching injuries:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getInjuries(studentId)
    }
  }

  async createInjury(injuryData: Omit<Injury, 'id' | 'date_reported' | 'created_at' | 'updated_at'>): Promise<Injury> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('injuries')
          .insert({
            ...injuryData,
            date_reported: new Date().toISOString(),
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error creating injury:', error as Error)
        throw error
      }
    } else {
      return mockAPI.createInjury(injuryData)
    }
  }

  // Assignments
  async getAssignments(practitionerId?: string, studentId?: string): Promise<Assignment[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        let query = supabase.from('practitioner_assignments').select('*')
        
        if (practitionerId) {
          query = query.eq('practitioner_id', practitionerId)
        }
        if (studentId) {
          query = query.eq('student_id', studentId)
        }
        
        const { data, error } = await query
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching assignments:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getAssignments(practitionerId, studentId)
    }
  }

  // Appointments
  async getAppointments(userId: string, role: string): Promise<Appointment[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        let query = supabase.from('appointments').select('*')
        
        if (role === 'student') {
          query = query.eq('student_id', userId)
        } else if (role === 'practitioner') {
          query = query.eq('practitioner_id', userId)
        }
        
        const { data, error } = await query
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching appointments:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getAppointments(userId, role)
    }
  }

  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert(appointmentData)
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error creating appointment:', error as Error)
        throw error
      }
    } else {
      // Mock implementation
      const newAppointment: Appointment = {
        id: `appointment-${Date.now()}`,
        ...appointmentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return newAppointment
    }
  }

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order('sent_at', { ascending: false })
        
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching messages:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getMessages(userId)
    }
  }

  async sendMessage(messageData: Omit<Message, 'id' | 'sent_at'>): Promise<Message> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            ...messageData,
            sent_at: new Date().toISOString(),
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error sending message:', error as Error)
        throw error
      }
    } else {
      // Mock implementation
      const newMessage: Message = {
        id: `message-${Date.now()}`,
        ...messageData,
        sent_at: new Date().toISOString(),
      }
      return newMessage
    }
  }

  // Recovery Logs
  async getRecoveryLogs(practitionerId?: string): Promise<RecoveryLog[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        let query = supabase.from('recovery_logs').select('*')
        
        if (practitionerId) {
          query = query.eq('practitioner_id', practitionerId)
        }
        
        const { data, error } = await query
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching recovery logs:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getRecoveryLogs(practitionerId)
    }
  }

  async createRecoveryLog(logData: Omit<RecoveryLog, 'id' | 'created_at'>): Promise<RecoveryLog> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('recovery_logs')
          .insert({
            ...logData,
            date_logged: new Date().toISOString(),
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error creating recovery log:', error as Error)
        throw error
      }
    } else {
      // Mock implementation
      const newLog: RecoveryLog = {
        id: `log-${Date.now()}`,
        ...logData,
        created_at: new Date().toISOString(),
      }
      return newLog
    }
  }

  // Users
  async getUsers(role?: string): Promise<User[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        let query = supabase.from('profiles').select('*')
        
        if (role) {
          query = query.eq('role', role)
        }
        
        const { data, error } = await query
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching users:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getUsers(role)
    }
  }

  // Treatment Plan Templates
  async getPlanTemplates(): Promise<TreatmentPlanTemplate[]> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('plan_templates')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return data || []
      } catch (error) {
        logger.error('Error fetching plan templates:', error as Error)
        throw error
      }
    } else {
      return mockAPI.getPlanTemplates()
    }
  }

  async createPlanTemplate(templateData: Omit<TreatmentPlanTemplate, 'id' | 'created_at'>): Promise<TreatmentPlanTemplate> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('plan_templates')
          .insert(templateData)
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error creating plan template:', error as Error)
        throw error
      }
    } else {
      // Mock implementation
      const newTemplate: TreatmentPlanTemplate = {
        id: `tpl-${Date.now()}`,
        ...templateData,
        created_at: new Date().toISOString(),
      }
      return newTemplate
    }
  }

  // Treatment Plans
  async createPlanFromTemplate(assignmentId: string, templateId: string, title?: string): Promise<TreatmentPlanInstance> {
    if (isSupabaseEnabled && supabase) {
      try {
        // First get the template
        const { data: template, error: templateError } = await supabase
          .from('plan_templates')
          .select('*')
          .eq('id', templateId)
          .single()
        
        if (templateError) throw templateError
        
        // Create the plan
        const { data, error } = await supabase
          .from('treatment_plans')
          .insert({
            assignment_id: assignmentId,
            template_id: templateId,
            title: title || template.name,
            phases: template.phases,
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error creating plan from template:', error as Error)
        throw error
      }
    } else {
      return mockAPI.createPlanFromTemplate(assignmentId, templateId, title)
    }
  }

  // Daily Check-ins
  async createDailyCheckIn(checkInData: {
    student_id: string
    pain_level?: number
    swelling?: number
    rom?: number
    notes?: string
  }): Promise<any> {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from('daily_checkins')
          .insert({
            ...checkInData,
            checkin_date: new Date().toISOString().split('T')[0],
          })
          .select()
          .single()
        
        if (error) throw error
        return data
      } catch (error) {
        logger.error('Error creating daily check-in:', error as Error)
        throw error
      }
    } else {
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: `checkin-${Date.now()}`,
            ...checkInData,
            checkin_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
          })
        }, 500)
      })
    }
  }

  // File Upload
  async uploadFile(file: File, assignmentId?: string): Promise<{ url: string; id: string }> {
    if (isSupabaseEnabled && supabase) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`
        
        const { data, error } = await supabase.storage
          .from('user-files')
          .upload(filePath, file)
        
        if (error) throw error
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user-files')
          .getPublicUrl(filePath)
        
        // Save file record to database
        const { data: fileRecord, error: dbError } = await supabase
          .from('files')
          .insert({
            uploaded_by: (await supabase.auth.getUser()).data.user?.id || '',
            assignment_id: assignmentId || null,
            file_url: urlData.publicUrl,
            file_type: file.type,
          })
          .select()
          .single()
        
        if (dbError) throw dbError
        
        return { url: urlData.publicUrl, id: fileRecord.id }
      } catch (error) {
        logger.error('Error uploading file:', error as Error)
        throw error
      }
    } else {
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            url: URL.createObjectURL(file),
            id: `file-${Date.now()}`,
          })
        }, 1000)
      })
    }
  }
}

export const api = new APIClient()