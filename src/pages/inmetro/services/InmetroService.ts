import type { IOrdemServico } from '../types'
import ApiService from '@/services/ApiService'

class InmetroService extends ApiService {
  // 👉 methods

  // Finalizar ordem de serviço
  async finalizar<T>(ordemServico: IOrdemServico) {
    return await this.update<T>(ordemServico, `${ordemServico.id}/finalizar`)
  }

  // Reprovar ordem de serviço
  async reprovar<T>(ordemServico: IOrdemServico) {
    return await this.update<T>(ordemServico, `${ordemServico.id}/reprovar`)
  }

  // Buscar anexos de uma ordem de serviço
  async buscarAnexo<T>(ordemServicoId: string) {
    return await this.fetchAll<T>(undefined, `${ordemServicoId}/anexos`)
  }

  // Buscar materiais/equipamentos de uma ordem de serviço
  async buscarMateriais<T>(ordemServicoId: string) {
    return await this.fetchAll<T>(undefined, `${ordemServicoId}/materiais`)
  }
}

export default new InmetroService('os')
