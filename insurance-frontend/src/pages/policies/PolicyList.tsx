"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { type Policy, PolicyType } from "../../types/Policy"
import policyService from "../../services/policyService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { Search, Plus, Filter } from "lucide-react"
import { toast } from "react-toastify"
import { format } from "date-fns"

const PolicyList: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("")

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true)
        const data = await policyService.getAllPolicies()
        setPolicies(data)
        setFilteredPolicies(data)
      } catch (error) {
        console.error("Error fetching policies:", error)
        toast.error("Failed to load policies")
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  useEffect(() => {
    let filtered = policies

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter((policy) => policy.type === filterType)
    }

    // Apply search filter (on policy ID)
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (policy) => policy.id.toString().includes(searchTerm) || policy.clientId.toString().includes(searchTerm),
      )
    }

    setFilteredPolicies(filtered)
  }, [searchTerm, filterType, policies])

  const handleDeletePolicy = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await policyService.deletePolicy(id)
        setPolicies(policies.filter((policy) => policy.id !== id))
        toast.success("Policy deleted successfully")
      } catch (error) {
        console.error("Error deleting policy:", error)
        toast.error("Failed to delete policy")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Policies</h1>
        <Link
          to="/policies/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
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
            placeholder="Search by Policy ID or Customer ID..."
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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value={PolicyType.AUTO}>Auto</option>
              <option value={PolicyType.HABITATION}>Home</option>
              <option value={PolicyType.SANTE}>Health</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredPolicies.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredPolicies.map((policy) => (
              <li key={policy.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">
                          <Link to={`/policies/${policy.id}`}>Policy #{policy.id}</Link>
                        </p>
                        <p className="text-sm text-gray-500">Customer ID: {policy.clientId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/policies/${policy.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        to={`/policies/${policy.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                            policy.type === "AUTO"
                              ? "bg-blue-100 text-blue-800"
                              : policy.type === "HABITATION"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {policy.type}
                        </span>
                        Coverage: ${policy.montantCouverture.toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Effective: {format(new Date(policy.dateEffet), "PP")} - Expires:{" "}
                        {format(new Date(policy.dateExpiration), "PP")}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No policies found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PolicyList

