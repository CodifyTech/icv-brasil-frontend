import { defineStore } from 'pinia'

import PropostaService from '../services/PropostaService'
import type { ICusto, IDespesa, IDespesaDireta, IDespesaIndireta, IServico, ITributo } from '@/pages/proposta/types'

const defaultValue = {
  pessoa_contato: '',
  consultor: '',
  telefone: '',
  email: '',
  area: null,
  status: '',
  servicos: [] as IServico[],
}

export const usePropostaStore = defineStore('crud/proposta', {
  state: () => ({
    serviceName: 'PropostaService',
    sortKeyDefault: 'pessoa_contato',
    defaultValue,
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
        custos: [] as ICusto[],
        despesas: [] as IDespesa[],
        tributos: [] as ITributo[],
        despesas_indiretas: [] as IDespesaIndireta[],
        despesas_diretas: [] as IDespesaDireta[],
      } as IServico,
    },
  }),
  actions: {
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
  },
})
