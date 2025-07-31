import { useState, useEffect } from 'react'
import { User } from '../../App'
import AddReportForm from '../../components/AddReportForm'
import DoctorProfile from '../../components/DoctorProfile'
import './DoctorDashboard.css'
import serverUrl from '../server'

interface DoctorDashboardProps {
  user: User
  onLogout: () => void
  activeTab?: string
}

interface MenuItem {
  id: string
  label: string
  icon: string
}

interface DashboardStats {
  todayScreenings: number
  totalChildrenScreened: number
  positiveCases: number
  reportsThisWeek?: number
  pendingReports?: number
}

interface Child {
  id: number
  name: string
  age: number
  gender: string
  fatherName: string
  mobileNo: string
  schoolName: string
  haveAadhar: string
  haveShramik: string
  heartStatus: string
  notes: string
  createdat: string
}

const DoctorDashboard = ({ user, onLogout, activeTab: initialActiveTab }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'dashboard')
  const [stats, setStats] = useState<DashboardStats>({
    todayScreenings: 0,
    totalChildrenScreened: 0,
    positiveCases: 0,
    reportsThisWeek: 0,
    pendingReports: 0
  })
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '📊' },
    { id: 'addReport', label: 'नई रिपोर्ट', icon: '📝' },
    { id: 'profile', label: 'प्रोफाइल', icon: '👤' }
  ]

  // API Base URL - adjust this according to your setup
  const API_BASE_URL = `${serverUrl}doctor_api.php`

  // Fetch doctor statistics
  const fetchDoctorStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}?action=get_doctor_stats&doctor_id=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.message || 'Failed to fetch statistics')
      }
    } catch (error) {
      console.error('Error fetching doctor stats:', error)
      setError('Error fetching statistics')
    } finally {
      setLoading(false)
    }
  }

  // Fetch children list
  const fetchChildrenList = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}?action=get_children_list&doctor_id=${user.id}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        setChildrenList(data.data.children || [])
      } else {
        setError(data.message || 'Failed to fetch children list')
      }
    } catch (error) {
      console.error('Error fetching children list:', error)
      setError('Error fetching children list')
    } finally {
      setLoading(false)
    }
  }

  // Load data when component mounts or when switching to dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDoctorStats()
      fetchChildrenList()
    }
  }, [activeTab, user.id])

  // Refresh data function
  const refreshData = () => {
    fetchDoctorStats()
    fetchChildrenList()
  }

  const renderDashboard = () => (
    <div>
      <div className="content-header">
        <h3>डैशबोर्ड अवलोकन</h3>
        <p>बच्चों की स्वास्थ्य जांच सेवा</p>
        {error && (
          <div className="error-message" style={{color: 'red', marginTop: '10px'}}>
            {error}
            <button onClick={refreshData} style={{marginLeft: '10px', padding: '5px 10px'}}>
              पुनः प्रयास करें
            </button>
          </div>
        )}
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>कुल जांच किए गए बच्चे</h4>
          <p className="stat-number">
            {loading ? '...' : stats.totalChildrenScreened}
          </p>
          <span className="stat-icon">👶</span>
        </div>
        <div className="stat-card">
          <h4>संदिग्ध मामले</h4>
          <p className="stat-number">
            {loading ? '...' : stats.positiveCases}
          </p>
          <span className="stat-icon">⚠️</span>
        </div>
        <div className="stat-card">
          <h4>आज की जांच</h4>
          <p className="stat-number">
            {loading ? '...' : stats.todayScreenings}
          </p>
          <span className="stat-icon">📅</span>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h4>इलाज किए गए बच्चे</h4>
            <button 
              onClick={refreshData} 
              className="btn-secondary"
              disabled={loading}
              style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}
            >
              {loading ? 'लोड हो रहा है...' : 'रिफ्रेश करें'}
            </button>
          </div>
          <div className="children-table-container">
            {loading ? (
              <div className="loading-message" style={{textAlign: 'center', padding: '2rem'}}>
                <p>डेटा लोड हो रहा है...</p>
              </div>
            ) : childrenList.length > 0 ? (
              <table className="children-table">
                <thead>
                  <tr>
                    <th>क्रम</th>
                    <th>नाम</th>
                    <th>उम्र</th>
                    <th>लिंग</th>
                    <th>पिता का नाम</th>
                    <th>मोबाइल</th>
                    <th>स्कूल</th>
                    <th>हृदय स्थिति</th>
                    <th>जांच तिथि</th>
                  </tr>
                </thead>
                <tbody>
                  {childrenList.map((child, index) => (
                    <tr key={child.id}>
                      <td>{index + 1}</td>
                      <td className="child-name-cell">{child.name}</td>
                      <td>{child.age} वर्ष</td>
                      <td>{child.gender}</td>
                      <td>{child.fatherName}</td>
                      <td>{child.mobileNo}</td>
                      <td>{child.schoolName}</td>
                      <td>
                        <span className={`status-badge ${child.heartStatus === 'संदिग्ध' ? 'status-unhealthy' : 'status-healthy'}`}>
                          {child.heartStatus}
                        </span>
                      </td>
                      <td>{new Date(child.createdat).toLocaleDateString('hi-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data-message">
                <p>अभी तक कोई बच्चों की जांच नहीं की गई है।</p>
                <p>नई रिपोर्ट जोड़ने के लिए "नई रिपोर्ट" पर क्लिक करें।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'addReport':
        return <AddReportForm 
          user={user} 
          onBack={() => {
            setActiveTab('dashboard')
            // Refresh data when returning from add report form
            setTimeout(() => {
              fetchDoctorStats()
              fetchChildrenList()
            }, 100)
          }} 
        />
      case 'profile':
        return <DoctorProfile user={user} onBack={() => setActiveTab('dashboard')} />
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar doctor-sidebar">
        <div className="sidebar-header">
          <h2>धड़कन</h2>
          <p>चिकित्सक पैनल</p>
        </div>
        
        <nav>
          <ul className="sidebar-nav">
            {menuItems.map(item => (
              <li key={item.id}>
                <a
                  href="#"
                  className={activeTab === item.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(item.id)
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <p className="user-name">👩‍⚕️ {user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            लॉगआउट
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>चिकित्सक डैशबोर्ड</h1>
          <p>बच्चों की स्वास्थ्य जांच और देखभाल</p>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
