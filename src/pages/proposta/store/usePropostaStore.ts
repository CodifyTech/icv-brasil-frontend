import { defineStore } from 'pinia'

import PropostaService from '../services/PropostaService'
import type { AnexoItem } from '@/components/AttachmentUpload.vue'
import { PropostaEnum } from '@/enums/PropostaStatusEnum'
import type { ICusto, IDespesa, IDespesaDireta, IDespesaIndireta, IProposta, IServico, ITributo } from '@/pages/proposta/types'
import type { IRubrica } from '@/pages/rubricas/types'
import { useSuccessDialogStore } from '@/stores/useSuccessDialogStore'

const defaultValue = {
  codigo_proposta: '',
  pessoa_contato: '',
  consultor_id: null,
  telefone: '',
  email: '',
  status: '',
  servicos: [] as IServico[],
  cliente_id: null,
  departamentos: [] as Array<{ id: string; nome: string }>,
  anexos: [] as AnexoItem[],
} as Partial<IProposta>

export const usePropostaStore = defineStore('crud/proposta', {
  state: () => ({
    serviceName: 'PropostaService',
    sortKeyDefault: 'pessoa_contato',
    defaultValue,
    data: { ...defaultValue },
    filiais: [] as Array<{ id: string; nome_fantasia: string }>,
    funcionarios: [] as Array<{ id: string; nome: string }>,
    tipoServicos: [] as Array<{ id: string; nome: string }>,
    departamentos: [] as Array<{ id: string; nome: string }>,
    rubricas: [] as IRubrica[],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      filial: false,
      funcionarios: false,
      tipoServico: false,
      departamento: false,
    },

    modal: {
      isDialogVisible: false,
      servico: {
        tipo_servico_id: null,
        unidade_custos: 'hh',
        valor_total_custos: 0,
        valor_total_despesas: 0,
        valor_total_tributos: 0,
        valor_total_despesas_indiretas: 0,
        valor_total_despesas_diretas: 0,
        valor_total: 0,
        valor_total_hd: 0,
        valor_k_minimo: 0,
        valor_diaria_minimo: 0,
        valor_contrato: 0,
        custos: [] as ICusto[],
        despesas: [] as IDespesa[],
        tributos: [] as ITributo[],
        despesas_indiretas: [] as IDespesaIndireta[],
        despesas_diretas: [] as IDespesaDireta[],
      } as Partial<IServico>,
    },
  }),
  actions: {
    async save(formData?: boolean) {
      this.loading.save = true

      return await PropostaService.create(this.data, undefined, formData)
        .then(data => {
          this.resetForm()

          useSuccessDialogStore().showSuccessDialog({
            title: 'Informação',
            message: 'Foi criado com sucesso!',
            confirmText: 'OK',
          })

          return data
        })
        .catch(err => {
          return err.response.data
        })
        .finally(() => {
          this.loading.save = false
        })
    },
    async update(formData?: boolean) {
      if ((this.data as any).id) {
        this.loading.save = true

        return await PropostaService.update(this.data, (this.data as any).id, formData)
          .then(data => {
            if (data)
              this.data = data as any

            useSuccessDialogStore().showSuccessDialog({
              title: 'Informação',
              message: 'Foi atualizado com sucesso!',
              confirmText: 'OK',
            })

            return data
          })
          .catch(err => {
            return err.response.data
          })
          .finally(() => {
            this.loading.save = false
          })
      }
    },

    // 👉 methods
    async fetchCliente(search?: string) {
      this.loading.filial = true
      await PropostaService.fetchCliente(search)
        .then(data => {
          this.filiais = data as Array<{ id: string | number; nome_fantasia: string }>
          this.loading.filial = false
        }).catch(() => {
          this.filiais = []
          this.loading.filial = false
        })
    },

    async fetchFuncionarios(search?: string) {
      this.loading.funcionarios = true
      await PropostaService.fetchFuncionarios(search)
        .then(data => {
          this.funcionarios = data as Array<{ id: string; nome: string }>
          this.loading.funcionarios = false
        }).catch(() => {
          this.funcionarios = []
          this.loading.funcionarios = false
        })
    },

    async fetchTipoServico(search?: string) {
      this.loading.tipoServico = true
      await PropostaService.fetchTipoServico(search)
        .then(data => {
          this.tipoServicos = data as Array<{ id: string; nome: string }>
          this.loading.tipoServico = false
        }).catch(() => {
          this.tipoServicos = []
          this.loading.tipoServico = false
        })
    },

    async fetchDepartamentos(search?: string) {
      this.loading.departamento = true
      await PropostaService.fetchAll(search, 'listar/departamentos')
        .then(data => {
          this.departamentos = data as Array<{ id: string; nome: string }>
        }).catch(() => {
          this.departamentos = []
        })
        .finally(() => {
          this.loading.departamento = false
        })
    },

    async obterRubricasFixas() {
      // Limpar os arrays existentes ou inicializá-los se forem nulos
      this.modal.servico.tributos = []
      this.modal.servico.despesas_indiretas = []
      this.modal.servico.despesas_diretas = []

      await PropostaService.fetchAll<{
        tributos: IRubrica[]
        despesas_indiretas: IRubrica[]
        despesas_diretas: IRubrica[]
      }>({}, 'listar/rubricas-fixas')
        .then(data => {
          // Adicionar tributos
          data.tributos.forEach((item: IRubrica) => {
            this.modal.servico.tributos.push({
              nome: item.nome,
              aliquota: item.valor,
            })
          })

          // Adicionar despesas indiretas
          data.despesas_indiretas.forEach((item: IRubrica) => {
            this.modal.servico.despesas_indiretas.push({
              nome: item.nome,
              valor: item.valor,
            })
          })

          // Adicionar despesas diretas
          data.despesas_diretas.forEach((item: IRubrica) => {
            this.modal.servico.despesas_diretas.push({
              nome: item.nome,
              valor: item.valor,
            })
          })
        })
        .catch(error => {
          console.error('Erro ao obter rubricas fixas:', error)
        })
    },

    async handleStatusChange(propostaId: string, data: { status: string; observacao?: string }) {
      try {
        const response = await PropostaService.updateStatus<IProposta>(propostaId, data.status, data.observacao)

        const item = this.items?.find(item => item.id === propostaId)

        if (item) {
          item.status = response.status
          item.observacao = response.observacao
        }
      }
      catch (error) {
        console.error('Erro ao atualizar status:', error)
      }
    },

    async buscarPropostasPorCliente(clienteId: string, statuses: string[] = [PropostaEnum.APROVADA, PropostaEnum.PERDIDA]) {
      try {
        return await PropostaService.buscarPropostasPorCliente<IProposta[]>(clienteId, statuses)
      }
      catch (error) {
        console.error('Erro ao buscar propostas por cliente:', error)

        return []
      }
    },
  },
})
