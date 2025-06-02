import { defineStore } from 'pinia'
import type { IDepartamento } from '@/pages/departamento/types'
import FuncionarioService from '@/pages/funcionario/services/FuncionarioService'
import type { IAtestadoOcupacional, IEPI, IFormacao, IFuncionarioAnexo, IHonorario, IQualificacao, ITipoDocumento } from '@/pages/funcionario/types'
import type { IUser } from '@/pages/users/types'

const defaultValue = {
  foto: '',
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
  honorarios: [] as IHonorario[],
}

export const useFuncionarioStore = defineStore('crud/funcionario', {
  state: () => ({
    serviceName: 'FuncionarioService',
    sortKeyDefault: 'nome',
    defaultValue,
    useres: [],
    departamentos: [] as IDepartamento[],
    tipoDocumentos: [] as ITipoDocumento[],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      user: false,
      departamentos: false,
      tipoDocumentos: false,
    },
  }),
  actions: {
    // 👉 methods
    async fetchDepartamentos(search?: string) {
      this.loading.departamentos = true
      await FuncionarioService.fetchAll<IDepartamento[]>({
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
    async fetchTipoDocumentos(search?: string) {
      this.loading.tipoDocumentos = true
      await FuncionarioService.fetchAll<ITipoDocumento[]>({
        search,
      }, 'listar/tipo-documentos')
        .then(data => {
          this.tipoDocumentos = data
          this.loading.tipoDocumentos = false
        }).catch(() => {
          this.tipoDocumentos = []
          this.loading.tipoDocumentos = false
        })
    },
  },
})
