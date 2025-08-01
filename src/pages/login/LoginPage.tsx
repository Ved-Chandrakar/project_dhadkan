import { useState } from 'react'
import { User } from '../../App'
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

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768

  // Inline Styles
  const styles = {
    loginPage: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: isMobile ? '1rem' : '2rem'
    },
    loginCard: {
      background: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      overflow: 'hidden' as const,
      width: '100%',
      maxWidth: isMobile ? '400px' : '1000px',
      minHeight: isMobile ? 'auto' : '600px',
      display: 'flex',
      flexDirection: isMobile ? ('column' as const) : ('row' as const),
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    leftSection: {
      flex: isMobile ? 'none' : 1,
      background: 'linear-gradient(135deg, #F9A3CB 1%, #FFCEE6 0%,  #FCBCD7 10%, #F9A3CB 90% )',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '2rem 1.5rem' : '3rem 2rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      minHeight: isMobile ? '200px' : 'auto'
    },
    logoContainer: {
      marginTop: '-1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const
    },
    logoImage: {
      width: isMobile ? '300px' : '360px',
      height: 'auto',
      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
      transition: 'transform 0.3s ease'
    },
    // projectTitle: {
    //   fontSize: isMobile ? '2rem' : '2.8rem',
    //   fontWeight: 'bold' as const,
    //   color: '#d81b60',
    //   textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    //   marginBottom: '1rem',
    //   letterSpacing: '1px',
    //   textAlign: 'center' as const
    // },
    tagline: {
      fontSize: isMobile ? '1.5rem' : '1.5rem',
      color: '#ad1457',
      fontWeight: 500,
      textAlign: 'center' as const,
      lineHeight: 1.6,
      opacity: 0.9,
      marginTop: '-6rem'
    },
    rightSection: {
      flex: isMobile ? 'none' : 1,
      padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      background: '#ffffff'
    },
    loginHeader: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    loginHeaderH2: {
      color: '#2c3e50',
      fontSize: isMobile ? '1.8rem' : '2.2rem',
      marginBottom: '0.5rem',
      fontWeight: 600
    },
    loginHeaderP: {
      color: '#7f8c8d',
      fontSize: '1rem',
      margin: 0,
      opacity: 0.8
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    formGroupLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 600,
      color: '#34495e',
      fontSize: '0.95rem'
    },
    formInput: {
      width: '100%',
      padding: '1rem 1.2rem',
      border: '2px solid #ecf0f1',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8f9fa',
      boxSizing: 'border-box' as const,
      outline: 'none'
    },
    formInputFocus: {
      borderColor: '#FCBCD7',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(252, 188, 215, 0.15)',
      transform: 'translateY(-1px)'
    },
    errorMessage: {
      color: '#e74c3c',
      backgroundColor: '#fdf2f2',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
      fontSize: '0.9rem',
      textAlign: 'center' as const
    },
    loginBtn: {
      width: '100%',
      background: 'linear-gradient(135deg, #FCBCD7 0%, #FFCEE6 100%)',
      color: '#ad1457',
      border: 'none',
      padding: '1.2rem 2rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'none' as const,
      boxShadow: '0 6px 20px rgba(252, 188, 215, 0.3)',
      marginTop: '0.5rem'
    },
    loginBtnHover: {
      background: 'linear-gradient(135deg, #f8a5c2 0%, #fbb8e6 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(252, 188, 215, 0.4)'
    },
    loginBtnDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none'
    },
    decorativeElements: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none' as const,
      overflow: 'hidden' as const
    },
    decorativeCircle1: {
      position: 'absolute' as const,
      top: '-30px',
      right: '-30px',
      width: '100px',
      height: '100px',
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite'
    },
    decorativeCircle2: {
      position: 'absolute' as const,
      bottom: '-50px',
      left: '-50px',
      width: '120px',
      height: '120px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite reverse'
    },
    decorativeCircle3: {
      position: 'absolute' as const,
      top: '40%',
      left: '-20px',
      width: '80px',
      height: '80px',
      background: 'rgba(255, 255, 255, 0.08)',
      borderRadius: '50%',
      animation: 'float 10s ease-in-out infinite',
      animationDelay: '2s'
    },
    decorativeCircle4: {
      position: 'absolute' as const,
      bottom: '20%',
      right: '-25px',
      width: '90px',
      height: '90px',
      background: 'rgba(255, 255, 255, 0.12)',
      borderRadius: '50%',
      animation: 'float 7s ease-in-out infinite reverse',
      animationDelay: '1s'
    },
    decorativeCircle5: {
      position: 'absolute' as const,
      top: '15%',
      left: '50%',
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '50%',
      animation: 'float 12s ease-in-out infinite',
      animationDelay: '3s'
    },
    decorativeCircle6: {
      position: 'absolute' as const,
      bottom: '40%',
      left: '20%',
      width: '70px',
      height: '70px',
      background: 'rgba(255, 255, 255, 0.09)',
      borderRadius: '50%',
      animation: 'float 9s ease-in-out infinite reverse',
      animationDelay: '4s'
    }
  }

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
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes logoHover {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .logo-hover:hover {
            animation: logoHover 0.6s ease-in-out;
          }
        `}
      </style>
      
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          {/* Left Side - Brand Section */}
          <div style={styles.leftSection}>
            <div style={styles.decorativeElements}>
              <div style={styles.decorativeCircle1}></div>
              <div style={styles.decorativeCircle2}></div>
              <div style={styles.decorativeCircle3}></div>
              <div style={styles.decorativeCircle4}></div>
              <div style={styles.decorativeCircle5}></div>
              <div style={styles.decorativeCircle6}></div>
            </div>
            
            <div style={styles.logoContainer}>
              <img 
                src="/dhadkan_logo.png"
                alt="Dhadkan Logo"
                style={styles.logoImage}
                className="logo-hover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            
            {/* <h1 style={styles.projectTitle}>DHADKAN</h1> */}
            <p style={styles.tagline}>स्वस्थ दिल, स्वस्थ धड़कन</p>
          </div>

          {/* Right Side - Login Form */}
          <div style={styles.rightSection}>
            <div style={styles.loginHeader}>
              <h2 style={styles.loginHeaderH2}>प्रवेश करें</h2>
              <p style={styles.loginHeaderP}>अपनी भूमिका चुनकर लॉगिन करें</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel} htmlFor="role">भूमिका चुनें:</label>
                <select
                  style={styles.formInput}
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ecf0f1'
                    e.target.style.backgroundColor = '#f8f9fa'
                    e.target.style.boxShadow = 'none'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  <option value="admin">प्रशासक (Admin)</option>
                  <option value="doctor">चिकित्सक (Doctor)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel} htmlFor="email">ईमेल पता:</label>
                <input
                  style={styles.formInput}
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="अपना ईमेल दर्ज करें"
                  required
                  onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ecf0f1'
                    e.target.style.backgroundColor = '#f8f9fa'
                    e.target.style.boxShadow = 'none'
                    e.target.style.transform = 'translateY(0)'
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formGroupLabel} htmlFor="password">पासवर्ड:</label>
                <input
                  style={styles.formInput}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  required
                  onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ecf0f1'
                    e.target.style.backgroundColor = '#f8f9fa'
                    e.target.style.boxShadow = 'none'
                    e.target.style.transform = 'translateY(0)'
                  }}
                />
              </div>

              {error && (
                <div style={styles.errorMessage}>
                  {error}
                </div>
              )}

              <button 
                style={{
                  ...styles.loginBtn,
                  ...(loading ? styles.loginBtnDisabled : {})
                }}
                type="submit" 
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    Object.assign(e.currentTarget.style, styles.loginBtnHover)
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FCBCD7 0%, #FFCEE6 100%)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(252, 188, 215, 0.3)'
                  }
                }}
              >
                {loading ? 'प्रवेश हो रहा है...' : 'लॉगिन करें'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
