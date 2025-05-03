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
  anexo_dados_bancarios: File | string | null
  user_id?: string
  departamento_id?: string
}

export interface IFuncionarioAnexo {
  id?: string
  nome: string
  anexo: File | string | null
  funcionario_id?: string
}

export interface IFormacao {
  id?: string
  nome: string
  conselho_classe: string
  anexo: File | string | null
}

export interface IQualificacao {
  id?: string
  nome: string
  validate: string
  utilma_avaliacao: string
  validate_avaliacao: string
  anexo: File | string | null
}

export interface IAtestadoOcupacional {
  id?: string
  nome: string
  validade: string
  exame: File | string | null
}

export interface IEPI {
  id?: string
  nome: string
  ca: string
  anexo: File | string | null
}
