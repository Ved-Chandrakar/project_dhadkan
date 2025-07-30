import { useState, useEffect } from 'react'
import { User } from '../../../App'
import './ChildrenReports.css'

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

  const mockReports: ChildReport[] = [
    {
      id: 1,
      dr_id: 1,
      name: 'राहुल कुमार',
      gender: 'पुरुष',
      fatherName: 'सुनील कुमार',
      mobileNo: '9876543210',
      schoolName: 'सरकारी प्राथमिक विद्यालय',
      haveAadhar: 'yes',
      haveShramik: 'no',
      aadharPhoto: 'path/to/aadhar1.jpg',
      shramikPhoto: null,
      heartStatus: 'संदेह नहीं',
      notes: 'सामान्य स्वास्थ्य स्थिति',
      // Legacy fields for compatibility
      childName: 'राहुल कुमार',
      motherName: 'सुनीता कुमार',
      age: 8,
      mobileNumber: '9876543210',
      address: 'सेक्टर 15, गुड़गांव, हरियाणा',
      aadharAvailable: true,
      shramikCardAvailable: false,
      symptoms: ['सामान्य खांसी', 'हल्का बुखार'],
      diseaseFound: false,
      screeningDate: '2025-01-29',
      doctorName: 'डॉ. प्रिया शर्मा',
      weight: 25,
      height: 120,
      heartRate: 85,
      bloodPressure: '110/70',
      healthStatus: 'स्वस्थ'
    },
    {
      id: 2,
      dr_id: 2,
      name: 'आरती देवी',
      gender: 'महिला',
      fatherName: 'राज कुमार',
      mobileNo: '9876543211',
      schoolName: 'दिल्ली पब्लिक स्कूल',
      haveAadhar: 'yes',
      haveShramik: 'yes',
      aadharPhoto: 'path/to/aadhar2.jpg',
      shramikPhoto: 'path/to/shramik2.jpg',
      heartStatus: 'संदिग्ध',
      notes: 'हृदय की जांच की आवश्यकता',
      // Legacy fields for compatibility
      childName: 'आरती देवी',
      motherName: 'सरिता देवी',
      age: 6,
      mobileNumber: '9876543211',
      address: 'मॉडल टाउन, दिल्ली',
      aadharAvailable: true,
      shramikCardAvailable: true,
      symptoms: ['सांस लेने में कठिनाई', 'सीने में दर्द'],
      diseaseFound: true,
      screeningDate: '2025-01-29',
      doctorName: 'डॉ. अमित वर्मा',
      weight: 18,
      height: 105,
      heartRate: 95,
      bloodPressure: '120/80',
      healthStatus: 'असामान्य'
    },
    {
      id: 3,
      dr_id: 3,
      name: 'विकास शर्मा',
      gender: 'पुरुष',
      fatherName: 'मोहन शर्मा',
      mobileNo: '9876543212',
      schoolName: 'केंद्रीय विद्यालय',
      haveAadhar: 'yes',
      haveShramik: 'no',
      aadharPhoto: 'path/to/aadhar3.jpg',
      shramikPhoto: null,
      heartStatus: 'संदेह नहीं',
      notes: 'पूर्ण स्वस्थ',
      // Legacy fields for compatibility
      childName: 'विकास शर्मा',
      motherName: 'गीता शर्मा',
      age: 7,
      mobileNumber: '9876543212',
      address: 'लाजपत नगर, नई दिल्ली',
      aadharAvailable: true,
      shramikCardAvailable: false,
      symptoms: [],
      diseaseFound: false,
      screeningDate: '2025-01-28',
      doctorName: 'डॉ. सुनीता गुप्ता',
      weight: 22,
      height: 115,
      heartRate: 80,
      bloodPressure: '100/65',
      healthStatus: 'स्वस्थ'
    },
    {
      id: 4,
      dr_id: 4,
      name: 'अनिता कुमारी',
      gender: 'महिला',
      fatherName: 'रमेश प्रसाद',
      mobileNo: '9876543213',
      schoolName: 'सरकारी कन्या विद्यालय',
      haveAadhar: 'no',
      haveShramik: 'yes',
      aadharPhoto: null,
      shramikPhoto: 'path/to/shramik4.jpg',
      heartStatus: 'संदिग्ध',
      notes: 'पेट संबंधी समस्या',
      // Legacy fields for compatibility
      childName: 'अनिता कुमारी',
      motherName: 'शांति देवी',
      age: 9,
      mobileNumber: '9876543213',
      address: 'सदर बाजार, दिल्ली',
      aadharAvailable: false,
      shramikCardAvailable: true,
      symptoms: ['पेट दर्द', 'भूख न लगना'],
      diseaseFound: true,
      screeningDate: '2025-01-27',
      doctorName: 'डॉ. राजेश कुमार',
      weight: 28,
      height: 125,
      heartRate: 88,
      bloodPressure: '105/68',
      healthStatus: 'जांच में'
    }
  ]

  const doctors = Array.from(new Set(mockReports.map(report => report.doctorName)))
  const healthStatuses = ['स्वस्थ', 'असामान्य', 'जांच में']

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || report.healthStatus === filterStatus
    const matchesDoctor = !filterDoctor || report.doctorName === filterDoctor
    return matchesSearch && matchesStatus && matchesDoctor
  })

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  const normalCount = mockReports.filter(r => r.heartStatus === 'संदेह नहीं').length
  const suspiciousCount = mockReports.filter(r => r.heartStatus === 'संदिग्ध').length
  const totalCount = mockReports.length

  const handleViewDetails = (report: ChildReport) => {
    setSelectedChild(report)
  }

  const handleExportReport = () => {
    // Export functionality would be implemented here
    alert('रिपोर्ट एक्सपोर्ट हो रही है...')
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
          {/* <div className="stat-card pending">
            <h3>जांच में</h3>
            <p className="stat-number">{pendingCount}</p>
            <span className="stat-icon">🔍</span>
          </div> */}
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
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>

          {/* <button className="btn-primary" onClick={handleExportReport}>
            रिपोर्ट एक्सपोर्ट करें
          </button> */}
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
                        <div className="child-name">{report.childName}</div>
                        <div className="child-details">
                          {report.age} वर्ष, {report.gender}
                        </div>
                        <div className="child-contact">{report.mobileNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="parent-info">
                      <div>पिता: {report.fatherName}</div>
                      {/* <div>माता: {report.motherName}</div> */}
                    </div>
                  </td>
                  <td>{report.schoolName}</td>
                  <td>{report.screeningDate}</td>
                  <td>डॉक्टर ID: {report.dr_id}</td>
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
              पृष्ठ {currentPage} / {totalPages}
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

        {filteredReports.length === 0 && (
          <div className="no-results">
            <p>कोई रिपोर्ट नहीं मिली।</p>
          </div>
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
