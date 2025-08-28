import { PropostaEnum } from '@/enums/PropostaStatusEnum'
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

  async fetchTipoServico(search?: string) {
    return await this.getOrDeleteRequest('GET', {
      search,
    }, 'listar/tipo-servico')
  }

  async updateStatus<T>(id: string, status: string, observacao?: string) {
    return await this.postOrPutRequest<T>('PUT', {
      status,
      observacao,
    }, `${id}/status`)
  }

  async buscarPropostasPorCliente<T>(clienteId: string, statuses: string[] = [PropostaEnum.APROVADA, PropostaEnum.PERDIDA]) {
    return await this.getOrDeleteRequest<T>('GET', {
      statuses,
    }, `cliente/${clienteId}/propostas`)
  }
}
export default new PropostaService('proposta')
