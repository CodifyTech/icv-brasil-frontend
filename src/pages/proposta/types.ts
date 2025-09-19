import type { AnexoItem } from '@/components/AttachmentUpload.vue'

export interface IProposta {
  id?: string
  codigo_proposta: string
  pessoa_contato: string
  consultor: string
  telefone: string
  email: string
  status: string
  cliente_id: string | null
  observacao: string | null
  departamentos: Array<{ id: string; nome: string }>
  funcionarios: Array<{ id: string; nome: string }>
  tipoServicos: Array<{ id: string; nome: string }>
  anexos: AnexoItem[]
}

export interface IServico {
  id?: string
  tipo_servico_id: string | null
  unidade_custos: string
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
  id?: string
  nome: string
  valor: number
  servico_id?: string
}
export interface IDespesa {
  id?: string
  nome: string
  valor: number
  servico_id?: string
}
export interface ITributo {
  id?: string
  nome: string
  aliquota: number
  servico_id?: string
}
export interface IDespesaIndireta {
  id?: string
  nome: string
  valor: number
  servico_id?: string
}

export interface IDespesaDireta {
  id?: string
  nome: string
  valor: number
  servico_id?: string
}
