import { defineStore } from 'pinia'
import type { IAction, IPermission } from '@/pages/acesso/types'
import PermissoesService from '@/pages/acesso/permissoes/services/PermissoesService'

const defaultValue = {
  id: '',
  name: '',
  crud: '',
  actions: [],
} as IPermission

export const usePermissoesStore = defineStore('crud/permissions', {
  state: () => ({
    serviceName: 'PermissoesService',
    sortKeyDefault: 'name',
    defaultValue,
    isPermissionDialogVisible: false,
    isEditing: false,
    actions: [] as IAction[],
  }),
  actions: {
    async createAllPermissions(permission: IPermission) {
      return PermissoesService.create<IPermission>(permission, 'create/all')
        .then(data => {
          this.items.push(data)
          this.data = { ...defaultValue }
        })
    },
    async updateAllPermissions(permission: IPermission) {
      return PermissoesService.update<IPermission>(permission, 'update/all')
        .then(permission => {
          const permissionExisting = this.items.find(r => r.name === permission.name)
          if (permissionExisting) {
            const index = this.items.indexOf(permissionExisting)
            if (index !== -1)
              this.items[index] = permission
          }
          this.data = { ...defaultValue }
        })
    },
    async deletarAllPermission(permission: IPermission) {
      return PermissoesService.deleteAll(permission.name)
        .then(() => {
          const index = this.items.findIndex(p => p === permission)

          if (index !== -1)
            this.items.splice(index, 1)
        })
    },
    async getPermission(permission: IPermission) {
      this.data = {
        ...permission,
      }
    },
    async listActions() {
      PermissoesService.fetchActions<IAction[]>()
        .then(actions => {
          this.actions = actions
        })
    },
  },
})
