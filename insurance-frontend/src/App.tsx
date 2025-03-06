import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/common/ProtectedRoute"
import AdminRoute from "./components/common/AdminRoute"
import Layout from "./components/layout/Layout"
import LoadingSpinner from "./components/common/LoadingSpinner"
import TailwindTest from "./components/TailwindTest"

// Lazy loaded components
const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const CustomerList = lazy(() => import("./pages/customers/CustomerList"))
const CustomerDetails = lazy(() => import("./pages/customers/CustomerDetails"))
const AddCustomer = lazy(() => import("./pages/customers/AddCustomer"))
const PolicyList = lazy(() => import("./pages/policies/PolicyList"))
const PolicyDetails = lazy(() => import("./pages/policies/PolicyDetails"))
const AddPolicy = lazy(() => import("./pages/policies/AddPolicy"))
const ClaimList = lazy(() => import("./pages/claims/ClaimList"))
const ClaimDetails = lazy(() => import("./pages/claims/ClaimDetails"))
const AddClaim = lazy(() => import("./pages/claims/AddClaim"))
const Profile = lazy(() => import("./pages/profile/Profile"))
const NotFound = lazy(() => import("./pages/NotFound"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />

              {/* Customer routes */}
              <Route path="customers">
                <Route index element={<CustomerList />} />
                <Route path="add" element={<AddCustomer />} />
                <Route path=":id" element={<CustomerDetails />} />
              </Route>

              {/* Policy routes */}
              <Route path="policies">
                <Route index element={<PolicyList />} />
                <Route path="add" element={<AddPolicy />} />
                <Route path=":id" element={<PolicyDetails />} />
              </Route>

              {/* Claim routes */}
              <Route path="claims">
                <Route index element={<ClaimList />} />
                <Route path="add" element={<AddClaim />} />
                <Route path=":id" element={<ClaimDetails />} />
              </Route>

              {/* Profile route */}
              <Route path="profile" element={<Profile />} />

              {/* Admin routes */}
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App

