import { defineStore } from 'pinia'
import type { IAtestadoOcupacional, IEPI, IFormacao, IQualificacao } from '@/pages/funcionario/types'
import {IUser} from "@/pages/users/types";

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

  user: {
    email: '',
    password: '',
  } as IUser,
  formacoes: [] as IFormacao[],
  atestado_ocupacionals: [] as IAtestadoOcupacional[],
  epis: [] as IEPI[],
  qualificacoes: [] as IQualificacao[],
}

export const useFuncionarioStore = defineStore('crud/funcionario', {
  state: () => ({
    serviceName: 'FuncionarioService',
    sortKeyDefault: 'nome',
    defaultValue,
    useres: [],
    loading: {
      save: false,
      item: false,
      items: false,
      destroy: false,
      user: false,
    },
  }),
  actions: {
    // 👉 methods
  },
})
