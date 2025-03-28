import { defineStore } from 'pinia'

import PropostaService from '../services/PropostaService'
import type { ICusto, IDespesa, IDespesaDireta, IDespesaIndireta, IServico, ITributo } from '@/pages/proposta/types'
import { useSuccessDialogStore } from '@/stores/useSuccessDialogStore'
import type { IRubrica } from '@/pages/rubricas/types'

const defaultValue = {
  pessoa_contato: '',
  consultor: '',
  telefone: '',
  email: '',
  area: 'OIA - O&G',
  status: '',
  servicos: [] as IServico[],
  filial_id: null,
}

export const usePropostaStore = defineStore('crud/proposta', {
  state: () => ({
    serviceName: 'PropostaService',
    sortKeyDefault: 'pessoa_contato',
    defaultValue,
    data: { ...defaultValue },
    filiais: [],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      filial: false,
    },

    modal: {
      isDialogVisible: false,
      servico: {
        nome: '',
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
      } as IServico,
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
      if (this.data.id) {
        this.loading.save = true

        return await PropostaService.update(this.data, this.data.id, formData)
          .then(data => {
            if (data)
              this.data = data

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
    async fetchFilial(search?: string) {
      this.loading.filial = true
      await PropostaService.fetchFilial(search)
        .then(res => {
          this.filiais = res.data
          this.loading.filial = false
        }).catch(() => {
          this.filiais = []
          this.loading.filial = false
        })
    },

    async obterRubricasFixas() {
      // Limpar os arrays existentes ou inicializá-los se forem nulos
      this.modal.servico.tributos = this.modal.servico.tributos?.length ? [] : []
      this.modal.servico.despesas_indiretas = this.modal.servico.despesas_indiretas?.length ? [] : []
      this.modal.servico.despesas_diretas = this.modal.servico.despesas_diretas?.length ? [] : []

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
  },
})
