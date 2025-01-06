export interface ICliente {
  razao_social: string
  nome_fantasia: string
  cnpj: string
}

export interface IFilial {
  id?: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  cliente_id?: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidade: string
  estado: string
}
