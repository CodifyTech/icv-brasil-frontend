import ApiService from '@/services/ApiService'

class PerfisService extends ApiService {
  async listPermissions<T>() {
    return this.getOrDeleteRequest<T>('GET', {}, 'list/permissions')
  }
}
export default new PerfisService('roles')
