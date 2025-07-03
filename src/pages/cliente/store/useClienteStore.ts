import { defineStore } from 'pinia'
import type { ICliente } from '@/pages/cliente/types'

const defaultValue = {
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cep: '',
  cidade: '',
  estado: '',
  filiais: [] as ICliente[],
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
