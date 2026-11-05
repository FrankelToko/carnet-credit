import { todayIso } from '../../domain/dates'
import type { Customer, Transaction } from '../../domain/types'

export interface DemoState {
  version: 1
  customers: Customer[]
  transactions: Transaction[]
}

/** Données fictives, datées par rapport à `now` pour que les retards restent cohérents. */
export const buildSeed = (now: Date): DemoState => {
  const day = (offset: number): string =>
    todayIso(new Date(now.getTime() + offset * 86_400_000))
  const at = (offset: number): string => `${day(offset)}T09:00:00.000Z`

  const customer = (id: string, name: string, phone: string, offset: number): Customer => ({
    id,
    name,
    phone,
    createdAt: at(offset),
  })

  const credit = (
    id: string,
    customerId: string,
    amount: number,
    offset: number,
    dueOffset: number | null,
    description: string,
  ): Transaction => ({
    id,
    customerId,
    kind: 'credit',
    amount,
    description,
    createdAt: at(offset),
    ...(dueOffset === null ? {} : { dueDate: day(dueOffset) }),
  })

  const payment = (id: string, customerId: string, amount: number, offset: number): Transaction => ({
    id,
    customerId,
    kind: 'payment',
    amount,
    createdAt: at(offset),
  })

  return {
    version: 1,
    customers: [
      customer('cus_paul', 'Paul Mbarga', '670 11 22 33', -90),
      customer('cus_marie', 'Marie Nkou', '699 44 55 66', -80),
      customer('cus_joseph', 'Joseph Tchamba', '677 77 88 99', -60),
      customer('cus_aicha', 'Aïcha Bello', '655 12 34 56', -45),
      customer('cus_eric', 'Éric Fotso', '690 98 76 54', -30),
      customer('cus_solange', 'Solange Biyick', '680 21 43 65', -50),
    ],
    transactions: [
      credit('tx_01', 'cus_paul', 60000, -40, -12, 'Ciment et fer à béton'),
      payment('tx_02', 'cus_paul', 15000, -20),
      credit('tx_03', 'cus_marie', 32500, -10, 1, 'Riz, huile et savon'),
      credit('tx_04', 'cus_joseph', 25000, -9, 14, 'Sacs de farine'),
      credit('tx_05', 'cus_joseph', 7000, -3, 14, 'Boissons'),
      payment('tx_06', 'cus_joseph', 5000, -1),
      credit('tx_07', 'cus_aicha', 15000, -5, 21, 'Pagnes'),
      credit('tx_08', 'cus_eric', 8000, -2, 30, 'Piles et ampoules'),
      credit('tx_09', 'cus_solange', 12000, -30, -15, 'Provisions'),
      payment('tx_10', 'cus_solange', 12000, -14),
    ],
  }
}
