import { describe, expect, it } from 'vitest'
import { formatDate } from './dates'
import {
  buildReceiptMessage,
  buildReminderMessage,
  normalizePhone,
  whatsappLink,
} from './whatsapp'

describe('normalizePhone', () => {
  it('ajoute le code pays à un numéro local', () => {
    expect(normalizePhone('670 12 34 56')).toBe('237670123456')
  })

  it('accepte les formats internationaux', () => {
    expect(normalizePhone('+237 670 12 34 56')).toBe('237670123456')
    expect(normalizePhone('00237670123456')).toBe('237670123456')
    expect(normalizePhone('237670123456')).toBe('237670123456')
  })
})

describe('whatsappLink', () => {
  it('encode correctement le message', () => {
    const link = whatsappLink('670123456', 'Bonjour à vous & merci')
    expect(link).toBe('https://wa.me/237670123456?text=Bonjour%20%C3%A0%20vous%20%26%20merci')
  })
})

describe('messages', () => {
  it('construit une relance', () => {
    const message = buildReminderMessage({
      customerName: 'Paul',
      shopName: 'Ma boutique',
      balance: 45000,
      date: '2026-11-05',
    })
    expect(message).toContain('Bonjour Paul')
    expect(message).toContain('Ma boutique')
    expect(message).toContain('45 000 FCFA')
    expect(message).toContain('05/11/2026')
  })

  it("construit un reçu de paiement avec le solde restant", () => {
    const message = buildReceiptMessage({
      kind: 'payment',
      customerName: 'Paul',
      shopName: 'Ma boutique',
      amount: 15000,
      balanceAfter: 30000,
      date: '2026-11-05',
    })
    expect(message).toContain('Reçu de paiement')
    expect(message).toContain('Montant payé : 15 000 FCFA')
    expect(message).toContain('Solde restant : 30 000 FCFA')
  })

  it('construit un reçu de crédit', () => {
    const message = buildReceiptMessage({
      kind: 'credit',
      customerName: 'Marie',
      shopName: 'Ma boutique',
      amount: 8000,
      balanceAfter: 8000,
      date: '2026-11-05',
    })
    expect(message).toContain('Crédit enregistré')
    expect(message).toContain('Total à payer : 8 000 FCFA')
  })
})

describe('formatDate', () => {
  it('formate une date ISO', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026')
    expect(formatDate('2026-11-05T10:00:00Z')).toBe('05/11/2026')
  })
})
