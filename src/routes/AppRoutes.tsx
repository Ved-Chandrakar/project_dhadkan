import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/login/LoginPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import DoctorDashboard from '../pages/doctor/DoctorDashboard'
import { User } from '../App'

interface AppRoutesProps {
  user: User | null
  onLogin: (userData: User) => void
  onLogout: () => void
}

const AppRoutes = ({ user, onLogin, onLogout }: AppRoutesProps) => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/doctor-dashboard'} replace />
          ) : (
            <LoginPage onLogin={onLogin} />
          )
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          user && user.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/doctor-dashboard" 
        element={
          user && user.role === 'doctor' ? (
            <DoctorDashboard user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/doctor/dashboard" 
        element={
          user && user.role === 'doctor' ? (
            <DoctorDashboard user={user} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/doctor/profile" 
        element={
          user && user.role === 'doctor' ? (
            <DoctorDashboard user={user} onLogout={onLogout} activeTab="profile" />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/doctor/add-report" 
        element={
          user && user.role === 'doctor' ? (
            <DoctorDashboard user={user} onLogout={onLogout} activeTab="addReport" />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/" 
        element={
          <Navigate to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/doctor-dashboard') : '/login'} replace />
        } 
      />
    </Routes>
  )
}

export default AppRoutes
