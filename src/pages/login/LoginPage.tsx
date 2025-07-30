import { useState } from 'react'
import { User } from '../../App'
import './LoginPage.css'
import serverUrl from '../server'

interface LoginPageProps {
  onLogin: (userData: User) => void
}

interface LoginFormData {
  email: string
  password: string
  role: 'admin' | 'doctor'
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'admin'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // API call to login.php
      const response = await fetch(`${serverUrl}login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: formData.role // 'admin' or 'doctor'
        })
      })

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userData', JSON.stringify(data.user))

        // Create user object for the frontend
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.userType as 'admin' | 'doctor',
          name: data.user.name
        }
        
        onLogin(userData)
      } else {
        setError(data.message || 'लॉगिन में त्रुटि हुई')
      }
    } catch (err) {
      console.error('Login error:', err)
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('सर्वर से कनेक्शन नहीं हो पा रहा। कृपया XAMPP चालू करें और दोबारा कोशिश करें।')
      } else {
        setError('सर्वर से कनेक्ट नहीं हो पा रहा। कृपया बाद में कोशिश करें।')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Government Header */}
      <header className="gov-header">
        <h1>धड़कन</h1>
        <p className="subtitle">स्वास्थ्य सेवा प्रबंधन प्रणाली</p>
      </header>
      {/* Login Form */}
      <div className="login-form-container">
        <div className="form-container">
          <div className="login-header">
            <h2>प्रवेश करें</h2>
            <p>अपनी भूमिका चुनकर लॉगिन करें</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">भूमिका चुनें:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="admin">प्रशासक (Admin)</option>
                <option value="doctor">चिकित्सक (Doctor)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">ईमेल पता:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="अपना ईमेल दर्ज करें"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">पासवर्ड:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="अपना पासवर्ड दर्ज करें"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'प्रवेश हो रहा है...' : 'प्रवेश करें'}
            </button>
          </form>

          <div className="login-footer">
            {/* <p>समस्या हो रही है? तकनीकी सहायता से संपर्क करें</p> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="gov-footer">
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">संचालित</p>
            <p className="text-xs font-semibold text-green-600">SSIPMT, Raipur</p>
            <p className="text-xs text-gray-400 mt-1">स्वास्थ्य एवं परिवार कल्याण मंत्रालय-छत्तीसगढ़ सरकार</p>
            <p className="text-xs text-gray-400">संस्करण 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage
