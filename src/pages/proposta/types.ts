export interface IProposta {
  pessoa_contato: string
  consultor: string
  telefone: string
  email: string
  area: string
  status: string
  filial_id: string

}

export interface IServico {
  id?: string
  nome: string
  valor_total_custos: number
  valor_total_despesas: number
  valor_total_tributos: number
  valor_total_despesas_indiretas: number
  valor_total_despesas_diretas: number
  valor_total: number
  valor_total_hd: number
  valor_k_minimo: number
  valor_diaria_minimo: number
  valor_contrato: number
  proposta_id: string

  custos: ICusto[]
  despesas: IDespesa[]
  tributos: ITributo[]
  despesas_indiretas: IDespesaIndireta[]
  despesas_diretas: IDespesaDireta[]
}

export interface ICusto {
  id?: number
  nome: string
  valor: number
  servico_id?: string
}
export interface IDespesa {
  id?: number
  nome: string
  valor: number
  servico_id?: string
}
export interface ITributo {
  id?: number
  nome: string
  aliquota: number
  servico_id?: string
}
export interface IDespesaIndireta {
  id?: number
  nome: string
  valor: number
  servico_id?: string
}

export interface IDespesaDireta {
  id?: number
  nome: string
  valor: number
  servico_id?: string
}
