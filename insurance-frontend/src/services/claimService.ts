import apiClient from "../utils/axiosConfig"
import type { Claim } from "../types/Claim"

// Endpoints pour le service de sinistres
const CLAIM_API = "/claims"

const claimService = {
  // Récupération de tous les sinistres
  getAllClaims: async (): Promise<Claim[]> => {
    const response = await apiClient.get(CLAIM_API)
    return response.data
  },

  // Récupération d'un sinistre par son ID
  getClaimById: async (id: number): Promise<Claim> => {
    const response = await apiClient.get(`${CLAIM_API}/${id}`)
    return response.data
  },

  // Récupération des sinistres liés à un contrat spécifique
  getClaimsByPolicyId: async (policyId: number): Promise<Claim[]> => {
    const response = await apiClient.get(`${CLAIM_API}/policy/${policyId}`)
    return response.data
  },

  // Récupération des sinistres d'un client spécifique
  getClaimsByCustomerId: async (customerId: number): Promise<Claim[]> => {
    const response = await apiClient.get(`${CLAIM_API}/customer/${customerId}`)
    return response.data
  },

  // Récupération des sinistres de l'utilisateur connecté
  getMyClaims: async (): Promise<Claim[]> => {
    const response = await apiClient.get(`${CLAIM_API}/me`)
    return response.data
  },

  // Création d'un nouveau sinistre
  createClaim: async (claim: Omit<Claim, "id">): Promise<Claim> => {
    const response = await apiClient.post(CLAIM_API, claim)
    return response.data
  },

  // Mise à jour d'un sinistre existant
  updateClaim: async (id: number, claim: Partial<Omit<Claim, "id">>): Promise<Claim> => {
    const response = await apiClient.put(`${CLAIM_API}/${id}`, claim)
    return response.data
  },

  // Traitement d'un sinistre (définir le montant remboursé)
  processClaim: async (id: number, montantRemboursé: number): Promise<Claim> => {
    const response = await apiClient.patch(`${CLAIM_API}/${id}/process`, { montantRemboursé })
    return response.data
  },

  // Suppression d'un sinistre
  deleteClaim: async (id: number): Promise<void> => {
    await apiClient.delete(`${CLAIM_API}/${id}`)
  },

  // Ajout de documents à un sinistre (simulation)
  uploadClaimDocument: async (claimId: number, file: File): Promise<{ id: number; fileName: string; url: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await apiClient.post(`${CLAIM_API}/${claimId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },

  // Récupération des documents d'un sinistre
  getClaimDocuments: async (claimId: number): Promise<{ id: number; fileName: string; url: string }[]> => {
    const response = await apiClient.get(`${CLAIM_API}/${claimId}/documents`)
    return response.data
  },
}

export default claimService

