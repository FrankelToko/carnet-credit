import { describe, expect, it } from 'vitest'
import { parseAmount, pressKey } from './amountInput'
import { formatAmount } from './money'

// Intl utilise des espaces insécables : on les normalise pour comparer.
const normalize = (text: string): string => text.replace(/\s/g, ' ')

describe('formatAmount', () => {
  it('sépare les milliers', () => {
    expect(normalize(formatAmount(45000))).toBe('45 000')
    expect(normalize(formatAmount(1250000))).toBe('1 250 000')
  })

  it('affiche zéro', () => {
    expect(formatAmount(0)).toBe('0')
  })
})

describe('pressKey', () => {
  it('ajoute des chiffres', () => {
    expect(pressKey('1', '5')).toBe('15')
    expect(pressKey('15', '000')).toBe('15000')
  })

  it('ignore les zéros en tête', () => {
    expect(pressKey('', '0')).toBe('')
    expect(pressKey('', '000')).toBe('')
  })

  it('efface le dernier chiffre', () => {
    expect(pressKey('1500', 'backspace')).toBe('150')
    expect(pressKey('', 'backspace')).toBe('')
  })

  it('refuse de dépasser 9 chiffres', () => {
    expect(pressKey('123456789', '0')).toBe('123456789')
  })
})

describe('parseAmount', () => {
  it('convertit la saisie en entier', () => {
    expect(parseAmount('15000')).toBe(15000)
    expect(parseAmount('')).toBe(0)
  })
})
