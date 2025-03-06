"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import type { Customer } from "../../types/Customer"
import customerService from "../../services/customerService"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import { Search, Plus, Edit, Trash } from "lucide-react"
import { toast } from "react-toastify"

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const data = await customerService.getAllCustomers()
        setCustomers(data)
        setFilteredCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast.error("Failed to load customers")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchTerm, customers])

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.deleteCustomer(id)
        setCustomers(customers.filter((customer) => customer.id !== id))
        toast.success("Customer deleted successfully")
      } catch (error) {
        console.error("Error deleting customer:", error)
        toast.error("Failed to delete customer")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link
          to="/customers/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredCustomers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">
                          <Link to={`/customers/${customer.id}`}>
                            {customer.prenom} {customer.nom}
                          </Link>
                        </p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </Link>
                      <Link
                        to={`/customers/${customer.id}/edit`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">{customer.telephone}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{customer.adresse}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No customers found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerList

