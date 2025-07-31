import React, { useState, useEffect } from 'react'
import serverUrl from '../pages/server'

interface DoctorProfileProps {
  user: {
    id: number
    name: string
    email: string
  }
  onBack: () => void
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

interface DoctorStats {
  totalChildrenScreened: number
  positiveCases: number
  todayScreenings: number
  reportsThisWeek: number
  pendingReports: number
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ user, onBack }) => {
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null)
  const [stats, setStats] = useState<DoctorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDoctorProfile()
  }, [user.id])

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${serverUrl}get_doctor_profile.php?doctor_id=${user.id}`)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setDoctorData(result.data.profile)
        setStats(result.data.statistics)
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
      setStats({
        totalChildrenScreened: 0,
        positiveCases: 0,
        todayScreenings: 0,
        reportsThisWeek: 0,
        pendingReports: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="content-header">
          <button className="back-btn" onClick={onBack}>
            ← वापस
          </button>
          <h3>चिकित्सक प्रोफाइल</h3>
          <p>व्यक्तिगत जानकारी लोड हो रही है...</p>
        </div>
        
        <div className="profile-container">
          <div className="profile-card">
            <div className="loading-message" style={{textAlign: 'center', padding: '2rem'}}>
              <p>प्रोफाइल डेटा लोड हो रहा है...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="content-header">
        <button className="back-btn" onClick={onBack}>
          ← वापस
        </button>
        <h3>चिकित्सक प्रोफाइल</h3>
        <p>व्यक्तिगत जानकारी और सेटिंग्स</p>
        {error && (
          <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
            <p>Error: {error}</p>
            <button onClick={fetchDoctorProfile} style={{marginLeft: '10px', padding: '5px 10px'}}>
              पुनः प्रयास करें
            </button>
          </div>
        )}
      </div>
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-icon">👩‍⚕️</span>
              <h4>{doctorData?.doctorName || 'डॉक्टर'}</h4>
            </div>
            
            <div className="profile-details">
              <div className="detail-row">
                <label>चिकित्सक ID:</label>
                <span>{doctorData?.id || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>चिकित्सक नाम:</label>
                <span>{doctorData?.doctorName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>अस्पताल का प्रकार:</label>
                <span>{doctorData?.hospitalType || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>अस्पताल का नाम:</label>
                <span>{doctorData?.hospitalname || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>मोबाइल नंबर:</label>
                <span>{doctorData?.phoneNo || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>अनुभव (वर्ष):</label>
                <span>{doctorData?.experience ? `${doctorData.experience} वर्ष` : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>ईमेल पता:</label>
                <span>{doctorData?.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>खाता बनाया गया:</label>
                <span>{doctorData?.createdAt ? new Date(doctorData.createdAt).toLocaleDateString('hi-IN') : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <label>अंतिम अपडेट:</label>
                <span>{doctorData?.updatedAt ? new Date(doctorData.updatedAt).toLocaleDateString('hi-IN') : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* <div className="profile-stats">
            <h5>प्रदर्शन सांख्यिकी</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats?.totalChildrenScreened || 0}</span>
                <span className="stat-label">कुल जांच</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats?.positiveCases || 0}</span>
                <span className="stat-label">सकारात्मक मामले</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats?.todayScreenings || 0}</span>
                <span className="stat-label">आज की जांच</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats?.reportsThisWeek || 0}</span>
                <span className="stat-label">इस सप्ताह की रिपोर्ट</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats?.pendingReports || 0}</span>
                <span className="stat-label">लंबित रिपोर्ट</span>
              </div>
            </div>
          </div> */}
          
          {/* <div className="profile-actions">
            <button className="btn-primary" onClick={fetchDoctorProfile}>
              प्रोफाइल रिफ्रेश करें
            </button>
            <button className="btn-secondary" disabled>
              प्रोफाइल संपादित करें
            </button>
            <button className="btn-outline" disabled>
              सेटिंग्स
            </button>
          </div>
        </div>
      </div>
    </div>
  )
            <h5>प्रदर्शन सांख्यिकी</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{mockStats.totalChildrenScreened}</span>
                <span className="stat-label">कुल जांच</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{mockStats.positiveCases}</span>
                <span className="stat-label">सकारात्मक मामले</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{mockStats.reportsThisWeek}</span>
                <span className="stat-label">इस सप्ताह की रिपोर्ट</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{mockStats.pendingReports}</span>
                <span className="stat-label">लंबित रिपोर्ट</span>
              </div>
            </div>
          </div> */}
          
          {/* <div className="profile-actions">
            <button className="btn-primary">प्रोफाइल संपादित करें</button>
            <button className="btn-secondary">पासवर्ड बदलें</button>
            <button className="btn-outline">सेटिंग्स</button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile