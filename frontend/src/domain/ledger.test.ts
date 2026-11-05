import { describe, expect, it } from 'vitest'
import { computeBalance, summarize } from './balance'
import { customerStatus, overdueAmount } from './overdue'
import type { Transaction } from './types'
import { validateTransaction } from './validation'

let counter = 0
const tx = (partial: Partial<Transaction> & Pick<Transaction, 'kind' | 'amount'>): Transaction => {
  counter += 1
  return {
    id: `t${counter}`,
    customerId: 'c1',
    createdAt: `2026-10-0${counter % 9 + 1}T08:00:00Z`,
    ...partial,
  }
}

describe('computeBalance et summarize', () => {
  it('calcule le solde depuis les transactions', () => {
    const list = [
      tx({ kind: 'credit', amount: 10000 }),
      tx({ kind: 'credit', amount: 5000 }),
      tx({ kind: 'payment', amount: 4000 }),
    ]
    expect(computeBalance(list)).toBe(11000)
    expect(summarize(list)).toEqual({ totalCredit: 15000, totalPaid: 4000, balance: 11000 })
  })

  it('vaut zéro sans transaction', () => {
    expect(computeBalance([])).toBe(0)
  })

  it('applique une correction signée', () => {
    const list = [
      tx({ kind: 'credit', amount: 10000 }),
      tx({ kind: 'adjustment', amount: -2000 }),
      tx({ kind: 'adjustment', amount: 500 }),
    ]
    expect(computeBalance(list)).toBe(8500)
    expect(summarize(list)).toEqual({ totalCredit: 10500, totalPaid: 2000, balance: 8500 })
  })
})

describe('validateTransaction', () => {
  it('accepte un crédit valide', () => {
    expect(validateTransaction({ kind: 'credit', amount: 15000 }, 0)).toEqual({ ok: true })
  })

  it('refuse un montant nul, négatif ou décimal', () => {
    for (const amount of [0, -100, 12.5]) {
      expect(validateTransaction({ kind: 'credit', amount }, 0)).toEqual({
        ok: false,
        error: 'invalid_amount',
      })
    }
  })

  it('accepte un paiement égal au solde', () => {
    expect(validateTransaction({ kind: 'payment', amount: 5000 }, 5000)).toEqual({ ok: true })
  })

  it('refuse un paiement supérieur au solde', () => {
    expect(validateTransaction({ kind: 'payment', amount: 5001 }, 5000)).toEqual({
      ok: false,
      error: 'exceeds_balance',
    })
  })

  it('refuse un paiement quand le client ne doit rien', () => {
    expect(validateTransaction({ kind: 'payment', amount: 100 }, 0)).toEqual({
      ok: false,
      error: 'exceeds_balance',
    })
  })

  it('refuse une correction qui rend le solde négatif', () => {
    expect(validateTransaction({ kind: 'adjustment', amount: -6000 }, 5000)).toEqual({
      ok: false,
      error: 'negative_balance',
    })
    expect(validateTransaction({ kind: 'adjustment', amount: -5000 }, 5000)).toEqual({ ok: true })
  })
})

describe('overdueAmount et customerStatus', () => {
  const today = '2026-11-05'

  it('compte un crédit échu et impayé', () => {
    const list = [tx({ kind: 'credit', amount: 10000, dueDate: '2026-10-10' })]
    expect(overdueAmount(list, today)).toBe(10000)
    expect(customerStatus(list, today)).toBe('late')
  })

  it("n'est pas en retard avant l'échéance ou sans échéance", () => {
    expect(overdueAmount([tx({ kind: 'credit', amount: 10000, dueDate: '2026-12-01' })], today)).toBe(0)
    expect(overdueAmount([tx({ kind: 'credit', amount: 10000 })], today)).toBe(0)
    expect(customerStatus([tx({ kind: 'credit', amount: 10000 })], today)).toBe('ongoing')
  })

  it('déduit les paiements partiels', () => {
    const list = [
      tx({ kind: 'credit', amount: 10000, dueDate: '2026-10-10', createdAt: '2026-10-01T08:00:00Z' }),
      tx({ kind: 'payment', amount: 4000, createdAt: '2026-10-05T08:00:00Z' }),
    ]
    expect(overdueAmount(list, today)).toBe(6000)
  })

  it('rembourse les crédits les plus anciens en premier', () => {
    const credits = [
      tx({ kind: 'credit', amount: 5000, dueDate: '2026-10-10', createdAt: '2026-10-01T08:00:00Z' }),
      tx({ kind: 'credit', amount: 5000, dueDate: '2026-12-01', createdAt: '2026-10-02T08:00:00Z' }),
    ]
    const withPayment = (amount: number) => [
      ...credits,
      tx({ kind: 'payment', amount, createdAt: '2026-10-20T08:00:00Z' }),
    ]
    expect(overdueAmount(withPayment(5000), today)).toBe(0)
    expect(overdueAmount(withPayment(3000), today)).toBe(2000)
  })

  it('indique soldé quand le solde est nul', () => {
    const list = [
      tx({ kind: 'credit', amount: 5000, dueDate: '2026-10-10' }),
      tx({ kind: 'payment', amount: 5000 }),
    ]
    expect(customerStatus(list, today)).toBe('settled')
  })
})
