export interface Claim {
    id: number
    date: string
    description: string
    montantRéclamé: number
    montantRemboursé?: number
    contratId: number
  }
  
  export interface ClaimFormData {
    date: string
    description: string
    montantRéclamé: number
    montantRemboursé?: number // Optional, defaults to 0 for new claims
    contratId: number
  }
  
  