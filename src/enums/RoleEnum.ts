/**
 * Enum de Cargos/Roles do Sistema
 *
 * Mantém sincronizado com app/Domains/ACL/Enums/RoleEnum.php do backend
 */

export enum RoleEnum {

  // Cargos de sistema
  Admin = 'admin',
  AdminSystem = 'admin-system',

  // Cargos do sistema
  Senior = 'senior',
  Pleno = 'pleno',
  Comercial = 'comercial',
  RH = 'rh',
  Financeiro = 'financeiro',
  Junior = 'junior',
  InmetroQualidade = 'inmetro-qualidade',
  Inmetro = 'inmetro',
  Funcionario = 'funcionario',
}

/**
 * Nomes descritivos dos cargos
 */
export const RoleNames: Record<RoleEnum, string> = {
  [RoleEnum.Admin]: 'Administrator',
  [RoleEnum.AdminSystem]: 'Admin System',
  [RoleEnum.Senior]: 'SENIOR',
  [RoleEnum.Pleno]: 'PLENO',
  [RoleEnum.Comercial]: 'COMERCIAL',
  [RoleEnum.RH]: 'RH',
  [RoleEnum.Financeiro]: 'FINANCEIRO',
  [RoleEnum.Junior]: 'JUNIOR',
  [RoleEnum.InmetroQualidade]: 'INMETRO/QUALIDADE',
  [RoleEnum.Inmetro]: 'Inmetro',
  [RoleEnum.Funcionario]: 'Funcionário',
}

/**
 * Cargos que têm acesso total sem filtro de departamento
 */
export const rolesWithFullAccess = [
  RoleEnum.Admin,
  RoleEnum.AdminSystem,
  RoleEnum.Senior,
]

/**
 * Cargos que devem ter filtro de departamento aplicado
 */
export const rolesWithDepartmentFilter = [
  RoleEnum.Pleno,
  RoleEnum.Comercial,
  RoleEnum.Junior,
]

/**
 * Verifica se um cargo tem acesso total
 */
export function hasFullAccess(role: string | null | undefined): boolean {
  if (!role)
    return false

  return rolesWithFullAccess.includes(role as RoleEnum)
}

/**
 * Verifica se um cargo deve ter filtro de departamento
 */
export function needsDepartmentFilter(role: string | null | undefined): boolean {
  if (!role)
    return false

  return rolesWithDepartmentFilter.includes(role as RoleEnum)
}

/**
 * Obtém o nome descritivo de um cargo
 */
export function getRoleName(role: string): string {
  return RoleNames[role as RoleEnum] || role
}
