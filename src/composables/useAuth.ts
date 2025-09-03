import type { IUser } from '@/pages/users/types'

export const useAuth = () => {
  const auth = useCookie<IUser>('userData')

  const hasRole = (role: string) => {
    return auth.value?.role?.slug === role
  }

  return {
    auth,
    hasRole,
  }
}
