export interface IRubricas {
  custos: IRubrica[]
  despesas: IRubrica[]
  tributos: IRubrica[]
  despesas_diretas: IRubrica[]
  despesas_indiretas: IRubrica[]
}

export interface IRubrica {
  id?: string
  nome: string
  tipo: string
  tipo_valor: number
  valor: number
}
