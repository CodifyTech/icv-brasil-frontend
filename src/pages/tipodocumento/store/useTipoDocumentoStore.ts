import { defineStore } from 'pinia'

const defaultValue = {
  nome: '',
}

export const useTipoDocumentoStore = defineStore('crud/tipodocumento', {
  state: () => ({
    serviceName: 'TipoDocumentoService',
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
