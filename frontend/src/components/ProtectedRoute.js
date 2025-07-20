"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./common/Spinner"

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Spinner />
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
