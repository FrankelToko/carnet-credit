import { formatDate } from './dates'
import { formatAmount } from './money'
import type { Money } from './types'

const DEFAULT_COUNTRY_CODE = '237'

/** Numéro au format international sans "+" : "670 12 34 56" -> "237670123456". */
export const normalizePhone = (
  raw: string,
  countryCode: string = DEFAULT_COUNTRY_CODE,
): string => {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (trimmed.startsWith('+')) return digits
  if (digits.startsWith('00')) return digits.slice(2)
  return digits.startsWith(countryCode) ? digits : countryCode + digits
}

/** Lien WhatsApp avec message prérempli : le commerçant l'ouvre et envoie lui-même. */
export const whatsappLink = (phone: string, message: string): string =>
  `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`

/** Montant avec espaces simples (pas d'espaces insécables dans un message). */
const amountText = (value: Money): string =>
  `${formatAmount(value).replace(/\s/g, ' ')} FCFA`

export interface ReminderInput {
  customerName: string
  shopName: string
  balance: Money
  date: string
}

export const buildReminderMessage = ({
  customerName,
  shopName,
  balance,
  date,
}: ReminderInput): string =>
  `Bonjour ${customerName}, ici ${shopName}. ` +
  `Au ${formatDate(date)}, il vous reste ${amountText(balance)} à régler. ` +
  'Merci de passer dès que possible.'

export interface ReceiptInput {
  kind: 'credit' | 'payment'
  customerName: string
  shopName: string
  amount: Money
  balanceAfter: Money
  date: string
}

export const buildReceiptMessage = ({
  kind,
  customerName,
  shopName,
  amount,
  balanceAfter,
  date,
}: ReceiptInput): string => {
  const isPayment = kind === 'payment'
  return [
    `${shopName} - ${isPayment ? 'Reçu de paiement' : 'Crédit enregistré'}`,
    `Client : ${customerName}`,
    `${isPayment ? 'Montant payé' : 'Montant du crédit'} : ${amountText(amount)}`,
    `${isPayment ? 'Solde restant' : 'Total à payer'} : ${amountText(balanceAfter)}`,
    `Date : ${formatDate(date)}`,
  ].join('\n')
}
