export interface IRubricas {
  custos: IRubrica[]
  despesas: IRubrica[]
  tributos: IRubrica[]
}

export interface IRubrica {
  id?: string
  nome: string
  tipo: string
  tipo_valor: number
  valor: number
}
