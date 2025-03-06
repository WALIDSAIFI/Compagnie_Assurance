"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import type { Claim } from "../../types/Claim"
import policyService from "../../services/policyService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { Search, Plus, Filter } from "lucide-react"
import { toast } from "react-toastify"
import { format } from "date-fns"

const ClaimList: React.FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialStatusFilter = queryParams.get("status") || ""

  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true)
        const data = await policyService.getAllClaims()
        setClaims(data)
        setFilteredClaims(data)
      } catch (error) {
        console.error("Error fetching claims:", error)
        toast.error("Failed to load claims")
      } finally {
        setLoading(false)
      }
    }

    fetchClaims()
  }, [])

  useEffect(() => {
    let filtered = claims

    // Apply status filter
    if (statusFilter === "pending") {
      filtered = filtered.filter((claim) => claim.montantRemboursé === 0)
    } else if (statusFilter === "processed") {
      filtered = filtered.filter((claim) => claim.montantRemboursé! > 0)
    }

    // Apply search filter (on claim ID or contract ID)
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (claim) =>
          claim.id.toString().includes(searchTerm) ||
          claim.contratId.toString().includes(searchTerm) ||
          claim.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredClaims(filtered)
  }, [searchTerm, statusFilter, claims])

  const handleDeleteClaim = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      try {
        await policyService.deleteClaim(id)
        setClaims(claims.filter((claim) => claim.id !== id))
        toast.success("Claim deleted successfully")
      } catch (error) {
        console.error("Error deleting claim:", error)
        toast.error("Failed to delete claim")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Claims</h1>
        <Link
          to="/claims/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          File New Claim
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Claims</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredClaims.length > 0 ? (
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
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Policy ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount Claimed
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
                {filteredClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:text-blue-800">
                        {claim.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(claim.date), "PP")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                      {claim.description.length > 50 ? `${claim.description.substring(0, 50)}...` : claim.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link to={`/policies/${claim.contratId}`} className="text-blue-600 hover:text-blue-800">
                        {claim.contratId}
                      </Link>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/claims/${claim.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <Link to={`/claims/${claim.id}/edit`} className="text-green-600 hover:text-green-900 mr-4">
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteClaim(claim.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No claims found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimList

