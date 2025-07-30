import { useState } from 'react'
import { User } from '../../../App'
import './AddReportForm.css'

interface AddReportFormProps {
  user: User
  onBack: () => void
}

interface FormData {
  name: string
  gender: 'पुरुष' | 'महिला' | ''
  fatherName: string
  mobileNo: string
  schoolName: string
  haveAadhar: 'yes' | 'no' | ''
  haveShramik: 'yes' | 'no' | ''
  aadharPhoto: File | null
  shramikPhoto: File | null
  heartStatus: 'संदिग्ध' | 'संदेह नहीं' | ''
  notes: string
}

const AddReportForm = ({ user, onBack }: AddReportFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.gender && formData.fatherName && formData.mobileNo)
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would make the actual API call
      console.log('Form submitted:', formData)
      
      alert('रिपोर्ट सफलतापूर्वक जमा हो गई!')
      
      // Reset form
      setFormData({
        name: '',
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
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('रिपोर्ट जमा करने में त्रुटि हुई। कृपया दोबारा कोशिश करें।')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="form-step">
      <h3>बच्चे की मूलभूत जानकारी</h3>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">बच्चे का नाम *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="बच्चे का पूरा नाम दर्ज करें"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">लिंग *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">लिंग चुनें</option>
            <option value="पुरुष">पुरुष</option>
            <option value="महिला">महिला</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fatherName">पिता का नाम *</label>
          <input
            type="text"
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleInputChange}
            placeholder="पिता का पूरा नाम दर्ज करें"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNo">मोबाइल नंबर *</label>
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
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="form-step">
      <h3>शिक्षा और दस्तावेज़ जानकारी</h3>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="schoolName">स्कूल का नाम *</label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            placeholder="विद्यालय का पूरा नाम दर्ज करें"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="haveAadhar">आधार कार्ड उपलब्ध है? *</label>
          <select
            id="haveAadhar"
            name="haveAadhar"
            value={formData.haveAadhar}
            onChange={handleInputChange}
            required
          >
            <option value="">चुनें</option>
            <option value="yes">हाँ</option>
            <option value="no">नहीं</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="haveShramik">श्रमिक कार्ड उपलब्ध है? *</label>
          <select
            id="haveShramik"
            name="haveShramik"
            value={formData.haveShramik}
            onChange={handleInputChange}
            required
          >
            <option value="">चुनें</option>
            <option value="yes">हाँ</option>
            <option value="no">नहीं</option>
          </select>
        </div>

        {formData.haveAadhar === 'yes' && (
          <div className="form-group">
            <label htmlFor="aadharPhoto">आधार कार्ड की फोटो</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="aadharPhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'aadharPhoto')}
              />
              <div className="file-upload-text">
                {formData.aadharPhoto ? formData.aadharPhoto.name : 'आधार कार्ड की फोटो चुनें'}
              </div>
            </div>
          </div>
        )}

        {formData.haveShramik === 'yes' && (
          <div className="form-group">
            <label htmlFor="shramikPhoto">श्रमिक कार्ड की फोटो</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="shramikPhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'shramikPhoto')}
              />
              <div className="file-upload-text">
                {formData.shramikPhoto ? formData.shramikPhoto.name : 'श्रमिक कार्ड की फोटो चुनें'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="form-step">
      <h3>स्वास्थ्य निदान और टिप्पणी</h3>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="heartStatus">हृदय की स्थिति *</label>
          <div className="radio-group">
            <label className="radio-option normal">
              <input
                type="radio"
                name="heartStatus"
                value="संदेह नहीं"
                checked={formData.heartStatus === 'संदेह नहीं'}
                onChange={handleInputChange}
                required
              />
              <span className="radio-mark"></span>
              <span className="radio-text">
                <strong>संदेह नहीं</strong>
                <small>बच्चे की हृदय की स्थिति सामान्य है</small>
              </span>
            </label>

            <label className="radio-option suspicious">
              <input
                type="radio"
                name="heartStatus"
                value="संदिग्ध"
                checked={formData.heartStatus === 'संदिग्ध'}
                onChange={handleInputChange}
                required
              />
              <span className="radio-mark"></span>
              <span className="radio-text">
                <strong>संदिग्ध</strong>
                <small>बच्चे की हृदय की स्थिति में कुछ समस्या हो सकती है</small>
              </span>
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="notes">अतिरिक्त टिप्पणी</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="कोई अतिरिक्त जानकारी, सिफारिश या टिप्पणी लिखें..."
            rows={5}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="add-report-form">
      <div className="page-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← वापस
          </button>
          <div>
            <h1>नई रिपोर्ट जोड़ें</h1>
            <p>बच्चे की स्वास्थ्य जांच रिपोर्ट भरें</p>
          </div>
        </div>
      </div>

      <div className="content-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">मूलभूत जानकारी</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">शिक्षा और दस्तावेज़</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">स्वास्थ्य निदान</div>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="btn-secondary" onClick={prevStep}>
                  ← पिछला
                </button>
              )}
              
              <div className="nav-spacer"></div>
              
              {currentStep < 3 ? (
                <button type="button" className="btn-primary" onClick={nextStep}>
                  अगला →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'जमा हो रही है...' : 'रिपोर्ट जमा करें'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Doctor Info */}
        <div className="doctor-info-card">
          <div className="doctor-avatar">👩‍⚕️</div>
          <div className="doctor-details">
            <h4>रिपोर्ट तैयार करने वाले चिकित्सक</h4>
            <p><strong>नाम:</strong> {user.name}</p>
            <p><strong>ईमेल:</strong> {user.email}</p>
            <p><strong>तारीख:</strong> {new Date().toLocaleDateString('hi-IN')}</p>
            <p><strong>समय:</strong> {new Date().toLocaleTimeString('hi-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddReportForm
