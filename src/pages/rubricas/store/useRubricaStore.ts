import { defineStore } from 'pinia'
import type { IRubrica, IRubricas } from '@/pages/rubricas/types'
import RubricaService from '@/pages/rubricas/services/RubricaService'
import { useSuccessDialogStore } from '@/stores/useSuccessDialogStore'

export const useRubricaStore = defineStore('rubrica', {
  state: () => ({
    items: {
      custos: [],
      tributos: [],
      despesas: [],
    } as IRubricas,
  }),
  actions: {
    async listarRubricas() {
      await RubricaService.fetchAll<IRubricas>()
        .then((data: IRubricas) => {
          this.items = data
        })
    },
    async adicionarRubrica(rubrica: IRubrica, index: number) {
      await RubricaService.create(rubrica)
        .then(data => {
          this.items[rubrica.tipo][index].id = data.id

          useSuccessDialogStore()
            .showSuccessDialog({
              title: 'Informação',
              message: 'Rubrica cadastrada com sucesso',
              confirmText: 'Ok',
            })
        })
    },
    async atualizarRubrica(data: IRubrica, index: number) {
      await RubricaService.update<IRubrica>(data, data.id)
        .then(data => {
          this.items[rubrica.tipo][index] = data

          useSuccessDialogStore()
            .showSuccessDialog({
              title: 'Informação',
              message: 'Rubrica atualizada com sucesso',
              confirmText: 'Ok',
            })
        })
    },
    async deletarRubrica(id: string) {
      await RubricaService.destroy<IRubrica>(id)
        .then(() => {
          useSuccessDialogStore()
            .showSuccessDialog({
              title: 'Informação',
              message: 'Rubrica excluída com sucesso',
              confirmText: 'Ok',
            })
        })
    },
  },
})
