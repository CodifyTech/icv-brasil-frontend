export interface Invoice {
  id: number
  issuedDate: string
  client: Client
  service: string
  total: number
  avatar: string
  invoiceStatus: string
  balance: number
  dueDate: string
}
