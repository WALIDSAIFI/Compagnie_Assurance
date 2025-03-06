import axios from "../utils/axiosConfig"
import type { Policy, PolicyType } from "../types/Policy"
import type { Claim } from "../types/Claim"

// The gateway will route these requests to the policy-service
const API_URL = "/api/policies"

const policyService = {
  // Policy (Contrat) operations
  getAllPolicies: async (): Promise<Policy[]> => {
    const response = await axios.get(API_URL)
    return response.data
  },

  getPolicyById: async (id: number): Promise<Policy> => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  },

  getPoliciesByCustomerId: async (customerId: number): Promise<Policy[]> => {
    const response = await axios.get(`${API_URL}/customer/${customerId}`)
    return response.data
  },

  getPoliciesByType: async (type: PolicyType): Promise<Policy[]> => {
    const response = await axios.get(`${API_URL}/type/${type}`)
    return response.data
  },

  createPolicy: async (policy: Omit<Policy, "id">): Promise<Policy> => {
    const response = await axios.post(API_URL, policy)
    return response.data
  },

  updatePolicy: async (id: number, policy: Omit<Policy, "id">): Promise<Policy> => {
    const response = await axios.put(`${API_URL}/${id}`, policy)
    return response.data
  },

  deletePolicy: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`)
  },

  // Claims (Sinistre) operations - part of the Policy Service
  getAllClaims: async (): Promise<Claim[]> => {
    const response = await axios.get(`${API_URL}/claims`)
    return response.data
  },

  getClaimById: async (id: number): Promise<Claim> => {
    const response = await axios.get(`${API_URL}/claims/${id}`)
    return response.data
  },

  getClaimsByPolicyId: async (policyId: number): Promise<Claim[]> => {
    const response = await axios.get(`${API_URL}/${policyId}/claims`)
    return response.data
  },

  createClaim: async (claim: Omit<Claim, "id">): Promise<Claim> => {
    const response = await axios.post(`${API_URL}/claims`, claim)
    return response.data
  },

  updateClaim: async (id: number, claim: Omit<Claim, "id">): Promise<Claim> => {
    const response = await axios.put(`${API_URL}/claims/${id}`, claim)
    return response.data
  },

  deleteClaim: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/claims/${id}`)
  },
}

export default policyService

