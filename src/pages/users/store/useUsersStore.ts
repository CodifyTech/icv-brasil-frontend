import { defineStore } from 'pinia'
import type { IRole, IRoleResponse } from '@/pages/acesso/types'
import UsersService from '@/pages/users/services/UsersService'
import type { IUser } from '@/pages/users/types'

const defaultValue = {
  id: '',
  name: '',
  email: '',
  password: '',
  foto: '',
  role: '',
  ativo: 1,
} as IUser

export const useUsersStore = defineStore('crud/users', {
  state: () => ({
    serviceName: 'UsersService',
    sortKeyDefault: 'name',
    defaultValue,
    roles: [] as IRole[],

    loading: {
      roles: false,
      save: false,
      item: false,
      items: false,
      destroy: false,
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
  },
})
