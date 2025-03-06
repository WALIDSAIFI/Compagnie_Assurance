export interface Customer {
    id: number
    nom: string
    prenom: string
    email: string
    adresse: string
    telephone: string
    userId: number
    dateCreation?: string
    dateMiseAJour?: string
}

export interface CustomerFormData {
    nom: string
    prenom: string
    email: string
    adresse: string
    telephone: string
    userId: number
  }
  
  