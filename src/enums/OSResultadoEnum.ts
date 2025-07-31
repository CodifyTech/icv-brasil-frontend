export enum OsResultadoEnum {
  APROVADO = 'aprovado',
  REPROVADO = 'reprovado',
  CONDICIONAL = 'condicional',
}

export const OS_RESULTADO_OPTIONS = [
  { value: OsResultadoEnum.APROVADO, title: 'Aprovado' },
  { value: OsResultadoEnum.REPROVADO, title: 'Reprovado' },
  { value: OsResultadoEnum.CONDICIONAL, title: 'Condicional' },
]

export const getOSResultadoLabel = (resultado: OsResultadoEnum): string => {
  switch (resultado) {
    case OsResultadoEnum.APROVADO:
      return 'Aprovado'
    case OsResultadoEnum.REPROVADO:
      return 'Reprovado'
    case OsResultadoEnum.CONDICIONAL:
      return 'Condicional'
  }
}

export const getOSResultadoColor = (resultado: OsResultadoEnum): string => {
  switch (resultado) {
    case OsResultadoEnum.APROVADO:
      return 'success'
    case OsResultadoEnum.REPROVADO:
      return 'error'
    case OsResultadoEnum.CONDICIONAL:
      return 'warning'
    default:
      return 'default'
  }
}
