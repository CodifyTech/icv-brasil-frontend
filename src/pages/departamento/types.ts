import type { IUser } from '@/pages/users/types'

export interface IDepartamento {
  id: string
  nome: string
  email: string
  gestores?: IGestor[]
}

export interface IGestor extends Partial<IUser> {
}
