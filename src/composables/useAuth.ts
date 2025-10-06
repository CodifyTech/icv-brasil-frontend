import { RoleEnum, getRoleName, hasFullAccess, needsDepartmentFilter } from '@/enums/RoleEnum'
import type { IUser } from '@/pages/users/types'

export const useAuth = () => {
  const auth = useCookie<IUser>('userData')

  /**
   * Obtém o slug do role do usuário
   */
  const getUserRoleSlug = (): string | null => {
    if (!auth.value?.role)
      return null

    if (typeof auth.value.role === 'string')
      return auth.value.role

    return auth.value.role.slug || null
  }

  const hasRole = (role: string) => {
    const userRole = getUserRoleSlug()

    return userRole === role
  }

  /**
   * Verifica se o usuário tem um dos cargos especificados
   */
  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => hasRole(role))
  }

  /**
   * Verifica se o usuário tem acesso total (SENIOR, Admin)
   */
  const hasFullAccessRole = () => {
    const userRole = getUserRoleSlug()

    return hasFullAccess(userRole)
  }

  /**
   * Verifica se o usuário deve ter filtro de departamento
   */
  const needsDepartmentFilterRole = () => {
    const userRole = getUserRoleSlug()

    return needsDepartmentFilter(userRole)
  }

  /**
   * Obtém o nome descritivo do cargo atual
   */
  const getCurrentRoleName = () => {
    const userRole = getUserRoleSlug()

    return userRole ? getRoleName(userRole) : ''
  }

  /**
   * Verifica se é um dos novos cargos
   */
  const isNewRole = () => {
    const newRoles = [
      RoleEnum.Senior,
      RoleEnum.Pleno,
      RoleEnum.Comercial,
      RoleEnum.RH,
      RoleEnum.Financeiro,
      RoleEnum.Junior,
      RoleEnum.InmetroQualidade,
    ]

    return hasAnyRole(newRoles)
  }

  return {
    auth,
    hasRole,
    hasAnyRole,
    hasFullAccessRole,
    needsDepartmentFilterRole,
    getCurrentRoleName,
    isNewRole,
    getUserRoleSlug,
    RoleEnum, // Exporta o enum para uso nos componentes
  }
}
