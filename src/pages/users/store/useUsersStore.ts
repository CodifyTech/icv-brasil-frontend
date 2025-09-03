import { defineStore } from 'pinia'
import type { IRole, IRoleResponse } from '@/pages/acesso/types'
import type { IFuncionario } from '@/pages/funcionario/types'
import UsersService from '@/pages/users/services/UsersService'
import type { IUser } from '@/pages/users/types'

const defaultValue = {
  id: '',
  name: '',
  email: '',
  password: '',
  foto: '',
  role: null,
  ativo: 1,
  funcionario_id: null,
} as IUser

export const useUsersStore = defineStore('crud/users', {
  state: () => ({
    serviceName: 'UsersService',
    sortKeyDefault: 'name',
    defaultValue,
    roles: [] as IRole[],
    funcionarios: [] as IFuncionario[],

    loading: {
      roles: false,
      save: false,
      item: false,
      items: false,
      destroy: false,
      funcionarios: false,
    },
  }),
  actions: {
    async fetchPerfis() {
      this.loading.roles = true
      await UsersService.fetchRolesList<IRoleResponse>()
        .then(res => {
          this.roles = res.data
          this.loading.roles = false
        }).catch(() => {
          this.roles = []
          this.loading.roles = false
        })
    },
    async fetchFuncionarios() {
      this.loading.funcionarios = true
      await UsersService.fetchAll<IFuncionario[]>({}, 'listar/funcionarios')
        .then(data => {
          this.funcionarios = data
          this.loading.funcionarios = false
        }).catch(() => {
          this.funcionarios = []
          this.loading.funcionarios = false
        })
    },
  },
})
