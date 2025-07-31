import { useState, useEffect } from 'react'
import { User } from '../../../App'
import serverUrl from '../../server'

interface ChildrenReportsProps {
  user: User
  onBack: () => void
}

interface ChildReport {
  id: number
  dr_id: number
  name: string
  gender: 'पुरुष' | 'महिला'
  fatherName: string
  mobileNo: string
  schoolName: string
  haveAadhar: 'yes' | 'no'
  haveShramik: 'yes' | 'no'
  aadharPhoto: string | null
  shramikPhoto: string | null
  heartStatus: 'संदिग्ध' | 'संदेह नहीं'
  notes: string | null
  // Legacy fields for compatibility
  childName: string
  motherName: string
  age: number
  mobileNumber: string
  address: string
  aadharAvailable: boolean
  shramikCardAvailable: boolean
  symptoms: string[]
  diseaseFound: boolean
  screeningDate: string
  doctorName: string
  weight: number
  height: number
  heartRate: number
  bloodPressure: string
  healthStatus: 'स्वस्थ' | 'असामान्य' | 'जांच में'
}

const styles = {
  childrenReports: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  pageHeader: {
    background: 'linear-gradient(135deg, #FF9933 0%, #e88822 100%)',
    color: 'white',
    padding: '2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  headerText: {
    h1: {
      fontSize: '2.5rem',
      margin: 0,
      fontWeight: 700
    },
    p: {
      margin: '0.5rem 0 0 0',
      opacity: 0.9,
      fontSize: '1.1rem'
    }
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
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
    margin: '2rem 0'
  },
  loadingSpinner: {
    textAlign: 'center' as const,
    padding: '2rem'
  },
  loadingTitle: {
    color: '#FF9933',
    fontSize: '1.5rem',
    margin: '0 0 0.5rem 0',
    fontWeight: 600
  },
  loadingText: {
    color: '#6c757d',
    margin: 0,
    fontSize: '1rem'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  statCardBefore: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '4px'
  },
  statCardHealthy: {
    background: 'linear-gradient(90deg, #c55b04, #c95820)'
  },
  statCardUnhealthy: {
    background: 'linear-gradient(90deg, #dc3545, #e74c3c)'
  },
  statCardTotal: {
    background: 'linear-gradient(90deg, #FF9933, #e88822)'
  },
  statTitle: {
    color: '#495057',
    fontSize: '0.9rem',
    margin: '0 0 0.5rem 0',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1
  },
  statNumberHealthy: {
    color: '#28a745'
  },
  statNumberUnhealthy: {
    color: '#dc3545'
  },
  statNumberTotal: {
    color: '#FF9933'
  },
  statIcon: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
    fontSize: '2rem',
    opacity: 0.3
  },
  searchFilterSection: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    marginBottom: '2rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap' as const
  },
  searchBox: {
    position: 'relative' as const,
    flex: 1,
    minWidth: '300px'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#fff'
  },
  searchInputFocus: {
    outline: 'none',
    borderColor: '#FF9933'
  },
  searchIcon: {
    position: 'absolute' as const,
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6c757d'
  },
  filterSection: {
    display: 'flex',
    gap: '1rem'
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
    minWidth: '150px'
  },
  filterSelectFocus: {
    outline: 'none',
    borderColor: '#FF9933'
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e9ecef',
    marginBottom: '2rem'
  },
  reportsTable: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeader: {
    background: 'linear-gradient(45deg, #FF9933, #e88822)',
    color: 'white',
    padding: '1rem',
    textAlign: 'left' as const,
    fontWeight: 600,
    fontSize: '0.9rem'
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #e9ecef',
    fontSize: '0.9rem',
    verticalAlign: 'top'
  },
  tableRow: {
    transition: 'background-color 0.3s ease',
    cursor: 'pointer'
  },
  childInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  childAvatar: {
    fontSize: '2rem',
    background: '#f8f9fa',
    padding: '0.5rem',
    borderRadius: '50%',
    border: '2px solid #e9ecef'
  },
  childName: {
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: '0.25rem'
  },
  childDetails: {
    fontSize: '0.8rem',
    color: '#6c757d',
    marginBottom: '0.25rem'
  },
  childContact: {
    fontSize: '0.8rem',
    color: '#007bff'
  },
  parentInfo: {
    fontSize: '0.85rem',
    marginBottom: '0.25rem'
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textAlign: 'center' as const,
    minWidth: '60px',
    display: 'inline-block'
  },
  statusHealthy: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  statusSuspicious: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  btnSmall: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  },
  btnSmallPrimary: {
    background: '#FF9933',
    color: 'white'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  paginationBtn: {
    background: 'white',
    border: '2px solid #FF9933',
    color: '#FF9933',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  },
  paginationBtnHover: {
    background: '#FF9933',
    color: 'white'
  },
  paginationBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  paginationInfo: {
    fontWeight: 600,
    color: '#495057'
  },
  noResults: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#6c757d',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem 2rem'
  },
  emptyStateTitle: {
    color: '#495057',
    fontSize: '1.5rem',
    margin: '0 0 0.5rem 0',
    fontWeight: 600
  },
  emptyStateText: {
    color: '#6c757d',
    margin: 0,
    fontSize: '1rem'
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto' as const,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  largeModal: {
    maxWidth: '900px'
  },
  modalHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    color: '#FF9933',
    fontSize: '1.5rem',
    flex: 1
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  closeBtnHover: {
    background: '#f8f9fa',
    color: '#2c3e50'
  },
  modalBody: {
    padding: '1.5rem'
  },
  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  },
  btnSecondary: {
    background: 'white',
    color: '#FF9933',
    border: '2px solid #FF9933',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  btnSecondaryHover: {
    background: '#FF9933',
    color: 'white'
  },
  childDetailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  detailSection: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  detailSectionTitle: {
    color: '#FF9933',
    fontSize: '1.2rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #e9ecef',
    paddingBottom: '0.5rem'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #e9ecef'
  },
  detailRowLast: {
    borderBottom: 'none'
  },
  detailRowFullWidth: {
    flexDirection: 'column' as const,
    alignItems: 'flex-start'
  },
  detailLabel: {
    fontWeight: 600,
    color: '#495057',
    flex: '0 0 40%'
  },
  detailValue: {
    color: '#2c3e50',
    flex: 1,
    textAlign: 'right' as const
  },
  detailValueFullWidth: {
    marginTop: '0.5rem',
    textAlign: 'left' as const
  },
  valueAvailable: {
    color: '#28a745',
    fontWeight: 600
  },
  valueNotAvailable: {
    color: '#dc3545',
    fontWeight: 600
  }
}

const ChildrenReports = ({ user, onBack }: ChildrenReportsProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDoctor, setFilterDoctor] = useState('')
  const [selectedChild, setSelectedChild] = useState<ChildReport | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [reports, setReports] = useState<ChildReport[]>([])
  const [doctors, setDoctors] = useState<{ doctorId: number; doctorName: string; hospitalName: string; totalScreenings: number }[]>([])
  const [stats, setStats] = useState({
    totalChildren: 0,
    normalCases: 0,
    suspiciousCases: 0,
    totalDoctors: 0,
    totalSchools: 0
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10

  // ESC key functionality for going back
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !selectedChild) {
        onBack()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onBack, selectedChild])

  // Fetch reports data and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch reports
        const reportsResponse = await fetch(`${serverUrl}children_reports.php?action=getReports&page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&heartStatus=${filterStatus}&doctorId=${filterDoctor}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        })
        
        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json()
          if (reportsData.success) {
            setReports(reportsData.data || [])
            setPagination(reportsData.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalRecords: 0
            })
          }
        }

        // Fetch stats
        const statsResponse = await fetch(`${serverUrl}children_reports.php?action=getStats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        })
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.stats || {
              totalChildren: 0,
              normalCases: 0,
              suspiciousCases: 0,
              totalDoctors: 0,
              totalSchools: 0
            })
            setDoctors(statsData.doctorStats || [])
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('डेटा लोड करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentPage, searchTerm, filterStatus, filterDoctor])

  const healthStatuses = ['संदेह नहीं', 'संदिग्ध']

  const totalPages = pagination.totalPages
  const paginatedReports = reports

  const normalCount = stats.normalCases
  const suspiciousCount = stats.suspiciousCases
  const totalCount = stats.totalChildren

  const handleViewDetails = (report: ChildReport) => {
    setSelectedChild(report)
  }

  return (
    <div style={styles.childrenReports}>
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerText.h1}>बच्चों की रिपोर्ट</h1>
            <p style={styles.headerText.p}>सभी बच्चों की स्वास्थ्य जांच रिपोर्ट और विवरण - {user.name}</p>
          </div>
        </div>
      </div>

      <div style={styles.contentContainer}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>
              <h3 style={styles.loadingTitle}>रिपोर्ट लोड हो रही है...</h3>
              <p style={styles.loadingText}>कृपया प्रतीक्षा करें</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={styles.statsRow}>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{...styles.statCardBefore, ...styles.statCardHealthy}}></div>
                <h3 style={styles.statTitle}>सामान्य मामले</h3>
                <p style={{...styles.statNumber, ...styles.statNumberHealthy}}>{normalCount}</p>
                <span style={styles.statIcon}>✅</span>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{...styles.statCardBefore, ...styles.statCardUnhealthy}}></div>
                <h3 style={styles.statTitle}>संदिग्ध मामले</h3>
                <p style={{...styles.statNumber, ...styles.statNumberUnhealthy}}>{suspiciousCount}</p>
                <span style={styles.statIcon}>⚠️</span>
              </div>
              <div 
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{...styles.statCardBefore, ...styles.statCardTotal}}></div>
                <h3 style={styles.statTitle}>कुल बच्चे</h3>
                <p style={{...styles.statNumber, ...styles.statNumberTotal}}>{totalCount}</p>
                <span style={styles.statIcon}>👶</span>
              </div>
            </div>

        {/* Search and Filter */}
        <div style={styles.searchFilterSection}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="बच्चे का नाम, पिता का नाम या स्कूल खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => Object.assign(e.target.style, styles.searchInputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef'
              }}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          <div style={styles.filterSection}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.filterSelect}
              onFocus={(e) => Object.assign(e.target.style, styles.filterSelectFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef'
              }}
            >
              <option value="">सभी स्थितियां</option>
              {healthStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              style={styles.filterSelect}
              onFocus={(e) => Object.assign(e.target.style, styles.filterSelectFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef'
              }}
            >
              <option value="">सभी चिकित्सक</option>
              {doctors.map(doctor => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.doctorName} - {doctor.hospitalName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div style={styles.tableContainer}>
          <table style={styles.reportsTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>बच्चे का विवरण</th>
                <th style={styles.tableHeader}>पिता</th>
                <th style={styles.tableHeader}>स्कूल</th>
                <th style={styles.tableHeader}>जांच की तारीख</th>
                <th style={styles.tableHeader}>चिकित्सक</th>
                <th style={styles.tableHeader}>हृदय स्थिति</th>
                <th style={styles.tableHeader}>कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map(report => (
                <tr 
                  key={report.id} 
                  style={styles.tableRow}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <td style={styles.tableCell}>
                    <div style={styles.childInfo}>
                      <div style={styles.childAvatar}>
                        {report.gender === 'पुरुष' ? '👦' : '👧'}
                      </div>
                      <div>
                        <div style={styles.childName}>{report.childName || report.name}</div>
                        <div style={styles.childDetails}>
                          {report.age} वर्ष, {report.gender}
                        </div>
                        <div style={styles.childContact}>{report.mobileNumber || report.mobileNo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.parentInfo}>
                      <div>पिता: {report.fatherName}</div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>{report.schoolName}</td>
                  <td style={styles.tableCell}>{report.screeningDate}</td>
                  <td style={styles.tableCell}>{report.doctorName}</td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      ...(report.heartStatus === 'संदेह नहीं' ? styles.statusHealthy : styles.statusSuspicious)
                    }}>
                      {report.heartStatus}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button 
                        style={{...styles.btnSmall, ...styles.btnSmallPrimary}}
                        onClick={() => handleViewDetails(report)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#e88822'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FF9933'
                        }}
                      >
                        विस्तार देखें
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button 
              style={{
                ...styles.paginationBtn,
                ...(currentPage === 1 ? styles.paginationBtnDisabled : {})
              }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  Object.assign(e.currentTarget.style, styles.paginationBtnHover)
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#FF9933'
                }
              }}
            >
              ← पिछला
            </button>
            
            <div style={styles.paginationInfo}>
              पृष्ठ {pagination.currentPage} / {pagination.totalPages} (कुल {pagination.totalRecords} रिपोर्ट)
            </div>
            
            <button 
              style={{
                ...styles.paginationBtn,
                ...(currentPage === totalPages ? styles.paginationBtnDisabled : {})
              }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  Object.assign(e.currentTarget.style, styles.paginationBtnHover)
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#FF9933'
                }
              }}
            >
              अगला →
            </button>
          </div>
        )}

        {reports.length === 0 && !isLoading && (
          <div style={styles.noResults}>
            <div style={styles.emptyState}>
              <h3 style={styles.emptyStateTitle}>कोई रिपोर्ट उपलब्ध नहीं है</h3>
              <p style={styles.emptyStateText}>अभी तक कोई बच्चों की रिपोर्ट नहीं मिली है।</p>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Child Detail Modal */}
      {selectedChild && (
        <div style={styles.modalOverlay} onClick={() => setSelectedChild(null)}>
          <div style={{...styles.modalContent, ...styles.largeModal}} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>बच्चे की विस्तृत रिपोर्ट</h3>
              <button 
                style={styles.closeBtn} 
                onClick={() => setSelectedChild(null)}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.closeBtnHover)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = '#6c757d'
                }}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.childDetailGrid}>
                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>व्यक्तिगत जानकारी</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>नाम:</span>
                    <span style={styles.detailValue}>{selectedChild.name}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>लिंग:</span>
                    <span style={styles.detailValue}>{selectedChild.gender}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>पिता का नाम:</span>
                    <span style={styles.detailValue}>{selectedChild.fatherName}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>मोबाइल नंबर:</span>
                    <span style={styles.detailValue}>{selectedChild.mobileNo}</span>
                  </div>
                  <div style={{...styles.detailRow, ...styles.detailRowLast}}>
                    <span style={styles.detailLabel}>स्कूल:</span>
                    <span style={styles.detailValue}>{selectedChild.schoolName}</span>
                  </div>
                </div>

                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>दस्तावेज स्थिति</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>आधार कार्ड:</span>
                    <span style={{
                      ...styles.detailValue,
                      ...(selectedChild.haveAadhar === 'yes' ? styles.valueAvailable : styles.valueNotAvailable)
                    }}>
                      {selectedChild.haveAadhar === 'yes' ? 'हां' : 'नहीं'}
                    </span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>श्रमिक कार्ड:</span>
                    <span style={{
                      ...styles.detailValue,
                      ...(selectedChild.haveShramik === 'yes' ? styles.valueAvailable : styles.valueNotAvailable)
                    }}>
                      {selectedChild.haveShramik === 'yes' ? 'हां' : 'नहीं'}
                    </span>
                  </div>
                  {selectedChild.aadharPhoto && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>आधार फोटो:</span>
                      <span style={styles.detailValue}>उपलब्ध</span>
                    </div>
                  )}
                  {selectedChild.shramikPhoto && (
                    <div style={{...styles.detailRow, ...styles.detailRowLast}}>
                      <span style={styles.detailLabel}>श्रमिक फोटो:</span>
                      <span style={styles.detailValue}>उपलब्ध</span>
                    </div>
                  )}
                </div>

                <div style={styles.detailSection}>
                  <h4 style={styles.detailSectionTitle}>चिकित्सा जानकारी</h4>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>चिकित्सक ID:</span>
                    <span style={styles.detailValue}>{selectedChild.dr_id}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>हृदय स्थिति:</span>
                    <span style={{
                      ...styles.detailValue,
                      ...(selectedChild.heartStatus === 'संदेह नहीं' ? styles.valueAvailable : styles.valueNotAvailable)
                    }}>
                      {selectedChild.heartStatus}
                    </span>
                  </div>
                  {selectedChild.notes && (
                    <div style={{...styles.detailRow, ...styles.detailRowFullWidth, ...styles.detailRowLast}}>
                      <span style={styles.detailLabel}>टिप्पणी:</span>
                      <span style={{...styles.detailValue, ...styles.detailValueFullWidth}}>{selectedChild.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button 
                style={styles.btnSecondary} 
                onClick={() => setSelectedChild(null)}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.btnSecondaryHover)
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#FF9933'
                }}
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChildrenReports
