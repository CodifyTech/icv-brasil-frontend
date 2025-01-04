export interface ICliente {
  razao_social: string
  nome_fantasia: string
  cnpj: string
}

export interface IFilial {
  razao_social: string
  nome_fantasia: string
  cnpj: string
  cliente_id: string
}
