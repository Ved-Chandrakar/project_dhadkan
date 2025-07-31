import { useState, useEffect } from 'react'
import { User } from '../../App'
import DoctorManagement from './doctors/DoctorManagement'
import ChildrenReports from './children/ChildrenReports'
import './AdminDashboard.css'
import serverUrl from '../server'

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: string
}

interface DashboardStats {
  totalChildrenScreened: number
  positiveCases: number
  healthyCases: number
  todayScreenings: number
  totalDoctors: number
  activeDoctors: number
  thisWeekScreenings: number
  thisMonthScreenings: number
  healthyPercentage: number
  suspiciousPercentage: number
  weeklyGrowth: number
}

interface Child {
  id: number
  name: string
  age: number
  parentName: string
  phone: string
  screeningDate: string
  status: 'स्वस्थ' | 'असामान्य'
  doctorName: string
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalChildrenScreened: 0,
    positiveCases: 0,
    healthyCases: 0,
    todayScreenings: 0,
    totalDoctors: 0,
    activeDoctors: 0,
    thisWeekScreenings: 0,
    thisMonthScreenings: 0,
    healthyPercentage: 0,
    suspiciousPercentage: 0,
    weeklyGrowth: 0
  })
  const [children, setChildren] = useState<Child[]>([])

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '📊' },
    { id: 'doctors', label: 'चिकित्सक प्रबंधन', icon: '👩‍⚕️' },
    { id: 'childReports', label: 'बच्चों की रिपोर्ट', icon: '👶' }
  ]

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`${serverUrl}admin_dashboard.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.data) {
        const data = result.data
        
        setDashboardStats({
          totalChildrenScreened: data.totalChildrenScreened || 0,
          positiveCases: data.positiveCases || 0,
          healthyCases: data.healthyCases || 0,
          todayScreenings: data.todayScreenings || 0,
          totalDoctors: data.totalDoctors || 0,
          activeDoctors: data.activeDoctors || 0,
          thisWeekScreenings: data.thisWeekScreenings || 0,
          thisMonthScreenings: data.thisMonthScreenings || 0,
          healthyPercentage: data.healthyPercentage || 0,
          suspiciousPercentage: data.suspiciousPercentage || 0,
          weeklyGrowth: data.weeklyGrowth || 0
        })
        
        const recentChildren = data.recentChildren || []
        setChildren(recentChildren.map((child: any) => ({
          id: child.id,
          name: child.name,
          age: child.age,
          parentName: child.parentName,
          phone: child.phone,
          screeningDate: child.screeningDate,
          status: child.status,
          doctorName: child.doctorName
        })))
        
      } else {
        setError(result.message || 'API से डेटा लोड करने में त्रुटि')
        console.error('API Error:', result.message)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`नेटवर्क त्रुटि: ${errorMessage}`)
      console.error('Error fetching dashboard data:', error)
      
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const healthyChildren = children.filter(child => child.status === 'स्वस्थ').length
  const unhealthyChildren = children.filter(child => child.status === 'असामान्य').length

  // Function to refresh dashboard data
  const refreshDashboard = () => {
    fetchDashboardData()
  }

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <h3>डेटा लोड हो रहा है...</h3>
            <p>कृपया प्रतीक्षा करें</p>
          </div>
        </div>
      )
    }

    if (error && dashboardStats.totalChildrenScreened === 0) {
      return (
        <div className="error-container">
          <div className="error-content">
            <h3>❌ डेटा लोड नहीं हो सका</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={refreshDashboard}
            >
              🔄 पुनः प्रयास करें
            </button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="content-header">
          <div className="header-left">
            <h3>डैशबोर्ड अवलोकन</h3>
            <p>बच्चों की स्वास्थ्य जांच प्रणाली</p>
          </div>
          <div className="header-right">
            <button 
              className="refresh-btn"
              onClick={refreshDashboard}
              disabled={isLoading}
              title="डेटा रीफ्रेश करें"
            >
              {isLoading ? '🔄' : '🔄'} रीफ्रेश
            </button>
          </div>
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
              <span className="error-note">(डेटा लोड नहीं हो सका - कृपया रीफ्रेश करें)</span>
            </div>
          )}
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h4>कुल जांच किए गए बच्चे</h4>
            <p className="stat-number">{dashboardStats.totalChildrenScreened}</p>
            <small className="stat-subtitle">स्वस्थ: {dashboardStats.healthyCases} | संदिग्ध: {dashboardStats.positiveCases}</small>
          </div>
          <div className="stat-card">
            <h4>संदिग्ध मामले</h4>
            <p className="stat-number">{dashboardStats.positiveCases}</p>
            <small className="stat-subtitle">{dashboardStats.suspiciousPercentage.toFixed(1)}% कुल जांच का</small>
          </div>
          <div className="stat-card">
            <h4>आज की जांच</h4>
            <p className="stat-number">{dashboardStats.todayScreenings}</p>
            <small className="stat-subtitle">इस सप्ताह: {dashboardStats.thisWeekScreenings}</small>
          </div>
          <div className="stat-card">
            <h4>कुल चिकित्सक</h4>
            <p className="stat-number">{dashboardStats.totalDoctors}</p>
            <small className="stat-subtitle">सक्रिय: {dashboardStats.activeDoctors}</small>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="stats-grid secondary-stats">
          <div className="stat-card">
            <h4>इस महीने की जांच</h4>
            <p className="stat-number">{dashboardStats.thisMonthScreenings}</p>
            <small className="stat-subtitle">
              {dashboardStats.weeklyGrowth >= 0 ? '📈' : '📉'} 
              {Math.abs(dashboardStats.weeklyGrowth).toFixed(1)}% साप्ताहिक वृद्धि
            </small>
          </div>
          <div className="stat-card">
            <h4>स्वस्थता दर</h4>
            <p className="stat-number">{dashboardStats.healthyPercentage.toFixed(1)}%</p>
            <small className="stat-subtitle">स्वस्थ बच्चे: {dashboardStats.healthyCases}</small>
          </div>
          <div className="stat-card">
            <h4>इस सप्ताह</h4>
            <p className="stat-number">{dashboardStats.thisWeekScreenings}</p>
            <small className="stat-subtitle">
              {dashboardStats.weeklyGrowth >= 0 ? 'वृद्धि' : 'कमी'}: {Math.abs(dashboardStats.weeklyGrowth).toFixed(1)}%
            </small>
          </div>
          <div className="stat-card">
            <h4>औसत दैनिक जांच</h4>
            <p className="stat-number">{Math.round(dashboardStats.thisWeekScreenings / 7)}</p>
            <small className="stat-subtitle">पिछले 7 दिनों का औसत</small>
          </div>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <h4>मामलों की तुलना</h4>
            {children.length > 0 ? (
              <div className="comparison-chart">
                <div className="chart-container">
                  <div className="y-axis">
                    <div className="y-label">संदिग्ध मामले</div>
                    <div className="y-label">स्वस्थ मामले</div>
                  </div>
                  <div className="chart-bars">
                    <div className="bar-group">
                      <div className="bar suspected" style={{width: `${(unhealthyChildren / Math.max(healthyChildren, unhealthyChildren)) * 100}%`}}>
                        <span className="bar-value">{unhealthyChildren}</span>
                      </div>
                    </div>
                    <div className="bar-group">
                      <div className="bar healthy" style={{width: `${(healthyChildren / Math.max(healthyChildren, unhealthyChildren)) * 100}%`}}>
                        <span className="bar-value">{healthyChildren}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chart-summary">
                  <div className="summary-item">
                    <span className="summary-color suspected"></span>
                    <span>संदिग्ध: {unhealthyChildren} ({Math.round((unhealthyChildren / children.length) * 100)}%)</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-color healthy"></span>
                    <span>स्वस्थ: {healthyChildren} ({Math.round((healthyChildren / children.length) * 100)}%)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data-message">
                <p>📊 चार्ट डेटा उपलब्ध नहीं है</p>
              </div>
            )}
          </div>

          <div className="overview-card">
            <h4>स्वास्थ्य सांख्यिकी</h4>
            {children.length > 0 ? (
              <div className="health-stats">
                <div className="health-stat">
                  <span className="health-label">स्वस्थ बच्चे</span>
                  <span className="health-value healthy">{healthyChildren}</span>
                </div>
                <div className="health-stat">
                  <span className="health-label">असामान्य मामले</span>
                  <span className="health-value unhealthy">{unhealthyChildren}</span>
                </div>
                <div className="health-stat">
                  <span className="health-label">स्वस्थता दर</span>
                  <span className="health-value">{Math.round((healthyChildren / children.length) * 100)}%</span>
                </div>
              </div>
            ) : (
              <div className="no-data-message">
                <p>📈 सांख्यिकी डेटा उपलब्ध नहीं है</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'doctors':
        return <DoctorManagement user={user} onBack={() => setActiveTab('dashboard')} />
      case 'childReports':
        return <ChildrenReports user={user} onBack={() => setActiveTab('dashboard')} />
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>धड़कन</h2>
          <p>प्रशासक पैनल</p>
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
            <p className="user-name">👤 {user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            लॉगआउट
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
