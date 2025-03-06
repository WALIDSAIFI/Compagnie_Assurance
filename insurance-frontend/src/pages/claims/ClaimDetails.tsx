"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import type { Claim } from "../../types/Claim"
import type { Policy } from "../../types/Policy"
import type { Customer } from "../../types/Customer"
import policyService from "../../services/policyService"
import customerService from "../../services/customerService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { Edit, Trash } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const ClaimDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [claim, setClaim] = useState<Claim | null>(null)
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingClaim, setProcessingClaim] = useState(false)
  const [reimbursementAmount, setReimbursementAmount] = useState<number>(0)

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        setLoading(true)
        if (!id) return

        const claimId = Number.parseInt(id)
        const claimData = await policyService.getClaimById(claimId)
        setClaim(claimData)

        // Fetch policy details
        const policyData = await policyService.getPolicyById(claimData.contratId)
        setPolicy(policyData)

        // Fetch customer details
        const customerData = await customerService.getCustomerById(policyData.clientId)
        setCustomer(customerData)

        // Set initial reimbursement amount if already processed
        setReimbursementAmount(claimData.montantRemboursé!)
      } catch (error) {
        console.error("Error fetching claim details:", error)
        toast.error("Failed to load claim details")
      } finally {
        setLoading(false)
      }
    }

    fetchClaimDetails()
  }, [id])

  const handleDeleteClaim = async () => {
    if (!claim) return

    if (window.confirm("Are you sure you want to delete this claim? This action cannot be undone.")) {
      try {
        await policyService.deleteClaim(claim.id)
        toast.success("Claim deleted successfully")
        navigate("/claims")
      } catch (error) {
        console.error("Error deleting claim:", error)
        toast.error("Failed to delete claim")
      }
    }
  }

  const handleProcessClaim = async () => {
    if (!claim) return

    try {
      setProcessingClaim(true)

      // Update only the reimbursement amount
      const updatedClaim = {
        ...claim,
        montantRemboursé: reimbursementAmount,
      }

      await policyService.updateClaim(claim.id, updatedClaim)
      setClaim(updatedClaim)
      toast.success("Claim processed successfully")
    } catch (error) {
      console.error("Error processing claim:", error)
      toast.error("Failed to process claim")
    } finally {
      setProcessingClaim(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!claim || !policy || !customer) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Claim not found</h2>
        <p className="mt-2 text-gray-500">
          The claim you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/claims" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Return to claims
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Claim Details</h1>
        <div className="flex space-x-2">
          <Link
            to={`/claims/${claim.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Claim
          </Link>
          <button
            onClick={handleDeleteClaim}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Claim
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Claim Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the insurance claim.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Claim ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{claim.id}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date Filed</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {format(new Date(claim.date), "PPP")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{claim.description}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Amount Claimed</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ${claim.montantRéclamé.toLocaleString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Amount Reimbursed</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                ${claim.montantRemboursé!.toLocaleString()}
                {claim.montantRemboursé === 0 && (
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    claim.montantRemboursé! > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {claim.montantRemboursé! > 0 ? "Processed" : "Pending"}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Policy Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the related insurance policy.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Policy ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <Link to={`/policies/${policy.id}`} className="text-blue-600 hover:text-blue-800">
                  {policy.id}
                </Link>
              </dd>
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
          </dl>
        </div>
      </div>

      {isAdmin && claim.montantRemboursé === 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Process Claim</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Approve or deny this claim.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="col-span-2">
                <label htmlFor="reimbursementAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Reimbursement Amount
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="reimbursementAmount"
                    id="reimbursementAmount"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    min="0"
                    max={claim.montantRéclamé}
                    value={reimbursementAmount}
                    onChange={(e) => setReimbursementAmount(Number.parseFloat(e.target.value) || 0)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter 0 to deny the claim or any amount up to the claimed amount to approve it.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleProcessClaim}
                  disabled={processingClaim}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {processingClaim ? "Processing..." : "Process Claim"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClaimDetails

