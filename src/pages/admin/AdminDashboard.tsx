import { useState, useEffect } from 'react'
import { User } from '../../App'
import DoctorManagement from './doctors/DoctorManagement'
import ChildrenReports from './children/ChildrenReports'
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

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768

  // Inline Styles
  const styles = {
    dashboard: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    sidebar: {
      width: isMobile ? '100%' : '280px',
      background: 'linear-gradient(180deg, #6078a4 0%, #2f4b80 50%, #0b0f2b 100%)',
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
    sidebarNavLi: {
      margin: 0
    },
    sidebarNavA: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      color: 'white',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      borderLeft: '4px solid transparent',
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
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)',
      padding: '0.75rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'all 0.3s ease'
    },
    logoutBtnHover: {
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderColor: 'rgba(255,255,255,0.5)'
    },
    mainContent: {
      flex: 1,
      marginLeft: isMobile ? 0 : '280px',
      padding: isMobile ? '1rem' : '2rem'
    },
    contentArea: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #e9ecef'
    },
    contentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      background: 'linear-gradient(135deg, #6078a4 0%, #2f4b80 50%, #0b0f2b 100%)',
      marginBottom: '1.5rem',
      flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
      gap: isMobile ? '1rem' : '0',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(11, 15, 43, 0.3)'
    },
    headerLeft: {
      flex: 1
    },
    contentHeaderH3: {
      color: 'white',
      fontSize: '1.8rem',
      margin: '0 0 0.5rem 0',
      fontWeight: 600
    },
    contentHeaderP: {
      color: 'rgba(255, 255, 255, 0.9)',
      margin: '0 0 1.5rem 0',
      fontSize: '1rem'
    },
    headerRight: {
      display: 'flex',
      gap: '1rem'
    },
    refreshBtn: {
      background: 'linear-gradient(135deg, #6078a4 0%, #2f4b80 50%, #0b0f2b 100%)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem'
    },
    refreshBtnHover: {
      background: 'linear-gradient(135deg, #2f4b80 0%, #0b0f2b 50%, #6078a4 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(96, 120, 164, 0.3)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    statCardBefore: {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #6078a4 0%, #2f4b80 50%, #0b0f2b 100%)'
    },
    statCardH4: {
      color: '#495057',
      fontSize: '0.9rem',
      margin: '0 0 0.5rem 0',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold' as const,
      margin: 0,
      color: '#6078a4'
    },
    statSubtitle: {
      fontSize: '0.8rem',
      color: '#6c757d',
      marginTop: '0.5rem'
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '2rem',
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
      color: '#6078a4',
      fontSize: '1.2rem',
      margin: '0 0 1rem 0',
      fontWeight: 600
    },
    healthStats: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem'
    },
    healthStat: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    healthLabel: {
      fontWeight: 600,
      color: '#495057'
    },
    healthValue: {
      fontWeight: 'bold' as const,
      fontSize: '1.1rem',
      color: '#6078a4'
    },
    healthValueHealthy: {
      color: '#28a745'
    },
    healthValueUnhealthy: {
      color: '#dc3545'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
      margin: '2rem'
    },
    loadingSpinner: {
      textAlign: 'center' as const,
      padding: '2rem'
    },
    loadingSpinnerH3: {
      color: '#6078a4',
      fontSize: '1.5rem',
      margin: '0 0 0.5rem 0',
      fontWeight: 600
    },
    loadingSpinnerP: {
      color: '#6c757d',
      margin: 0,
      fontSize: '1rem'
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
      margin: '2rem'
    },
    errorContent: {
      textAlign: 'center' as const,
      padding: '2rem'
    },
    retryBtn: {
      background: 'linear-gradient(135deg, #6078a4 0%, #2f4b80 50%, #0b0f2b 100%)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem'
    },
    errorBanner: {
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: '100%'
    },
    errorIcon: {
      fontSize: '1.2rem'
    },
    errorMessage: {
      color: '#856404',
      fontWeight: 600,
      flex: 1
    },
    errorNote: {
      color: '#856404',
      fontSize: '0.85rem',
      opacity: 0.8
    },
    comparisonChart: {
      padding: '1rem 0'
    },
    chartContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      minHeight: '150px'
    },
    yAxis: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-around',
      marginRight: '1rem',
      height: '120px'
    },
    yLabel: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#495057',
      textAlign: 'right' as const,
      paddingRight: '0.5rem'
    },
    chartBars: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-around',
      height: '120px'
    },
    barGroup: {
      display: 'flex',
      alignItems: 'center',
      margin: '0.5rem 0'
    },
    bar: {
      height: '30px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '8px',
      minWidth: '60px',
      position: 'relative' as const,
      marginRight: '0.5rem'
    },
    barSuspected: {
      background: 'linear-gradient(90deg, #2f4b80, #0b0f2b)',
      color: 'white'
    },
    barHealthy: {
      background: 'linear-gradient(90deg, #6078a4, #2f4b80)',
      color: 'white'
    },
    barValue: {
      fontWeight: 'bold' as const,
      fontSize: '0.9rem'
    },
    chartSummary: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e9ecef',
      flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
      alignItems: isMobile ? 'center' : 'flex-start'
    },
    summaryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: 500
    },
    summaryColor: {
      width: '12px',
      height: '12px',
      borderRadius: '2px'
    },
    summaryColorSuspected: {
      background: '#2f4b80'
    },
    summaryColorHealthy: {
      background: '#6078a4'
    },
    noDataMessage: {
      textAlign: 'center' as const,
      padding: '2rem',
      color: '#6c757d'
    }
  }

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '◊' },
    { id: 'doctors', label: 'चिकित्सक प्रबंधन', icon: '⚚' },
    { id: 'childReports', label: 'बच्चों की रिपोर्ट', icon: '◆' }
  ]

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`${serverUrl}dhadkan_admin_dashboard.php`, {
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
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}>
            <h3 style={styles.loadingSpinnerH3}>डेटा लोड हो रहा है...</h3>
            <p style={styles.loadingSpinnerP}>कृपया प्रतीक्षा करें</p>
          </div>
        </div>
      )
    }

    if (error && dashboardStats.totalChildrenScreened === 0) {
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorContent}>
            <h3>❌ डेटा लोड नहीं हो सका</h3>
            <p>{error}</p>
            <button 
              style={styles.retryBtn}
              onClick={refreshDashboard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.refreshBtnHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #FF9933, #e88822)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              🔄 पुनः प्रयास करें
            </button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div style={styles.contentHeader}>
          <div style={styles.headerLeft}>
            <h3 style={styles.contentHeaderH3}>डैशबोर्ड अवलोकन</h3>
            <p style={styles.contentHeaderP}>बच्चों की स्वास्थ्य जांच प्रणाली</p>
          </div>
          <div style={styles.headerRight}>
            <button 
              style={styles.refreshBtn}
              onClick={refreshDashboard}
              disabled={isLoading}
              title="डेटा रीफ्रेश करें"
              onMouseEnter={(e) => {
                if (!isLoading) {
                  Object.assign(e.currentTarget.style, styles.refreshBtnHover)
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #FF9933, #e88822)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {isLoading ? '🔄' : '🔄'} रीफ्रेश
            </button>
          </div>
          {error && (
            <div style={styles.errorBanner}>
              <span style={styles.errorIcon}>⚠</span>
              <span style={styles.errorMessage}>{error}</span>
              <span style={styles.errorNote}>(डेटा लोड नहीं हो सका - कृपया रीफ्रेश करें)</span>
            </div>
          )}
        </div>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>कुल जांच किए गए बच्चे</h4>
            <p style={styles.statNumber}>{dashboardStats.totalChildrenScreened}</p>
            <small style={styles.statSubtitle}>स्वस्थ: {dashboardStats.healthyCases} | संदिग्ध: {dashboardStats.positiveCases}</small>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>संदिग्ध मामले</h4>
            <p style={styles.statNumber}>{dashboardStats.positiveCases}</p>
            <small style={styles.statSubtitle}>{dashboardStats.suspiciousPercentage.toFixed(1)}% कुल जांच का</small>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>आज की जांच</h4>
            <p style={styles.statNumber}>{dashboardStats.todayScreenings}</p>
            <small style={styles.statSubtitle}>इस सप्ताह: {dashboardStats.thisWeekScreenings}</small>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>कुल चिकित्सक</h4>
            <p style={styles.statNumber}>{dashboardStats.totalDoctors}</p>
            <small style={styles.statSubtitle}>सक्रिय: {dashboardStats.activeDoctors}</small>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>इस महीने की जांच</h4>
            <p style={styles.statNumber}>{dashboardStats.thisMonthScreenings}</p>
            <small style={styles.statSubtitle}>
              {dashboardStats.weeklyGrowth >= 0 ? '↗' : '↘'} 
              {Math.abs(dashboardStats.weeklyGrowth).toFixed(1)}% साप्ताहिक वृद्धि
            </small>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>स्वस्थता दर</h4>
            <p style={styles.statNumber}>{dashboardStats.healthyPercentage.toFixed(1)}%</p>
            <small style={styles.statSubtitle}>स्वस्थ बच्चे: {dashboardStats.healthyCases}</small>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>इस सप्ताह</h4>
            <p style={styles.statNumber}>{dashboardStats.thisWeekScreenings}</p>
            <small style={styles.statSubtitle}>
              {dashboardStats.weeklyGrowth >= 0 ? 'वृद्धि' : 'कमी'}: {Math.abs(dashboardStats.weeklyGrowth).toFixed(1)}%
            </small>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statCardBefore}></div>
            <h4 style={styles.statCardH4}>औसत दैनिक जांच</h4>
            <p style={styles.statNumber}>{Math.round(dashboardStats.thisWeekScreenings / 7)}</p>
            <small style={styles.statSubtitle}>पिछले 7 दिनों का औसत</small>
          </div>
        </div>

        <div style={styles.overviewGrid}>
          <div style={styles.overviewCard}>
            <h4 style={styles.overviewCardH4}>मामलों की तुलना</h4>
            {children.length > 0 ? (
              <div style={styles.comparisonChart}>
                <div style={styles.chartContainer}>
                  <div style={styles.yAxis}>
                    <div style={styles.yLabel}>संदिग्ध मामले</div>
                    <div style={styles.yLabel}>स्वस्थ मामले</div>
                  </div>
                  <div style={styles.chartBars}>
                    <div style={styles.barGroup}>
                      <div style={{...styles.bar, ...styles.barSuspected, width: `${(unhealthyChildren / Math.max(healthyChildren, unhealthyChildren)) * 100}%`}}>
                        <span style={styles.barValue}>{unhealthyChildren}</span>
                      </div>
                    </div>
                    <div style={styles.barGroup}>
                      <div style={{...styles.bar, ...styles.barHealthy, width: `${(healthyChildren / Math.max(healthyChildren, unhealthyChildren)) * 100}%`}}>
                        <span style={styles.barValue}>{healthyChildren}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={styles.chartSummary}>
                  <div style={styles.summaryItem}>
                    <span style={{...styles.summaryColor, ...styles.summaryColorSuspected}}></span>
                    <span>संदिग्ध: {unhealthyChildren} ({Math.round((unhealthyChildren / children.length) * 100)}%)</span>
                  </div>
                  <div style={styles.summaryItem}>
                    <span style={{...styles.summaryColor, ...styles.summaryColorHealthy}}></span>
                    <span>स्वस्थ: {healthyChildren} ({Math.round((healthyChildren / children.length) * 100)}%)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.noDataMessage}>
                <p>◊ चार्ट डेटा उपलब्ध नहीं है</p>
              </div>
            )}
          </div>

          <div style={styles.overviewCard}>
            <h4 style={styles.overviewCardH4}>स्वास्थ्य सांख्यिकी</h4>
            {children.length > 0 ? (
              <div style={styles.healthStats}>
                <div style={styles.healthStat}>
                  <span style={styles.healthLabel}>स्वस्थ बच्चे</span>
                  <span style={{...styles.healthValue, ...styles.healthValueHealthy}}>{healthyChildren}</span>
                </div>
                <div style={styles.healthStat}>
                  <span style={styles.healthLabel}>असामान्य मामले</span>
                  <span style={{...styles.healthValue, ...styles.healthValueUnhealthy}}>{unhealthyChildren}</span>
                </div>
                <div style={styles.healthStat}>
                  <span style={styles.healthLabel}>स्वस्थता दर</span>
                  <span style={styles.healthValue}>{Math.round((healthyChildren / children.length) * 100)}%</span>
                </div>
              </div>
            ) : (
              <div style={styles.noDataMessage}>
                <p>↗ सांख्यिकी डेटा उपलब्ध नहीं है</p>
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
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img 
            src="/dhadkan_logo1.png" 
            alt="धड़कन लोगो" 
            style={styles.sidebarLogo}
          />
          <p style={styles.sidebarHeaderP}>प्रशासक पैनल</p>
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
                >
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userProfile}>
            <p style={styles.userName}>👤 {user.name}</p>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
          <button onClick={onLogout} style={styles.logoutBtn}>
            लॉगआउट
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
