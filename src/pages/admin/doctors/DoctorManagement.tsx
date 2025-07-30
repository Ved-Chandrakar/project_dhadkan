import { useState, useEffect } from 'react'
import { User } from '../../../App'
import './DoctorManagement.css'

interface DoctorManagementProps {
  user: User
  onBack: () => void
}

interface Doctor {
  id: number
  doctorName: string
  hospitalType: string
  hospitalname: string
  phoneNo: string
  experience: number
  email: string
  password: string
  createdAt: string
  updatedAt: string
  // Legacy fields for compatibility
  name: string
  specialization: string
  hospital: string
  phone: string
  totalScreenings: number
  joiningDate: string
  status: 'सक्रिय' | 'निष्क्रिय'
}

const DoctorManagement = ({ user, onBack }: DoctorManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  // ESC key functionality for going back
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !showAddForm && !selectedDoctor) {
        onBack()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onBack, showAddForm, selectedDoctor])

  const mockDoctors: Doctor[] = [
    {
      id: 1,
      doctorName: 'डॉ. प्रिया शर्मा',
      hospitalType: 'सरकारी',
      hospitalname: 'सरकारी अस्पताल, दिल्ली',
      phoneNo: '9876543210',
      experience: 8,
      email: 'dr.priya@gov.in',
      password: '******',
      createdAt: '2020-03-15 10:30:00',
      updatedAt: '2025-01-29 15:45:00',
      // Legacy fields for compatibility
      name: 'डॉ. प्रिया शर्मा',
      specialization: 'बाल चिकित्सक',
      hospital: 'सरकारी अस्पताल, दिल्ली',
      phone: '9876543210',
      totalScreenings: 450,
      joiningDate: '2020-03-15',
      status: 'सक्रिय'
    },
    {
      id: 2,
      doctorName: 'डॉ. अमित वर्मा',
      hospitalType: 'केंद्रीय सरकारी',
      hospitalname: 'AIIMS, नई दिल्ली',
      phoneNo: '9876543211',
      experience: 12,
      email: 'dr.amit@aiims.gov.in',
      password: '******',
      createdAt: '2018-07-20 14:20:00',
      updatedAt: '2025-01-28 09:15:00',
      // Legacy fields for compatibility
      name: 'डॉ. अमित वर्मा',
      specialization: 'हृदय रोग विशेषज्ञ',
      hospital: 'AIIMS, नई दिल्ली',
      phone: '9876543211',
      totalScreenings: 380,
      joiningDate: '2018-07-20',
      status: 'सक्रिय'
    },
    {
      id: 3,
      doctorName: 'डॉ. सुनीता गुप्ता',
      hospitalType: 'सरकारी',
      hospitalname: 'सफदरजंग अस्पताल',
      phoneNo: '9876543212',
      experience: 15,
      email: 'dr.sunita@safdarjung.gov.in',
      password: '******',
      createdAt: '2015-11-10 11:45:00',
      updatedAt: '2025-01-27 16:30:00',
      // Legacy fields for compatibility
      name: 'डॉ. सुनीता गुप्ता',
      specialization: 'बाल चिकित्सक',
      hospital: 'सफदरजंग अस्पताल',
      phone: '9876543212',
      totalScreenings: 520,
      joiningDate: '2015-11-10',
      status: 'सक्रिय'
    },
    {
      id: 4,
      doctorName: 'डॉ. राजेश कुमार',
      hospitalType: 'प्राइवेट',
      hospitalname: 'गवर्नमेंट हॉस्पिटल, गुड़गांव',
      phoneNo: '9876543213',
      experience: 6,
      email: 'dr.rajesh@ggh.gov.in',
      password: '******',
      createdAt: '2022-01-05 08:15:00',
      updatedAt: '2025-01-26 12:20:00',
      // Legacy fields for compatibility
      name: 'डॉ. राजेश कुमार',
      specialization: 'सामान्य चिकित्सक',
      hospital: 'गवर्नमेंट हॉस्पिटल, गुड़गांव',
      phone: '9876543213',
      totalScreenings: 280,
      joiningDate: '2022-01-05',
      status: 'निष्क्रिय'
    }
  ]

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !filterSpecialization || doctor.specialization === filterSpecialization
    return matchesSearch && matchesSpecialization
  })

  const handleAddDoctor = () => {
    setShowAddForm(true)
    setSelectedDoctor(null)
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowAddForm(true)
  }

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleDeleteDoctor = (doctor: Doctor) => {
    if (window.confirm(`क्या आप वाकई ${doctor.name} को हटाना चाहते हैं?`)) {
      // Delete functionality would be implemented here
      alert(`${doctor.name} को हटा दिया गया है।`)
    }
  }

  return (
    <div className="doctor-management">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>चिकित्सक प्रबंधन</h1>
            <p>सभी चिकित्सकों की जानकारी और प्रबंधन - {user.name}</p>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>कुल चिकित्सक</h3>
            <p className="stat-number">{mockDoctors.length}</p>
            <span className="stat-icon">👩‍⚕️</span>
          </div>
          {/* <div className="stat-card">
            <h3>सक्रिय चिकित्सक</h3>
            <p className="stat-number">{mockDoctors.filter(d => d.status === 'सक्रिय').length}</p>
            <span className="stat-icon">✅</span>
          </div> */}
          <div className="stat-card">
            <h3>कुल जांच</h3>
            <p className="stat-number">{mockDoctors.reduce((sum, doc) => sum + doc.totalScreenings, 0)}</p>
            <span className="stat-icon">📊</span>
          </div>
          <div className="stat-card">
            <h3>औसत अनुभव</h3>
            <p className="stat-number">{Math.round(mockDoctors.reduce((sum, doc) => sum + doc.experience, 0) / mockDoctors.length)} वर्ष</p>
            <span className="stat-icon">🎓</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="चिकित्सक का नाम या अस्पताल खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          {/* <div className="filter-section">
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
            >
              <option value="">सभी विशेषज्ञताएं</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div> */}

          <button className="btn-primary" onClick={handleAddDoctor}>
            नया चिकित्सक जोड़ें
          </button>
        </div>

        {/* Doctors Table */}
        <div className="table-container">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>चिकित्सक</th>
                <th>विशेषज्ञता</th>
                <th>अस्पताल</th>
                <th>संपर्क</th>
                <th>अनुभव</th>
                <th>ईमेल</th>
                <th>कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>
                    <div className="doctor-info">
                      <div className="doctor-avatar">🩺</div>
                      <div>
                        <div className="doctor-name">{doctor.name}</div>
                        <div className="doctor-email">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.hospital}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.experience} वर्ष</td>
                  <td>{doctor.email}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-small btn-primary"
                        onClick={() => handleViewDoctor(doctor)}
                      >
                        देखें
                      </button>
                      <button 
                        className="btn-small btn-danger"
                        onClick={() => handleDeleteDoctor(doctor)}
                      >
                        हटाएं
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="no-results">
            <p>कोई चिकित्सक नहीं मिला।</p>
          </div>
        )}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedDoctor ? 'चिकित्सक संपादित करें' : 'नया चिकित्सक जोड़ें'}</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>यह फॉर्म जल्द ही उपलब्ध होगा।</p>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Detail Modal */}
      {selectedDoctor && !showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>चिकित्सक विवरण</h3>
              <button className="close-btn" onClick={() => setSelectedDoctor(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="doctor-detail">
                <div className="detail-section">
                  <h4>व्यक्तिगत जानकारी</h4>
                  <p><strong>ID:</strong> {selectedDoctor.id}</p>
                  <p><strong>चिकित्सक का नाम:</strong> {selectedDoctor.doctorName}</p>
                  <p><strong>ईमेल:</strong> {selectedDoctor.email}</p>
                  <p><strong>फोन नंबर:</strong> {selectedDoctor.phoneNo}</p>
                  <p><strong>अनुभव:</strong> {selectedDoctor.experience} वर्ष</p>
                </div>
                <div className="detail-section">
                  <h4>अस्पताल जानकारी</h4>
                  <p><strong>अस्पताल का प्रकार:</strong> {selectedDoctor.hospitalType}</p>
                  <p><strong>अस्पताल का नाम:</strong> {selectedDoctor.hospitalname}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedDoctor(null)}>
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorManagement
