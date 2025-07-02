import { defineStore } from 'pinia'
import InmetroService from '../services/InmetroService'
import type { ICliente } from '@/pages/cliente/types'
import type { IEscopo } from '@/pages/escopo/types'
import type { IFuncionario } from '@/pages/funcionario/types'
import type { ITipoServico } from '@/pages/tiposervico/types'

export const useInmetroStore = defineStore('inmetro', {
  state: () => ({
    // Dados de apoio para o Inmetro
    escopos: [] as IEscopo[],
    tiposServico: [] as ITipoServico[],
    responsaveis: [] as IFuncionario[],
    clientes: [] as ICliente[],

    // Loading states específicos do Inmetro
    loading: {
      escopos: false,
      tiposServico: false,
      responsaveis: false,
      clientes: false,
    },
  }),

  actions: {
    // Buscar escopos
    async fetchEscopo() {
      this.loading.escopos = true
      try {
        const data = await InmetroService.fetchAll<IEscopo[]>({}, 'listar/escopo')

        this.escopos = data

        return data
      }
      catch (error) {
        console.error('Erro ao buscar escopo:', error)
        throw error
      }
      finally {
        this.loading.escopos = false
      }
    },

    // Buscar responsáveis
    async fetchResponsavel() {
      this.loading.responsaveis = true
      try {
        const data = await InmetroService.fetchAll<IFuncionario[]>({}, 'listar/responsaveis')

        this.responsaveis = data

        return data
      }
      catch (error) {
        console.error('Erro ao buscar responsáveis:', error)
        throw error
      }
      finally {
        this.loading.responsaveis = false
      }
    },

    // Buscar tipos de serviço
    async fetchTipoServico() {
      this.loading.tiposServico = true
      try {
        const data = await InmetroService.fetchAll<ITipoServico[]>({}, 'listar/tipo-servico')

        this.tiposServico = data

        return data
      }
      catch (error) {
        console.error('Erro ao buscar tipo servico:', error)
        throw error
      }
      finally {
        this.loading.tiposServico = false
      }
    },

    async fetchClientes() {
      this.loading.clientes = true
      try {
        const data = await InmetroService.fetchAll<ICliente[]>({}, 'listar/clientes')

        this.clientes = data

        return data
      }
      catch (error) {
        console.error('Erro ao buscar clientes:', error)
        throw error
      }
      finally {
        this.loading.clientes = false
      }
    },

    // Carregar todos os dados de apoio
    async carregarDadosApoio() {
      await Promise.all([
        this.fetchEscopo(),
        this.fetchTipoServico(),
        this.fetchResponsavel(),
        this.fetchClientes(),
      ])
    },
  },

  getters: {
    // Opções para selects
    escopoOptions: state => state.escopos.map(escopo => ({
      value: escopo.id,
      title: escopo.nome,
    })),

    tipoServicoOptions: state => state.tiposServico.map(tipo => ({
      value: tipo.id,
      title: tipo.nome,
    })),

    responsavelOptions: state => state.responsaveis.map(responsavel => ({
      value: responsavel.id,
      title: responsavel.nome,
    })),
  },
})
