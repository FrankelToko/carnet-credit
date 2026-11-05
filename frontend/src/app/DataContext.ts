import { createContext, useContext } from 'react'
import type { Customer, Transaction } from '../domain/types'
import type { CustomerPatch, NewCustomer, NewTransaction } from '../services/dataSource'

export interface DataContextValue {
  customers: Customer[]
  transactions: Transaction[]
  loading: boolean
  error: string | null
  isDemo: boolean
  addCustomer: (input: NewCustomer) => Promise<Customer>
  updateCustomer: (id: string, patch: CustomerPatch) => Promise<Customer>
  addTransaction: (input: NewTransaction) => Promise<Transaction>
  resetDemo: (() => Promise<void>) | null
}

export const DataContext = createContext<DataContextValue | null>(null)

export const useData = (): DataContextValue => {
  const value = useContext(DataContext)
  if (!value) throw new Error('useData doit être utilisé dans <DataProvider>.')
  return value
}
