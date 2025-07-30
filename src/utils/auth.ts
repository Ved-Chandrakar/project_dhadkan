// Auth utility functions
export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
  // Redirect to login page
  window.location.href = '/'
}

export const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error parsing stored user data:', error)
    return null
  }
}

export const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

export const isAuthenticated = () => {
  const token = getAuthToken()
  const userData = getStoredUserData()
  return !!(token && userData)
}
