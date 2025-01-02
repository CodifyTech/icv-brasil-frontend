export interface IFuncionario {
  nome: string
  rg: string
  cpf: string
  telefone_1: string
  telefone_2: string
  email_1: string
  email_2: string
  logradouro: string
  bairro: string
  cidade: string
  uf: string
  aeroporto_proximo: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  valor_hh: number
  valor_diaria: number
  valor_demanda: number
  valor_deslocamento: number
  valor_refeicao: number
  valor_pedagio: number
  valor_hospedagem: number
  valor_outros: number
  banco: string
  agencia: string
  conta: string
  user_id: string
}

export interface IFormacao {
  id?: string
  nome: string
  conselho_classe: string
}
