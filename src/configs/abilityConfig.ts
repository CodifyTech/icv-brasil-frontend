const unchangedSubjects = ['auth', 'all'] // These subjects are not related to any model

const userSubjects = [
  'permission',
  'users',
  'roles',
  'funcionario',
  'cliente',
  'proposta',
  'cargo',
  'tipo-documento',
  'tipo-servico',
  'escopo',
  'inmetro',
  'rubrica',
  'departamento',
  'os',
]

export const subjects = [...unchangedSubjects, ...userSubjects]
export const actions = ['create', 'list', 'read', 'edit', 'delete', 'manage', 'block']
