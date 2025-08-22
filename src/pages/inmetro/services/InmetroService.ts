import type { IOrdemServico } from '../types'
import ApiService from '@/services/ApiService'
import useApi from '@/composables/useApi'

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

  // Gerar código de ordem de serviço
  async gerarCodigoOS(clienteId: string) {
    return await this.post({ cliente_id: clienteId }, 'gerar-codigo')
  }

  // Exportar CSV - método específico para download de arquivo
  async exportarCSV(filtros?: any): Promise<Blob> {
    // Limpa campos vazios do filtro
    const cleanedFiltros = filtros
      ? Object.fromEntries(
        Object.entries(filtros).filter(([, value]) => value !== null && value !== undefined && value !== ''),
      )
      : {}
    
    // Constrói a query string
    const queryString = new URLSearchParams(cleanedFiltros as any).toString()
    const url = queryString ? `os/exportar/csv?${queryString}` : 'os/exportar/csv'
    
    const response = await useApi.request({
      url,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Accept: 'text/csv',
      },
    })

    return response.data
  }
}

export default new InmetroService('os')
