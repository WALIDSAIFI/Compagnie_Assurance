import type React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mt-2 text-lg text-gray-500">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Go back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound

