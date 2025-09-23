export enum PropostaEnum {
  ANDAMENTO = 'ANDAMENTO',
  APROVADA = 'APROVADA',
  REPROVADA = 'REPROVADA',
  DECLINADA = 'DECLINADA',
}

export const PROPOSTA_STATUS_OPTIONS = [
  { value: PropostaEnum.ANDAMENTO, title: 'Andamento' },
  { value: PropostaEnum.APROVADA, title: 'Aprovada' },
  { value: PropostaEnum.REPROVADA, title: 'Reprovada' },
  { value: PropostaEnum.DECLINADA, title: 'Declinada' },
]

export const getPropostaStatusLabel = (status: PropostaEnum): string => {
  switch (status) {
    case PropostaEnum.ANDAMENTO:
      return 'Andamento'
    case PropostaEnum.REPROVADA:
      return 'Reprovada'
    case PropostaEnum.DECLINADA:
      return 'Declinada'
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
    case PropostaEnum.REPROVADA:
      return 'error'
    case PropostaEnum.DECLINADA:
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
    case PropostaEnum.REPROVADA:
      return 'tabler-x'
    case PropostaEnum.DECLINADA:
      return 'tabler-x'
    default:
      return 'tabler-help'
  }
}
