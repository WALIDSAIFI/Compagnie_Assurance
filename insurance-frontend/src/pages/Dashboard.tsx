"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import customerService from "../services/customerService"
import policyService from "../services/policyService"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { Users, FileText, AlertTriangle, Clock } from "lucide-react"
import { format } from "date-fns"
import type { Policy } from "../types/Policy"
import type { Claim } from "../types/Claim"

// Create a simple Card component instead of using shadcn/ui
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    customers: 0,
    policies: 0,
    claims: 0,
    pendingClaims: 0,
  })
  const [recentPolicies, setRecentPolicies] = useState<Policy[]>([])
  const [recentClaims, setRecentClaims] = useState<Claim[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch stats
        const customers = await customerService.getAllCustomers()
        const policies = await policyService.getAllPolicies()
        const claims = await policyService.getAllClaims()

        // Calculate pending claims
        const pendingClaims = claims.filter((claim) => claim.montantRemboursé === 0)

        setStats({
          customers: customers.length,
          policies: policies.length,
          claims: claims.length,
          pendingClaims: pendingClaims.length,
        })

        // Get recent policies (5 most recent)
        const sortedPolicies = [...policies]
          .sort((a, b) => new Date(b.dateEffet).getTime() - new Date(a.dateEffet).getTime())
          .slice(0, 5)
        setRecentPolicies(sortedPolicies)

        // Get recent claims (5 most recent)
        const sortedClaims = [...claims]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
        setRecentClaims(sortedClaims)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white shadow rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold">{stats.customers}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Policies</p>
              <p className="text-2xl font-semibold">{stats.policies}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Claims</p>
              <p className="text-2xl font-semibold">{stats.claims}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/claims" className="text-sm text-blue-600 hover:text-blue-800">
              View all claims →
            </Link>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow rounded-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <Clock className="h-6 w-6" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Policies</h2>
          {recentPolicies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Effective Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPolicies.map((policy) => (
                    <tr key={policy.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/policies/${policy.id}`} className="text-blue-600 hover:text-blue-800">
                          {policy.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            policy.type === "AUTO"
                              ? "bg-blue-100 text-blue-800"
                              : policy.type === "HABITATION"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {policy.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(policy.dateEffet), "PP")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${policy.montantCouverture.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No policies found.</p>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Claims</h2>
          {recentClaims.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:text-blue-800">
                          {claim.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(claim.date), "PP")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${claim.montantRéclamé.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            claim.montantRemboursé! > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {claim.montantRemboursé! > 0 ? "Processed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No claims found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

