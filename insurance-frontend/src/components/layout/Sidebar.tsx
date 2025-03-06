import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Home, Users, FileText, AlertTriangle, Settings, X } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const { isAdmin } = useAuth()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Customers", path: "/customers", icon: <Users className="h-5 w-5" /> },
    { name: "Policies", path: "/policies", icon: <FileText className="h-5 w-5" /> },
    { name: "Claims", path: "/claims", icon: <AlertTriangle className="h-5 w-5" /> },
  ]

  if (isAdmin) {
    navItems.push({ name: "Admin", path: "/admin", icon: <Settings className="h-5 w-5" /> })
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/" className="text-xl font-bold text-blue-600">
            InsuranceApp
          </Link>
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive(item.path) ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar

