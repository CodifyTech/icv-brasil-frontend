import { defineStore } from 'pinia'

const defaultValue = {
  nome: '',
}

export const useEscopoStore = defineStore('crud/escopo', {
  state: () => ({
    serviceName: 'EscopoService',
    sortKeyDefault: 'nome',
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
