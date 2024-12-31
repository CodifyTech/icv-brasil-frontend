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
  ...utils,
]
