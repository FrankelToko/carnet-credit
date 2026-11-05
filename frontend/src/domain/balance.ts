import type { Money, Transaction } from './types'

/** Effet d'une transaction sur la dette : positif l'augmente, négatif la réduit. */
export const signedAmount = (transaction: Transaction): Money =>
  transaction.kind === 'payment' ? -transaction.amount : transaction.amount

/** Le solde n'est jamais stocké : il est toujours recalculé depuis les transactions. */
export const computeBalance = (transactions: readonly Transaction[]): Money =>
  transactions.reduce((sum, transaction) => sum + signedAmount(transaction), 0)

export interface Summary {
  totalCredit: Money
  totalPaid: Money
  balance: Money
}

/**
 * Totaux d'un client. Une correction positive compte comme un crédit,
 * une correction négative comme un remboursement.
 */
export const summarize = (transactions: readonly Transaction[]): Summary => {
  let totalCredit = 0
  let totalPaid = 0
  for (const transaction of transactions) {
    const effect = signedAmount(transaction)
    if (effect >= 0) totalCredit += effect
    else totalPaid += -effect
  }
  return { totalCredit, totalPaid, balance: totalCredit - totalPaid }
}
