import type { IUser } from '@/pages/users/types'

export interface LoginResponse {
  authorization: IAuthorization
  user: IUser
}

export interface PayloadLogin {
  email: string
  password: string
}

export interface IAuthorization {
  token: string
  abilities: IAbilities
}

export interface IPermission {
  action: string
  subject: string
}

export interface IAbilities {
  role: string
  permissions: IPermission[]
  subjects: string[]
}
