import apiClient from "../utils/axiosConfig"
import type { User } from "../types/User"

// Endpoints pour le service d'authentification
const AUTH_API = "http://localhost:8080/auth-service"

const authService = {
  // Connexion utilisateur
  login: async (login: string, password: string) => {
    const response = await apiClient.post(`${AUTH_API}/login`, { login, password })
    // Stockage du token JWT
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  // Inscription utilisateur
  register: async (login: string, password: string, email: string) => {
    const response = await apiClient.post(`${AUTH_API}/register`, {
      login,
      password,
      email,
      active: true,
      role: "CLIENT", // Par défaut, les nouveaux utilisateurs sont des clients
    })
    return response.data
  },

  // Récupération des informations de l'utilisateur connecté
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get(`${AUTH_API}/me`)
    return response.data
  },

  // Déconnexion (côté client uniquement)
  logout: () => {
    localStorage.removeItem("token")
  },

  // Vérification si l'utilisateur est connecté
  isLoggedIn: (): boolean => {
    return localStorage.getItem("token") !== null
  },

  // Récupération de tous les utilisateurs (admin uniquement)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get(`${AUTH_API}/users`)
    return response.data
  },

  // Activation/désactivation d'un utilisateur (admin uniquement)
  toggleUserActive: async (userId: number, active: boolean): Promise<User> => {
    const response = await apiClient.patch(`${AUTH_API}/users/${userId}/active`, { active })
    return response.data
  },

  // Modification du rôle d'un utilisateur (admin uniquement)
  changeUserRole: async (userId: number, role: string): Promise<User> => {
    const response = await apiClient.patch(`${AUTH_API}/users/${userId}/role`, { role })
    return response.data
  },
}

export default authService

