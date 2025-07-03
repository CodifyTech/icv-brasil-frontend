import ClienteService from '@/pages/cliente/services/ClienteService'
import type { ICliente } from '@/pages/cliente/types'
import type { IEscopo } from '@/pages/escopo/types'
import type { IFuncionario } from '@/pages/funcionario/types'
import InmetroService from '@/pages/inmetro/services/InmetroService'
import type { IFiltrosInmetro, IMaterialEquipamento, IOrdemServico, IOrdemServicoAnexo } from '@/pages/inmetro/types'
import type { ITipoServico } from '@/pages/tiposervico/types'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { defineStore } from 'pinia'

export const useOrdemServicoStore = defineStore('ordem-servico', {
  state: () => ({
    // Lista de ordens de serviço
    ordensServico: [] as IOrdemServico[],
    ordemServicoAtual: null as IOrdemServico | null,

    // Form state
    formRef: null,
    formData: {
      material_equipamentos: [],
      anexos: [],
    } as Partial<IOrdemServico>,

    // Loading states
    loading: {
      list: false,
      item: false,
      save: false,
      relatorios: false,
      upload: false,
      destroy: false,
    },

    // Filtros e busca
    filtros: {} as IFiltrosInmetro,
    page: 1,
    itemsPerPage: 10,
    searchTerm: '',
    isSearching: false,

    // Dados relacionados
    clientes: [] as ICliente[],
    escopos: [] as IEscopo[],
    tiposServico: [] as ITipoServico[],
    responsaveis: [] as IFuncionario[],
    router: useRouter(),
    snackbarStore: useSnackbarStore(),
  }),

  actions: {
    // Buscar ordens de serviço
    async fetchOrdensServico(options = {}) {
      this.loading.list = true
      try {
        const { data } = await InmetroService.fetchAll<{ data: IOrdemServico[] }>({ ...this.filtros, ...options }, undefined)

        this.ordensServico = data

        return data
      }
      catch (error) {
        console.error('Erro ao buscar ordens de serviço:', error)
        throw error
      }
      finally {
        this.loading.list = false
      }
    },

    // Buscar ordem de serviço específica
    async fetchOrdemServico(id: string) {
      this.loading.item = true
      try {
        const data = await InmetroService.fetch<IOrdemServico>(id)

        this.ordemServicoAtual = data

        // Preencher formData para edição
        this.formData = {
          anexos: [],
          material_equipamentos: [],
          ...data,
        }

        return data
      }
      catch (error) {
        console.error('Erro ao buscar ordem de serviço:', error)
        throw error
      }
      finally {
        this.loading.item = false
      }
    },

    // Criar ordem de serviço
    async criarOrdemServico(dados: any) {
      this.loading.save = true
      try {
        const data = await InmetroService.post(dados, undefined, true)

        this.ordensServico.unshift(data as IOrdemServico)

        this.router.push('/os')

        // Limpar formData após criação
        this.resetForm()

        this.snackbarStore.showSnackbar({
          text: 'Ordem de serviço criada com sucesso!',
          color: 'success',
          timeout: 3000,
        })

        return data
      }
      catch (error) {
        this.snackbarStore.showSnackbar({
          text: 'Erro ao criar ordem de serviço. Tente novamente.',
          color: 'error',
          timeout: 3000,
        })

        console.error('Erro ao criar ordem de serviço:', error)
        throw error
      }
      finally {
        this.loading.save = false
      }
    },

    // Finalizar OS
    async finalizarOS(ordemServico: IOrdemServico) {
      this.loading.save = true
      try {
        const response = await InmetroService.finalizar(ordemServico)

        // Atualizar a ordem de serviço na lista local
        const index = this.ordensServico.findIndex(os => os.id === ordemServico.id)
        if (index !== -1)
          this.ordensServico[index] = response || ordemServico

        return response
      }
      catch (error) {
        console.error('Erro ao finalizar OS:', error)
        throw error
      }
      finally {
        this.loading.save = false
      }
    },

    // Reprovar OS
    async reprovarOS(ordemServico: IOrdemServico) {
      this.loading.save = true
      try {
        const response = await InmetroService.reprovar(ordemServico)

        // Atualizar a ordem de serviço na lista local
        const index = this.ordensServico.findIndex(os => os.id === ordemServico.id)
        if (index !== -1)
          this.ordensServico[index] = response || ordemServico

        return response
      }
      catch (error) {
        console.error('Erro ao reprovar OS:', error)
        throw error
      }
      finally {
        this.loading.save = false
      }
    },

    // Exportar CSV
    async exportarCSV() {
      try {
        const response = await InmetroService.fetchAll({ ...this.filtros }, 'exportar-csv')

        // Criar URL do blob e fazer download
        const url = window.URL.createObjectURL(new Blob([response as BlobPart]))
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
    },

    // Download relatório PDF
    async downloadRelatorioPDF(id?: string) {
      if (!id)
        return

      try {
        const response = await InmetroService.fetch(`relatorio/${id}/pdf`)

        // Criar URL do blob e fazer download
        const url = window.URL.createObjectURL(new Blob([response as BlobPart]))
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
    },

    // Carregar anexos
    async carregarAnexos(osId: string) {
      if (!osId)
        return []

      try {
        // Fazer chamada para a API
        const data = await InmetroService.buscarAnexo<IOrdemServicoAnexo[]>(osId)

        return data || []
      }
      catch (error) {
        console.error('Erro ao carregar anexos:', error)

        return []
      }
    },

    async carregarMateriais(osId: string) {
      if (!osId)
        return []

      try {
        // Fazer chamada para a API
        const data = await InmetroService.buscarMateriais<IMaterialEquipamento[]>(osId)

        return data || []
      }
      catch (error) {
        console.error('Erro ao carregar materiais:', error)

        return []
      }
    },

    // Buscar clientes
    async fetchClientes() {
      try {
        const data = await ClienteService.fetchAll<ICliente[]>({}, 'listar/clientes')

        this.clientes = data

        return data
      }
      catch (error) {
        console.error('Erro ao buscar clientes:', error)
        throw error
      }
    },

    // Métodos para formulário
    async save() {
      return await this.criarOrdemServico(this.formData)
    },

    async update() {
      if (!this.formData.id)
        return

      this.loading.save = true
      try {
        const data = await InmetroService.update(this.formData, this.formData.id, true)

        // Atualizar na lista
        const index = this.ordensServico.findIndex(os => os.id === this.formData.id)
        if (index !== -1)
          this.ordensServico[index] = data as IOrdemServico

        // Atualizar ordem atual
        this.ordemServicoAtual = data as IOrdemServico
        this.formData = { ...(data as IOrdemServico) }

        this.router.push('/os')

        this.router.push('/os')

        // Limpar formData após criação
        this.resetForm()

        this.snackbarStore.showSnackbar({
          text: 'Ordem de serviço atualizada com sucesso!',
          color: 'success',
          timeout: 3000,
        })

        return data
      }
      catch (error) {
        this.snackbarStore.showSnackbar({
          text: 'Erro ao atualizar ordem de serviço. Tente novamente.',
          color: 'error',
          timeout: 3000,
        })
        console.error('Erro ao atualizar ordem de serviço:', error)
        throw error
      }
      finally {
        this.loading.save = false
      }
    },

    // Métodos para tabela
    async loadMore() {
      this.page++

      return await this.fetchOrdensServico({ page: this.page })
    },

    async search(searchValue: string) {
      this.searchTerm = searchValue
      this.isSearching = true
      this.page = 1

      return await this.fetchOrdensServico({ search: searchValue, page: 1 })
    },

    async searchAgain() {
      return await this.search(this.searchTerm)
    },

    // Métodos de controle
    resetForm() {
      this.formData = {
        material_equipamentos: [],
        anexos: [],
      }
      this.formRef = null
    },

    resetFiltros() {
      this.filtros = {}
      this.fetchOrdensServico({ page: 1 })
    },

    resetOrdemAtual() {
      this.ordemServicoAtual = null
    },

    resetSearch() {
      this.searchTerm = ''
      this.isSearching = false
      this.page = 1
      this.filtros = {}
    },

    async destroy(id: string) {
      this.loading.destroy = true
      try {
        await InmetroService.destroy(`${id}`)
        this.ordensServico = this.ordensServico.filter(os => os.id !== id)
      }
      catch (error) {
        console.error('Erro ao deletar ordem de serviço:', error)
        throw error
      }
      finally {
        this.loading.destroy = false
      }
    },

    dialogDestroy(id: string) {
      return () => this.destroy(id)
    },

    async onOrderBy(orderBy: string) {
      return await this.fetchOrdensServico({ orderBy })
    },

    loadClientes() {
      return this.fetchClientes()
    },
  },

  getters: {
    statusOptions: () => [
      { value: 'em_analise', title: 'Em Análise', color: 'info' },
      { value: 'andamento', title: 'Andamento', color: 'warning' },
      { value: 'finalizado', title: 'Finalizado', color: 'success' },
    ],
  },
})
