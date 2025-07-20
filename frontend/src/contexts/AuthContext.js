"use client"

import React, { createContext, useState, useEffect } from "react"
import { authService } from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in on app start
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const response = await authService.getProfile()
        setUser(response.data)
      } catch (error) {
        localStorage.removeItem("token")
        console.error("Failed to load user", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Register user
  const register = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.register(userData)
      localStorage.setItem("token", response.data.token)
      setUser(response.data)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login(userData)
      localStorage.setItem("token", response.data.token)
      setUser(response.data)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  // Update profile
  const updateProfile = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.updateProfile(userData)
      setUser({ ...user, ...response.data })
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Update failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update password
  const updatePassword = async (passwordData) => {
    setLoading(true)
    setError(null)
    try {
      await authService.updatePassword(passwordData)
    } catch (error) {
      setError(error.response?.data?.message || "Password update failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
