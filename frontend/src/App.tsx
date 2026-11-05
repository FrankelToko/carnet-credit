import { useData } from './app/DataContext'
import { Amount, Button, Card, DemoBanner } from './design-system'
import { computeBalance } from './domain/balance'
import { todayIso } from './domain/dates'
import { customerStatus, type CustomerStatus } from './domain/overdue'

const STATUS_LABEL: Record<CustomerStatus, string> = {
  settled: 'À jour',
  late: 'En retard',
  ongoing: 'En cours',
}

const STATUS_COLOR: Record<CustomerStatus, string> = {
  settled: 'text-success',
  late: 'text-danger',
  ongoing: 'text-muted',
}

const App = () => {
  const { customers, transactions, loading, error, isDemo, resetDemo } = useData()
  const today = todayIso()

  const rows = customers
    .map((customer) => {
      const own = transactions.filter((transaction) => transaction.customerId === customer.id)
      return { customer, balance: computeBalance(own), status: customerStatus(own, today) }
    })
    .sort((a, b) => b.balance - a.balance)

  const total = rows.reduce((sum, row) => sum + row.balance, 0)

  return (
    <>
      {isDemo && <DemoBanner />}
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-5">
        <h1 className="text-2xl font-extrabold text-night">Données de démonstration</h1>

        {loading && <p className="text-muted">Chargement…</p>}
        {error && <p className="font-semibold text-danger">{error}</p>}

        <Card className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-muted">On me doit</span>
          <Amount value={total} size="lg" />
        </Card>

        <ul className="flex flex-col gap-2">
          {rows.map(({ customer, balance, status }) => (
            <li key={customer.id}>
              <Card className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{customer.name}</div>
                  <div className={`text-sm font-semibold ${STATUS_COLOR[status]}`}>
                    {STATUS_LABEL[status]}
                  </div>
                </div>
                <Amount value={balance} />
              </Card>
            </li>
          ))}
        </ul>

        {resetDemo && (
          <Button variant="secondary" onClick={() => void resetDemo()}>
            Réinitialiser la démonstration
          </Button>
        )}
      </main>
    </>
  )
}

export default App
