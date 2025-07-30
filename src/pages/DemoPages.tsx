import { useState } from 'react'
import { User } from '../App'
import { 
  DoctorManagement, 
  ChildrenReports, 
  AddReportForm, 
  DoctorProfile 
} from './index'
import './DemoPages.css'

interface DemoPagesProps {
  user: User
  onBack: () => void
}

const DemoPages = ({ user, onBack }: DemoPagesProps) => {
  const [currentPage, setCurrentPage] = useState<string | null>(null)

  const pages = [
    {
      id: 'doctor-management',
      title: 'चिकित्सक प्रबंधन',
      description: 'सभी चिकित्सकों की जानकारी, खोज और प्रबंधन',
      icon: '👩‍⚕️',
      component: DoctorManagement,
      category: 'admin'
    },
    {
      id: 'children-reports',
      title: 'बच्चों की रिपोर्ट',
      description: 'बच्चों की स्वास्थ्य जांच रिपोर्ट और विस्तृत जानकारी',
      icon: '👶',
      component: ChildrenReports,
      category: 'admin'
    },
    {
      id: 'add-report-form',
      title: 'नई रिपोर्ट जोड़ें',
      description: 'बच्चे की नई स्वास्थ्य जांच रिपोर्ट बनाएं',
      icon: '📝',
      component: AddReportForm,
      category: 'doctor'
    },
    {
      id: 'doctor-profile',
      title: 'चिकित्सक प्रोफाइल',
      description: 'चिकित्सक की व्यक्तिगत और व्यावसायिक जानकारी',
      icon: '👤',
      component: DoctorProfile,
      category: 'doctor'
    }
  ]

  const adminPages = pages.filter(page => page.category === 'admin')
  const doctorPages = pages.filter(page => page.category === 'doctor')

  if (currentPage) {
    const selectedPage = pages.find(page => page.id === currentPage)
    if (selectedPage) {
      const Component = selectedPage.component
      return (
        <Component 
          user={user} 
          onBack={() => setCurrentPage(null)}
        />
      )
    }
  }

  return (
    <div className="demo-pages">
      <div className="page-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← मुख्य डैशबोर्ड पर वापस
          </button>
          <div>
            <h1>इंटरफेस डेमो</h1>
            <p>सभी उपलब्ध pages और interfaces का प्रदर्शन</p>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="intro-section">
          <div className="intro-card">
            <h2>🎯 डेमो के बारे में</h2>
            <p>
              यह डेमो पेज आपको धड़कन हेल्थकेयर सिस्टम के सभी interfaces दिखाता है। 
              प्रत्येक कार्ड पर क्लिक करके आप विभिन्न pages का अनुभव कर सकते हैं।
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">👩‍⚕️</span>
              <span>चिकित्सक प्रबंधन</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👶</span>
              <span>बच्चों की रिपोर्ट</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📝</span>
              <span>फॉर्म भरना</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👤</span>
              <span>प्रोफाइल प्रबंधन</span>
            </div>
          </div>
        </div>

        <div className="pages-section">
          <h2>प्रशासक (Admin) Pages</h2>
          <div className="pages-grid">
            {adminPages.map(page => (
              <div 
                key={page.id} 
                className="page-card admin-card"
                onClick={() => setCurrentPage(page.id)}
              >
                <div className="page-icon">{page.icon}</div>
                <div className="page-content">
                  <h3>{page.title}</h3>
                  <p>{page.description}</p>
                </div>
                <div className="page-arrow">→</div>
              </div>
            ))}
          </div>

          <h2>चिकित्सक (Doctor) Pages</h2>
          <div className="pages-grid">
            {doctorPages.map(page => (
              <div 
                key={page.id} 
                className="page-card doctor-card"
                onClick={() => setCurrentPage(page.id)}
              >
                <div className="page-icon">{page.icon}</div>
                <div className="page-content">
                  <h3>{page.title}</h3>
                  <p>{page.description}</p>
                </div>
                <div className="page-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tech-info">
          <h2>तकनीकी जानकारी</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Frontend</h4>
              <p>React 19.1.0 + TypeScript</p>
            </div>
            <div className="tech-item">
              <h4>Styling</h4>
              <p>CSS Modules + Government Theme</p>
            </div>
            <div className="tech-item">
              <h4>Components</h4>
              <p>Modular & Reusable</p>
            </div>
            <div className="tech-item">
              <h4>Language</h4>
              <p>Hindi Interface</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoPages
