import { useState } from 'react'
import { User } from '../../App'
import AddReportForm from '../../components/AddReportForm'
import DoctorProfile from '../../components/DoctorProfile'
import './DoctorDashboard.css'

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
}

const DoctorDashboard = ({ user, onLogout, activeTab: initialActiveTab }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'dashboard')

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '📊' },
    { id: 'addReport', label: 'नई रिपोर्ट', icon: '📝' },
    { id: 'profile', label: 'प्रोफाइल', icon: '👤' }
  ]

  const mockStats: DashboardStats = {
    todayScreenings: 8,
    totalChildrenScreened: 156,
    positiveCases: 12
  }

  // Mock children data based on schema for logged-in doctor
  const childrenList = [
    {
      id: 1,
      name: 'राहुल कुमार',
      age: 8,
      gender: 'पुरुष' as const,
      fatherName: 'रमेश कुमार',
      mobileNo: '9876543210',
      schoolName: 'सरकारी प्राथमिक विद्यालय',
      heartStatus: 'संदेह नहीं' as const,
      createdat: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'प्रिया शर्मा',
      age: 7,
      gender: 'महिला' as const,
      fatherName: 'विकास शर्मा',
      mobileNo: '9876543211',
      schoolName: 'गवर्नमेंट स्कूल',
      heartStatus: 'संदिग्ध' as const,
      createdat: '2024-01-14T14:20:00Z'
    },
    {
      id: 3,
      name: 'अमित वर्मा',
      age: 9,
      gender: 'पुरुष' as const,
      fatherName: 'सुनील वर्मा',
      mobileNo: '9876543212',
      schoolName: 'पब्लिक स्कूल',
      heartStatus: 'संदेह नहीं' as const,
      createdat: '2024-01-13T16:45:00Z'
    },
    {
      id: 4,
      name: 'काजल सिंह',
      age: 6,
      gender: 'महिला' as const,
      fatherName: 'राजेश सिंह',
      mobileNo: '9876543213',
      schoolName: 'सरकारी विद्यालय',
      heartStatus: 'संदिग्ध' as const,
      createdat: '2024-01-12T11:15:00Z'
    }
  ]

  const renderDashboard = () => (
    <div>
      <div className="content-header">
        <h3>डैशबोर्ड अवलोकन</h3>
        <p>बच्चों की स्वास्थ्य जांच सेवा</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>कुल जांच किए गए बच्चे</h4>
          <p className="stat-number">{mockStats.totalChildrenScreened}</p>
          <span className="stat-icon">👶</span>
        </div>
        <div className="stat-card">
          <h4>संदिग्ध मामले</h4>
          <p className="stat-number">{mockStats.positiveCases}</p>
          <span className="stat-icon">⚠️</span>
        </div>
        <div className="stat-card">
          <h4>आज की जांच</h4>
          <p className="stat-number">{mockStats.todayScreenings}</p>
          <span className="stat-icon">📅</span>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <h4>इलाज किए गए बच्चे</h4>
          <div className="children-table-container">
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
        return <AddReportForm user={user} onBack={() => setActiveTab('dashboard')} />
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
