export interface ICliente {
  id?: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidade: string
  estado: string
  filiais?: ICliente[]
  cliente_id?: string
}
