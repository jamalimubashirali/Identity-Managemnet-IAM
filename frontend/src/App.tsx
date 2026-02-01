import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import AdminLoginPage from "@/pages/AdminLoginPage"
import RegisterPage from "@/pages/RegisterPage"
import Dashboard from "@/pages/Dashboard"
import UsersPage from "@/pages/admin/UsersPage"
import RolesPage from "@/pages/admin/RolesPage"
import AuditLogPage from "@/pages/admin/AuditLogPage"
import ProfilePage from "@/pages/ProfilePage"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import type { JSX } from "react/jsx-runtime"

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user && !user.roles.includes(requiredRole)) {
    return <Navigate to="/" replace /> // Unauthorized redirect
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <AuditLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
