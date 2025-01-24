import moment from 'moment'

export const avatarCor = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
]

export const avatarTwoText = (value: string) => {
  if (!value)
    return ''
  const nameArray = value.split(' ')

  return nameArray.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
}

export const formatDate = (date: string, format = 'DD/MM/YYYY') => {
  if (!date)
    return ''

  return moment(date).format(format)
}
