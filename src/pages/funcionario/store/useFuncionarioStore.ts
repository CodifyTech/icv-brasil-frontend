import { defineStore } from 'pinia'
import type { IAtestadoOcupacional, IEPI, IFormacao, IFuncionarioAnexo, IQualificacao } from '@/pages/funcionario/types'
import type { IUser } from '@/pages/users/types'
import type { IDepartamento } from '@/pages/departamento/types'
import FuncionarioService from '@/pages/funcionario/services/FuncionarioService'

const defaultValue = {
  nome: '',
  rg: '',
  cpf: '',
  telefone_1: '',
  telefone_2: '',
  email: '',
  password: '',
  logradouro: '',
  bairro: '',
  cidade: '',
  uf: '',
  aeroporto_proximo: '',
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  departamento_id: null,
  valor_hh: 0,
  valor_diaria: 0,
  valor_demanda: 0,
  valor_deslocamento: 0,
  valor_refeicao: 0,
  valor_pedagio: 0,
  valor_hospedagem: 0,
  valor_outros: 0,
  banco: '',
  agencia: '',
  conta: '',
  anexo_dados_bancarios: null,
  user_id: null,
  user: {
    email: '',
    password: '',
  } as IUser,
  formacoes: [] as IFormacao[],
  atestado_ocupacionals: [] as IAtestadoOcupacional[],
  epis: [] as IEPI[],
  qualificacoes: [] as IQualificacao[],
  anexos: [] as IFuncionarioAnexo[],
}

export const useFuncionarioStore = defineStore('crud/funcionario', {
  state: () => ({
    serviceName: 'FuncionarioService',
    sortKeyDefault: 'nome',
    defaultValue,
    useres: [],
    departamentos: [] as IDepartamento[],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      user: false,
      departamentos: false,
    },
  }),
  actions: {
    // 👉 methods
    async fetchDepartamentos(search?: string) {
      this.loading.departamentos = true
      await FuncionarioService.fetchAll<{
        data: IDepartamento[]
      }>({
        search,
      }, 'listar/departamentos')
        .then(data => {
          this.departamentos = data
          this.loading.departamentos = false
        }).catch(() => {
          this.departamentos = []
          this.loading.departamentos = false
        })
    },
  },
})
