import { computeBalance } from './balance'
import type { Money, Transaction } from './types'

export type CustomerStatus = 'settled' | 'late' | 'ongoing'

/**
 * Montant en retard à la date `today` (AAAA-MM-JJ).
 * Les paiements remboursent d'abord les crédits les plus anciens.
 * Un crédit sans échéance n'est jamais en retard.
 */
export const overdueAmount = (
  transactions: readonly Transaction[],
  today: string,
): Money => {
  const sorted = [...transactions].sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  let repaid = 0
  for (const transaction of sorted) {
    if (transaction.kind === 'payment') repaid += transaction.amount
    else if (transaction.kind === 'adjustment' && transaction.amount < 0) {
      repaid += -transaction.amount
    }
  }

  let overdue = 0
  for (const transaction of sorted) {
    const isDebt =
      transaction.kind === 'credit' ||
      (transaction.kind === 'adjustment' && transaction.amount > 0)
    if (!isDebt) continue

    const covered = Math.min(repaid, transaction.amount)
    repaid -= covered
    const remaining = transaction.amount - covered
    if (remaining > 0 && transaction.dueDate && transaction.dueDate < today) {
      overdue += remaining
    }
  }
  return overdue
}

export const customerStatus = (
  transactions: readonly Transaction[],
  today: string,
): CustomerStatus => {
  if (computeBalance(transactions) === 0) return 'settled'
  return overdueAmount(transactions, today) > 0 ? 'late' : 'ongoing'
}
