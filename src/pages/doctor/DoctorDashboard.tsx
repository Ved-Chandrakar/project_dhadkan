import { useState, useEffect } from 'react'
import { User } from '../../App'
import AddReportForm from './forms/AddReportForm'
import DoctorProfile from './profile/DoctorProfile'
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
  totalTeachers?: number
  totalEmployees?: number
  totalStaff?: number
  staffPositiveCases?: number
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

interface Staff {
  id: number
  name: string
  age: number
  gender: string
  mobileNo: string
  schoolName: string
  haveAadhar: string
  haveShramik: string
  heartStatus: string
  notes: string
  createdat: string
  category: 'शिक्षक' | 'कर्मचारी'
}

const DoctorDashboard = ({ user, onLogout, activeTab: initialActiveTab }: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || 'dashboard')
  const [stats, setStats] = useState<DashboardStats>({
    todayScreenings: 0,
    totalChildrenScreened: 0,
    positiveCases: 0,
    reportsThisWeek: 0,
    pendingReports: 0,
    totalTeachers: 0,
    totalEmployees: 0,
    totalStaff: 0,
    staffPositiveCases: 0
  })
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [staffLoading, setStaffLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // // Add CSS animations and scrollbar styles
  // React.useEffect(() => {
  //   const style = document.createElement('style')
  //   style.textContent = `
  //     .children-table-container::-webkit-scrollbar {
  //       width: 8px;
  //       height: 8px;
  //     }
  //     // .children-table-container::-webkit-scrollbar-track {
  //     //   background: #f1f1f1;
  //     //   border-radius: 4px;
  //     // }
  //     .children-table-container::-webkit-scrollbar-thumb {
  //       background: linear-gradient(180deg, #71a876ff, #3f704fff);
  //       border-radius: 4px;
  //     }
  //     .children-table-container::-webkit-scrollbar-thumb:hover {
  //       background: linear-gradient(180deg, #3f704fff, #71a876ff);
  //     }
  //     .children-table-container::-webkit-scrollbar-corner {
  //       background: #f1f1f1;
  //     }
  //   `
  //   document.head.appendChild(style)
  //   return () => {
  //     if (document.head.contains(style)) {
  //       document.head.removeChild(style)
  //     }
  //   }
  // }, [])

  // Responsive breakpoints
  const isMobile = window.innerWidth <= 768

  // Comprehensive styles object
  const styles = {
    dashboard: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    sidebar: {
      width: isMobile ? '100%' : '280px',
      background: 'linear-gradient(180deg, #71a876ff 0%, #3f704fff 100%)',
      color: 'white',
      position: (isMobile ? 'relative' : 'fixed') as 'relative' | 'fixed',
      height: isMobile ? 'auto' : '100vh',
      overflowY: 'auto' as const,
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    },
    sidebarHeader: {
      padding: '2rem 1.5rem',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      textAlign: 'center' as const
    },
    sidebarLogo: {
      width: '150px',
      maxHeight: '200px',
      objectFit: 'contain' as const,
      marginTop: '-60px',
      marginBottom: '-50px',
      margin: '0 auto'
    },
    sidebarHeaderH2: {
      fontSize: '2rem',
      fontWeight: 'bold' as const,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
    },
    sidebarHeaderP: {
      margin: '0.5rem 0 0 0',
      marginBottom: '-20px',
      opacity: 0.9,
      fontSize: '0.95rem'
    },
    sidebarNav: {
      listStyle: 'none',
      padding: '1rem 0',
      margin: 0
    },
    sidebarNavA: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      color: 'white',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid' as const,
      borderLeftColor: 'transparent',
      cursor: 'pointer'
    },
    sidebarNavAHover: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderLeftColor: 'rgba(255,255,255,0.5)'
    },
    sidebarNavAActive: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderLeftColor: 'white',
      fontWeight: 600
    },
    navIcon: {
      marginRight: '0.75rem',
      fontSize: '1.1rem'
    },
    sidebarFooter: {
      position: (isMobile ? 'relative' : 'absolute') as 'relative' | 'absolute',
      bottom: isMobile ? 'auto' : 0,
      left: 0,
      right: 0,
      padding: '1.5rem',
      borderTop: '1px solid rgba(255,255,255,0.2)'
    },
    userProfile: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    userName: {
      fontSize: '0.95rem',
      margin: '0 0 0.5rem 0',
      fontWeight: 600
    },
    userEmail: {
      fontSize: '0.85rem',
      margin: 0,
      opacity: 0.8
    },
    logoutBtn: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'all 0.3s ease'
    },
    logoutBtnHover: {
      backgroundColor: 'rgba(255,255,255,0.2)'
    },
    mainContent: {
      marginLeft: isMobile ? '0' : '280px',
      minHeight: '100vh',
      background: '#f8f9fa',
      width: isMobile ? '100%' : 'calc(100% - 280px)'
    },
    mainHeader: {
      background: 'white',
      padding: '2rem',
      borderBottom: '1px solid #e9ecef',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    mainHeaderH1: {
      color: '#3f704fff',
      borderRadius: '8px',
      fontSize: '2.5rem',
      margin: '0 0 0.5rem 0',

      fontWeight: 700
    },
    mainHeaderP: {
      margin: 0,
      color: '#6c757d',
      borderRadius: '8px',
      fontSize: '1.1rem'
    },
    contentArea: {
      padding: isMobile ? '1rem' : '2rem'
    },
    contentHeader: {
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'linear-gradient(180deg, #71a876ff 0%, #3f704fff 100%)',
      borderRadius: '8px',
    },
    contentHeaderH3: {
      color: '#ffffff',
      fontSize: '1.8rem',
      margin: '0 0 0.5rem 0',
      fontWeight: 600
    },
    contentHeaderP: {
      margin: 0,
      color: '#ffffff',
      fontSize: '1rem'
    },
    errorMessage: {
      color: 'red',
      marginTop: '10px',
      padding: '1rem',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '6px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    statCardBefore: {
      content: "''",
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      background: 'linear-gradient(90deg, #71a876ff, #3f704fff)'
    },
    statCardH4: {
      color: '#495057',
      fontSize: '0.95rem',
      margin: '0 0 1rem 0',
      fontWeight: 600
    },
    statNumber: {
      color: '#3f704fff',
      fontSize: '2.5rem',
      fontWeight: 'bold' as const,
      margin: '0 0 0.5rem 0',
      lineHeight: 1
    },
    statIcon: {
      position: 'absolute' as const,
      top: '1.5rem',
      right: '1.5rem',
      fontSize: '2rem',
      opacity: 0.3
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '1rem' : '2rem',
      marginTop: '2rem'
    },
    overviewCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    overviewCardH4: {
      color: '#3f704fff',
      fontSize: '1.2rem',
      margin: '0 0 1rem 0',
      fontWeight: 600
    },
    btnSecondary: {
      color: '#3f704fff',
      border: '2px solid #3f704fff',
      background: 'white',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    btnSecondaryHover: {
      background: '#3f704fff',
      color: 'white'
    },
    childrenTableContainer: {
      overflowX: 'auto' as const,
      overflowY: 'auto' as const,
      maxHeight: isMobile ? '400px' : '500px',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative' as const,
      // Custom scrollbar styles
      scrollbarWidth: 'thin' as const,
      scrollbarColor: '#71a876ff #f1f1f1'
    },
    childrenTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      minWidth: '800px',
      borderRadius: '8px',
      tableLayout: 'fixed' as const
    },
    childrenTableTh: {
      background: 'linear-gradient(45deg, #71a876ff, #3f704fff)',
      color: 'white',
      padding: isMobile ? '0.5rem 0.4rem' : '1rem 0.75rem',
      textAlign: 'left' as const,
      fontWeight: 600,
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      borderBottom: '2px solid #3f704fff',
      position: 'sticky' as const,
      top: 0,
      zIndex: 10,
      whiteSpace: 'nowrap' as const
    },
    childrenTableTd: {
      padding: isMobile ? '0.5rem 0.4rem' : '1rem 0.75rem',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
      fontSize: isMobile ? '0.75rem' : '0.9rem',
      color: '#495057',
      wordWrap: 'break-word' as const,
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    childrenTableTr: {
      transition: 'background-color 0.2s ease'
    },
    childrenTableTrHover: {
      backgroundColor: '#e8f5e8',
      cursor: 'pointer'
    },
    childrenTableTrEven: {
      backgroundColor: '#f8f9fa'
    },
    childNameCell: {
      fontWeight: 600,
      color: '#3f704fff'
    },
    loadingMessage: {
      textAlign: 'center' as const,
      padding: '2rem'
    },
    noDataMessage: {
      textAlign: 'center' as const,
      padding: '3rem 2rem',
      color: '#6c757d'
    },
    noDataMessageP: {
      margin: '0.5rem 0',
      fontSize: '1rem'
    },
    noDataMessagePFirst: {
      fontWeight: 600,
      color: '#495057'
    },
    statusBadge: {
      padding: isMobile ? '0.2rem 0.5rem' : '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      fontWeight: 600,
      textAlign: 'center' as const,
      minWidth: '60px'
    },
    statusHealthy: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    statusUnhealthy: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    backBtn: {
      background: '#3f704fff',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      marginBottom: '1rem',
      transition: 'background 0.3s ease'
    },
    backBtnHover: {
      background: '#71a876ff'
    }
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '◊' },
    { id: 'addReport', label: 'नई रिपोर्ट', icon: '✎' },
    { id: 'profile', label: 'प्रोफाइल', icon: '👤' }
  ]

  // API Base URL - adjust this according to your setup
  const API_BASE_URL = `${serverUrl}dhadkan_doctor_api.php`

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

  // Fetch staff list (teachers and employees)
  const fetchStaffList = async () => {
    try {
      setStaffLoading(true)
      const response = await fetch(`${API_BASE_URL}?action=get_teacher_employee_list&doctor_id=${user.id}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        setStaffList(data.data.staff || [])
      } else {
        console.error('Failed to fetch staff list:', data.message)
      }
    } catch (error) {
      console.error('Error fetching staff list:', error)
    } finally {
      setStaffLoading(false)
    }
  }

  // Load data when component mounts or when switching to dashboard
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDoctorStats()
      fetchChildrenList()
      fetchStaffList()
    }
  }, [activeTab, user.id])

  // Refresh data function
  const refreshData = () => {
    fetchDoctorStats()
    fetchChildrenList()
    fetchStaffList()
  }

  const renderDashboard = () => (
    <div>
      <div style={styles.contentHeader}>
        <h3 style={styles.contentHeaderH3}>डैशबोर्ड अवलोकन</h3>
        <p style={styles.contentHeaderP}>बच्चों की स्वास्थ्य जांच सेवा</p>
        {error && (
          <div style={styles.errorMessage}>
            {error}
            <button onClick={refreshData} style={{marginLeft: '10px', padding: '5px 10px'}}>
              पुनः प्रयास करें
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statCardBefore}></div>
          <h4 style={styles.statCardH4}>कुल जांच किए गए बच्चे</h4>
          <p style={styles.statNumber}>
            {loading ? '...' : stats.totalChildrenScreened}
          </p>
          <span style={styles.statIcon}>◆</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statCardBefore}></div>
          <h4 style={styles.statCardH4}>बच्चों में संदिग्ध मामले</h4>
          <p style={styles.statNumber}>
            {loading ? '...' : stats.positiveCases}
          </p>
          <span style={styles.statIcon}>⚠</span>
        </div>
        {/* <div style={styles.statCard}>
          <div style={styles.statCardBefore}></div>
          <h4 style={styles.statCardH4}>आज की जांच</h4>
          <p style={styles.statNumber}>
            {loading ? '...' : stats.todayScreenings}
          </p>
          <span style={styles.statIcon}>📅</span>
        </div> */}
        <div style={styles.statCard}>
          <div style={styles.statCardBefore}></div>
          <h4 style={styles.statCardH4}>कुल स्टाफ (शिक्षक + कर्मचारी)</h4>
          <p style={styles.statNumber}>
            {loading ? '...' : (stats.totalStaff || 0)}
          </p>
          <span style={styles.statIcon}>👥</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statCardBefore}></div>
          <h4 style={styles.statCardH4}>स्टाफ संदिग्ध मामले</h4>
          <p style={styles.statNumber}>
            {loading ? '...' : (stats.staffPositiveCases || 0)}
          </p>
          <span style={styles.statIcon}>⚠</span>
        </div>
      </div>

      <div style={styles.overviewGrid}>
        <div style={styles.overviewCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h4 style={styles.overviewCardH4}>इलाज किए गए बच्चे</h4>
            <button 
              onClick={refreshData} 
              style={{
                ...styles.btnSecondary,
                ...(loading ? {opacity: 0.6, cursor: 'not-allowed'} : {})
              }}
              disabled={loading}
            >
              {loading ? 'लोड हो रहा है...' : 'रिफ्रेश करें'}
            </button>
          </div>
          <div style={styles.childrenTableContainer} className="children-table-container">
            {loading ? (
              <div style={styles.loadingMessage}>
                <p>डेटा लोड हो रहा है...</p>
              </div>
            ) : childrenList.length > 0 ? (
              <>
                <div style={{
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#f8f9fa',
                  padding: '0.5rem',
                  borderBottom: '1px solid #e9ecef',
                  fontSize: '0.85rem',
                  color: '#6c757d',
                  zIndex: 5
                }}>
                  {/* कुल {childrenList.length} बच्चों की रिपोर्ट्स | स्क्रॉल करके अधिक देखें */}
                </div>
                <table style={styles.childrenTable}>
                  <thead>
                    <tr>
                      <th style={{...styles.childrenTableTh, width: '60px'}}>क्रम</th>
                      <th style={{...styles.childrenTableTh, width: '150px'}}>नाम</th>
                      <th style={{...styles.childrenTableTh, width: '80px'}}>उम्र</th>
                      <th style={{...styles.childrenTableTh, width: '80px'}}>लिंग</th>
                      <th style={{...styles.childrenTableTh, width: '150px'}}>पिता का नाम</th>
                      <th style={{...styles.childrenTableTh, width: '120px'}}>मोबाइल</th>
                      <th style={{...styles.childrenTableTh, width: '150px'}}>स्कूल</th>
                      <th style={{...styles.childrenTableTh, width: '120px'}}>हृदय स्थिति</th>
                      <th style={{...styles.childrenTableTh, width: '120px'}}>जांच तिथि</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childrenList.map((child, index) => (
                      <tr 
                        key={child.id} 
                        style={{
                          ...styles.childrenTableTr,
                          ...(index % 2 === 1 ? styles.childrenTableTrEven : {})
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e8f5e8'
                          e.currentTarget.style.cursor = 'pointer'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = index % 2 === 1 ? '#f8f9fa' : 'transparent'
                        }}
                      >
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{index + 1}</td>
                        <td style={{...styles.childrenTableTd, ...styles.childNameCell}} title={child.name}>{child.name}</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{child.age || 0} वर्ष</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{child.gender}</td>
                        <td style={styles.childrenTableTd} title={child.fatherName}>{child.fatherName}</td>
                        <td style={styles.childrenTableTd}>{child.mobileNo}</td>
                        <td style={styles.childrenTableTd} title={child.schoolName}>{child.schoolName}</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>
                          <span style={{
                            ...styles.statusBadge,
                            ...(child.heartStatus === 'संदिग्ध' ? styles.statusUnhealthy : styles.statusHealthy)
                          }}>
                            {child.heartStatus}
                          </span>
                        </td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{new Date(child.createdat).toLocaleDateString('hi-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={styles.noDataMessage}>
                <p style={{...styles.noDataMessageP, ...styles.noDataMessagePFirst}}>अभी तक कोई बच्चों की जांच नहीं की गई है।</p>
                <p style={styles.noDataMessageP}>नई रिपोर्ट जोड़ने के लिए "नई रिपोर्ट" पर क्लिक करें।</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Staff Table */}
        <div style={styles.overviewCard}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h4 style={styles.overviewCardH4}>स्टाफ की जांच (शिक्षक और कर्मचारी)</h4>
            <button 
              onClick={refreshData} 
              style={{
                ...styles.btnSecondary,
                ...(staffLoading ? {opacity: 0.6, cursor: 'not-allowed'} : {})
              }}
              disabled={staffLoading}
            >
              {staffLoading ? 'लोड हो रहा है...' : 'रिफ्रेश करें'}
            </button>
          </div>
          <div style={styles.childrenTableContainer} className="children-table-container">
            {staffLoading ? (
              <div style={styles.loadingMessage}>
                <p>स्टाफ डेटा लोड हो रहा है...</p>
              </div>
            ) : staffList.length > 0 ? (
              <>
                <div style={{
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#f8f9fa',
                  padding: '0.5rem',
                  borderBottom: '1px solid #e9ecef',
                  fontSize: '0.85rem',
                  color: '#6c757d',
                  zIndex: 5
                }}>
                  कुल {staffList.length} स्टाफ सदस्यों की रिपोर्ट्स
                </div>
                <table style={styles.childrenTable}>
                  <thead>
                    <tr>
                      <th style={{...styles.childrenTableTh, width: '60px'}}>क्रम</th>
                      <th style={{...styles.childrenTableTh, width: '150px'}}>नाम</th>
                      <th style={{...styles.childrenTableTh, width: '80px'}}>उम्र</th>
                      <th style={{...styles.childrenTableTh, width: '80px'}}>लिंग</th>
                      <th style={{...styles.childrenTableTh, width: '100px'}}>श्रेणी</th>
                      <th style={{...styles.childrenTableTh, width: '120px'}}>मोबाइल</th>
                      <th style={{...styles.childrenTableTh, width: '150px'}}>स्कूल</th>
                      <th style={{...styles.childrenTableTh, width: '120px'}}>हृदय स्थिति</th>
                      <th style={{...styles.childrenTableTh, width: '120px'}}>जांच तिथि</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff, index) => (
                      <tr 
                        key={staff.id} 
                        style={{
                          ...styles.childrenTableTr,
                          ...(index % 2 === 1 ? styles.childrenTableTrEven : {})
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e8f5e8'
                          e.currentTarget.style.cursor = 'pointer'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = index % 2 === 1 ? '#f8f9fa' : 'transparent'
                        }}
                      >
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{index + 1}</td>
                        <td style={{...styles.childrenTableTd, ...styles.childNameCell}} title={staff.name}>{staff.name}</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{staff.age || 0} वर्ष</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{staff.gender}</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            backgroundColor: staff.category === 'शिक्षक' ? '#e3f2fd' : '#f3e5f5',
                            color: staff.category === 'शिक्षक' ? '#1976d2' : '#7b1fa2'
                          }}>
                            {staff.category}
                          </span>
                        </td>
                        <td style={styles.childrenTableTd}>{staff.mobileNo}</td>
                        <td style={styles.childrenTableTd} title={staff.schoolName}>{staff.schoolName}</td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>
                          <span style={{
                            ...styles.statusBadge,
                            ...(staff.heartStatus === 'संदिग्ध' ? styles.statusUnhealthy : styles.statusHealthy)
                          }}>
                            {staff.heartStatus}
                          </span>
                        </td>
                        <td style={{...styles.childrenTableTd, textAlign: 'center'}}>{new Date(staff.createdat).toLocaleDateString('hi-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={styles.noDataMessage}>
                <p style={{...styles.noDataMessageP, ...styles.noDataMessagePFirst}}>अभी तक कोई स्टाफ की जांच नहीं की गई है।</p>
                <p style={styles.noDataMessageP}>नई रिपोर्ट जोड़ने के लिए "नई रिपोर्ट" पर क्लिक करें।</p>
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
        />
      case 'profile':
        return <DoctorProfile user={user} />
      default:
        return renderDashboard()
    }
  }

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img 
            src="/dhadkan_logo1.png" 
            alt="धड़कन लोगो" 
            style={styles.sidebarLogo}
          />
          <p style={{
            ...styles.sidebarHeaderP,
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
            marginTop: '0.5rem'
          }}>चिकित्सक पैनल</p>
        </div>
        
        <nav>
          <ul style={styles.sidebarNav}>
            {menuItems.map(item => (
              <li key={item.id}>
                <a
                  href="#"
                  style={{
                    ...styles.sidebarNavA,
                    ...(activeTab === item.id ? styles.sidebarNavAActive : {})
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(item.id)
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.borderLeftColor = 'transparent'
                    }
                  }}
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={{
            textAlign: 'center' as const,
            padding: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '1rem'
          }}>
            Version: 1.0.0
          </div>
          <div style={styles.userProfile}>
            <p style={styles.userName}>🩺{user.name}</p>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
          <button 
            onClick={onLogout} 
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
            }}
          >
            लॉगआउट
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* <header style={styles.mainHeader}>
          <h1 style={styles.mainHeaderH1}>चिकित्सक डैशबोर्ड</h1>
          <p style={styles.mainHeaderP}>बच्चों की स्वास्थ्य जांच और देखभाल</p>
        </header> */}

        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
