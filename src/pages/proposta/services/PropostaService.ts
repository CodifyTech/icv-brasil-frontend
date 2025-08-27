import ApiService from '@/services/ApiService'

class PropostaService extends ApiService {
  // 👉 methods
  async fetchCliente(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/clientes')
  }

  async fetchFuncionarios(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/funcionarios')
  }
}
export default new PropostaService('proposta')
