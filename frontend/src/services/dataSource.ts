import type { Customer, Money, Transaction, TransactionKind } from '../domain/types'

export interface NewCustomer {
  name: string
  phone: string
  address?: string
  notes?: string
}

export type CustomerPatch = Partial<NewCustomer>

export interface NewTransaction {
  customerId: string
  kind: TransactionKind
  amount: Money
  description?: string
  dueDate?: string
}

/**
 * Contrat commun au mode démonstration et à l'API Django.
 * Volontairement, il n'existe aucune méthode pour modifier ou supprimer
 * une transaction : une correction est une nouvelle transaction.
 */
export interface DataSource {
  readonly isDemo: boolean
  listCustomers(): Promise<Customer[]>
  createCustomer(input: NewCustomer): Promise<Customer>
  updateCustomer(id: string, patch: CustomerPatch): Promise<Customer>
  listTransactions(): Promise<Transaction[]>
  createTransaction(input: NewTransaction): Promise<Transaction>
  /** Uniquement en démonstration. */
  resetDemo?(): Promise<void>
}
