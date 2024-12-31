import { defineStore } from 'pinia'

import FuncionarioService from '../services/FuncionarioService'

const defaultValue = {
  nome: '', rg: '', cpf: '', telefone_1: '', telefone_2: '', email_1: '', email_2: '', logradouro: '', bairro: '', cidade: '', uf: '', aeroporto_proximo: '', razao_social: '', nome_fantasia: '', cnpj: '', valor_hh: 0, valor_diaria: 0, valor_demanda: 0, valor_deslocamento: 0, valor_refeicao: 0, valor_pedagio: 0, valor_hospedagem: 0, valor_outros: 0, banco: '', agencia: '', conta: '',
}

export const useFuncionarioStore = defineStore('crud/funcionario', {
  state: () => ({
    serviceName: 'FuncionarioService',
    sortKeyDefault: 'nome',
    defaultValue,
    useres: [],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      user: false,
    },
  }),
  actions: {
    // 👉 methods
    async fetchUser(search?: string) {
      this.loading.user = true
      await FuncionarioService.fetchUser(search)
        .then(res => {
          this.useres = res.data
          this.loading.user = false
        }).catch(() => {
          this.useres = []
          this.loading.user = false
        })
    },
  },
})
