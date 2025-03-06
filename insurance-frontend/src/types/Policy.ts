export enum PolicyType {
    AUTO = "AUTO",
    HABITATION = "HABITATION",
    SANTE = "SANTE",
  }
  
  export interface Policy {
    id: number
    type: PolicyType
    dateEffet: string
    dateExpiration: string
    montantCouverture: number
    clientId: number
  }
  
  export interface PolicyFormData {
    type: PolicyType
    dateEffet: string
    dateExpiration: string
    montantCouverture: number
    clientId: number
  }
  
  