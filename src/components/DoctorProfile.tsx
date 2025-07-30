import React from 'react'

interface DoctorProfileProps {
  user: {
    name: string
    email: string
  }
  onBack: () => void
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ user, onBack }) => {
  // Mock data based on doctors schema
  const doctorData = {
    id: 1,
    doctorName: user.name || 'डॉ. प्रिया शर्मा',
    hospitalType: 'सरकारी अस्पताल',
    hospitalname: 'सरकारी अस्पताल, गुड़गांव',
    phoneNo: '9876543210',
    experience: 8,
    email: user.email || 'dr.priya@gov.in',
    createdAt: '2020-03-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  }

  const mockStats = {
    totalChildrenScreened: 145,
    positiveCases: 12,
    reportsThisWeek: 23,
    pendingReports: 3
  }

  return (
    <div>
      <div className="content-header">
        <button className="back-btn" onClick={onBack}>
          ← वापस
        </button>
        <h3>चिकित्सक प्रोफाइल</h3>
        <p>व्यक्तिगत जानकारी और सेटिंग्स</p>
      </div>
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <span className="avatar-icon">👩‍⚕️</span>
              <h4>{doctorData.doctorName}</h4>
            </div>
            
            <div className="profile-details">
              <div className="detail-row">
                <label>चिकित्सक ID:</label>
                <span>{doctorData.id}</span>
              </div>
              <div className="detail-row">
                <label>चिकित्सक नाम:</label>
                <span>{doctorData.doctorName}</span>
              </div>
              <div className="detail-row">
                <label>अस्पताल का प्रकार:</label>
                <span>{doctorData.hospitalType}</span>
              </div>
              <div className="detail-row">
                <label>अस्पताल का नाम:</label>
                <span>{doctorData.hospitalname}</span>
              </div>
              <div className="detail-row">
                <label>मोबाइल नंबर:</label>
                <span>{doctorData.phoneNo}</span>
              </div>
              <div className="detail-row">
                <label>अनुभव (वर्ष):</label>
                <span>{doctorData.experience} वर्ष</span>
              </div>
              <div className="detail-row">
                <label>ईमेल पता:</label>
                <span>{doctorData.email}</span>
              </div>
              <div className="detail-row">
                <label>खाता बनाया गया:</label>
                <span>{new Date(doctorData.createdAt).toLocaleDateString('hi-IN')}</span>
              </div>
              {/* <div className="detail-row">
                <label>अंतिम अपडेट:</label>
                <span>{new Date(doctorData.updatedAt).toLocaleDateString('hi-IN')}</span>
              </div> */}
            </div>
          </div>
          
          {/* <div className="profile-stats">
            <h5>प्रदर्शन सांख्यिकी</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{mockStats.totalChildrenScreened}</span>
                <span className="stat-label">कुल जांच</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{mockStats.positiveCases}</span>
                <span className="stat-label">सकारात्मक मामले</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{mockStats.reportsThisWeek}</span>
                <span className="stat-label">इस सप्ताह की रिपोर्ट</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{mockStats.pendingReports}</span>
                <span className="stat-label">लंबित रिपोर्ट</span>
              </div>
            </div>
          </div> */}
          
          {/* <div className="profile-actions">
            <button className="btn-primary">प्रोफाइल संपादित करें</button>
            <button className="btn-secondary">पासवर्ड बदलें</button>
            <button className="btn-outline">सेटिंग्स</button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
