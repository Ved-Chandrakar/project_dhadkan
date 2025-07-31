import { useState, useEffect } from 'react'
import { User } from '../../../App'
import './DoctorManagement.css'
import serverUrl from '../../server'

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

interface DoctorFormData {
  doctorName: string
  hospitalType: string
  hospitalname: string
  phoneNo: string
  experience: number
  email: string
  password: string
}

const DoctorManagement = ({ user, onBack }: DoctorManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<DoctorFormData>({
    doctorName: '',
    hospitalType: '',
    hospitalname: '',
    phoneNo: '',
    experience: 0,
    email: '',
    password: ''
  })

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

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${serverUrl}doctor_management.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setDoctors(result.data || [])
        } else {
          console.error('Error fetching doctors:', result.message)
          alert('डेटा लोड करने में त्रुटि: ' + result.message)
        }
      } catch (error) {
        console.error('Error fetching doctors:', error)
        alert('डेटा लोड करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।')
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAddDoctor = () => {
    setFormData({
      doctorName: '',
      hospitalType: '',
      hospitalname: '',
      phoneNo: '',
      experience: 0,
      email: '',
      password: ''
    })
    setShowAddForm(true)
    setSelectedDoctor(null)
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setFormData({
      doctorName: doctor.doctorName,
      hospitalType: doctor.hospitalType,
      hospitalname: doctor.hospitalname,
      phoneNo: doctor.phoneNo,
      experience: doctor.experience,
      email: doctor.email,
      password: '' // Don't pre-fill password for security
    })
    setSelectedDoctor(doctor)
    setShowAddForm(true)
  }

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleDeleteDoctor = async (doctor: Doctor) => {
    if (window.confirm(`क्या आप वाकई ${doctor.name || doctor.doctorName} को हटाना चाहते हैं?`)) {
      try {
        const response = await fetch(`${serverUrl}doctor_management.php?action=delete&id=${doctor.id}`, {
          method: 'DELETE'
        })

        const result = await response.json()

        if (result.success) {
          alert(`${doctor.name || doctor.doctorName} को सफलतापूर्वक हटा दिया गया है।`)
          
          // Refresh doctors list
          const fetchResponse = await fetch(`${serverUrl}doctor_management.php`)
          const fetchResult = await fetchResponse.json()
          if (fetchResult.success) {
            setDoctors(fetchResult.data || [])
          }
        } else {
          alert('त्रुटि: ' + result.message)
        }
      } catch (error) {
        console.error('Error deleting doctor:', error)
        alert('चिकित्सक हटाने में त्रुटि हुई। कृपया पुनः प्रयास करें।')
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.doctorName.trim()) {
      alert('कृपया चिकित्सक का नाम दर्ज करें')
      return false
    }
    if (!formData.email.trim()) {
      alert('कृपया ईमेल दर्ज करें')
      return false
    }
    if (!formData.phoneNo.trim() || formData.phoneNo.length !== 10) {
      alert('कृपया वैध 10 अंकों का फ़ोन नंबर दर्ज करें')
      return false
    }
    if (!selectedDoctor && !formData.password.trim()) {
      alert('कृपया पासवर्ड दर्ज करें')
      return false
    }
    if (formData.experience < 0) {
      alert('कृपया वैध अनुभव दर्ज करें')
      return false
    }
    return true
  }

  const handleSubmitForm = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      
      const url = selectedDoctor 
        ? `${serverUrl}doctor_management.php?action=update`
        : `${serverUrl}doctor_management.php?action=add`

      const method = selectedDoctor ? 'PUT' : 'POST'
      const payload = selectedDoctor 
        ? { ...formData, id: selectedDoctor.id }
        : formData

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        alert(selectedDoctor ? 'चिकित्सक की जानकारी सफलतापूर्वक अपडेट की गई!' : 'नया चिकित्सक सफलतापूर्वक जोड़ा गया!')
        setShowAddForm(false)
        setSelectedDoctor(null)
        
        // Refresh doctors list
        const fetchResponse = await fetch(`${serverUrl}doctor_management.php`)
        const fetchResult = await fetchResponse.json()
        if (fetchResult.success) {
          setDoctors(fetchResult.data || [])
        }
      } else {
        alert('त्रुटि: ' + result.message)
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('फॉर्म जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।')
    } finally {
      setIsSubmitting(false)
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
                <p className="stat-number">{doctors.length}</p>
                <span className="stat-icon">👩‍⚕️</span>
              </div>
              <div className="stat-card">
                <h3>सक्रिय चिकित्सक</h3>
                <p className="stat-number">{doctors.filter(d => d.status === 'सक्रिय').length}</p>
                <span className="stat-icon">✅</span>
              </div>
              <div className="stat-card">
                <h3>कुल जांच</h3>
                <p className="stat-number">{doctors.length > 0 ? doctors.reduce((sum: number, doc) => sum + doc.totalScreenings, 0) : 0}</p>
                <span className="stat-icon">📊</span>
              </div>
              <div className="stat-card">
                <h3>औसत अनुभव</h3>
                <p className="stat-number">{doctors.length > 0 ? Math.round(doctors.reduce((sum: number, doc) => sum + doc.experience, 0) / doctors.length) : 0} वर्ष</p>
                <span className="stat-icon">🎓</span>
              </div>
            </div>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="चिकित्सक का नाम खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <button className="btn-primary" onClick={handleAddDoctor}>
            नया चिकित्सक जोड़ें
          </button>
        </div>

        {/* Doctors Table */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="doctors-table">
              <thead>
                <tr>
                  <th>चिकित्सक</th>
                  <th>अस्पताल</th>
                  <th>संपर्क</th>
                  <th>अनुभव</th>
                  <th>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map(doctor => (
                  <tr key={doctor.id}>
                    <td>
                      <div className="doctor-info">
                        <div className="doctor-avatar">🩺</div>
                        <div className="doctor-details">
                          <div className="doctor-name">{doctor.name || doctor.doctorName}</div>
                          <div className="doctor-email">{doctor.email}</div>
                          <div className="doctor-specialization">{doctor.specialization || 'सामान्य चिकित्सा'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="hospital-info">
                        <div className="hospital-name">{doctor.hospital || doctor.hospitalname}</div>
                        <div className="hospital-type">{doctor.hospitalType}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="phone">{doctor.phone || doctor.phoneNo}</div>
                        <div className="screenings">{doctor.totalScreenings || 0} जांच</div>
                      </div>
                    </td>
                    <td>
                      <div className="experience-info">
                        <span className="experience-years">{doctor.experience} वर्ष</span>
                        <span className={`status-badge ${doctor.status === 'सक्रिय' ? 'status-active' : 'status-inactive'}`}>
                          {doctor.status || 'सक्रिय'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-small btn-primary"
                          onClick={() => handleViewDoctor(doctor)}
                          title="विवरण देखें"
                        >
                        विवरण देखें
                        </button>
                        <button 
                          className="btn-small btn-secondary"
                          onClick={() => handleEditDoctor(doctor)}
                          title="संपादित करें"
                        >
                        संपादित करें
                        </button>
                        <button 
                          className="btn-small btn-danger"
                          onClick={() => handleDeleteDoctor(doctor)}
                          title="हटाएं"
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
        </div>
      </div>

      {/* Add/Edit Doctor Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content doctor-form-modal">
            <div className="modal-header">
              <h3>{selectedDoctor ? 'चिकित्सक संपादित करें' : 'नया चिकित्सक जोड़ें'}</h3>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="doctor-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="doctorName">चिकित्सक का नाम *</label>
                    <input
                      type="text"
                      id="doctorName"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      placeholder="डॉ. राम कुमार"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">ईमेल पता *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="doctor@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNo">फ़ोन नंबर *</label>
                    <input
                      type="tel"
                      id="phoneNo"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">अनुभव (वर्षों में)</label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="5"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hospitalType">अस्पताल का प्रकार</label>
                    <select
                      id="hospitalType"
                      name="hospitalType"
                      value={formData.hospitalType}
                      onChange={handleInputChange}
                    >
                      <option value="">प्रकार चुनें</option>
                      <option value="सरकारी">सरकारी अस्पताल</option>
                      <option value="प्राइवेट">प्राइवेट अस्पताल</option>
                      <option value="ट्रस्ट">ट्रस्ट अस्पताल</option>
                      <option value="कॉर्पोरेट">कॉर्पोरेट अस्पताल</option>
                      <option value="अन्य">अन्य</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hospitalname">अस्पताल का नाम</label>
                    <input
                      type="text"
                      id="hospitalname"
                      name="hospitalname"
                      value={formData.hospitalname}
                      onChange={handleInputChange}
                      placeholder="सरकारी अस्पताल, नई दिल्ली"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="password">
                      {selectedDoctor ? 'नया पासवर्ड (खाली छोड़ें यदि बदलना नहीं है)' : 'पासवर्ड *'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="पासवर्ड दर्ज करें"
                      minLength={6}
                      required={!selectedDoctor}
                    />
                    <small className="form-hint">
                      {selectedDoctor ? 
                        'पासवर्ड बदलने के लिए ही भरें, अन्यथा खाली छोड़ दें' : 
                        'कम से कम 6 अक्षर का पासवर्ड दर्ज करें'
                      }
                    </small>
                  </div>
                </div>

                <div className="form-footer">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setShowAddForm(false)}
                    disabled={isSubmitting}
                  >
                    रद्द करें
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'सुरक्षित कर रहे हैं...' : (selectedDoctor ? 'अपडेट करें' : 'जोड़ें')}
                  </button>
                </div>
              </form>
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
