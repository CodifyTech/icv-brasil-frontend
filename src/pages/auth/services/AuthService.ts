import ApiService from '@/services/ApiService'

class AuthService extends ApiService {
  public async login<T>(payload: any) {
    return await this.postOrPutRequest<T>('POST', payload, 'login')
  }

  public async logout() {
    return await this.postOrPutRequest('POST', {}, 'logout')
  }

  public async forgotPassword(email: string) {
    return await this.postOrPutRequest('POST', {
      email,
    }, 'forgot-password')
  }

  public async resetPassword(email: string, token: string, newPassword: string, confirmPassword: string) {
    return await this.postOrPutRequest('POST', {
      email,
      password: newPassword,
      password_confirmation: confirmPassword,
      token,
    }, 'reset-password')
  }
}
export default new AuthService('auth')
