import ApiService from '@/services/ApiService'

class PropostaService extends ApiService {
  // 👉 methods
  async fetchFilial(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/filial')
  }
}
export default new PropostaService('proposta')
