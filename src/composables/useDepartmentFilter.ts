import { useAuth } from './useAuth'

/**
 * Composable para gerenciar filtros de departamento
 *
 * Adiciona automaticamente filtros de departamento nas requisições
 * para usuários que não têm acesso total
 */
export const useDepartmentFilter = () => {
  const { hasFullAccessRole, auth } = useAuth()

  /**
   * Verifica se o filtro de departamento deve ser aplicado
   */
  const shouldApplyFilter = (): boolean => {
    return !hasFullAccessRole()
  }

  /**
   * Obtém o ID do departamento do usuário
   */
  const getUserDepartmentId = (): string | number | null => {
    // Prioriza departamento_id direto do usuário
    if (auth.value?.departamento_id)
      return auth.value.departamento_id

    // Fallback para departamento do funcionário
    if (auth.value?.funcionario?.departamento_id)
      return auth.value.funcionario.departamento_id

    return null
  }

  /**
   * Adiciona filtro de departamento aos parâmetros se necessário
   */
  const addDepartmentFilter = <T extends Record<string, any>>(params: T): T => {
    if (!shouldApplyFilter())
      return params

    const departmentId = getUserDepartmentId()

    if (departmentId) {
      return {
        ...params,
        departamento_id: departmentId,
      }
    }

    return params
  }

  /**
   * Verifica se o usuário pode ver um item específico baseado no departamento
   */
  const canViewItem = (itemDepartmentId: string | number | null): boolean => {
    // Se tem acesso total, pode ver tudo
    if (hasFullAccessRole())
      return true

    // Se não tem departamento definido, não pode ver
    const userDepartmentId = getUserDepartmentId()
    if (!userDepartmentId)
      return false

    // Compara departamentos
    return String(itemDepartmentId) === String(userDepartmentId)
  }

  return {
    shouldApplyFilter,
    getUserDepartmentId,
    addDepartmentFilter,
    canViewItem,
  }
}
