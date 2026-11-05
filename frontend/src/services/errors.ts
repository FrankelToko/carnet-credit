import type { Money } from '../domain/types'
import { validationMessage, type ValidationError } from '../domain/validation'

export class TransactionRejectedError extends Error {
  readonly reason: ValidationError

  constructor(reason: ValidationError, balance: Money) {
    super(validationMessage(reason, balance))
    this.name = 'TransactionRejectedError'
    this.reason = reason
  }
}

export class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} introuvable.`)
    this.name = 'NotFoundError'
  }
}
