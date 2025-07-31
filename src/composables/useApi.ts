import axios from 'axios'
import { useSnackbarStore } from '@/stores/useSnackbarStore'
import { useValidationDialogStore } from '@/stores/useValidationDialogStore'

const snackbarStore = useSnackbarStore()
const validationDialogStore = useValidationDialogStore()

const useApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição para adicionar o Bearer token
useApi.interceptors.request.use(config => {
  const accessToken = useCookie('accessToken').value

  if (accessToken)
    config.headers.Authorization = `Bearer ${accessToken}`

  return config
}, error => {
  return Promise.reject(error)
})

// Interceptor de resposta para tratar erros
useApi.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response) {
    const { data, status } = error.response

    if (status === 401) {
      useCookie('userData').value = null
      useLocalStorage('userAbilityRules', []).value = null
      useCookie('accessToken').value = null
      window.document.location.href = '/auth/login'

      snackbarStore.showSnackbar({
        text: 'Sua sessão expirou, faça login novamente.',
        color: 'error',
        timeout: 3000,
        location: 'top center',
      })

      return Promise.reject(error)
    }
    else if (status === 403) {
      snackbarStore.showSnackbar({
        text: 'Você não tem permissão para acessar este recurso.',
        color: 'error',
        timeout: 3000,
        location: 'top center',
      })

      return Promise.reject(error)
    }
    else if (status === 422) {
      // Trata o erro de validação 422
      const errors = data.errors || {}

      validationDialogStore.showValidationDialog(status, errors)

      return Promise.reject(error)
    }
    else if (status >= 500) {
      snackbarStore.showSnackbar({
        text: error.response.data.message || 'Erro no servidor. Tente novamente mais tarde.',
        color: 'error',
        timeout: 3000,
        location: 'top center',
      })

      return Promise.reject(error)
    }
    else {
      snackbarStore.showSnackbar({
        text: error.response.data.message || 'Ocorreu um erro.',
        color: 'error',
        timeout: 3000,
        location: 'top center',
      })

      return Promise.reject(error)
    }
  }
  else {
    snackbarStore.showSnackbar({
      text: 'Erro de rede. Verifique sua conexão.',
      color: 'error',
      timeout: 3000,
      location: 'top center',
    })

    return Promise.reject(error)
  }
})

export default useApi
