import { defineStore } from 'pinia'

const defaultValue = {
  nome: '', descricao: '',
}

export const useCargoStore = defineStore('crud/cargo', {
  state: () => ({
    serviceName: 'CargoService',
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
