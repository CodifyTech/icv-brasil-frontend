export interface IOrdemServico {
  id?: string
  codigo?: string
  cliente_id?: string
  fornecedor?: string
  num_pedido_compra?: string
  num_relatorio?: string
  descritivo?: string
  responsavel_id?: string
  perfil_responsavel_id?: string | null
  escopo_acreditacao_id?: string | null
  tipo_servico_id?: string | null
  data_execucao?: string | null
  certificado_associado?: string | null
  resultado?: string | null
  status?: string | null
  anexos?: IOrdemServicoAnexo[]
  materialEquipamentos?: IMaterialEquipamento[]
}

export interface IMaterialEquipamento {
  id: string
  descricao: string
}

export interface IOrdemServicoAnexo {
  id: string
  nome: string
  anexo: string | File | File[]
  inmetro_flag: boolean
  ordem_servico_id: string
}

export interface IFiltrosInmetro {
  cliente?: string
  data_inspecao_inicio?: string
  data_inspecao_fim?: string
  inspetor?: string
  fornecedor?: string
  escopo?: string
  tipo_inspecao?: string
  ordem_servico?: string
  pedido?: string
  certificado?: string
}
