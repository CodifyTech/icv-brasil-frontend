import utils from './utils'
import users from './users'

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
  ...users,
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
  ...utils,
]
