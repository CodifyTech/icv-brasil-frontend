import ApiService from '@/services/ApiService'

class FormacaoService extends ApiService {
  // 👉 methods
  async fetchFuncionario(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/funcionario')
  }
}
export default new FormacaoService('formacao')
