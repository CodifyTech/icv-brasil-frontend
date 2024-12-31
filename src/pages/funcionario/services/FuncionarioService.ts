import ApiService from '@/services/ApiService'

class FuncionarioService extends ApiService {
  // 👉 methods
  async fetchUser(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/user')
  }
}
export default new FuncionarioService('funcionario')
