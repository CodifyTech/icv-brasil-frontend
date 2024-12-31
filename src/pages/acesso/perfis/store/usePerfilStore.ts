import { defineStore } from 'pinia'
import type { IUser } from '@/pages/users/types'
import PerfisService from '@/pages/acesso/perfis/services/PerfisService'
import type { IPermission, IRole, IRoleResponse } from '@/pages/acesso/types'

const defaultValue = {
  id: '',
  name: '',
  permissions: [],
} as IRole

export const usePerfilStore = defineStore('perfil', {
  state: () => ({
    role: { ...defaultValue } as IRole,
    roles: [] as IRole[],
    permissions: [] as IPermission[],

    users: [] as IUser[],
    loadingUsers: false,
    isEditing: false,
  }),
  actions: {
    async cadastrarPerfil(role: IRole) {
      return PerfisService.create<IRole>(role)
        .then(data => {
          this.roles.push(data)
          this.role = { ...defaultValue }
        })
    },
    async obterPerfil(id: string) {
      await PerfisService.fetch<IRole>(id)
        .then(role => {
          this.role = role
        })
    },
    async atualizarPerfil(role: IRole) {
      return PerfisService.update<IRole>(role, role.id ?? '')
        .then(data => {
          const index = this.roles.findIndex(r => r.id === data.id)

          if (index !== -1)
            this.roles[index] = data

          this.role = { ...defaultValue }
        })
    },
    async deletarPerfil(id: string) {
      return PerfisService.destroy<IRole>(id)
        .then(() => {
          const index = this.roles.findIndex(r => r.id === id)

          if (index !== -1)
            this.roles.splice(index, 1)
        })
    },
    async listarPerfis() {
      PerfisService.fetchAll<IRoleResponse>()
        .then(res => {
          this.roles = res.data
        })
    },
    async listarTodasPermissions() {
      PerfisService.listPermissions<IPermission[]>()
        .then(permissions => {
          this.permissions = permissions
        })
    },
  },
})
