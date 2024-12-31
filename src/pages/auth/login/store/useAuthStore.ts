import { defineStore } from 'pinia'
import type { VForm } from 'vuetify/components/VForm'
import moment from 'moment'
import type { IAuthorization, LoginResponse, PayloadLogin } from '@/pages/auth/login/types'
import AuthService from '@/pages/auth/services/AuthService'
import type { IUser } from '@/pages/users/types'
import { useSuccessDialogStore } from '@/stores/useSuccessDialogStore'

const defaultCredentials = {
  email: '',
  password: '',
  remember: false,
}

const successDialog = useSuccessDialogStore()

export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    form: {} as VForm,
    loading: false,
    credentials: { ...defaultCredentials },
    user: {} as IUser,
    is_verified: false,
    authorization: {} as IAuthorization,
    messages: {
      error: {
        isError: false,
        status: '',
        messages: [] as any[] | string,
      },
    },
    ability: useAbility(),
    router: useRouter(),
    verificarEmailLoading: false,
    reenviarEmailVerificacaoLoading: false,
  }),
  actions: {
    async login(payload: PayloadLogin) {
      this.loading = true

      await this.form?.validate()
        .then(async ({ valid: isValid }) => {
          if (isValid) {
            await AuthService.login<LoginResponse>(payload)
              .then(res => {
                this.processLogin(res)
                this.router.replace('/')
              })
              .finally(() => {
                this.loading = false
                this.credentials = { ...defaultCredentials }
              })
          }
        })
    },
    processLogin(res: any) {
      const permissions = res.authorization.abilities.permissions

      useLocalStorage('userAbilityRules', []).value = permissions
      useCookie<IUser>('userData').value = res.user
      useCookie<string>('accessToken').value = res.authorization.token
      useCookie<string[]>('subjects').value = res.authorization.abilities.subjects

      this.ability.update(permissions)

      this.user = res.user
      this.authorization = res.authorization
    },
    async verificarEmail(email: string) {
      this.verificarEmailLoading = true

      return AuthService.fetch(`email/verify-email/${email}`)
        .then(() => {
          const auth = useCookie<IUser>('userData').value

          useCookie<IUser>('userData').value = {
            ...auth,
            email_verified_at: moment().toDate(),
          }
          successDialog.showSuccessDialog({
            title: 'E-mail verificado',
            message: 'Seu e-mail foi verificado com sucesso.',
            confirmText: 'Ok',
          })

          this.router.replace('/')
        }).finally(() => {
          this.verificarEmailLoading = false
        })
    },
    async reenviarEmailVerificacao() {
      this.reenviarEmailVerificacaoLoading = true

      return AuthService.post({}, 'email/verification-notification')
        .then(() => {
          successDialog.showSuccessDialog({
            title: 'E-mail enviado',
            message: 'Um novo e-mail de verificação foi enviado.',
            confirmText: 'Ok',
          })
        }).finally(() => {
          this.reenviarEmailVerificacaoLoading = false
        })
    },
    async logout() {
      await AuthService.logout().then(() => {
        useCookie('userData').value = null
        useLocalStorage('userAbilityRules', []).value = null
        useCookie('accessToken').value = null
        useCookie('subjects').value = null
        this.router.replace('/auth/login')
      })
    },
  },
})
