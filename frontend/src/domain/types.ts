/** Montant en FCFA, toujours un entier (pas de centimes). */
export type Money = number

export type TransactionKind = 'credit' | 'payment' | 'adjustment'

export interface Customer {
  id: string
  name: string
  phone: string
  address?: string
  notes?: string
  createdAt: string
}

/**
 * Une transaction validée est immuable.
 * Pour `adjustment`, le montant est signé : positif augmente la dette,
 * négatif la réduit. Pour `credit` et `payment`, il est strictement positif.
 */
export interface Transaction {
  id: string
  customerId: string
  kind: TransactionKind
  amount: Money
  description?: string
  dueDate?: string
  createdAt: string
}
