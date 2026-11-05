import { describe, expect, it } from 'vitest'
import { computeBalance } from '../../domain/balance'
import { todayIso } from '../../domain/dates'
import { customerStatus } from '../../domain/overdue'
import { NotFoundError, TransactionRejectedError } from '../errors'
import { DemoDataSource } from './DemoDataSource'
import { memoryStorage, type StorageLike } from './storage'

const NOW = new Date('2026-11-05T09:00:00Z')
const TODAY = todayIso(NOW)
const make = (storage: StorageLike = memoryStorage()) => new DemoDataSource(storage, () => NOW)

const balanceOf = async (source: DemoDataSource, customerId: string): Promise<number> => {
  const all = await source.listTransactions()
  return computeBalance(all.filter((transaction) => transaction.customerId === customerId))
}

describe('données de démonstration', () => {
  it('sont cohérentes avec les règles métier', async () => {
    const source = make()
    const all = await source.listTransactions()
    const paul = all.filter((transaction) => transaction.customerId === 'cus_paul')

    expect((await source.listCustomers()).length).toBe(6)
    expect(computeBalance(paul)).toBe(45000)
    expect(customerStatus(paul, TODAY)).toBe('late')
    expect(await balanceOf(source, 'cus_solange')).toBe(0)
  })

  it('sont conservées entre deux instances qui partagent le stockage', async () => {
    const storage = memoryStorage()
    await make(storage).createTransaction({ customerId: 'cus_eric', kind: 'credit', amount: 2000 })
    expect(await balanceOf(make(storage), 'cus_eric')).toBe(10000)
  })

  it('reviennent à zéro après une réinitialisation', async () => {
    const source = make()
    await source.createTransaction({ customerId: 'cus_paul', kind: 'payment', amount: 45000 })
    await source.resetDemo()
    expect(await balanceOf(source, 'cus_paul')).toBe(45000)
  })
})

describe('createTransaction', () => {
  it('enregistre un crédit qui augmente le solde', async () => {
    const source = make()
    await source.createTransaction({ customerId: 'cus_paul', kind: 'credit', amount: 10000 })
    expect(await balanceOf(source, 'cus_paul')).toBe(55000)
  })

  it('accepte un paiement égal au solde', async () => {
    const source = make()
    await source.createTransaction({ customerId: 'cus_paul', kind: 'payment', amount: 45000 })
    expect(await balanceOf(source, 'cus_paul')).toBe(0)
  })

  it('refuse un paiement supérieur au solde sans rien enregistrer', async () => {
    const source = make()
    const before = (await source.listTransactions()).length

    await expect(
      source.createTransaction({ customerId: 'cus_paul', kind: 'payment', amount: 45001 }),
    ).rejects.toBeInstanceOf(TransactionRejectedError)

    expect((await source.listTransactions()).length).toBe(before)
  })

  it('refuse un client inconnu', async () => {
    await expect(
      make().createTransaction({ customerId: 'inconnu', kind: 'credit', amount: 1000 }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it("ne garde l'échéance que pour un crédit", async () => {
    const source = make()
    const credit = await source.createTransaction({
      customerId: 'cus_eric',
      kind: 'credit',
      amount: 1000,
      dueDate: '2026-12-01',
    })
    const payment = await source.createTransaction({
      customerId: 'cus_eric',
      kind: 'payment',
      amount: 500,
      dueDate: '2026-12-01',
    })
    expect(credit.dueDate).toBe('2026-12-01')
    expect(payment.dueDate).toBeUndefined()
  })
})

describe('clients', () => {
  it('crée un client valide', async () => {
    const source = make()
    const created = await source.createCustomer({ name: '  Rose Ndzi ', phone: '677 00 11 22' })
    expect(created.name).toBe('Rose Ndzi')
    expect((await source.listCustomers()).length).toBe(7)
  })

  it('refuse un client sans nom ou sans numéro valide', async () => {
    const source = make()
    await expect(source.createCustomer({ name: '', phone: '677 00 11 22' })).rejects.toThrow()
    await expect(source.createCustomer({ name: 'Rose', phone: '12' })).rejects.toThrow()
  })

  it('met à jour un client existant', async () => {
    const source = make()
    const updated = await source.updateCustomer('cus_paul', { address: 'Akwa, Douala' })
    expect(updated.address).toBe('Akwa, Douala')
  })
})
