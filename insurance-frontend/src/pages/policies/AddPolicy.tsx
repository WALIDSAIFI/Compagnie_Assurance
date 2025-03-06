"use client"

import  React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import {  PolicyFormData, PolicyType } from "../../types/Policy"
import { Customer } from "../../types/Customer"
import policyService from "../../services/policyService"
import customerService from "../../services/customerService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { toast } from "react-toastify"

const AddPolicy: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const customerIdParam = queryParams.get("customerId")

  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PolicyFormData>({
    defaultValues: {
      dateEffet: new Date().toISOString().split("T")[0],
      dateExpiration: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
      montantCouverture: 100000,
    },
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true)
        const data = await customerService.getAllCustomers()
        setCustomers(data)

        // If customerId is provided in URL, set it as the default
        if (customerIdParam) {
          setValue("clientId", Number.parseInt(customerIdParam))
        }
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast.error("Failed to load customers")
      } finally {
        setLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [customerIdParam, setValue])

  const onSubmit = async (data: PolicyFormData) => {
    try {
      setLoading(true)
      const response = await policyService.createPolicy(data)
      toast.success("Policy created successfully")
      navigate(`/policies/${response.id}`)
    } catch (error) {
      console.error("Error creating policy:", error)
      toast.error("Failed to create policy")
    } finally {
      setLoading(false)
    }
  }

  if (loadingCustomers) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Policy</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Customer
          </label>
          <select
            id="clientId"
            className={`form-input ${errors.clientId ? "border-red-500" : ""}`}
            {...register("clientId", { required: "Customer is required" })}
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.prenom} {customer.nom} - {customer.email}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="form-error">{errors.clientId.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Policy Type
          </label>
          <select
            id="type"
            className={`form-input ${errors.type ? "border-red-500" : ""}`}
            {...register("type", { required: "Policy type is required" })}
          >
            <option value="">Select a policy type</option>
            <option value={PolicyType.AUTO}>Auto Insurance</option>
            <option value={PolicyType.HABITATION}>Home Insurance</option>
            <option value={PolicyType.SANTE}>Health Insurance</option>
          </select>
          {errors.type && <p className="form-error">{errors.type.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="dateEffet" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              id="dateEffet"
              className={`form-input ${errors.dateEffet ? "border-red-500" : ""}`}
              {...register("dateEffet", { required: "Effective date is required" })}
            />
            {errors.dateEffet && <p className="form-error">{errors.dateEffet.message}</p>}
          </div>

          <div>
            <label htmlFor="dateExpiration" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              id="dateExpiration"
              className={`form-input ${errors.dateExpiration ? "border-red-500" : ""}`}
              {...register("dateExpiration", { required: "Expiration date is required" })}
            />
            {errors.dateExpiration && <p className="form-error">{errors.dateExpiration.message}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="montantCouverture" className="block text-sm font-medium text-gray-700 mb-1">
            Coverage Amount ($)
          </label>
          <input
            type="number"
            id="montantCouverture"
            step="1000"
            min="0"
            className={`form-input ${errors.montantCouverture ? "border-red-500" : ""}`}
            placeholder="100000"
            {...register("montantCouverture", {
              required: "Coverage amount is required",
              min: { value: 1000, message: "Minimum coverage is $1,000" },
              valueAsNumber: true,
            })}
          />
          {errors.montantCouverture && <p className="form-error">{errors.montantCouverture.message}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate("/policies")} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creating..." : "Create Policy"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPolicy

