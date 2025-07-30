import { useState } from 'react'
import { User } from '../../App'
import DoctorManagement from './doctors/DoctorManagement'
import ChildrenReports from './children/ChildrenReports'
import './AdminDashboard.css'

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
  todayScreenings: number
  totalDoctors: number
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

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '📊' },
    { id: 'doctors', label: 'चिकित्सक प्रबंधन', icon: '👩‍⚕️' },
    { id: 'childReports', label: 'बच्चों की रिपोर्ट', icon: '👶' }
  ]

  // Mock data - replace with actual API calls
  const dashboardStats: DashboardStats = {
    totalChildrenScreened: 2450,
    positiveCases: 185,
    todayScreenings: 45,
    totalDoctors: 12
  }

  const mockChildren: Child[] = [
    {
      id: 1,
      name: 'राहुल कुमार',
      age: 8,
      parentName: 'सुनील कुमार',
      phone: '9876543210',
      screeningDate: '2025-01-29',
      status: 'स्वस्थ',
      doctorName: 'डॉ. प्रिया शर्मा'
    },
    {
      id: 2,
      name: 'आरती देवी',
      age: 6,
      parentName: 'राज कुमार',
      phone: '9876543211',
      screeningDate: '2025-01-29',
      status: 'असामान्य',
      doctorName: 'डॉ. अमित वर्मा'
    },
    {
      id: 3,
      name: 'विकास शर्मा',
      age: 7,
      parentName: 'मोहन शर्मा',
      phone: '9876543212',
      screeningDate: '2025-01-28',
      status: 'स्वस्थ',
      doctorName: 'डॉ. सुनीता गुप्ता'
    }
  ]

  const healthyChildren = mockChildren.filter(child => child.status === 'स्वस्थ').length
  const unhealthyChildren = mockChildren.filter(child => child.status === 'असामान्य').length

  const renderDashboard = () => (
    <div>
      <div className="content-header">
        <h3>डैशबोर्ड अवलोकन</h3>
        <p>बच्चों की स्वास्थ्य जांच प्रणाली</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>कुल जांच किए गए बच्चे</h4>
          <p className="stat-number">{dashboardStats.totalChildrenScreened}</p>
          {/* <span className="stat-icon">👶</span> */}
        </div>
        <div className="stat-card">
          <h4>संदिग्ध मामले</h4>
          <p className="stat-number">{dashboardStats.positiveCases}</p>
          {/* <span className="stat-icon">⚠️</span> */}
        </div>
        <div className="stat-card">
          <h4>आज की जांच</h4>
          <p className="stat-number">{dashboardStats.todayScreenings}</p>
          {/* <span className="stat-icon">📅</span> */}
        </div>
        <div className="stat-card">
          <h4>कुल चिकित्सक</h4>
          <p className="stat-number">{dashboardStats.totalDoctors}</p>
          {/* <span className="stat-icon">👩‍⚕️</span> */}
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <h4>मामलों की तुलना</h4>
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
                <span>संदिग्ध: {unhealthyChildren} ({Math.round((unhealthyChildren / mockChildren.length) * 100)}%)</span>
              </div>
              <div className="summary-item">
                <span className="summary-color healthy"></span>
                <span>स्वस्थ: {healthyChildren} ({Math.round((healthyChildren / mockChildren.length) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h4>स्वास्थ्य सांख्यिकी</h4>
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
              <span className="health-value">{Math.round((healthyChildren / mockChildren.length) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

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
        {/* <header className="main-header">
          <h1>प्रशासक डैशबोर्ड</h1>
          <p>बच्चों की स्वास्थ्य जांच प्रणाली का प्रबंधन</p>
        </header> */}

        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
