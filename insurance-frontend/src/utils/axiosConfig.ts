import axios from "axios"
import { toast } from "react-toastify"

// Création d'une instance axios avec la base URL du gateway
const apiClient = axios.create({
  baseURL: "/api", // Le gateway est configuré comme proxy dans package.json
  headers: {
    "Content-Type": "application/json",
  },
})

// Intercepteur pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Gestion des erreurs selon le code de statut
      switch (error.response.status) {
        case 401:
          // Non autorisé - déconnexion
          localStorage.removeItem("token")
          window.location.href = "/login"
          toast.error("Votre session a expiré. Veuillez vous reconnecter.")
          break
        case 403:
          // Accès interdit
          toast.error("Vous n'avez pas les permissions nécessaires pour cette action.")
          break
        case 404:
          // Ressource non trouvée
          toast.error("La ressource demandée n'existe pas.")
          break
        case 500:
          // Erreur serveur
          toast.error("Une erreur serveur s'est produite. Veuillez réessayer plus tard.")
          break
        default:
          // Autres erreurs
          toast.error(error.response.data.message || "Une erreur s'est produite.")
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      toast.error("Impossible de communiquer avec le serveur. Vérifiez votre connexion internet.")
    } else {
      // Erreur lors de la configuration de la requête
      toast.error("Une erreur s'est produite lors de la préparation de la requête.")
    }
    return Promise.reject(error)
  },
)

export default apiClient

