import { BrowserRouter as Router, } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getStoredUserData, isAuthenticated } from './utils/auth'

import AppRoutes from './routes/AppRoutes'
import './App.css'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'doctor'
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in using auth utilities
    if (isAuthenticated()) {
      const storedUserData = getStoredUserData()
      if (storedUserData) {
        setUser({
          id: storedUserData.id,
          name: storedUserData.name,
          email: storedUserData.email,
          role: storedUserData.userType
        })
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    // User data is already stored in localStorage by LoginPage component
  }

  const handleLogout = () => {
    setUser(null)
    // Clear all auth data
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>लोड हो रहा है...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <AppRoutes 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />
      </div>
    </Router>
  )
}

export default App
