import { defineStore } from 'pinia'
import InmetroService from '../services/InmetroService'
import type { IFiltrosInmetro, IOrdemServico } from '../types'
import ClienteService from '@/pages/cliente/services/ClienteService'
import type { ICliente } from '@/pages/cliente/types'
import type { IEscopo } from '@/pages/escopo/types'
import type { IFuncionario } from '@/pages/funcionario/types'
import type { ITipoServico } from '@/pages/tiposervico/types'

export const useInmetroStore = defineStore('inmetro', () => {
  // State
  const ordensServico = ref<IOrdemServico[]>([])
  const ordemServicoAtual = ref<IOrdemServico | null>(null)

  // Form state
  const formRef = ref(null)

  const formData = ref<Partial<IOrdemServico>>({
    materialEquipamentos: [],
    anexos: [],
  })

  const loading = ref({
    list: false,
    item: false,
    save: false,
    relatorios: false,
    upload: false,
    destroy: false,
  })

  const filtros = ref<IFiltrosInmetro>({})
  const clientes = ref<ICliente[]>([])
  const escopos = ref<IEscopo[]>([])
  const tiposServico = ref<ITipoServico[]>([])
  const responsaveis = ref<IFuncionario[]>([])

  // Pagination
  const page = ref(1)
  const itemsPerPage = ref(10)
  const searchTerm = ref('')
  const isSearching = ref(false)

  // Getters
  const statusOptions = computed(() => [
    { value: 'em_analise', title: 'Em Análise', color: 'info' },
    { value: 'andamento', title: 'Andamento', color: 'warning' },
    { value: 'finalizado', title: 'Finalizado', color: 'success' },
  ])

  // Actions
  const fetchOrdensServico = async (options = {}) => {
    loading.value.list = true
    try {
      const { data } = await InmetroService.fetchAll<IOrdemServico[]>({ ...filtros.value, ...options }, 'ordem-servico')

      ordensServico.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar ordens de serviço:', error)
      throw error
    }
    finally {
      loading.value.list = false
    }
  }

  const fetchRelatoriosFinalizados = async (options = {}) => {
    loading.value.relatorios = true
    try {
      const { data } = await InmetroService.fetchAll({ ...filtros.value, ...options }, 'relatorios-finalizados')

      ordensServico.value = data.data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar relatórios finalizados:', error)
      throw error
    }
    finally {
      loading.value.relatorios = false
    }
  }

  const fetchOrdemServico = async (id: string) => {
    loading.value.item = true
    try {
      const data = await InmetroService.fetch<IOrdemServico>(`ordem-servico/${id}`)

      ordemServicoAtual.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar ordem de serviço:', error)
      throw error
    }
    finally {
      loading.value.item = false
    }
  }

  const criarOrdemServico = async (dados: any) => {
    loading.value.save = true
    try {
      const { data } = await InmetroService.post(dados, 'ordem-servico', true)

      ordensServico.value.unshift(data)

      return data
    }
    catch (error) {
      console.error('Erro ao criar ordem de serviço:', error)
      throw error
    }
    finally {
      loading.value.save = false
    }
  }

  const alterarStatus = async (id: string, status: string) => {
    loading.value.save = true
    try {
      const { data } = await InmetroService.update({ status }, `ordem-servico/${id}/alterar-status`)

      // Atualizar na lista
      const index = ordensServico.value.findIndex(os => os.id === id)
      if (index !== -1)
        ordensServico.value[index] = data

      // Atualizar ordem atual
      if (ordemServicoAtual.value?.id === id)
        ordemServicoAtual.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao alterar status:', error)
      throw error
    }
    finally {
      loading.value.save = false
    }
  }

  const uploadAnexos = async (id: string, anexos: File[], inmetroFlags: Record<string, boolean>) => {
    loading.value.upload = true
    try {
      const formDataUpload = new FormData()

      anexos.forEach(anexo => {
        formDataUpload.append('novos_anexos[]', anexo)
      })

      Object.entries(inmetroFlags).forEach(([fileName, flag]) => {
        if (flag)
          formDataUpload.append(`inmetro_flags[${fileName}]`, 'true')
      })

      const { data } = await InmetroService.post(formDataUpload, `ordem-servico/${id}/upload-anexos`)

      if (ordemServicoAtual.value?.id === id)
        ordemServicoAtual.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao fazer upload de anexos:', error)
      throw error
    }
    finally {
      loading.value.upload = false
    }
  }

  const exportarCSV = async () => {
    try {
      const response = await InmetroService.fetchAll({ ...filtros.value }, 'exportar-csv')

      // Criar URL do blob e fazer download
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `relatorios_inmetro_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }
    catch (error) {
      console.error('Erro ao exportar CSV:', error)
      throw error
    }
  }

  const fetchClientes = async () => {
    try {
      const data = await ClienteService.fetchAll<ICliente[]>({}, 'listar/clientes')

      clientes.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar clientes:', error)
      throw error
    }
  }

  const fetchEscopo = async () => {
    try {
      const data = await InmetroService.fetchAll<IEscopo[]>({}, 'listar/escopo')

      escopos.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar escopo:', error)
      throw error
    }
  }

  const fetchResponsavel = async () => {
    try {
      const data = await InmetroService.fetchAll<IFuncionario[]>({}, 'listar/responsaveis')

      responsaveis.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar responsáveis:', error)
      throw error
    }
  }

  const fetchTipoServico = async () => {
    try {
      const data = await InmetroService.fetchAll<ITipoServico[]>({}, 'listar/tipo-servico')

      tiposServico.value = data

      return data
    }
    catch (error) {
      console.error('Erro ao buscar tipo servico:', error)
      throw error
    }
  }

  const resetFiltros = () => {
    filtros.value = {}
  }

  const resetOrdemAtual = () => {
    ordemServicoAtual.value = null
  }

  // Métodos adicionais para o formulário
  const save = async () => {
    return await criarOrdemServico(formData.value)
  }

  const update = async () => {
    if (!formData.value.id)
      return

    const { data } = await InmetroService.update(formData.value, `ordem-servico/${formData.value.id}`)

    return data
  }

  // Métodos para a tabela
  const loadMore = async () => {
    page.value++

    return await fetchOrdensServico({ page: page.value })
  }

  const search = async (searchValue: string) => {
    searchTerm.value = searchValue
    isSearching.value = true
    page.value = 1

    return await fetchOrdensServico({ search: searchValue, page: 1 })
  }

  const searchAgain = async () => {
    return await search(searchTerm.value)
  }

  const resetForm = () => {
    formData.value = {}
    formRef.value = null
  }

  const loadClientes = async () => {
    return await fetchClientes()
  }

  const uploadAnexo = async (ordemId: string, file: File, isInmetro: boolean) => {
    return await uploadAnexos(ordemId, [file], { [file.name]: isInmetro })
  }

  const resetSearch = () => {
    searchTerm.value = ''
    isSearching.value = false
    page.value = 1
    filtros.value = {}
  }

  const destroy = async (id: string) => {
    loading.value.destroy = true
    try {
      await InmetroService.destroy(`ordem-servico/${id}`)

      ordensServico.value = ordensServico.value.filter(os => os.id !== id)
    }
    catch (error) {
      console.error('Erro ao deletar ordem de serviço:', error)
      throw error
    }
    finally {
      loading.value.destroy = false
    }
  }

  const dialogDestroy = (id: string) => {
    return () => destroy(id)
  }

  const onOrderBy = async (orderBy: string) => {
    return await fetchOrdensServico({ orderBy })
  }

  const downloadRelatorioPDF = async (id?: string) => {
    if (!id)
      return

    try {
      const response = await InmetroService.fetch(`relatorio/${id}/pdf`)

      // Criar URL do blob e fazer download
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `relatorio_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }
    catch (error) {
      console.error('Erro ao baixar PDF do relatório:', error)
      throw error
    }
  }

  return {
    // State
    ordensServico,
    ordemServicoAtual,
    formRef,
    formData,
    loading,
    filtros,
    clientes,
    page,
    itemsPerPage,
    searchTerm,
    isSearching,
    escopos,
    tiposServico,
    responsaveis,

    // Getters
    statusOptions,

    // Actions
    fetchEscopo,
    fetchTipoServico,
    fetchResponsavel,
    fetchOrdensServico,
    fetchRelatoriosFinalizados,
    fetchOrdemServico,
    criarOrdemServico,
    alterarStatus,
    uploadAnexos,
    exportarCSV,
    downloadRelatorioPDF,
    fetchClientes,
    resetFiltros,
    resetOrdemAtual,
    save,
    update,
    resetForm,
    loadClientes,
    uploadAnexo,
    loadMore,
    search,
    searchAgain,
    resetSearch,
    destroy,
    dialogDestroy,
    onOrderBy,
  }
})
