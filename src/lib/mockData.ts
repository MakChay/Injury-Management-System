// Mock data for frontend development
export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'practitioner' | 'admin'
  profile_pic?: string
  phone?: string
  student_number?: string
  specialization?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Injury {
  id: string
  student_id: string
  injury_type: string
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  description: string
  body_part: string
  date_occurred: string
  date_reported: string
  status: 'reported' | 'assigned' | 'in_treatment' | 'recovering' | 'resolved'
  activity_when_injured?: string
  pain_level?: number
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  student_id: string
  practitioner_id: string
  injury_id: string
  assigned_by?: string
  assigned_at: string
  active: boolean
  notes?: string
  created_at: string
}

export interface Appointment {
  id: string
  student_id: string
  practitioner_id: string
  assignment_id?: string
  appointment_date: string
  duration_minutes: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  location?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  assignment_id?: string
  message: string
  read: boolean
  sent_at: string
}

export interface RecoveryLog {
  id: string
  assignment_id: string
  practitioner_id: string
  progress_notes: string
  exercises?: string
  pain_level?: number
  mobility_score?: number
  next_session_plan?: string
  date_logged: string
  created_at: string
}

export interface TreatmentPlanTemplate {
  id: string
  name: string
  injury_type: string
  sport?: string
  phases: Array<{
    title: string
    duration_days?: number
    exercises: Array<{ name: string; sets?: number; reps?: number; notes?: string; video_url?: string }>
  }>
}

export interface TreatmentPlanInstance {
  id: string
  assignment_id: string
  template_id?: string
  title: string
  phases: Array<{
    title: string
    completed?: boolean
    exercises: Array<{ name: string; done?: boolean; notes?: string }>
  }>
  created_at: string
}

// Mock current user - change this to test different roles
export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'john.doe@dut4life.ac.za',
  full_name: 'John Doe',
  role: 'student', // Change to 'practitioner' or 'admin' to test different views
  student_number: '21012345',
  phone: '+27 82 123 4567',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
}

export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    email: 'dr.smith@dut.ac.za',
    full_name: 'Dr. Sarah Smith',
    role: 'practitioner',
    specialization: 'Physiotherapy',
    phone: '+27 31 373 2000',
    bio: 'Specialized in sports injury rehabilitation with 10+ years experience.',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 'user-3',
    email: 'admin@dut.ac.za',
    full_name: 'Health Coordinator',
    role: 'admin',
    phone: '+27 31 373 2001',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T08:00:00Z'
  },
  {
    id: 'user-4',
    email: 'jane.wilson@dut4life.ac.za',
    full_name: 'Jane Wilson',
    role: 'student',
    student_number: '21012346',
    phone: '+27 82 987 6543',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z'
  }
]

export const mockInjuries: Injury[] = [
  {
    id: 'injury-1',
    student_id: 'user-1',
    injury_type: 'Ankle Sprain',
    severity: 'moderate',
    description: 'Twisted ankle during rugby practice. Immediate swelling and pain.',
    body_part: 'Left Ankle',
    date_occurred: '2024-01-20',
    date_reported: '2024-01-20T14:30:00Z',
    status: 'in_treatment',
    activity_when_injured: 'Rugby Practice',
    pain_level: 6,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-22T10:00:00Z'
  },
  {
    id: 'injury-2',
    student_id: 'user-4',
    injury_type: 'Hamstring Strain',
    severity: 'mild',
    description: 'Felt tightness during sprint training, mild discomfort.',
    body_part: 'Right Hamstring',
    date_occurred: '2024-01-25',
    date_reported: '2024-01-25T16:00:00Z',
    status: 'reported',
    activity_when_injured: 'Sprint Training',
    pain_level: 3,
    created_at: '2024-01-25T16:00:00Z',
    updated_at: '2024-01-25T16:00:00Z'
  }
]

export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    student_id: 'user-1',
    practitioner_id: 'user-2',
    injury_id: 'injury-1',
    assigned_by: 'user-3',
    assigned_at: '2024-01-21T09:00:00Z',
    active: true,
    notes: 'Priority case - athlete needs to return to competition soon.',
    created_at: '2024-01-21T09:00:00Z'
  }
]

export const mockAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    student_id: 'user-1',
    practitioner_id: 'user-2',
    assignment_id: 'assignment-1',
    appointment_date: '2024-01-30T10:00:00Z',
    duration_minutes: 60,
    status: 'scheduled',
    location: 'DUT Health Center - Room 201',
    notes: 'Follow-up session for ankle rehabilitation',
    created_at: '2024-01-22T15:00:00Z',
    updated_at: '2024-01-22T15:00:00Z'
  },
  {
    id: 'appointment-2',
    student_id: 'user-1',
    practitioner_id: 'user-2',
    assignment_id: 'assignment-1',
    appointment_date: '2024-01-28T14:00:00Z',
    duration_minutes: 45,
    status: 'completed',
    location: 'DUT Health Center - Room 201',
    notes: 'Initial assessment and treatment plan',
    created_at: '2024-01-21T12:00:00Z',
    updated_at: '2024-01-28T15:00:00Z'
  }
]

export const mockMessages: Message[] = [
  {
    id: 'message-1',
    sender_id: 'user-2',
    receiver_id: 'user-1',
    assignment_id: 'assignment-1',
    message: 'Hi John, please make sure to ice your ankle for 15 minutes, 3 times daily. See you at our next appointment.',
    read: false,
    sent_at: '2024-01-28T16:30:00Z'
  },
  {
    id: 'message-2',
    sender_id: 'user-1',
    receiver_id: 'user-2',
    assignment_id: 'assignment-1',
    message: 'Thank you Dr. Smith. The swelling has reduced significantly since our last session.',
    read: true,
    sent_at: '2024-01-29T08:15:00Z'
  }
]

export const mockRecoveryLogs: RecoveryLog[] = [
  {
    id: 'log-1',
    assignment_id: 'assignment-1',
    practitioner_id: 'user-2',
    progress_notes: 'Patient showing good progress. Swelling reduced by 70%. Range of motion improving.',
    exercises: 'Ankle circles (3x10), Calf raises (3x15), Balance exercises (2x30s)',
    pain_level: 4,
    mobility_score: 7,
    next_session_plan: 'Continue current exercises, introduce light jogging if pain allows.',
    date_logged: '2024-01-28T14:45:00Z',
    created_at: '2024-01-28T14:45:00Z'
  }
]

// Mock API functions
export const mockAuth = {
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple mock validation
    if (email && password) {
      return { user: mockCurrentUser, error: null }
    }
    return { user: null, error: { message: 'Invalid credentials' } }
  },
  
  signUp: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return { user: { ...mockCurrentUser, ...userData }, error: null }
  },
  
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { error: null }
  },
  
  getCurrentUser: () => mockCurrentUser
}

export const mockAPI = {
  getInjuries: async (studentId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return studentId 
      ? mockInjuries.filter(injury => injury.student_id === studentId)
      : mockInjuries
  },

  createInjury: async (injuryData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newInjury: Injury = {
      id: `injury-${Date.now()}`,
      ...injuryData,
      status: 'reported',
      date_reported: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockInjuries.push(newInjury)
    return newInjury
  },
  
  getAssignments: async (practitionerId?: string, studentId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    let filtered = mockAssignments
    if (practitionerId) filtered = filtered.filter(a => a.practitioner_id === practitionerId)
    if (studentId) filtered = filtered.filter(a => a.student_id === studentId)
    return filtered
  },
  
  getAppointments: async (userId: string, role: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockAppointments.filter(apt => 
      role === 'student' ? apt.student_id === userId : apt.practitioner_id === userId
    )
  },
  
  getMessages: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockMessages.filter(msg => 
      msg.sender_id === userId || msg.receiver_id === userId
    )
  },
  
  getRecoveryLogs: async (practitionerId?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return practitionerId 
      ? mockRecoveryLogs.filter(log => log.practitioner_id === practitionerId)
      : mockRecoveryLogs
  },
  
  getUsers: async (role?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return role ? mockUsers.filter(user => user.role === role) : mockUsers
  },

  // Templates and plans
  getPlanTemplates: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const templates: TreatmentPlanTemplate[] = [
      {
        id: 'tpl-ankle-sprain',
        name: 'Ankle Sprain (Moderate) - Generic',
        injury_type: 'Ankle Sprain',
        phases: [
          { title: 'Acute (Days 1-3)', exercises: [{ name: 'Rest/Ice/Elevation' }, { name: 'Ankle Alphabet' }] },
          { title: 'Subacute (Days 4-10)', exercises: [{ name: 'Calf Raises', sets: 3, reps: 15 }, { name: 'Single-leg Balance' }] },
        ],
      },
      {
        id: 'tpl-hamstring-mild',
        name: 'Hamstring Strain (Mild) - Running',
        injury_type: 'Hamstring Strain',
        sport: 'Athletics',
        phases: [
          { title: 'Phase 1', exercises: [{ name: 'Isometrics', sets: 3, reps: 10 }] },
          { title: 'Phase 2', exercises: [{ name: 'Eccentric Nordic', sets: 3, reps: 6 }] },
        ],
      },
    ]
    return templates
  },

  createPlanFromTemplate: async (assignment_id: string, template_id: string, title?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const plan: TreatmentPlanInstance = {
      id: `plan-${Date.now()}`,
      assignment_id,
      template_id,
      title: title || 'Personalized Plan',
      phases: [
        { title: 'Phase 1', exercises: [{ name: 'Exercise A' }, { name: 'Exercise B' }] },
      ],
      created_at: new Date().toISOString(),
    }
    return plan
  },
}
