import { defineStore } from 'pinia'
import type { IFiltrosInmetro, IMaterialEquipamento, IOrdemServico, IOrdemServicoAnexo } from './../../inmetro/types/index'
import { OsStatusEnum } from '@/enums/OSStatusEnum'
import ClienteService from '@/pages/cliente/services/ClienteService'
import type { ICliente } from '@/pages/cliente/types'
import type { IEscopo } from '@/pages/escopo/types'
import type { IFuncionario } from '@/pages/funcionario/types'
import InmetroService from '@/pages/inmetro/services/InmetroService'
import type { ITipoServico } from '@/pages/tipo-servico/types'
import { useSnackbarStore } from '@/stores/useSnackbarStore'

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
      fotos: [],
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
    total: 0,
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

    // Dialog states
    isDialogAprovarVisible: false,
    isDialogReprovarVisible: false,
  }),

  actions: {
    // Buscar ordens de serviço
    async fetchOrdensServico(options = {}) {
      this.loading.list = true
      try {
        const response = await InmetroService.fetchAll<{ data: IOrdemServico[]; total: number }>({
          ...this.filtros,
          ...options,
          per_page: this.itemsPerPage,
        }, undefined)

        this.ordensServico = response.data
        this.total = response.total || 0

        return response.data
      }
      catch (error) {
        console.error('Erro ao buscar ordens de serviço:', error)
        throw error
      }
      finally {
        this.loading.list = false
      }
    },

    async gerarCodigoOS() {
      try {
        // Verificar se há um cliente selecionado
        if (!this.formData.cliente_id) {
          console.log('❌ Cliente não selecionado')
          useSnackbarStore().showSnackbar({
            text: 'Selecione um cliente antes de gerar o código da OS',
            color: 'warning',
            timeout: 3000,
          })

          return
        }

        const response = await InmetroService.gerarCodigoOS(this.formData.cliente_id)

        if (response && typeof response === 'object' && 'codigo' in response) {
          this.formData.codigo = response.codigo as string
          useSnackbarStore().showSnackbar({
            text: 'Código da OS gerado com sucesso!',
            color: 'success',
            timeout: 2000,
          })
        }
      }
      catch (error) {
        console.error('❌ Erro ao gerar código da OS:', error)
        useSnackbarStore().showSnackbar({
          text: 'Erro ao gerar código da OS. Tente novamente.',
          color: 'error',
          timeout: 3000,
        })
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
          fotos: [],
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

        useSnackbarStore().showSnackbar({
          text: 'Ordem de serviço criada com sucesso!',
          color: 'success',
          timeout: 3000,
        })

        return data
      }
      catch (error) {
        useSnackbarStore().showSnackbar({
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
        this.loading.relatorios = true

        // Chama o método específico para exportação CSV
        const blob = await InmetroService.exportarCSV(this.filtros)

        // Criar URL do blob e fazer download
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        // Gera nome do arquivo com timestamp
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `relatorios_inmetro_${timestamp}.csv`

        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        // Mostra mensagem de sucesso
        useSnackbarStore().showSnackbar({
          text: 'CSV exportado com sucesso!',
          color: 'success',
          timeout: 3000,
        })
      }
      catch (error) {
        console.error('Erro ao exportar CSV:', error)

        // Mostra mensagem de erro
        useSnackbarStore().showSnackbar({
          text: 'Erro ao exportar CSV. Tente novamente.',
          color: 'error',
          timeout: 4000,
        })

        throw error
      }
      finally {
        this.loading.relatorios = false
      }
    },

    // Exportar Excel
    async exportarExcel() {
      try {
        this.loading.relatorios = true

        // Chama o método específico para exportação Excel
        const blob = await InmetroService.exportarExcel(this.filtros)

        // Criar URL do blob e fazer download
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        // Gera nome do arquivo com timestamp
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `relatorios_inmetro_${timestamp}.xlsx`

        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        // Mostra mensagem de sucesso
        useSnackbarStore().showSnackbar({
          text: 'Excel exportado com sucesso!',
          color: 'success',
          timeout: 3000,
        })
      }
      catch (error) {
        console.error('Erro ao exportar Excel:', error)

        // Mostra mensagem de erro
        useSnackbarStore().showSnackbar({
          text: 'Erro ao exportar Excel. Tente novamente.',
          color: 'error',
          timeout: 4000,
        })

        throw error
      }
      finally {
        this.loading.relatorios = false
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

    // Abrir dialogs
    abrirDialogAprovar(item: IOrdemServico) {
      this.ordemServicoAtual = item
      this.isDialogAprovarVisible = true
    },

    abrirDialogReprovar(item: IOrdemServico) {
      this.ordemServicoAtual = item
      this.isDialogReprovarVisible = true
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

        useSnackbarStore().showSnackbar({
          text: 'Ordem de serviço atualizada com sucesso!',
          color: 'success',
          timeout: 3000,
        })

        return data
      }
      catch (error) {
        useSnackbarStore().showSnackbar({
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
        fotos: [],
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

    // Novos métodos para funcionalidade de email
    async enviarSolicitacaoResponsavel(osId: string) {
      this.loading.save = true
      try {
        const response = await InmetroService.post({}, `${osId}/enviar-solicitacao-responsavel`)

        // Atualizar a OS na lista local para mostrar que foi enviado
        const index = this.ordensServico.findIndex(os => os.id === osId)
        if (index !== -1)
          this.ordensServico[index].email_responsavel_enviado_em = new Date().toISOString()

        useSnackbarStore().showSnackbar({
          text: 'Solicitação enviada com sucesso para o responsável!',
          color: 'success',
          timeout: 3000,
        })

        return response
      }
      catch (error: any) {
        useSnackbarStore().showSnackbar({
          text: error.response?.data?.message || 'Erro ao enviar solicitação. Tente novamente.',
          color: 'error',
          timeout: 3000,
        })
        console.error('Erro ao enviar solicitação:', error)
        throw error
      }
      finally {
        this.loading.save = false
      }
    },

    async verificarToken(token: string) {
      try {
        return await InmetroService.getOrDeleteRequest('GET', {}, `verificar-token/${token}`)
      }
      catch (error) {
        console.error('Erro ao verificar token:', error)
        throw error
      }
    },

    async aceitarOS(token: string, observacoes?: string) {
      try {
        return await InmetroService.postOrPutRequest('POST', {
          observacoes,
        }, `aceitar/${token}`)
      }
      catch (error) {
        console.error('Erro ao aceitar OS:', error)
        throw error
      }
    },

    menuList(os: IOrdemServico) {
      this.ordemServicoAtual = os
      let menu = [
        {
          title: 'Duplicar',
          icon: 'tabler-copy',
          color: 'info',
          click: () => {
            this.router.push(`/os/cadastrar?duplicar=${os.id}`)
          },
        },
      ]

      if (os.status === OsStatusEnum.EM_ANALISE || os.status === OsStatusEnum.ANDAMENTO) {
        menu = [
          ...menu,
          {
            title: 'Aprovar',
            icon: 'tabler-check',
            color: 'success',
            click: (() => this.abrirDialogAprovar(this.ordemServicoAtual)) as any,
          },
          {
            title: 'Certificado Pendente',
            icon: 'tabler-certificate',
            color: 'success',
            click: async () => {
              await InmetroService.update({}, `${os.id}/certificado-pendente`)
              useSnackbarStore().showSnackbar({
                text: 'Certificado pendente enviado com sucesso!',
                color: 'success',
                timeout: 3000,
              })
            },
          },
          {
            title: 'Reprovar',
            color: 'error',
            icon: 'tabler-x',
            click: (() => this.abrirDialogReprovar(this.ordemServicoAtual)) as any,
          },
        ]
      }

      return menu
    },

    async confirmarFinalizacao(dados: { os: IOrdemServico | null; dadosFinalizacao: any }) {
      if (!dados.os)
        return

      try {
        console.log('Finalizando OS:', dados.os)
        console.log('Dados de finalização:', dados.dadosFinalizacao)

        // Implementação da chamada para o backend
        const osAtualizada = {
          ...dados.os,
          num_relatorio: dados.dadosFinalizacao.num_relatorio,
          data_execucao: dados.dadosFinalizacao.data_execucao,
          certificado_associado: dados.dadosFinalizacao.certificado_associado,
          resultado: dados.dadosFinalizacao.resultado,
          observacoes: dados.dadosFinalizacao.observacoes,
          status: 'FINALIZADA',
        }

        // Chamada para a API
        await this.finalizarOS(osAtualizada)

        // Atualizar a lista após finalizar
        await this.fetchOrdensServico()

        // Fechar o dialog
        this.isDialogAprovarVisible = false
        this.ordemServicoAtual = null

        // Mostrar mensagem de sucesso
        useSnackbarStore().showSnackbar({
          text: 'Ordem de serviço finalizada com sucesso!',
          color: 'success',
          timeout: 3000,
        })
      }
      catch (error) {
        console.error('Erro ao finalizar OS:', error)

        // Mostrar mensagem de erro
        useSnackbarStore().showSnackbar({
          text: 'Erro ao finalizar ordem de serviço. Tente novamente.',
          color: 'error',
          timeout: 4000,
        })
      }
    },

    async confirmarReprovacao(dados: { os: IOrdemServico | null; dadosReprovacao: any }) {
      if (!dados.os)
        return

      try {
        console.log('Reprovando OS:', dados.os)
        console.log('Dados de reprovação:', dados.dadosReprovacao)

        // Implementação da chamada para o backend
        const osAtualizada = {
          ...dados.os,
          motivo_reprovacao: dados.dadosReprovacao.motivo_reprovacao,
          observacoes_reprovacao: dados.dadosReprovacao.observacoes,
          data_reprovacao: dados.dadosReprovacao.data_reprovacao,
          status: 'REPROVADA',
        }

        // Chamada para a API
        await this.reprovarOS(osAtualizada)

        // Atualizar a lista após reprovar
        await this.fetchOrdensServico()

        // Fechar o dialog
        this.isDialogReprovarVisible = false
        this.ordemServicoAtual = null

        // Mostrar mensagem de sucesso
        useSnackbarStore().showSnackbar({
          text: 'Ordem de serviço reprovada com sucesso!',
          color: 'warning',
          timeout: 3000,
        })
      }
      catch (error) {
        console.error('Erro ao reprovar OS:', error)

        // Mostrar mensagem de erro
        useSnackbarStore().showSnackbar({
          text: 'Erro ao reprovar ordem de serviço. Tente novamente.',
          color: 'error',
          timeout: 4000,
        })
      }
    },

    // Pagination actions
    setPage(page: number) {
      this.page = page
    },

    nextPage() {
      if (this.page < Math.ceil(this.total / this.itemsPerPage)) {
        this.page++
        this.loadMore()
      }
    },

    previousPage() {
      if (this.page > 1) {
        this.page--
        this.loadMore()
      }
    },

    setItemsPerPage(itemsPerPage: number) {
      this.itemsPerPage = itemsPerPage
      this.page = 1 // Reset to first page when changing items per page
    },
  },

  getters: {
    statusOptions: () => [
      { value: 'em_analise', title: 'Em Análise', color: 'info' },
      { value: 'andamento', title: 'Andamento', color: 'warning' },
      { value: 'finalizado', title: 'Finalizado', color: 'success' },
    ],
    estatisticas: state => ({
      total: state.ordensServico.length,
      analise: state.ordensServico.filter(os => os.status === 'em_analise').length ?? 0,
      andamento: state.ordensServico.filter(os => os.status === 'andamento').length ?? 0,
      finalizado: state.ordensServico.filter(os => os.status === 'finalizado').length ?? 0,
    }),
  },
})
