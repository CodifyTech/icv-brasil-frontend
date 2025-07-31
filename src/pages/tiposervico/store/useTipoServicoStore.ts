import { defineStore } from 'pinia'

const defaultValue = {
  nome: '',
}

export const useTipoServicoStore = defineStore('crud/tiposervico', {
  state: () => ({
    serviceName: 'TipoServicoService',
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
