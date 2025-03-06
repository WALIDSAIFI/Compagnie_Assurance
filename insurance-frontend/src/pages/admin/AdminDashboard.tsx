"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import authService from "../../services/authService"
import customerService from "../../services/customerService"
import policyService from "../../services/policyService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { Check, X, User, Users, FileText, AlertTriangle } from "lucide-react"
import { toast } from "react-toastify"

// Create a simple Card component instead of using shadcn/ui
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

interface UserType {
  id: number
  login: string
  role: string
  active: boolean
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalCustomers: 0,
    totalPolicies: 0,
    totalClaims: 0,
    pendingClaims: 0,
  })
  const [usersList, setUsersList] = useState<UserType[]>([])

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)

        // Fetch all data
        const [users, customers, policies, claims] = await Promise.all([
          authService.getAllUsers(),
          customerService.getAllCustomers(),
          policyService.getAllPolicies(),
          policyService.getAllClaims(),
        ])

        const activeUsers = users.filter((u) => u.active)
        const inactiveUsers = users.filter((u) => !u.active)
        const pendingClaims = claims.filter((claim) => claim.montantRemboursé === 0)

        setStats({
          totalUsers: users.length,
          activeUsers: activeUsers.length,
          inactiveUsers: inactiveUsers.length,
          totalCustomers: customers.length,
          totalPolicies: policies.length,
          totalClaims: claims.length,
          pendingClaims: pendingClaims.length,
        })

        setUsersList(users)
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast.error("Failed to load admin dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await authService.toggleUserActive(userId, !currentStatus)

      // Update the local state to reflect the change
      setUsersList(usersList.map((u) => (u.id === userId ? { ...u, active: !currentStatus } : u)))

      // Update stats
      setStats((prev) => ({
        ...prev,
        activeUsers: currentStatus ? prev.activeUsers - 1 : prev.activeUsers + 1,
        inactiveUsers: currentStatus ? prev.inactiveUsers + 1 : prev.inactiveUsers - 1,
      }))

      toast.success(`User ${currentStatus ? "deactivated" : "activated"} successfully`)
    } catch (error) {
      console.error("Error toggling user status:", error)
      toast.error("Failed to update user status")
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white shadow rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="mt-2 flex space-x-2 text-sm">
            <span className="text-green-600">{stats.activeUsers} active</span>
            <span>•</span>
            <span className="text-red-600">{stats.inactiveUsers} inactive</span>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold">{stats.totalCustomers}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/customers" className="text-sm text-blue-600 hover:text-blue-800">
              View all customers →
            </Link>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-semibold">{stats.totalPolicies}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/policies" className="text-sm text-blue-600 hover:text-blue-800">
              View all policies →
            </Link>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Claims</p>
              <p className="text-2xl font-semibold">{stats.pendingClaims}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/claims?status=pending" className="text-sm text-blue-600 hover:text-blue-800">
              View pending claims →
            </Link>
          </div>
        </Card>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Management</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage system users and their permissions.</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usersList.map((userItem) => (
                  <tr key={userItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{userItem.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userItem.login}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          userItem.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          userItem.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userItem.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleUserStatus(userItem.id, userItem.active)}
                        className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md ${
                          userItem.active
                            ? "text-red-600 bg-red-100 hover:bg-red-200"
                            : "text-green-600 bg-green-100 hover:bg-green-200"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {userItem.active ? (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

