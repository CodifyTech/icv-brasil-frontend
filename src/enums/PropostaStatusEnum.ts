export enum PropostaEnum {
  ANDAMENTO = 'ANDAMENTO',
  APROVADA = 'APROVADA',
  PERDIDA = 'PERDIDA',
}

export const PROPOSTA_STATUS_OPTIONS = [
  { value: PropostaEnum.ANDAMENTO, title: 'Andamento' },
  { value: PropostaEnum.APROVADA, title: 'Aprovada' },
  { value: PropostaEnum.PERDIDA, title: 'Perdida' },
]

export const getPropostaStatusLabel = (status: PropostaEnum): string => {
  switch (status) {
    case PropostaEnum.ANDAMENTO:
      return 'Andamento'
    case PropostaEnum.PERDIDA:
      return 'Perdida'
    case PropostaEnum.APROVADA:
      return 'Aprovada'
  default:
      return '-'
  }
}


export const getPropostaStatusColor = (status: PropostaEnum): string => {
  switch (status) {
    case PropostaEnum.ANDAMENTO:
      return 'warning'
    case PropostaEnum.PERDIDA:
      return 'error'
    case PropostaEnum.APROVADA:
      return 'success'
    default:
      return 'default'
  }
}

export const getPropostaStatusIcon = (status: PropostaEnum): string => {
  switch (status) {
    case PropostaEnum.ANDAMENTO:
      return 'tabler-progress'
    case PropostaEnum.APROVADA:
      return 'tabler-check'
    case PropostaEnum.PERDIDA:
      return 'tabler-x'
    default:
      return 'tabler-help'
  }
}
