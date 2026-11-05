import { computeBalance } from '../../domain/balance'
import { validateCustomerInput } from '../../domain/customer'
import type { Customer, Transaction } from '../../domain/types'
import { validateTransaction } from '../../domain/validation'
import type { CustomerPatch, DataSource, NewCustomer, NewTransaction } from '../dataSource'
import { NotFoundError, TransactionRejectedError } from '../errors'
import { newId } from './id'
import { buildSeed, type DemoState } from './seed'
import type { StorageLike } from './storage'

const STORAGE_KEY = 'carnet-credit:demo:v1'

export class DemoDataSource implements DataSource {
  readonly isDemo = true
  private readonly storage: StorageLike
  private readonly now: () => Date

  constructor(storage: StorageLike, now: () => Date = () => new Date()) {
    this.storage = storage
    this.now = now
  }

  private read(): DemoState {
    const raw = this.storage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as DemoState
        if (
          parsed.version === 1 &&
          Array.isArray(parsed.customers) &&
          Array.isArray(parsed.transactions)
        ) {
          return parsed
        }
      } catch {
        // Données illisibles : on repart des données de démonstration.
      }
    }
    const seed = buildSeed(this.now())
    this.write(seed)
    return seed
  }

  private write(state: DemoState): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  async listCustomers(): Promise<Customer[]> {
    return this.read().customers
  }

  async listTransactions(): Promise<Transaction[]> {
    return this.read().transactions
  }

  async createCustomer(input: NewCustomer): Promise<Customer> {
    const errors = validateCustomerInput(input)
    const firstError = Object.values(errors)[0]
    if (firstError) throw new Error(firstError)

    const state = this.read()
    const customer: Customer = {
      id: newId('cus'),
      name: input.name.trim(),
      phone: input.phone.trim(),
      createdAt: this.now().toISOString(),
      ...(input.address?.trim() ? { address: input.address.trim() } : {}),
      ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    }
    this.write({ ...state, customers: [...state.customers, customer] })
    return customer
  }

  async updateCustomer(id: string, patch: CustomerPatch): Promise<Customer> {
    const state = this.read()
    const current = state.customers.find((customer) => customer.id === id)
    if (!current) throw new NotFoundError('Client')

    const updated: Customer = { ...current, ...patch }
    const errors = validateCustomerInput(updated)
    const firstError = Object.values(errors)[0]
    if (firstError) throw new Error(firstError)

    this.write({
      ...state,
      customers: state.customers.map((customer) => (customer.id === id ? updated : customer)),
    })
    return updated
  }

  async createTransaction(input: NewTransaction): Promise<Transaction> {
    const state = this.read()
    if (!state.customers.some((customer) => customer.id === input.customerId)) {
      throw new NotFoundError('Client')
    }

    const balance = computeBalance(
      state.transactions.filter((transaction) => transaction.customerId === input.customerId),
    )
    const result = validateTransaction({ kind: input.kind, amount: input.amount }, balance)
    if (!result.ok) throw new TransactionRejectedError(result.error, balance)

    const transaction: Transaction = {
      id: newId('tx'),
      customerId: input.customerId,
      kind: input.kind,
      amount: input.amount,
      createdAt: this.now().toISOString(),
      ...(input.description?.trim() ? { description: input.description.trim() } : {}),
      ...(input.kind === 'credit' && input.dueDate ? { dueDate: input.dueDate } : {}),
    }
    this.write({ ...state, transactions: [...state.transactions, transaction] })
    return transaction
  }

  async resetDemo(): Promise<void> {
    this.write(buildSeed(this.now()))
  }
}
