import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Customer, Transaction } from '../domain/types'
import type { DataSource } from '../services/dataSource'
import { DataContext, type DataContextValue } from './DataContext'

interface DataProviderProps {
  source: DataSource
  children: ReactNode
}

interface Loaded {
  customers: Customer[]
  transactions: Transaction[]
}

const errorMessage = (caught: unknown): string =>
  caught instanceof Error ? caught.message : 'Chargement impossible.'

export const DataProvider = ({ source, children }: DataProviderProps) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async (): Promise<Loaded> => {
    const [loadedCustomers, loadedTransactions] = await Promise.all([
      source.listCustomers(),
      source.listTransactions(),
    ])
    return { customers: loadedCustomers, transactions: loadedTransactions }
  }, [source])

  // Chargement initial : l'état n'est modifié qu'une fois la réponse reçue.
  useEffect(() => {
    let cancelled = false
    fetchAll()
      .then((loaded) => {
        if (cancelled) return
        setCustomers(loaded.customers)
        setTransactions(loaded.transactions)
        setError(null)
      })
      .catch((caught: unknown) => {
        if (!cancelled) setError(errorMessage(caught))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [fetchAll])

  // Rechargement après une action (ajout, modification, réinitialisation).
  const refresh = useCallback(async () => {
    try {
      const loaded = await fetchAll()
      setCustomers(loaded.customers)
      setTransactions(loaded.transactions)
      setError(null)
    } catch (caught) {
      setError(errorMessage(caught))
    }
  }, [fetchAll])

  const value = useMemo<DataContextValue>(
    () => ({
      customers,
      transactions,
      loading,
      error,
      isDemo: source.isDemo,
      addCustomer: async (input) => {
        const created = await source.createCustomer(input)
        await refresh()
        return created
      },
      updateCustomer: async (id, patch) => {
        const updated = await source.updateCustomer(id, patch)
        await refresh()
        return updated
      },
      addTransaction: async (input) => {
        const created = await source.createTransaction(input)
        await refresh()
        return created
      },
      resetDemo: source.resetDemo
        ? async () => {
            await source.resetDemo?.()
            await refresh()
          }
        : null,
    }),
    [customers, transactions, loading, error, source, refresh],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
