import ApiService from '@/services/ApiService'

class UsersService extends ApiService {
  async fetchRolesList<T>(): Promise<T> {
    return this.fetchAll<T>({}, 'list/roles')
  }
}
export default new UsersService('users')
