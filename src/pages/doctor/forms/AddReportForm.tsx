import { useState } from 'react'
import { User } from '../../../App'
import serverUrl from '../../server'

interface AddReportFormProps {
  user: User
}

interface FormData {
  name: string
  age: string
  gender: 'पुरुष' | 'महिला' | ''
  fatherName: string // Only for children
  mobileNo: string
  schoolName: string
  haveAadhar: 'yes' | 'no' | ''
  haveShramik: 'yes' | 'no' | ''
  aadharPhoto: File | null
  shramikPhoto: File | null
  heartStatus: 'संदिग्ध' | 'संदेह नहीं' | ''
  notes: string
}

const AddReportForm = ({ user }: AddReportFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    fatherName: '',
    mobileNo: '',
    schoolName: '',
    haveAadhar: '',
    haveShramik: '',
    aadharPhoto: null,
    shramikPhoto: null,
    heartStatus: '',
    notes: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('बच्चे')

  // Clear form when category changes
  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    
    // Clear father name if switching to teacher or employee
    if (newCategory !== 'बच्चे' && formData.fatherName) {
      setFormData(prev => ({
        ...prev,
        fatherName: ''
      }))
    }
    
    // Reset to step 1 when changing category
    setCurrentStep(1)
  }

  // Responsive check
  const isMobile = window.innerWidth <= 768
  const isSmallMobile = window.innerWidth <= 576

  // Styles object
  const styles = {
    addReportForm: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    },
    pageHeader: {
      background: 'linear-gradient(180deg, #71a876ff 0%, #3f704fff 100%)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(63, 112, 79, 0.2)'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    headerLeft: {
      flex: 1
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    categoryDropdown: {
      padding: '0.75rem 1.25rem',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '140px',
      outline: 'none',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      appearance: 'none' as any,
      WebkitAppearance: 'none' as any,
      MozAppearance: 'none' as any,
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem center',
      backgroundSize: '1rem',
      paddingRight: '3rem'
    },
    categoryDropdownHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
    },
    pageHeaderH1: {
      fontSize: isSmallMobile ? '1.8rem' : '2.5rem',
      margin: 0,
      fontWeight: '700'
    },
    pageHeaderP: {
      margin: '0.5rem 0 0 0',
      opacity: 0.9,
      fontSize: '1.1rem'
    },
    contentContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '1rem' : '2rem',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
      gap: isMobile ? '1rem' : '2rem'
    },
    progressSteps: {
      gridColumn: '1 / -1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: isMobile ? '1rem' : '2rem',
      marginBottom: '2rem',
      background: 'white',
      padding: isMobile ? '1rem' : '2rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row'
    },
    step: {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column' as 'column' | 'row',
      alignItems: 'center',
      gap: '0.5rem',
      position: 'relative' as const,
      flex: 1,
      maxWidth: isMobile ? 'none' : '200px',
      width: isMobile ? '100%' : 'auto',
      padding: isMobile ? '0.5rem' : '0',
      justifyContent: isMobile ? 'flex-start' : 'center'
    },
    stepAfter: {
      content: "''",
      position: 'absolute' as const,
      top: '20px',
      right: '-50%',
      width: '100%',
      height: '2px',
      backgroundColor: '#e9ecef',
      zIndex: 1,
      display: isMobile ? 'none' : 'block'
    },
    stepAfterCompleted: {
      backgroundColor: '#28a745'
    },
    stepNumber: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#e9ecef',
      color: '#6c757d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold' as const,
      fontSize: '1.1rem',
      position: 'relative' as const,
      zIndex: 2,
      transition: 'all 0.3s ease'
    },
    stepNumberActive: {
      background: 'linear-gradient(45deg, #71a876ff, #3f704fff)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(63, 112, 79, 0.3)'
    },
    stepNumberCompleted: {
      background: 'linear-gradient(45deg, #3f704fff, #71a876ff)',
      color: 'white',
      boxShadow: '0 2px 8px rgba(113, 168, 118, 0.2)'
    },
    stepLabel: {
      fontSize: isSmallMobile ? '0.8rem' : '0.9rem',
      textAlign: 'center' as const,
      color: '#6c757d',
      fontWeight: '500'
    },
    stepLabelActive: {
      color: '#3f704fff',
      fontWeight: '600'
    },
    stepLabelCompleted: {
      color: '#71a876ff',
      fontWeight: '600'
    },
    formContainer: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    formStep: {
      width: '100%'
    },
    formStepH3: {
      color: '#3f704fff',
      fontSize: '1.5rem',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '3px solid #e9ecef',
      position: 'relative' as const
    },
    formStepH3After: {
      content: "''",
      position: 'absolute' as const,
      bottom: '-3px',
      left: 0,
      width: '60px',
      height: '3px',
      background: 'linear-gradient(45deg, #71a876ff, #3f704fff)'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: isMobile ? '1rem' : '1.5rem',
      marginBottom: '2rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    formGroupFullWidth: {
      gridColumn: '1 / -1'
    },
    formGroupLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#2c3e50'
    },
    formInput: {
      padding: '0.75rem',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease',
      backgroundColor: '#ffffff'
    },
    formInputFocus: {
      outline: 'none',
      borderColor: '#3f704fff',
      boxShadow: '0 0 0 3px rgba(63, 112, 79, 0.1)',
      transform: 'translateY(-1px)'
    },
    formInputInvalid: {
      borderColor: '#dc3545'
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
      marginTop: '0.5rem'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1.5rem',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'white',
      position: 'relative' as const
    },
    radioOptionHover: {
      borderColor: '#3f704fff',
      background: '#f8fff8',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(63, 112, 79, 0.1)'
    },
    radioInput: {
      display: 'none'
    },
    radioMark: {
      width: '20px',
      height: '20px',
      border: '2px solid #e9ecef',
      borderRadius: '50%',
      position: 'relative' as const,
      transition: 'all 0.3s ease',
      flexShrink: 0,
      marginTop: '2px'
    },
    radioMarkChecked: {
      borderColor: '#3f704fff',
      background: '#3f704fff'
    },
    radioMarkAfter: {
      content: "''",
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '8px',
      height: '8px',
      background: 'white',
      borderRadius: '50%'
    },
    radioText: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.25rem'
    },
    radioTextStrong: {
      fontSize: '1.1rem',
      fontWeight: '600'
    },
    radioTextSmall: {
      fontSize: '0.9rem',
      color: '#6c757d',
      lineHeight: 1.3
    },
    fileUploadContainer: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      border: '2px dashed #e9ecef',
      borderRadius: '8px',
      padding: '1rem',
      background: '#f8f9fa',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    fileUploadContainerHover: {
      borderColor: '#71a876ff',
      background: '#f8fff8'
    },
    fileUploadInput: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer'
    },
    fileUploadText: {
      color: '#6c757d',
      fontSize: '0.9rem',
      textAlign: 'center' as const,
      width: '100%'
    },
    fileUploadTextHover: {
      color: '#71a876ff'
    },
    formNavigation: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginTop: '2rem',
      paddingTop: '2rem',
      borderTop: '1px solid #e9ecef',
      flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row'
    },
    navSpacer: {
      flex: 1,
      display: isMobile ? 'none' : 'block'
    },
    btnPrimary: {
      background: 'linear-gradient(45deg, #71a876ff, #3f704fff)',
      color: 'white',
      border: 'none',
      padding: isMobile ? '1rem' : '0.75rem 2rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      boxShadow: '0 2px 8px rgba(63, 112, 79, 0.2)',
      width: isMobile ? '100%' : 'auto'
    },
    btnPrimaryHover: {
      background: 'linear-gradient(45deg, #3f704fff, #71a876ff)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(63, 112, 79, 0.3)'
    },
    btnPrimaryDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    },
    btnSecondary: {
      background: 'white',
      color: '#3f704fff',
      border: '2px solid #3f704fff',
      padding: isMobile ? '1rem' : '0.75rem 2rem',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      width: isMobile ? '100%' : 'auto'
    },
    btnSecondaryHover: {
      background: '#3f704fff',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(63, 112, 79, 0.2)'
    },
    doctorInfoCard: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef',
      height: 'fit-content',
      position: isMobile ? 'static' : 'sticky' as 'static' | 'sticky',
      top: '2rem',
      order: isMobile ? -1 : 'initial'
    },
    doctorAvatar: {
      fontSize: '3rem',
      textAlign: 'center' as const,
      marginBottom: '1rem',
      background: '#f8f9fa',
      padding: '1rem',
      borderRadius: '50%',
      border: '3px solid #e9ecef',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem auto'
    },
    doctorDetailsH4: {
      color: '#3f704fff',
      fontSize: '1.1rem',
      marginBottom: '1rem',
      textAlign: 'center' as const
    },
    doctorDetailsP: {
      marginBottom: '0.5rem',
      fontSize: '0.9rem',
      color: '#495057'
    },
    doctorDetailsStrong: {
      color: '#2c3e50'
    }
  }

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data:image/jpeg;base64, part and just return the base64 string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'aadharPhoto' | 'shramikPhoto') => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      fatherName: '',
      mobileNo: '',
      schoolName: '',
      haveAadhar: '',
      haveShramik: '',
      aadharPhoto: null,
      shramikPhoto: null,
      heartStatus: '',
      notes: ''
    })
    setCurrentStep(1)
    
    // Reset file input fields
    const aadharInput = document.getElementById('aadharPhoto') as HTMLInputElement
    const shramikInput = document.getElementById('shramikPhoto') as HTMLInputElement
    if (aadharInput) aadharInput.value = ''
    if (shramikInput) shramikInput.value = ''
  }

  const validateStep = (step: number): boolean => {
    const isChild = selectedCategory === 'बच्चे'
    
    switch (step) {
      case 1:
        if (isChild) {
          return !!(formData.name && formData.age && formData.gender && formData.fatherName && formData.mobileNo)
        } else {
          // For teacher, no father name required
          return !!(formData.name && formData.age && formData.gender && formData.mobileNo)
        }
      case 2:
        return !!(formData.schoolName && formData.haveAadhar && formData.haveShramik)
      case 3:
        return !!(formData.heartStatus)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    } else {
      alert('कृपया सभी आवश्यक फील्ड भरें।')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      alert('कृपया सभी आवश्यक फील्ड भरें।')
      return
    }

    setIsSubmitting(true)

    try {
      // Convert files to base64 if they exist
      let aadharPhotoBase64 = null
      let shramikPhotoBase64 = null
      
      try {
        if (formData.aadharPhoto && formData.aadharPhoto instanceof File) {
          aadharPhotoBase64 = await fileToBase64(formData.aadharPhoto)
        }
        if (formData.shramikPhoto && formData.shramikPhoto instanceof File) {
          shramikPhotoBase64 = await fileToBase64(formData.shramikPhoto)
        }
      } catch (fileError) {
        console.error('Error converting files to base64:', fileError)
        throw new Error('फाइल अपलोड करने में त्रुटि हुई। कृपया दोबारा कोशिश करें।')
      }
      
      // Create JSON payload based on selected category
      const isChild = selectedCategory === 'बच्चे'
      const isEmployee = selectedCategory === 'कर्मचारी'
      
      const jsonData = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        ...(isChild && { fatherName: formData.fatherName }), // Only include fatherName for children
        mobileNo: formData.mobileNo,
        schoolName: formData.schoolName,
        haveAadhar: formData.haveAadhar,
        haveShramik: formData.haveShramik,
        heartStatus: formData.heartStatus,
        notes: formData.notes,
        dr_id: user.id,
        // Add category parameter for backend
        category: isEmployee ? 'employee' : 'teacher', // employee or teacher (children go to different endpoint)
        aadharPhoto: aadharPhotoBase64 && formData.aadharPhoto ? {
          data: aadharPhotoBase64,
          name: formData.aadharPhoto.name || 'aadhar.jpg',
          type: formData.aadharPhoto.type || 'image/jpeg'
        } : null,
        shramikPhoto: shramikPhotoBase64 && formData.shramikPhoto ? {
          data: shramikPhotoBase64,
          name: formData.shramikPhoto.name || 'shramik.jpg',
          type: formData.shramikPhoto.type || 'image/jpeg'
        } : null
      }

      // Use different API endpoints based on category
      const apiUrl = isChild 
        ? `${serverUrl}dhadkan_add_child_report.php`
        : `${serverUrl}dhadkan_add_teacher_emp_report.php` // This handles both teacher and employee
      
      // Submit to appropriate endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      })
      
      // Check if response is ok and has content
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
      }
      
      // Check if response has content
      const responseText = await response.text()
      if (!responseText.trim()) {
        throw new Error('Server returned empty response')
      }
      
      // Try to parse JSON
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Response text:', responseText)
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        throw new Error(`Invalid JSON response from server: ${errorMessage}`)
      }
      
      if (result.success) {
        let entityType, entityData
        
        if (isChild) {
          entityType = 'बच्चे'
          entityData = result.data.child
        } else if (isEmployee) {
          entityType = 'कर्मचारी'
          entityData = result.data.employee
        } else {
          entityType = 'शिक्षक'
          entityData = result.data.teacher
        }
        
        alert(`${entityType} की रिपोर्ट सफलतापूर्वक जमा हो गई!\n\n${entityType} का नाम: ${entityData.name}\nजांच ID: ${entityData.id}`)
        
        // Reset form after successful submission
        resetForm()
        
      } else {
        throw new Error(result.message || 'फॉर्म जमा करने में त्रुटि हुई')
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      let errorMessage = 'रिपोर्ट जमा करने में त्रुटि हुई। कृपया दोबारा कोशिश करें।'
      
      // Show specific error message if available
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => {
    const isChild = selectedCategory === 'बच्चे'
    const isTeacher = selectedCategory === 'शिक्षक'
    
    return (
    <div style={styles.formStep}>
      <h3 style={{...styles.formStepH3, position: 'relative'}}>
        {isChild ? 'बच्चे की मूलभूत जानकारी' : isTeacher ? 'शिक्षक की मूलभूत जानकारी' : 'मूलभूत जानकारी'}
        <div style={styles.formStepH3After}></div>
      </h3>
      
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.formGroupLabel}>
            {isChild ? 'बच्चे का नाम *' : isTeacher ? 'शिक्षक का नाम *' : 'नाम *'}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={isChild ? 'बच्चे का पूरा नाम दर्ज करें' : isTeacher ? 'शिक्षक का पूरा नाम दर्ज करें' : 'पूरा नाम दर्ज करें'}
            required
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="age" style={styles.formGroupLabel}>उम्र (वर्ष में) *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder={isChild ? 'बच्चे की उम्र दर्ज करें' : isTeacher ? 'शिक्षक की उम्र दर्ज करें' : 'उम्र दर्ज करें'}
            min="0"
            max={isChild ? "18" : "65"}
            required
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="gender" style={styles.formGroupLabel}>लिंग *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            style={styles.formInput}
          >
            <option value="">लिंग चुनें</option>
            <option value="पुरुष">पुरुष</option>
            <option value="महिला">महिला</option>
          </select>
        </div>

        {/* Show Father's Name only for children */}
        {isChild && (
          <div style={styles.formGroup}>
            <label htmlFor="fatherName" style={styles.formGroupLabel}>पिता का नाम *</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              placeholder="पिता का पूरा नाम दर्ज करें"
              required
              style={styles.formInput}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label htmlFor="mobileNo" style={styles.formGroupLabel}>मोबाइल नंबर *</label>
          <input
            type="tel"
            id="mobileNo"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            placeholder="10 अंकों का मोबाइल नंबर"
            pattern="[0-9]{10}"
            maxLength={10}
            required
            style={styles.formInput}
          />
        </div>
      </div>
    </div>
    )
  }

  const renderStep2 = () => (
    <div style={styles.formStep}>
      <h3 style={{...styles.formStepH3, position: 'relative'}}>
        विद्यालय और दस्तावेज़ जानकारी
        <div style={styles.formStepH3After}></div>
      </h3>
      
      <div style={styles.formGrid}>
        <div style={{...styles.formGroup, ...styles.formGroupFullWidth}}>
          <label htmlFor="schoolName" style={styles.formGroupLabel}>स्कूल का नाम *</label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            placeholder="विद्यालय का पूरा नाम दर्ज करें"
            required
            style={styles.formInput}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="haveAadhar" style={styles.formGroupLabel}>आधार कार्ड उपलब्ध है? *</label>
          <select
            id="haveAadhar"
            name="haveAadhar"
            value={formData.haveAadhar}
            onChange={handleInputChange}
            required
            style={styles.formInput}
          >
            <option value="">चुनें</option>
            <option value="yes">हाँ</option>
            <option value="no">नहीं</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="haveShramik" style={styles.formGroupLabel}>श्रमिक कार्ड उपलब्ध है? *</label>
          <select
            id="haveShramik"
            name="haveShramik"
            value={formData.haveShramik}
            onChange={handleInputChange}
            required
            style={styles.formInput}
          >
            <option value="">चुनें</option>
            <option value="yes">हाँ</option>
            <option value="no">नहीं</option>
          </select>
        </div>

        {formData.haveAadhar === 'yes' && (
          <div style={styles.formGroup}>
            <label htmlFor="aadharPhoto" style={styles.formGroupLabel}>आधार कार्ड की फोटो</label>
            <div style={styles.fileUploadContainer}>
              <input
                type="file"
                id="aadharPhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'aadharPhoto')}
                style={styles.fileUploadInput}
              />
              <div style={styles.fileUploadText}>
                {formData.aadharPhoto ? formData.aadharPhoto.name : 'आधार कार्ड की फोटो चुनें'}
              </div>
            </div>
          </div>
        )}

        {formData.haveShramik === 'yes' && (
          <div style={styles.formGroup}>
            <label htmlFor="shramikPhoto" style={styles.formGroupLabel}>श्रमिक कार्ड की फोटो</label>
            <div style={styles.fileUploadContainer}>
              <input
                type="file"
                id="shramikPhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'shramikPhoto')}
                style={styles.fileUploadInput}
              />
              <div style={styles.fileUploadText}>
                {formData.shramikPhoto ? formData.shramikPhoto.name : 'श्रमिक कार्ड की फोटो चुनें'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => {
    const isChild = selectedCategory === 'बच्चे'
    const isTeacher = selectedCategory === 'शिक्षक'
    
    return (
    <div style={styles.formStep}>
      <h3 style={{...styles.formStepH3, position: 'relative'}}>
        स्वास्थ्य निदान और टिप्पणी
        <div style={styles.formStepH3After}></div>
      </h3>
      
      <div style={styles.formGrid}>
        <div style={{...styles.formGroup, ...styles.formGroupFullWidth}}>
          <label htmlFor="heartStatus" style={styles.formGroupLabel}>हृदय की स्थिति *</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioOption}>
              <input
                type="radio"
                name="heartStatus"
                value="संदेह नहीं"
                checked={formData.heartStatus === 'संदेह नहीं'}
                onChange={handleInputChange}
                required
                style={styles.radioInput}
              />
              <span style={{
                ...styles.radioMark,
                ...(formData.heartStatus === 'संदेह नहीं' ? styles.radioMarkChecked : {})
              }}>
                {formData.heartStatus === 'संदेह नहीं' && <div style={styles.radioMarkAfter}></div>}
              </span>
              <span style={styles.radioText}>
                <strong style={styles.radioTextStrong}>संदेह नहीं</strong>
                <small style={styles.radioTextSmall}>
                  {isChild ? 'बच्चे की हृदय की स्थिति सामान्य है' : 
                   isTeacher ? 'शिक्षक की हृदय की स्थिति सामान्य है' : 
                   'हृदय की स्थिति सामान्य है'}
                </small>
              </span>
            </label>

            <label style={styles.radioOption}>
              <input
                type="radio"
                name="heartStatus"
                value="संदिग्ध"
                checked={formData.heartStatus === 'संदिग्ध'}
                onChange={handleInputChange}
                required
                style={styles.radioInput}
              />
              <span style={{
                ...styles.radioMark,
                ...(formData.heartStatus === 'संदिग्ध' ? styles.radioMarkChecked : {})
              }}>
                {formData.heartStatus === 'संदिग्ध' && <div style={styles.radioMarkAfter}></div>}
              </span>
              <span style={styles.radioText}>
                <strong style={styles.radioTextStrong}>संदिग्ध</strong>
                <small style={styles.radioTextSmall}>
                  {isChild ? 'बच्चे की हृदय की स्थिति में कुछ समस्या हो सकती है' : 
                   isTeacher ? 'शिक्षक की हृदय की स्थिति में कुछ समस्या हो सकती है' : 
                   'हृदय की स्थिति में कुछ समस्या हो सकती है'}
                </small>
              </span>
            </label>
          </div>
        </div>

        <div style={{...styles.formGroup, ...styles.formGroupFullWidth}}>
          <label htmlFor="notes" style={styles.formGroupLabel}>अतिरिक्त टिप्पणी</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="कोई अतिरिक्त जानकारी, सिफारिश या टिप्पणी लिखें..."
            rows={5}
            style={{...styles.formInput, resize: 'vertical' as const}}
          />
        </div>
      </div>
    </div>
    )
  }

  return (
    <>
      <style>
        {`
          .category-dropdown option {
            background-color: #3f704fff !important;
            color: white !important;
            padding: 0.75rem !important;
            font-weight: 600 !important;
            border: none !important;
          }
          
          .category-dropdown option:hover {
            background-color: #71a876ff !important;
          }
          
          .category-dropdown option:checked {
            background-color: #71a876ff !important;
            color: white !important;
          }
          
          .category-dropdown::-webkit-scrollbar {
            width: 8px;
          }
          
          .category-dropdown::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          
          .category-dropdown::-webkit-scrollbar-thumb {
            background: #3f704fff;
            border-radius: 4px;
          }
          
          .category-dropdown::-webkit-scrollbar-thumb:hover {
            background: #71a876ff;
          }
        `}
      </style>
      <div style={styles.addReportForm}>
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageHeaderH1}>नई रिपोर्ट जोड़ें</h1>
            <p style={styles.pageHeaderP}>
              {selectedCategory === 'बच्चे' ? 'बच्चे की स्वास्थ्य जांच रिपोर्ट भरें' : 
               selectedCategory === 'शिक्षक' ? 'शिक्षक की स्वास्थ्य जांच रिपोर्ट भरें' : 
               selectedCategory === 'कर्मचारी' ? 'कर्मचारी की स्वास्थ्य जांच रिपोर्ट भरें' :
               'स्वास्थ्य जांच रिपोर्ट भरें'}
            </p>
          </div>
          <div style={styles.headerRight}>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={styles.categoryDropdown}
              className="category-dropdown"
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.categoryDropdownHover)}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <option value="बच्चे">बच्चे</option>
              <option value="शिक्षक">शिक्षक</option>
              <option value="कर्मचारी">कर्मचारी</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.contentContainer}>
        {/* Progress Steps */}
        <div style={styles.progressSteps}>
          <div style={{
            ...styles.step,
            ...(currentStep >= 1 ? {} : {}),
            ...(currentStep > 1 ? {} : {})
          }}>
            <div style={{
              ...styles.stepNumber,
              ...(currentStep >= 1 ? styles.stepNumberActive : {}),
              ...(currentStep > 1 ? styles.stepNumberCompleted : {})
            }}>1</div>
            <div style={{
              ...styles.stepLabel,
              ...(currentStep >= 1 ? styles.stepLabelActive : {}),
              ...(currentStep > 1 ? styles.stepLabelCompleted : {})
            }}>मूलभूत जानकारी</div>
          </div>
          <div style={{
            ...styles.step,
            ...(currentStep >= 2 ? {} : {}),
            ...(currentStep > 2 ? {} : {})
          }}>
            <div style={{
              ...styles.stepNumber,
              ...(currentStep >= 2 ? styles.stepNumberActive : {}),
              ...(currentStep > 2 ? styles.stepNumberCompleted : {})
            }}>2</div>
            <div style={{
              ...styles.stepLabel,
              ...(currentStep >= 2 ? styles.stepLabelActive : {}),
              ...(currentStep > 2 ? styles.stepLabelCompleted : {})
            }}>विद्यालय और दस्तावेज़ जानकारी</div>
          </div>
          <div style={{
            ...styles.step,
            ...(currentStep >= 3 ? {} : {}),
            ...(currentStep > 3 ? {} : {})
          }}>
            <div style={{
              ...styles.stepNumber,
              ...(currentStep >= 3 ? styles.stepNumberActive : {}),
              ...(currentStep > 3 ? styles.stepNumberCompleted : {})
            }}>3</div>
            <div style={{
              ...styles.stepLabel,
              ...(currentStep >= 3 ? styles.stepLabelActive : {}),
              ...(currentStep > 3 ? styles.stepLabelCompleted : {})
            }}>स्वास्थ्य निदान</div>
          </div>
        </div>

        {/* Form Content */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div style={styles.formNavigation}>
              {currentStep > 1 && (
                <button 
                  type="button" 
                  style={styles.btnSecondary}
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  ← पिछला
                </button>
              )}
              
              <div style={styles.navSpacer}></div>
              
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  style={styles.btnPrimary}
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  अगला →
                </button>
              ) : (
                <button 
                  type="submit" 
                  style={{
                    ...styles.btnPrimary,
                    ...(isSubmitting ? styles.btnPrimaryDisabled : {})
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'जमा हो रही है...' : 
                   `${selectedCategory === 'बच्चे' ? 'बच्चे की' : 
                       selectedCategory === 'शिक्षक' ? 'शिक्षक की' : 
                       selectedCategory === 'कर्मचारी' ? 'कर्मचारी की' : ''} रिपोर्ट जमा करें`}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Doctor Info */}
        <div style={styles.doctorInfoCard}>
          <div style={styles.doctorAvatar}>🩺</div>
          <div>
            <h4 style={styles.doctorDetailsH4}>
              {selectedCategory === 'बच्चे' ? 'बच्चे की रिपोर्ट तैयार करने वाले चिकित्सक' : 
               selectedCategory === 'शिक्षक' ? 'शिक्षक की रिपोर्ट तैयार करने वाले चिकित्सक' : 
               selectedCategory === 'कर्मचारी' ? 'कर्मचारी की रिपोर्ट तैयार करने वाले चिकित्सक' :
               'रिपोर्ट तैयार करने वाले चिकित्सक'}
            </h4>
            <p style={styles.doctorDetailsP}><strong style={styles.doctorDetailsStrong}>नाम:</strong> {user.name}</p>
            <p style={styles.doctorDetailsP}><strong style={styles.doctorDetailsStrong}>ईमेल:</strong> {user.email}</p>
            <p style={styles.doctorDetailsP}><strong style={styles.doctorDetailsStrong}>तारीख:</strong> {new Date().toLocaleDateString('hi-IN')}</p>
            <p style={styles.doctorDetailsP}><strong style={styles.doctorDetailsStrong}>समय:</strong> {new Date().toLocaleTimeString('hi-IN')}</p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default AddReportForm
