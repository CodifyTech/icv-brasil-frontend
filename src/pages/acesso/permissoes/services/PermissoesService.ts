import ApiService from '@/services/ApiService'

class PermissoesService extends ApiService {
  async fetchActions<T>() {
    return this.fetch<T>('list/actions')
  }

  async deleteAll(name: string) {
    return this.destroy(`destroy/all/${name}`)
  }
}
export default new PermissoesService('permission')
