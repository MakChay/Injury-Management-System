import { useState, useEffect } from 'react'
import { mockAuth, mockCurrentUser, type User } from '../lib/mockData'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial auth check
    const initAuth = async () => {
      try {
        // Simulate checking for existing session
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // For demo purposes, automatically log in with mock user
        // In real app, this would check for existing session
        const currentUser = mockAuth.getCurrentUser()
        setUser(currentUser)
        setProfile(currentUser)
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
      const { user, error } = await mockAuth.signIn(email, password)
      if (error) {
        throw new Error(error.message)
      }
      setUser(user)
      setProfile(user)
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: any) => {
    setLoading(true)
    try {
      const { user, error } = await mockAuth.signUp(userData)
      if (error) {
        throw new Error(error.message)
      }
      setUser(user)
      setProfile(user)
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await mockAuth.signOut()
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