import { defineStore } from 'pinia'
import type { IDepartamento, IGestor } from '@/pages/departamento/types'
import DepartamentoService from '@/pages/departamento/services/DepartamentoService'

const defaultValue = {
  nome: '',
  email: '',
  gestores: [] as IGestor[],
} as IDepartamento

export const useDepartamentoStore = defineStore('crud/departamento', {
  state: () => ({
    serviceName: 'DepartamentoService',
    sortKeyDefault: 'nome',
    defaultValue,
    gestores: [] as IGestor[],

    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      gestores: false,
    },
  }),
  actions: {
    // 👉 methods
    async fetchGestor(search?: string) {
      this.loading.gestores = true
      await DepartamentoService.fetchAll<{
        data: IGestor[]
      }>({
        search,
      }, 'listar/usuario')
        .then(res => {
          this.gestores = res.data
          this.loading.gestores = false
        }).catch(() => {
          this.gestores = []
          this.loading.gestores = false
        })
    },
  },
})
