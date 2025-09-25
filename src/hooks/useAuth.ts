import { useState, useEffect } from 'react'
import { mockAuth, type User } from '../lib/mockData'
import { supabase, isSupabaseEnabled } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isSupabaseEnabled && supabase) {
          const client = supabase
          const { data } = await client.auth.getSession()
          const session = data.session
          if (session?.user) {
            const { data: profileRow } = await client
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            const authedUser: User | null = profileRow
              ? {
                  id: profileRow.id,
                  email: profileRow.email,
                  full_name: profileRow.full_name,
                  role: profileRow.role,
                  profile_pic: profileRow.profile_pic ?? undefined,
                  phone: profileRow.phone ?? undefined,
                  student_number: profileRow.student_number ?? undefined,
                  specialization: profileRow.specialization ?? undefined,
                  bio: profileRow.bio ?? undefined,
                  created_at: profileRow.created_at,
                  updated_at: profileRow.updated_at,
                }
              : null
            setUser(authedUser)
            setProfile(authedUser)
          } else {
            setUser(null)
            setProfile(null)
          }
          client.auth.onAuthStateChange(async (_event: any, session: any) => {
            if (session?.user) {
              const { data: profileRow } = await client
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
              const authedUser: User | null = profileRow
                ? {
                    id: profileRow.id,
                    email: profileRow.email,
                    full_name: profileRow.full_name,
                    role: profileRow.role,
                    profile_pic: profileRow.profile_pic ?? undefined,
                    phone: profileRow.phone ?? undefined,
                    student_number: profileRow.student_number ?? undefined,
                    specialization: profileRow.specialization ?? undefined,
                    bio: profileRow.bio ?? undefined,
                    created_at: profileRow.created_at,
                    updated_at: profileRow.updated_at,
                  }
                : null
              setUser(authedUser)
              setProfile(authedUser)
            } else {
              setUser(null)
              setProfile(null)
            }
          })
        } else {
          // Demo: use mock user
          await new Promise(resolve => setTimeout(resolve, 300))
          const currentUser = mockAuth.getCurrentUser()
          setUser(currentUser)
          setProfile(currentUser)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isSupabaseEnabled && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return { error }
        const sessionUser = data.user
        if (!sessionUser) return { error: new Error('No user returned') }
        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single()
        if (profileError) return { error: profileError as any }
        const authedUser: User = {
          id: profileRow.id,
          email: profileRow.email,
          full_name: profileRow.full_name,
          role: profileRow.role,
          profile_pic: profileRow.profile_pic ?? undefined,
          phone: profileRow.phone ?? undefined,
          student_number: profileRow.student_number ?? undefined,
          specialization: profileRow.specialization ?? undefined,
          bio: profileRow.bio ?? undefined,
          created_at: profileRow.created_at,
          updated_at: profileRow.updated_at,
        }
        setUser(authedUser)
        setProfile(authedUser)
        return { error: null }
      } else {
        const { user, error: mockError } = await mockAuth.signIn(email, password)
        if (mockError) {
          return { error: mockError }
        }
        setUser(user)
        setProfile(user)
        return { error: null }
      }
    } catch (error: unknown) {
      return { error: error instanceof Error ? error : new Error('Sign in failed') }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: any) => {
    setLoading(true)
    try {
      if (isSupabaseEnabled && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
        })
        if (error) return { error }
        const newUser = data.user
        if (!newUser) return { error: new Error('No user created') }
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: newUser.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role,
          phone: userData.phone || null,
          student_number: userData.studentNumber || null,
          sport: userData.sport || null,
          specialization: userData.specialization || null,
        })
        if (upsertError) return { error: upsertError }
        const profile = {
          id: newUser.id,
          email: userData.email,
          full_name: userData.fullName,
          role: userData.role,
          phone: userData.phone,
          student_number: userData.studentNumber,
          sport: userData.sport,
          specialization: userData.specialization,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User
        setUser(profile)
        setProfile(profile)
        return { error: null }
      } else {
        const { user, error: mockError } = await mockAuth.signUp(userData)
        if (mockError) {
          return { error: mockError }
        }
        setUser(user)
        setProfile(user)
        return { error: null }
      }
    } catch (error: any) {
      return { error: error instanceof Error ? error : new Error('Sign up failed') }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      if (isSupabaseEnabled && supabase) {
        await supabase.auth.signOut()
      } else {
        await mockAuth.signOut()
      }
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin',
    isPractitioner: profile?.role === 'practitioner',
    isStudent: profile?.role === 'student',
  }
}