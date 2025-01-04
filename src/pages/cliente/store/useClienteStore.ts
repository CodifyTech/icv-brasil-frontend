import { defineStore } from 'pinia'

const defaultValue = {
  razao_social: '', nome_fantasia: '', cnpj: '',
}

export const useClienteStore = defineStore('crud/cliente', {
  state: () => ({
    serviceName: 'ClienteService',
    sortKeyDefault: 'razao_social',
    defaultValue,

    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,

    },
  }),
  actions: {
    // 👉 methods

  },
})
