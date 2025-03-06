"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import type { Policy } from "../../types/Policy"
import type { Claim } from "../../types/Claim"
import type { Customer } from "../../types/Customer"
import policyService from "../../services/policyService"
import customerService from "../../services/customerService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { Plus, Edit, Trash } from "lucide-react"

const PolicyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolicyDetails = async () => {
      try {
        setLoading(true)
        if (!id) return

        const policyId = Number.parseInt(id)
        const policyData = await policyService.getPolicyById(policyId)
        setPolicy(policyData)

        // Fetch customer details
        const customerData = await customerService.getCustomerById(policyData.clientId)
        setCustomer(customerData)

        // Fetch claims for this policy
        const claimsData = await policyService.getClaimsByPolicyId(policyId)
        setClaims(claimsData)
      } catch (error) {
        console.error("Error fetching policy details:", error)
        toast.error("Failed to load policy details")
      } finally {
        setLoading(false)
      }
    }

    fetchPolicyDetails()
  }, [id])

  const handleDeletePolicy = async () => {
    if (!policy) return

    if (window.confirm("Are you sure you want to delete this policy? This action cannot be undone.")) {
      try {
        await policyService.deletePolicy(policy.id)
        toast.success("Policy deleted successfully")
        navigate("/policies")
      } catch (error) {
        console.error("Error deleting policy:", error)
        toast.error("Failed to delete policy")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!policy || !customer) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Policy not found</h2>
        <p className="mt-2 text-gray-500">
          The policy you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/policies" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Return to policies
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Policy Details</h1>
        <div className="flex space-x-2">
          <Link
            to={`/policies/${policy.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Policy
          </Link>
          <button
            onClick={handleDeletePolicy}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Policy
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Policy Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the insurance policy.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Policy ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{policy.id}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Policy Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Effective Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(policy.dateEffet), "PPP")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(policy.dateExpiration), "PPP")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Coverage Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ${policy.montantCouverture.toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the policy holder.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to={`/customers/${customer.id}`} className="text-blue-600 hover:text-blue-800">
                  {customer.prenom} {customer.nom}
                </Link>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.email}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.telephone}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.adresse}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Claims</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Claims filed under this policy.</p>
          </div>
          <Link
            to={`/claims/add?policyId=${policy.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            File New Claim
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {claims.length > 0 ? (
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
                      Amount Claimed
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount Reimbursed
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
                  {claims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(claim.date), "PP")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{claim.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${claim.montantRéclamé.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${claim.montantRemboursé!.toLocaleString()}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No claims have been filed for this policy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PolicyDetails

