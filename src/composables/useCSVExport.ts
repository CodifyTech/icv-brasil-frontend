import { type CSVExportOptions, CSVUtils } from '@/utils/csvUtils'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

/**
 * Composable para facilitar exportações CSV
 */
export function useCSVExport() {
  const snackbarStore = useSnackbarStore()

  /**
   * Exporta dados para CSV
   */
  const exportToCSV = async (
    data: Record<string, any>[],
    headers?: string[],
    options?: CSVExportOptions,
  ) => {
    try {
      if (!data || data.length === 0) {
        snackbarStore.showSnackbar({
          text: 'Nenhum dado disponível para exportação.',
          color: 'warning',
          timeout: 3000,
        })

        return
      }

      CSVUtils.downloadCSVFromArray(data, headers, options)

      snackbarStore.showSnackbar({
        text: 'CSV exportado com sucesso!',
        color: 'success',
        timeout: 3000,
      })
    }
    catch (error) {
      console.error('Erro ao exportar CSV:', error)

      snackbarStore.showSnackbar({
        text: 'Erro ao exportar CSV. Tente novamente.',
        color: 'error',
        timeout: 4000,
      })
    }
  }

  /**
   * Exporta blob para CSV
   */
  const exportBlobToCSV = async (
    blob: Blob,
    options?: CSVExportOptions,
  ) => {
    try {
      CSVUtils.downloadCSVFromBlob(blob, options)

      snackbarStore.showSnackbar({
        text: 'CSV exportado com sucesso!',
        color: 'success',
        timeout: 3000,
      })
    }
    catch (error) {
      console.error('Erro ao exportar CSV:', error)

      snackbarStore.showSnackbar({
        text: 'Erro ao exportar CSV. Tente novamente.',
        color: 'error',
        timeout: 4000,
      })
    }
  }

  /**
   * Formata dados de OS para CSV
   */
  const formatOSDataForCSV = (ordensServico: any[]) => {
    return ordensServico.map(os => ({
      'Nº OS': os.codigo || '',
      'Nº Pedido': os.num_pedido_compra || '',
      'Nº Relatório': os.num_relatorio || '',
      'Cliente': os.cliente?.razao_social || os.cliente?.nome_fantasia || '',
      'Fornecedor': os.fornecedor || '',
      'Responsável': os.responsavel?.nome || '',
      'Escopo': os.escopo_acreditacao?.nome || '',
      'Tipo Serviço': os.tipo_servico?.nome || '',
      'Material/Equipamento': os.descritivo || '',
      'Data Execução': CSVUtils.formatDateForCSV(os.data_execucao),
      'Resultado': os.resultado || '',
      'Status': os.status || '',
      'Observações': CSVUtils.formatStringForCSV(os.observacoes),
    }))
  }

  return {
    exportToCSV,
    exportBlobToCSV,
    formatOSDataForCSV,
    CSVUtils,
  }
}
