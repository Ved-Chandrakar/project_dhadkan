import { useState, useEffect } from 'react'
import { User } from '../../../App'
import './ChildrenReports.css'
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
    <div className="children-reports">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>बच्चों की रिपोर्ट</h1>
            <p>सभी बच्चों की स्वास्थ्य जांच रिपोर्ट और विवरण - {user.name}</p>
          </div>
        </div>
      </div>

      <div className="content-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <h3>रिपोर्ट लोड हो रही है...</h3>
              <p>कृपया प्रतीक्षा करें</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="stats-row">
              <div className="stat-card healthy">
                <h3>सामान्य मामले</h3>
                <p className="stat-number">{normalCount}</p>
                <span className="stat-icon">✅</span>
              </div>
              <div className="stat-card unhealthy">
                <h3>संदिग्ध मामले</h3>
                <p className="stat-number">{suspiciousCount}</p>
                <span className="stat-icon">⚠️</span>
              </div>
              <div className="stat-card total">
                <h3>कुल बच्चे</h3>
                <p className="stat-number">{totalCount}</p>
                <span className="stat-icon">👶</span>
              </div>
            </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="बच्चे का नाम, पिता का नाम या स्कूल खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-section">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">सभी स्थितियां</option>
              {healthStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
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
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>बच्चे का विवरण</th>
                <th>पिता</th>
                <th>स्कूल</th>
                <th>जांच की तारीख</th>
                <th>चिकित्सक</th>
                <th>हृदय स्थिति</th>
                <th>कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map(report => (
                <tr key={report.id}>
                  <td>
                    <div className="child-info">
                      <div className="child-avatar">
                        {report.gender === 'पुरुष' ? '👦' : '👧'}
                      </div>
                      <div>
                        <div className="child-name">{report.childName || report.name}</div>
                        <div className="child-details">
                          {report.age} वर्ष, {report.gender}
                        </div>
                        <div className="child-contact">{report.mobileNumber || report.mobileNo}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="parent-info">
                      <div>पिता: {report.fatherName}</div>
                    </div>
                  </td>
                  <td>{report.schoolName}</td>
                  <td>{report.screeningDate}</td>
                  <td>{report.doctorName}</td>
                  <td>
                    <span className={`status-badge status-${report.heartStatus === 'संदेह नहीं' ? 'healthy' : 'suspicious'}`}>
                      {report.heartStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-small btn-primary"
                        onClick={() => handleViewDetails(report)}
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
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← पिछला
            </button>
            
            <div className="pagination-info">
              पृष्ठ {pagination.currentPage} / {pagination.totalPages} (कुल {pagination.totalRecords} रिपोर्ट)
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              अगला →
            </button>
          </div>
        )}

        {reports.length === 0 && !isLoading && (
          <div className="no-results">
            <div className="empty-state">
              <h3>कोई रिपोर्ट उपलब्ध नहीं है</h3>
              <p>अभी तक कोई बच्चों की रिपोर्ट नहीं मिली है।</p>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Child Detail Modal */}
      {selectedChild && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>बच्चे की विस्तृत रिपोर्ट</h3>
              <button className="close-btn" onClick={() => setSelectedChild(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="child-detail-grid">
                <div className="detail-section">
                  <h4>व्यक्तिगत जानकारी</h4>
                  <div className="detail-row">
                    <span className="label">नाम:</span>
                    <span className="value">{selectedChild.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">लिंग:</span>
                    <span className="value">{selectedChild.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">पिता का नाम:</span>
                    <span className="value">{selectedChild.fatherName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">मोबाइल नंबर:</span>
                    <span className="value">{selectedChild.mobileNo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">स्कूल:</span>
                    <span className="value">{selectedChild.schoolName}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>दस्तावेज स्थिति</h4>
                  <div className="detail-row">
                    <span className="label">आधार कार्ड:</span>
                    <span className={`value ${selectedChild.haveAadhar === 'yes' ? 'available' : 'not-available'}`}>
                      {selectedChild.haveAadhar === 'yes' ? 'हां' : 'नहीं'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">श्रमिक कार्ड:</span>
                    <span className={`value ${selectedChild.haveShramik === 'yes' ? 'available' : 'not-available'}`}>
                      {selectedChild.haveShramik === 'yes' ? 'हां' : 'नहीं'}
                    </span>
                  </div>
                  {selectedChild.aadharPhoto && (
                    <div className="detail-row">
                      <span className="label">आधार फोटो:</span>
                      <span className="value">उपलब्ध</span>
                    </div>
                  )}
                  {selectedChild.shramikPhoto && (
                    <div className="detail-row">
                      <span className="label">श्रमिक फोटो:</span>
                      <span className="value">उपलब्ध</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>चिकित्सा जानकारी</h4>
                  <div className="detail-row">
                    <span className="label">चिकित्सक ID:</span>
                    <span className="value">{selectedChild.dr_id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">हृदय स्थिति:</span>
                    <span className={`value status-${selectedChild.heartStatus === 'संदेह नहीं' ? 'healthy' : 'suspicious'}`}>
                      {selectedChild.heartStatus}
                    </span>
                  </div>
                  {selectedChild.notes && (
                    <div className="detail-row full-width">
                      <span className="label">टिप्पणी:</span>
                      <span className="value">{selectedChild.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedChild(null)}>
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
