"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import authService from "../services/authService"
import type { User } from "../types/User"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, email: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      const { token, user } = await authService.login(username, password)
      localStorage.setItem("token", token)
      setUser(user)
      toast.success("Login successful")
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error)
      toast.error("Login failed. Please check your credentials.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, password: string, email: string) => {
    try {
      setLoading(true)
      await authService.register(username, password, email)
      toast.success("Registration successful. Please login.")
      navigate("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      toast.error("Registration failed. Please try again.")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.info("You have been logged out")
    navigate("/login")
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "ADMIN"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

