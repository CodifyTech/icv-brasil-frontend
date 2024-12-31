import { defineStore } from 'pinia'

const defaultValue = {
  nome: '', conselho_classe: '',
}

export const useFormacaoStore = defineStore('crud/formacao', {
  state: () => ({
    serviceName: 'FormacaoService',
    sortKeyDefault: 'nome',
    defaultValue,
    funcionarios: [],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      funcionario: false,
    },
  }),
  actions: {
    // 👉 methods
    async fetchFuncionario(search?: string) {
      this.loading.funcionario = true
      await FuncionarioService.fetchFuncionario(search)
        .then(res => {
          this.funcionarios = res.data
          this.loading.funcionario = false
        }).catch(() => {
          this.funcionarios = []
          this.loading.funcionario = false
        })
    },
  },
})
