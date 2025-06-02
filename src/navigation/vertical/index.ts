// This function returns an array of objects, each representing a navigation item.
// Each object has properties like title, to, and icon.
// The title is the text displayed for the navigation item.
// The to property is an object that contains the name of the route.
// The icon property is an object that contains the name of the icon.
export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },
  { heading: 'Principal' },
  {
    title: 'Usuários',
    icon: { icon: 'tabler-users-group' },
    to: 'users',
    action: 'list',
    subject: 'users',
  },
  {
    title: 'Funcionários',
    icon: { icon: 'fa-light fa-user-tie' },
    to: 'funcionario',
    action: 'list',
    subject: 'funcionario',
  },
  {
    title: 'Clientes',
    icon: { icon: 'fa-light fa-users' },
    to: 'cliente',
    action: 'list',
    subject: 'cliente',
  },
  {
    title: 'Propostas',
    icon: { icon: 'fa-light fa-percent' },
    to: 'proposta',
    action: 'list',
    subject: 'proposta',
  },
  {
    title: 'Rubricas',
    icon: { icon: 'fa-light fa-receipt' },
    to: 'rubricas',
    action: 'list',
    subject: 'rubrica',
  },
  {
    title: 'Departamentos',
    icon: { icon: 'fa-light fa-buildings' },
    to: 'departamento',
    action: 'list',
    subject: 'departamento',
  },
  {
    title: 'Cargo',
    icon: { icon: 'fa-light fa-suitcase' },
    to: 'cargo',
    action: 'list',
    subject: 'cargo',
  },
  {
    title: 'Tipo Documento',
    icon: { icon: 'tabler-template' },
    to: 'tipodocumento',
    action: 'list',
    subject: 'tipodocumento',
  },
  {
    title: 'Controle de Acesso',
    icon: { icon: 'tabler-smart-home' },
    children: [
      { title: 'Perfis', to: 'acesso-perfis' },
      { title: 'Permissões', to: 'acesso-permissoes' },
    ],
  },
]
