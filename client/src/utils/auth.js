import { jwtDecode as decode } from 'jwt-decode';

class AuthService {
  // Get user data from token
  getProfile() {
    return decode(this.getToken());
  }

  // Check if user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Set token to localStorage and redirect to dashboard
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/dashboard');
  }

  // Clear token from localStorage and redirect to homepage
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
