interface IRole {
  title: string
  value: string
}

interface IFuncionario {
  id?: string
  nome?: string
  departamento_id?: string | number
}

export interface IUser {
  id?: string
  name: string
  email: string
  password?: string
  password_confirmation?: string
  email_verified_at?: boolean
  foto?: string
  role: null | string | IRole
  termos?: number
  ativo?: number
  departamento_id?: string | number
  funcionario?: IFuncionario
}

export interface IItemsResponse {
  data: IUser[]
  total: number
  page: number
}
