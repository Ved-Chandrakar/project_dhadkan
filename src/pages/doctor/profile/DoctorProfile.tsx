import { useState } from 'react'
import { User } from '../../../App'
import './DoctorProfile.css'

interface DoctorProfileProps {
  user: User
  onBack: () => void
}

interface DoctorDetails {
  personalInfo: {
    name: string
    email: string
    phone: string
    dateOfBirth: string
    gender: 'पुरुष' | 'महिला'
    address: string
  }
  professionalInfo: {
    specialization: string
    medicalLicense: string
    hospital: string
    department: string
    experience: number
    qualification: string
    joiningDate: string
  }
  statistics: {
    totalScreenings: number
    thisMonthScreenings: number
    positiveCases: number
    pendingReports: number
  }
  preferences: {
    notifications: boolean
    emailAlerts: boolean
    language: 'हिंदी' | 'अंग्रेजी'
    theme: 'light' | 'dark'
  }
}

const DoctorProfile = ({ user, onBack }: DoctorProfileProps) => {
  const [activeTab, setActiveTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails>({
    personalInfo: {
      name: user.name || 'डॉ. प्रिया शर्मा',
      email: user.email || 'dr.priya@gov.in',
      phone: '9876543210',
      dateOfBirth: '1985-06-15',
      gender: 'महिला',
      address: 'सेक्टर 15, गुड़गांव, हरियाणा - 122001'
    },
    professionalInfo: {
      specialization: 'बाल चिकित्सक',
      medicalLicense: 'MCI12345678',
      hospital: 'सरकारी अस्पताल, गुड़गांव',
      department: 'बाल रोग विभाग',
      experience: 8,
      qualification: 'MBBS, MD (Pediatrics)',
      joiningDate: '2020-03-15'
    },
    statistics: {
      totalScreenings: 450,
      thisMonthScreenings: 35,
      positiveCases: 28,
      pendingReports: 5
    },
    preferences: {
      notifications: true,
      emailAlerts: true,
      language: 'हिंदी',
      theme: 'light'
    }
  })

  const [editForm, setEditForm] = useState(doctorDetails)

  const handleInputChange = (section: keyof DoctorDetails, field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = () => {
    setDoctorDetails(editForm)
    setIsEditing(false)
    alert('प्रोफाइल सफलतापूर्वक अपडेट हो गई!')
  }

  const handleCancel = () => {
    setEditForm(doctorDetails)
    setIsEditing(false)
  }

  const tabItems = [
    { id: 'personal', label: 'व्यक्तिगत जानकारी', icon: '👤' },
    { id: 'professional', label: 'व्यावसायिक जानकारी', icon: '🏥' },
    { id: 'statistics', label: 'सांख्यिकी', icon: '📊' },
    { id: 'preferences', label: 'सेटिंग्स', icon: '⚙️' }
  ]

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>व्यक्तिगत जानकारी</h3>
        {!isEditing && (
          <button className="btn-edit" onClick={() => setIsEditing(true)}>
            संपादित करें
          </button>
        )}
      </div>

      <div className="info-grid">
        <div className="info-group">
          <label>पूरा नाम</label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.personalInfo.name}
              onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
            />
          ) : (
            <p>{doctorDetails.personalInfo.name}</p>
          )}
        </div>

        <div className="info-group">
          <label>ईमेल पता</label>
          {isEditing ? (
            <input
              type="email"
              value={editForm.personalInfo.email}
              onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            />
          ) : (
            <p>{doctorDetails.personalInfo.email}</p>
          )}
        </div>

        <div className="info-group">
          <label>मोबाइल नंबर</label>
          {isEditing ? (
            <input
              type="tel"
              value={editForm.personalInfo.phone}
              onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            />
          ) : (
            <p>{doctorDetails.personalInfo.phone}</p>
          )}
        </div>

        <div className="info-group">
          <label>जन्म तिथि</label>
          {isEditing ? (
            <input
              type="date"
              value={editForm.personalInfo.dateOfBirth}
              onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            />
          ) : (
            <p>{new Date(doctorDetails.personalInfo.dateOfBirth).toLocaleDateString('hi-IN')}</p>
          )}
        </div>

        <div className="info-group">
          <label>लिंग</label>
          {isEditing ? (
            <select
              value={editForm.personalInfo.gender}
              onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
            >
              <option value="पुरुष">पुरुष</option>
              <option value="महिला">महिला</option>
            </select>
          ) : (
            <p>{doctorDetails.personalInfo.gender}</p>
          )}
        </div>

        <div className="info-group full-width">
          <label>पता</label>
          {isEditing ? (
            <textarea
              value={editForm.personalInfo.address}
              onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
              rows={3}
            />
          ) : (
            <p>{doctorDetails.personalInfo.address}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="edit-actions">
          <button className="btn-primary" onClick={handleSave}>
            सहेजें
          </button>
          <button className="btn-secondary" onClick={handleCancel}>
            रद्द करें
          </button>
        </div>
      )}
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>व्यावसायिक जानकारी</h3>
      </div>

      <div className="info-grid">
        <div className="info-group">
          <label>विशेषज्ञता</label>
          <p>{doctorDetails.professionalInfo.specialization}</p>
        </div>

        <div className="info-group">
          <label>मेडिकल लाइसेंस</label>
          <p>{doctorDetails.professionalInfo.medicalLicense}</p>
        </div>

        <div className="info-group">
          <label>अस्पताल</label>
          <p>{doctorDetails.professionalInfo.hospital}</p>
        </div>

        <div className="info-group">
          <label>विभाग</label>
          <p>{doctorDetails.professionalInfo.department}</p>
        </div>

        <div className="info-group">
          <label>अनुभव</label>
          <p>{doctorDetails.professionalInfo.experience} वर्ष</p>
        </div>

        <div className="info-group">
          <label>योग्यता</label>
          <p>{doctorDetails.professionalInfo.qualification}</p>
        </div>

        <div className="info-group">
          <label>ज्वाइनिंग तारीख</label>
          <p>{new Date(doctorDetails.professionalInfo.joiningDate).toLocaleDateString('hi-IN')}</p>
        </div>
      </div>
    </div>
  )

  const renderStatistics = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>कार्य सांख्यिकी</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <h4>कुल जांच</h4>
            <p className="stat-number">{doctorDetails.statistics.totalScreenings}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h4>इस महीने</h4>
            <p className="stat-number">{doctorDetails.statistics.thisMonthScreenings}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h4>सकारात्मक मामले</h4>
            <p className="stat-number">{doctorDetails.statistics.positiveCases}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h4>लंबित रिपोर्ट</h4>
            <p className="stat-number">{doctorDetails.statistics.pendingReports}</p>
          </div>
        </div>
      </div>

      <div className="performance-chart">
        <h4>मासिक प्रदर्शन</h4>
        <p>पिछले 6 महीनों में आपके द्वारा की गई जांच का विवरण:</p>
        <div className="chart-placeholder">
          <div className="chart-bar" style={{ height: '60%' }}>जन</div>
          <div className="chart-bar" style={{ height: '75%' }}>फर</div>
          <div className="chart-bar" style={{ height: '40%' }}>मार</div>
          <div className="chart-bar" style={{ height: '85%' }}>अप्र</div>
          <div className="chart-bar" style={{ height: '70%' }}>मई</div>
          <div className="chart-bar" style={{ height: '90%' }}>जून</div>
        </div>
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>सेटिंग्स और प्राथमिकताएं</h3>
      </div>

      <div className="preferences-grid">
        <div className="preference-group">
          <h4>नोटिफिकेशन सेटिंग्स</h4>
          
          <div className="preference-item">
            <label className="switch-label">
              <span>पुश नोटिफिकेशन</span>
              <div className="switch">
                <input
                  type="checkbox"
                  checked={doctorDetails.preferences.notifications}
                  onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>

          <div className="preference-item">
            <label className="switch-label">
              <span>ईमेल अलर्ट</span>
              <div className="switch">
                <input
                  type="checkbox"
                  checked={doctorDetails.preferences.emailAlerts}
                  onChange={(e) => handleInputChange('preferences', 'emailAlerts', e.target.checked)}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>
        </div>

        <div className="preference-group">
          <h4>डिस्प्ले सेटिंग्स</h4>
          
          <div className="preference-item">
            <label>भाषा</label>
            <select
              value={doctorDetails.preferences.language}
              onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
            >
              <option value="हिंदी">हिंदी</option>
              <option value="अंग्रेजी">अंग्रेजी</option>
            </select>
          </div>

          <div className="preference-item">
            <label>थीम</label>
            <select
              value={doctorDetails.preferences.theme}
              onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
            >
              <option value="light">हल्का</option>
              <option value="dark">गहरा</option>
            </select>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h4>खाता प्रबंधन</h4>
        <div className="danger-actions">
          <button className="btn-danger">पासवर्ड बदलें</button>
          <button className="btn-danger">खाता निष्क्रिय करें</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="doctor-profile">
      <div className="page-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← वापस
          </button>
          <div className="header-info">
            <div className="doctor-avatar-large">👩‍⚕️</div>
            <div>
              <h1>{doctorDetails.personalInfo.name}</h1>
              <p>{doctorDetails.professionalInfo.specialization}</p>
              <p>{doctorDetails.professionalInfo.hospital}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="profile-tabs">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="profile-content">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'professional' && renderProfessionalInfo()}
          {activeTab === 'statistics' && renderStatistics()}
          {activeTab === 'preferences' && renderPreferences()}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
