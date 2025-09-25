import { useState, useEffect } from 'react'
import { mockAuth, type User } from '../lib/mockData'
import { supabase, isSupabaseEnabled } from '../lib/supabase'
import { logger } from '../lib/logger'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Development mode: Force no user to show register page first
  // Remove this in production or set via environment variable
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && process.env.VITE_FORCE_REGISTER_FIRST === 'true' && user) {
      logger.debug('Development mode: Forcing register page first')
      setUser(null)
      setProfile(null)
    }
  }, [user])

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
          if (currentUser) {
            setUser(currentUser)
            setProfile(currentUser)
          } else {
            setUser(null)
            setProfile(null)
          }
        }
      } catch (error) {
        logger.error('Auth initialization error:', error as Error)
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
        if (user) {
          setUser(user)
          setProfile(user)
        }
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
        // If email confirmations are enabled, session may be null; defer profile creation
        if (!data.session) {
          return { error: null, pendingVerification: true }
        }
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
        if (user) {
          setUser(user)
          setProfile(user)
        }
        return { error: null }
      }
    } catch (error: any) {
      return { error: error instanceof Error ? error : new Error('Sign up failed') }
    } finally {
      setLoading(false)
    }
  }

  const requestPasswordReset = async (email: string) => {
    setLoading(true)
    try {
      if (isSupabaseEnabled && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        return { error: error || null }
      } else {
        // Mock: pretend success
        await new Promise((r) => setTimeout(r, 500))
        return { error: null }
      }
    } catch (error: unknown) {
      return { error: error instanceof Error ? error : new Error('Password reset failed') }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (newPassword: string) => {
    setLoading(true)
    try {
      if (isSupabaseEnabled && supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        return { error: error || null }
      } else {
        await new Promise((r) => setTimeout(r, 500))
        return { error: null }
      }
    } catch (error: unknown) {
      return { error: error instanceof Error ? error : new Error('Update password failed') }
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
    } catch (error) {
      logger.error('Sign out error:', error as Error)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    isAdmin: profile?.role === 'admin',
    isPractitioner: profile?.role === 'practitioner',
    isStudent: profile?.role === 'student',
    setProfile,
  }
}