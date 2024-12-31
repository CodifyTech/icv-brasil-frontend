import { defineStore } from 'pinia'
import type { VForm } from 'vuetify/components/VForm'
import AuthService from '@/pages/auth/services/AuthService'
import { handleError } from '@/services/error-handling'

export const useRedefinirSenhaStore = defineStore('auth/redefinir-senha', {
  state: () => ({
    form: {} as VForm,
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
    messages: {
      success: {
        isSuccess: false,
        message: '',
      },
      error: {
        isError: false,
        status: '',
        messages: [] as any[] | string,
      },
    },
    loading: false,
    router: useRouter(),
  }),
  actions: {
    async resetPassword() {
      this.loading = true

      await AuthService.resetPassword(this.email, this.token, this.newPassword, this.confirmPassword).then(() => {
        this.messages.success.isSuccess = true
        this.messages.success.message = 'Sua senha foi redefinida com sucesso.'

        setTimeout(() => {
          this.router.replace('/auth/login')
        }, 3000)
      })
        .catch(reason => {
          const handling = handleError(reason.response)

          this.messages.error.isError = true
          this.messages.error.status = handling?.erroStatus
          this.messages.error.messages = handling?.errors
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
})
