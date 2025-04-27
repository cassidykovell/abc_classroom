import decode from "jwt-decode"

class AuthService {
  getProfile() {
    return decode(this.getToken())
  }

  loggedIn() {
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token)
      if (decoded.exp < Date.now() / 1000) {
        return true
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  getToken() {
    return localStorage.getItem("auth_token")
  }

  login(idToken) {
    localStorage.setItem("auth_token", idToken)
    window.location.assign("/")
  }

  logout() {
    localStorage.removeItem("auth_token")
    window.location.assign("/")
  }
}

export default new AuthService()
