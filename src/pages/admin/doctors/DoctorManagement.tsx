import { useState, useEffect } from 'react'
import { User } from '../../../App'
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

  // Inline Styles
  const styles = {
    doctorManagement: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    pageHeader: {
      background: 'linear-gradient(135deg, #FF9933 0%, #e88822 100%)',
      color: 'white',
      padding: '2rem 0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      position: 'relative' as const,
      zIndex: 1
    },
    headerText: {
      h1: {
        fontSize: '2.5rem',
        margin: 0,
        fontWeight: 700,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      p: {
        margin: '0.5rem 0 0 0',
        opacity: 0.9,
        fontSize: '1.1rem',
        fontWeight: 400
      }
    },
    contentContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '2rem'
    },
    statsSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem'
    },
    statCard: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #e9ecef',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer'
    },
    statCardBefore: {
      content: '""',
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #FF9933, #e88822)'
    },
    statContent: {
      flex: 1
    },
    statTitle: {
      color: '#495057',
      fontSize: '0.95rem',
      margin: '0 0 0.75rem 0',
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: 0,
      color: '#FF9933',
      lineHeight: 1
    },
    statIcon: {
      fontSize: '3rem',
      opacity: 0.2,
      marginLeft: '1rem'
    },
    controlsSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
      overflow: 'hidden' as const
    },
    searchFilterSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem',
      flexWrap: 'wrap' as const,
      width: '100%'
    },
    searchContainer: {
      flex: 1,
      minWidth: '280px',
      maxWidth: '450px',
      overflow: 'hidden' as const
    },
    searchBox: {
      position: 'relative' as const,
      width: '100%'
    },
    searchInput: {
      width: '100%',
      maxWidth: '100%',
      padding: '1rem 3rem 1rem 1.25rem',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: '#f8f9fa',
      boxSizing: 'border-box' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis'
    },
    searchInputFocus: {
      outline: 'none',
      borderColor: '#FF9933',
      background: 'white',
      boxShadow: '0 0 0 4px rgba(255, 153, 51, 0.1)'
    },
    searchIcon: {
      position: 'absolute' as const,
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6c757d',
      fontSize: '1.2rem'
    },
    actionContainer: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center'
    },
    btnPrimary: {
      background: 'linear-gradient(45deg, #FF9933, #e88822)',
      color: 'white',
      border: 'none',
      padding: '1rem 1.5rem',
      borderRadius: '10px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap' as const,
      fontSize: '1rem',
      boxShadow: '0 2px 8px rgba(255, 153, 51, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    btnIcon: {
      fontSize: '1.2rem'
    },
    resultsSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    resultsSummary: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap' as const,
      gap: '1rem'
    },
    resultsTitle: {
      color: '#2c3e50',
      fontSize: '1.5rem',
      margin: 0,
      fontWeight: 600
    },
    resultsText: {
      color: '#6c757d',
      margin: 0,
      fontSize: '1rem'
    },
    tableSection: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden' as const,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    tableContainer: {
      width: '100%'
    },
    tableWrapper: {
      width: '100%',
      overflowX: 'auto' as const,
      WebkitOverflowScrolling: 'touch' as any
    },
    doctorsTable: {
      width: '100%',
      minWidth: '1000px',
      borderCollapse: 'collapse' as const
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #FF9933 0%, #e88822 100%)',
      color: 'white',
      padding: '1.25rem 1rem',
      textAlign: 'left' as const,
      fontWeight: 600,
      fontSize: '0.95rem',
      whiteSpace: 'nowrap' as const
    },
    tableCell: {
      padding: '1.25rem 1rem',
      borderBottom: '1px solid #e9ecef',
      fontSize: '0.9rem',
      verticalAlign: 'middle' as const
    },
    doctorRow: {
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    doctorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    doctorAvatar: {
      fontSize: '1.8rem',
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      padding: '0.75rem',
      borderRadius: '50%',
      border: '2px solid #e9ecef',
      flexShrink: 0,
      transition: 'all 0.3s ease'
    },
    doctorDetails: {
      flex: 1,
      minWidth: 0
    },
    doctorName: {
      fontWeight: 600,
      color: '#2c3e50',
      marginBottom: '0.25rem',
      fontSize: '1rem',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis'
    },
    doctorEmail: {
      fontSize: '0.85rem',
      color: '#6c757d',
      marginBottom: '0.25rem',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis'
    },
    doctorSpecialization: {
      fontSize: '0.8rem',
      color: '#FF9933',
      fontWeight: 500,
      background: 'rgba(255, 153, 51, 0.1)',
      padding: '0.125rem 0.5rem',
      borderRadius: '12px',
      display: 'inline-block'
    },
    hospitalInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    },
    hospitalName: {
      fontWeight: 500,
      color: '#2c3e50',
      fontSize: '0.95rem',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis'
    },
    hospitalType: {
      fontSize: '0.8rem',
      color: '#6c757d',
      background: '#f8f9fa',
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      display: 'inline-block',
      border: '1px solid #e9ecef',
      maxWidth: 'fit-content'
    },
    contactInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.5rem'
    },
    phone: {
      fontWeight: 500,
      color: '#2c3e50',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    screenings: {
      fontSize: '0.8rem',
      color: '#17a2b8',
      background: '#e3f2fd',
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      display: 'inline-block',
      border: '1px solid #bee5eb',
      maxWidth: 'fit-content'
    },
    experienceInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      alignItems: 'center',
      textAlign: 'center' as const
    },
    experienceYears: {
      fontWeight: 600,
      color: '#FF9933',
      fontSize: '0.95rem'
    },
    statusBadge: {
      padding: '0.375rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 600,
      textAlign: 'center' as const,
      minWidth: '80px',
      display: 'inline-block',
      transition: 'all 0.3s ease'
    },
    statusActive: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    statusInactive: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnSmall: {
      padding: '0.5rem',
      fontSize: '1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      transition: 'all 0.3s ease',
      minWidth: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnSmallPrimary: {
      background: '#FF9933',
      color: 'white'
    },
    btnSmallSecondary: {
      background: '#6c757d',
      color: 'white'
    },
    btnSmallDanger: {
      background: '#dc3545',
      color: 'white'
    },
    noResults: {
      textAlign: 'center' as const,
      padding: '4rem 2rem',
      color: '#6c757d'
    },
    noResultsIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: 0.5
    },
    noResultsTitle: {
      color: '#495057',
      fontSize: '1.5rem',
      marginBottom: '0.5rem'
    },
    noResultsText: {
      fontSize: '1rem',
      opacity: 0.8
    },
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      background: 'white',
      borderRadius: '16px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '85vh',
      overflowY: 'auto' as const,
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'modalSlideIn 0.3s ease-out'
    },
    modalHeader: {
      padding: '2rem 2rem 1rem 2rem',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalTitle: {
      margin: 0,
      color: '#FF9933',
      fontSize: '1.75rem',
      fontWeight: 600
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6c757d',
      padding: '0.5rem',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalBody: {
      padding: '2rem'
    },
    modalFooter: {
      padding: '1rem 2rem 2rem 2rem',
      borderTop: '1px solid #e9ecef',
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    formGroupFullWidth: {
      gridColumn: '1 / -1'
    },
    formLabel: {
      color: '#495057',
      fontWeight: 600,
      marginBottom: '0.5rem',
      fontSize: '0.95rem'
    },
    formInput: {
      padding: '0.875rem',
      border: '2px solid #e9ecef',
      borderRadius: '10px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'white'
    },
    formInputFocus: {
      outline: 'none',
      borderColor: '#FF9933',
      boxShadow: '0 0 0 4px rgba(255, 153, 51, 0.1)'
    },
    formHint: {
      color: '#6c757d',
      fontSize: '0.85rem',
      marginTop: '0.25rem',
      fontStyle: 'italic'
    },
    formFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #e9ecef'
    },
    btnSecondary: {
      background: 'white',
      color: '#FF9933',
      border: '2px solid #FF9933',
      padding: '0.75rem 1.5rem',
      borderRadius: '10px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem'
    },
    detailSection: {
      background: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      marginBottom: '1rem'
    },
    detailTitle: {
      color: '#FF9933',
      fontSize: '1.25rem',
      marginBottom: '1rem',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '0.5rem',
      fontWeight: 600
    },
    detailText: {
      marginBottom: '0.75rem',
      lineHeight: 1.6,
      fontSize: '0.95rem'
    },
    detailStrong: {
      color: '#2c3e50',
      fontWeight: 600,
      display: 'inline-block',
      minWidth: '120px'
    },
    // Additional missing styles
    modalCloseBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    form: {
      width: '100%'
    }
  }

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
    <div style={styles.doctorManagement}>
      {/* Page Header Section */}
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.headerText.h1}>चिकित्सक प्रबंधन</h1>
            <p style={styles.headerText.p}>सभी चिकित्सकों की जानकारी और प्रबंधन - {user.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={styles.contentContainer}>
        {/* Statistics Cards Section */}
        <section style={styles.statsSection}>
          <div style={styles.statsRow}>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={styles.statCardBefore}></div>
              <div style={styles.statContent}>
                <h3 style={styles.statTitle}>कुल चिकित्सक</h3>
                <p style={styles.statNumber}>{doctors.length}</p>
              </div>
              <span style={styles.statIcon}>👩‍⚕️</span>
            </div>
            {/* <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={styles.statCardBefore}></div>
              {/* <div style={styles.statContent}>
                <h3 style={styles.statTitle}>सक्रिय चिकित्सक</h3>
                <p style={styles.statNumber}>{doctors.filter(d => d.status === 'सक्रिय').length}</p>
              </div> */}
              {/* <span style={styles.statIcon}>✅</span>
            </div> */} 
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={styles.statCardBefore}></div>
              <div style={styles.statContent}>
                <h3 style={styles.statTitle}>कुल जांच</h3>
                <p style={styles.statNumber}>{doctors.length > 0 ? doctors.reduce((sum: number, doc) => sum + doc.totalScreenings, 0) : 0}</p>
              </div>
              <span style={styles.statIcon}>📊</span>
            </div>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={styles.statCardBefore}></div>
              <div style={styles.statContent}>
                <h3 style={styles.statTitle}>औसत अनुभव</h3>
                <p style={styles.statNumber}>{doctors.length > 0 ? Math.round(doctors.reduce((sum: number, doc) => sum + doc.experience, 0) / doctors.length) : 0} वर्ष</p>
              </div>
              <span style={styles.statIcon}>🎓</span>
            </div>
          </div>
        </section>

        {/* Search and Controls Section */}
        <section style={styles.controlsSection}>
          <div style={styles.searchFilterSection}>
            <div style={styles.searchContainer}>
              <div style={styles.searchBox}>
                <input
                  type="text"
                  placeholder="चिकित्सक का नाम या अस्पताल खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                  onFocus={(e) => Object.assign(e.target.style, styles.searchInputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                    e.target.style.background = '#f8f9fa'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <span style={styles.searchIcon}>🔍</span>
              </div>
            </div>
            
            <div style={styles.actionContainer}>
              <button 
                style={styles.btnPrimary} 
                onClick={handleAddDoctor}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #e88822, #d77711)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 153, 51, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #FF9933, #e88822)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 153, 51, 0.2)'
                }}
              >
                <span style={styles.btnIcon}>➕</span>
                नया चिकित्सक जोड़ें
              </button>
            </div>
          </div>
        </section>

        {/* Results Summary Section */}
        <section style={styles.resultsSection}>
          <div style={styles.resultsSummary}>
            <h3 style={styles.resultsTitle}>चिकित्सक सूची</h3>
            <p style={styles.resultsText}>{filteredDoctors.length} में से {doctors.length} चिकित्सक दिखाए जा रहे हैं</p>
          </div>
        </section>

        {/* Doctors Table Section */}
        <section style={styles.tableSection}>
          <div style={styles.tableContainer}>
            {filteredDoctors.length === 0 ? (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>👩‍⚕️</div>
                <h3 style={styles.noResultsTitle}>कोई चिकित्सक नहीं मिला</h3>
                <p style={styles.noResultsText}>कृपया अपनी खोज बदलें या नया चिकित्सक जोड़ें</p>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.doctorsTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>चिकित्सक जानकारी</th>
                      <th style={styles.tableHeader}>अस्पताल विवरण</th>
                      <th style={styles.tableHeader}>संपर्क जानकारी</th>
                      <th style={styles.tableHeader}>अनुभव और स्थिति</th>
                      <th style={styles.tableHeader}>कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map(doctor => (
                      <tr 
                        key={doctor.id} 
                        style={styles.doctorRow}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa'
                          e.currentTarget.style.transform = 'scale(1.01)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        <td style={styles.tableCell}>
                          <div style={styles.doctorInfo}>
                            <div style={styles.doctorAvatar}>🩺</div>
                            <div style={styles.doctorDetails}>
                              <div style={styles.doctorName}>{doctor.name || doctor.doctorName}</div>
                              <div style={styles.doctorEmail}>{doctor.email}</div>
                              <div style={styles.doctorSpecialization}>{doctor.specialization || 'सामान्य चिकित्सा'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.hospitalInfo}>
                            <div style={styles.hospitalName}>{doctor.hospital || doctor.hospitalname}</div>
                            <div style={styles.hospitalType}>{doctor.hospitalType}</div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.contactInfo}>
                            <div style={styles.phone}>📞 {doctor.phone || doctor.phoneNo}</div>
                            <div style={styles.screenings}>📋 {doctor.totalScreenings || 0} जांच</div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.experienceInfo}>
                            <span style={styles.experienceYears}>{doctor.experience} वर्ष अनुभव</span>
                            <span style={{
                              ...styles.statusBadge,
                              ...(doctor.status === 'सक्रिय' ? styles.statusActive : styles.statusInactive)
                            }}>
                              {doctor.status || 'सक्रिय'}
                            </span>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionButtons}>
                            <button 
                              style={{...styles.btnSmall, ...styles.btnSmallPrimary}}
                              onClick={() => handleViewDoctor(doctor)}
                              title="विवरण देखें"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e88822'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 153, 51, 0.3)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FF9933'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            >
                              👁️
                            </button>
                            <button 
                              style={{...styles.btnSmall, ...styles.btnSmallSecondary}}
                              onClick={() => handleEditDoctor(doctor)}
                              title="संपादित करें"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#5a6268'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.3)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#6c757d'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            >
                              ✏️
                            </button>
                            <button 
                              style={{...styles.btnSmall, ...styles.btnSmallDanger}}
                              onClick={() => handleDeleteDoctor(doctor)}
                              title="हटाएं"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#c82333'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#dc3545'
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add/Edit Doctor Modal */}
      {showAddForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedDoctor ? 'चिकित्सक संपादित करें' : 'नया चिकित्सक जोड़ें'}</h3>
              <button style={styles.modalCloseBtn} onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <div style={styles.modalBody}>
              <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
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
