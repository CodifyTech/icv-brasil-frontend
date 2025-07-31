import ApiService from '@/services/ApiService'

class PropostaService extends ApiService {
  // 👉 methods
  async fetchCliente(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/clientes')
  }
}
export default new PropostaService('proposta')
