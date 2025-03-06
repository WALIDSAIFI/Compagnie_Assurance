export interface User {
    id: number
    login: string
    email?: string
    active: boolean
    role: "ADMIN" | "CLIENT"
    createdAt?: string
    lastLogin?: string
  }
  
  