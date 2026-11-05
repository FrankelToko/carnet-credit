import { formatAmount } from './money'
import type { Money, TransactionKind } from './types'

export type ValidationError = 'invalid_amount' | 'exceeds_balance' | 'negative_balance'

export type ValidationResult = { ok: true } | { ok: false; error: ValidationError }

export interface TransactionDraft {
  kind: TransactionKind
  amount: Money
}

/**
 * Règles d'une nouvelle transaction, à partir du solde actuel du client :
 * - le montant est un entier non nul (strictement positif sauf pour une correction) ;
 * - un paiement ne dépasse jamais le solde restant ;
 * - une correction ne peut pas rendre le solde négatif.
 */
export const validateTransaction = (
  draft: TransactionDraft,
  currentBalance: Money,
): ValidationResult => {
  const { kind, amount } = draft

  if (!Number.isInteger(amount) || amount === 0) {
    return { ok: false, error: 'invalid_amount' }
  }
  if (kind !== 'adjustment' && amount < 0) {
    return { ok: false, error: 'invalid_amount' }
  }
  if (kind === 'payment' && amount > currentBalance) {
    return { ok: false, error: 'exceeds_balance' }
  }
  if (kind === 'adjustment' && currentBalance + amount < 0) {
    return { ok: false, error: 'negative_balance' }
  }
  return { ok: true }
}

export const validationMessage = (error: ValidationError, balance: Money): string => {
  switch (error) {
    case 'invalid_amount':
      return 'Entre un montant valide.'
    case 'exceeds_balance':
      return balance === 0
        ? "Ce client ne doit rien pour l'instant."
        : `Le paiement dépasse ce qu'il doit (${formatAmount(balance)} FCFA).`
    case 'negative_balance':
      return 'Cette correction rendrait le solde négatif.'
  }
}
