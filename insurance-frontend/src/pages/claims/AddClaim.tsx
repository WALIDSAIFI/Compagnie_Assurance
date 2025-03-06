"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { ClaimFormData } from "../../types/Claim"
import type { Policy } from "../../types/Policy"
import policyService from "../../services/policyService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { toast } from "react-toastify"

const AddClaim: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const policyIdParam = queryParams.get("policyId")

  const [loading, setLoading] = useState(false)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loadingPolicies, setLoadingPolicies] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClaimFormData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      montantRemboursé: 0,
    },
  })

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoadingPolicies(true)
        const data = await policyService.getAllPolicies()
        setPolicies(data)

        // If policyId is provided in URL, set it as the default
        if (policyIdParam) {
          setValue("contratId", Number.parseInt(policyIdParam))
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
        toast.error("Failed to load policies")
      } finally {
        setLoadingPolicies(false)
      }
    }

    fetchPolicies()
  }, [policyIdParam, setValue])

  const onSubmit = async (data: ClaimFormData) => {
    try {
      setLoading(true)
      await policyService.createClaim(data)
      toast.success("Claim filed successfully")
      navigate(`/policies/${data.contratId}`)
    } catch (error) {
      console.error("Error filing claim:", error)
      toast.error("Failed to file claim")
    } finally {
      setLoading(false)
    }
  }

  if (loadingPolicies) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">File a New Claim</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="contratId" className="block text-sm font-medium text-gray-700 mb-1">
            Policy
          </label>
          <select
            id="contratId"
            className={`form-input ${errors.contratId ? "border-red-500" : ""}`}
            {...register("contratId", { required: "Policy is required" })}
          >
            <option value="">Select a policy</option>
            {policies.map((policy) => (
              <option key={policy.id} value={policy.id}>
                ID: {policy.id} - Type: {policy.type} - Coverage: ${policy.montantCouverture}
              </option>
            ))}
          </select>
          {errors.contratId && <p className="form-error">{errors.contratId.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Incident
          </label>
          <input
            type="date"
            id="date"
            className={`form-input ${errors.date ? "border-red-500" : ""}`}
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <p className="form-error">{errors.date.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className={`form-input ${errors.description ? "border-red-500" : ""}`}
            placeholder="Describe what happened..."
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "Description must be at least 10 characters" },
            })}
          ></textarea>
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="montantRéclamé" className="block text-sm font-medium text-gray-700 mb-1">
            Amount Claimed ($)
          </label>
          <input
            type="number"
            id="montantRéclamé"
            step="0.01"
            min="0"
            className={`form-input ${errors.montantRéclamé ? "border-red-500" : ""}`}
            placeholder="0.00"
            {...register("montantRéclamé", {
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than 0" },
              valueAsNumber: true,
            })}
          />
          {errors.montantRéclamé && <p className="form-error">{errors.montantRéclamé.message}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Filing Claim..." : "File Claim"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddClaim

