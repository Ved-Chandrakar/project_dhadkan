import { useState, useEffect } from 'react'
import serverUrl from '../../server'

interface DoctorProfileProps {
  user: {
    id: number
    name: string
    email: string
  }
}

interface DoctorData {
  id: number
  doctorName: string
  hospitalType: string
  hospitalname: string
  phoneNo: string
  experience: number | null
  email: string
  createdAt: string
  updatedAt: string
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ user }) => {
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .profile-card {
        animation: fadeInUp 0.6s ease-out;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Responsive check
  const isMobile = window.innerWidth <= 768

  // Comprehensive styles object
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: isMobile ? '1rem' : '2rem'
    },
    contentHeader: {
      marginBottom: '2rem',
      background: 'linear-gradient(180deg, #71a876ff 0%, #3f704fff 100%)',
      padding: '1rem',
      borderRadius: '8px',
      textAlign: 'center' as const
    },
    contentHeaderH3: {
      color: '#ffffff',
      fontSize: '2.5rem',
      margin: '0 0 0.5rem 0',
      fontWeight: 700,
      textShadow: '2px 2px 4px rgba(63, 112, 79, 0.1)'
    },
    contentHeaderP: {
      margin: 0,
      color: '#ffffff',
      fontSize: '1.1rem',
      fontWeight: 500
    },
    errorMessage: {
      background: 'linear-gradient(45deg, #dc3545, #c82333)',
      color: 'white',
      marginTop: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
    },
    profileContainer: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    profileCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '2 20px 40px rgba(63, 112, 79, 0.1)',
      overflow: 'hidden',
      border: '1px solid #000000',
      position: 'relative' as const,
    },
    profileCardBefore: {
      content: "''",
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '5px',
      background: 'linear-gradient(90deg, #71a876ff, #3f704fff)',
      zIndex: 1
    },
    profileInfo: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row',
      alignItems: 'stretch'
    },
    profileAvatar: {
      textAlign: 'center' as const,
      padding: '3rem 2rem',
      background: 'linear-gradient(135deg, #71a876ff 0%, #3f704fff 100%)',
      color: 'white',
      minWidth: isMobile ? '100%' : '300px',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    profileAvatarBefore: {
      content: "''",
      position: 'absolute' as const,
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '50%',
      animation: 'pulse 3s ease-in-out infinite'
    },
    avatarIcon: {
      fontSize: '5rem',
      display: 'block',
      marginTop: '10rem',
      marginBottom: '1rem',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
      position: 'relative' as const,
      zIndex: 2
    },
    profileAvatarH4: {
      margin: 0,
      fontSize: '1.8rem',
      fontWeight: 600,
      textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
      position: 'relative' as const,
      zIndex: 2
    },
    profileAvatarSubtitle: {
      margin: '0.5rem 0 0 0',
      fontSize: '1rem',
      opacity: 0.9,
      fontWeight: 300,
      position: 'relative' as const,
      zIndex: 2
    },
    profileDetails: {
      padding: '2.5rem',
      flex: 1,
      background: 'linear-gradient(135deg, #f8fcf8 0%, #ffffff 100%)'
    },
    detailsTitle: {
      color: '#3f704fff',
      fontSize: '1.4rem',
      marginBottom: '1.5rem',
      fontWeight: 600,
      borderBottom: '2px solid #e8f5e8',
      paddingBottom: '0.5rem'
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 0',
      borderBottom: '1px solid rgba(232, 245, 232, 0.8)',
      flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      gap: isMobile ? '0.5rem' : '0',
      transition: 'all 0.3s ease'
    },
    detailRowHover: {
      backgroundColor: 'rgba(63, 112, 79, 0.08)',
      borderRadius: '12px',
      margin: '0 -1rem',
      padding: '1rem 1rem',
      transform: 'translateX(5px)'
    },
    detailRowLast: {
      borderBottom: 'none'
    },
    detailLabel: {
      fontWeight: 600,
      color: '#3f704fff',
      minWidth: isMobile ? 'auto' : '180px',
      fontSize: '0.95rem'
    },
    detailValue: {
      color: '#71a876ff',
      textAlign: isMobile ? 'left' : 'right' as 'left' | 'right',
      fontWeight: 500,
      fontSize: '0.95rem'
    },
    loadingMessage: {
      textAlign: 'center' as const,
      padding: '3rem',
      color: '#3f704fff'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e8f5e8',
      borderTop: '4px solid #3f704fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    },
    refreshBtn: {
      marginLeft: '10px',
      padding: '8px 16px',
      background: 'linear-gradient(45deg, #dc3545, #c82333)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'all 0.3s ease'
    }
  }

  useEffect(() => {
    fetchDoctorProfile()
  }, [user.id])

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${serverUrl}dhadkan_get_doctor_profile.php?doctor_id=${user.id}`)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setDoctorData(result.data.profile)
      } else {
        throw new Error(result.message || 'Failed to fetch doctor profile')
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      
      // Fallback to user data if API fails
      setDoctorData({
        id: user.id,
        doctorName: user.name || '',
        hospitalType: '',
        hospitalname: '',
        phoneNo: '',
        experience: null,
        email: user.email || '',
        createdAt: '',
        updatedAt: ''
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.contentHeader}>
          {/* <button 
            style={styles.backBtn} 
            onClick={onBack}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(19, 136, 8, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(19, 136, 8, 0.3)'
            }}
          >
            🔙 वापस
          </button> */}
          <h3 style={styles.contentHeaderH3}>चिकित्सक प्रोफाइल</h3>
          <p style={styles.contentHeaderP}>व्यक्तिगत जानकारी लोड हो रही है...</p>
        </div>
        
        <div style={styles.profileContainer}>
          <div style={styles.profileCard} className="profile-card">
            <div style={styles.profileCardBefore}></div>
            <div style={styles.loadingMessage}>
              <div style={styles.loadingSpinner}></div>
              <h4 style={{color: '#3f704fff', margin: '0 0 1rem 0'}}>प्रोफाइल डेटा लोड हो रहा है...</h4>
              <p style={{color: '#7f8c8d', margin: 0}}>कृपया प्रतीक्षा करें</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentHeader}>
        <h3 style={styles.contentHeaderH3}>चिकित्सक प्रोफाइल</h3>
        <p style={styles.contentHeaderP}>व्यक्तिगत जानकारी और सेटिंग्स</p>
        {error && (
          <div style={styles.errorMessage}>
            <h4 style={{margin: '0 0 0.5rem 0'}}>⚠ त्रुटि</h4>
            <p style={{margin: '0 0 1rem 0'}}>Error: {error}</p>
            <button 
              onClick={fetchDoctorProfile} 
              style={styles.refreshBtn}
            >
              ↻ पुनः प्रयास करें
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.profileContainer}>
        <div style={styles.profileCard} className="profile-card">
          <div style={styles.profileCardBefore}></div>
          <div style={styles.profileInfo}>
            <div style={styles.profileAvatar}>
              <div style={styles.profileAvatarBefore}></div>
              <span style={styles.avatarIcon}>🩺</span>
              <h4 style={styles.profileAvatarH4}>{doctorData?.doctorName || 'डॉक्टर'}</h4>
              <p style={styles.profileAvatarSubtitle}>चिकित्सा विशेषज्ञ</p>
            </div>
            
            <div style={styles.profileDetails}>
              <h5 style={styles.detailsTitle}>□ व्यक्तिगत विवरण</h5>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>🆔 चिकित्सक ID:</label>
                <span style={styles.detailValue}>{doctorData?.id || 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>👤 चिकित्सक नाम:</label>
                <span style={styles.detailValue}>{doctorData?.doctorName || 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>⌂ अस्पताल का प्रकार:</label>
                <span style={styles.detailValue}>{doctorData?.hospitalType || 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>🏨 अस्पताल का नाम:</label>
                <span style={styles.detailValue}>{doctorData?.hospitalname || 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>📱 मोबाइल नंबर:</label>
                <span style={styles.detailValue}>{doctorData?.phoneNo || 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>🎓 अनुभव (वर्ष):</label>
                <span style={styles.detailValue}>{doctorData?.experience ? `${doctorData.experience} वर्ष` : 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>📧 ईमेल पता:</label>
                <span style={styles.detailValue}>{doctorData?.email || 'N/A'}</span>
              </div>
              <div 
                style={styles.detailRow}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>📅 खाता बनाया गया:</label>
                <span style={styles.detailValue}>{doctorData?.createdAt ? new Date(doctorData.createdAt).toLocaleDateString('hi-IN') : 'N/A'}</span>
              </div>
              <div 
                style={{...styles.detailRow, ...styles.detailRowLast}}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.detailRowHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderRadius = '0'
                  e.currentTarget.style.margin = '0'
                  e.currentTarget.style.padding = '1rem 0'
                }}
              >
                <label style={styles.detailLabel}>↻ अंतिम अपडेट:</label>
                <span style={styles.detailValue}>{doctorData?.updatedAt ? new Date(doctorData.updatedAt).toLocaleDateString('hi-IN') : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile