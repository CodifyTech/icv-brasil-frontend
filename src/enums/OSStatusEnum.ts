export enum OsStatusEnum {
  EM_ANALISE = 'em_analise',
  ANDAMENTO = 'andamento',
  FINALIZADO = 'finalizado',
}

export const OS_STATUS_OPTIONS = [
  { value: OsStatusEnum.EM_ANALISE, title: 'Em Análise' },
  { value: OsStatusEnum.ANDAMENTO, title: 'Andamento' },
  { value: OsStatusEnum.FINALIZADO, title: 'Finalizado' },
]

export const getOSStatusLabel = (status: OsStatusEnum | null): string => {
  switch (status) {
    case OsStatusEnum.EM_ANALISE:
      return 'Em Análise'
  case OsStatusEnum.ANDAMENTO:
      return 'Andamento'
  case OsStatusEnum.FINALIZADO:
      return 'Finalizado'
  default:
      return '-'
  }
}

export const getOSStatusColor = (status: OsStatusEnum | null): string => {
  switch (status) {
    case OsStatusEnum.EM_ANALISE:
      return 'info'
    case OsStatusEnum.ANDAMENTO:
      return 'warning'
    case OsStatusEnum.FINALIZADO:
      return 'success'
    default:
      return 'default'
  }
}

export const getOSStatusIcon = (status: OsStatusEnum | null): string => {
  switch (status) {
    case OsStatusEnum.EM_ANALISE:
      return 'tabler-eye'
    case OsStatusEnum.ANDAMENTO:
      return 'tabler-progress'
    case OsStatusEnum.FINALIZADO:
      return 'tabler-check'
    default:
      return 'tabler-help'
  }
}
