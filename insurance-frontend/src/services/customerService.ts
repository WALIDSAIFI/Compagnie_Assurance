import apiClient from "../utils/axiosConfig"
import type { Customer } from "../types/Customer"

// Endpoints pour le service client
const CUSTOMER_API = "/customers"

const customerService = {
  // Récupération de tous les clients
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await apiClient.get(CUSTOMER_API)
    return response.data
  },

  // Récupération d'un client par son ID
  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get(`${CUSTOMER_API}/${id}`)
    return response.data
  },

  // Recherche de clients par nom ou prénom
  searchCustomers: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get(`${CUSTOMER_API}/search?query=${query}`)
    return response.data
  },

  // Création d'un nouveau client
  createCustomer: async (customer: Omit<Customer, "id">): Promise<Customer> => {
    const response = await apiClient.post(CUSTOMER_API, customer)
    return response.data
  },

  // Mise à jour d'un client existant
  updateCustomer: async (id: number, customer: Omit<Customer, "id">): Promise<Customer> => {
    const response = await apiClient.put(`${CUSTOMER_API}/${id}`, customer)
    return response.data
  },

  // Suppression d'un client
  deleteCustomer: async (id: number): Promise<void> => {
    await apiClient.delete(`${CUSTOMER_API}/${id}`)
  },

  // Récupération du client associé à l'utilisateur connecté
  getCurrentCustomer: async (): Promise<Customer> => {
    const response = await apiClient.get(`${CUSTOMER_API}/me`)
    return response.data
  },
}

export default customerService

