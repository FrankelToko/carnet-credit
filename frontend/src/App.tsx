import { useState } from 'react'
import { Amount, AmountKeypad, Button, Card } from './design-system'
import { parseAmount } from './domain/amountInput'

const App = () => {
  const [typed, setTyped] = useState('15000')

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-5">
      <h1 className="text-2xl font-extrabold text-night">Design system</h1>

      <Card className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-muted">On me doit</span>
        <Amount value={184500} size="lg" />
      </Card>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1">Il me doit</Button>
        <Button size="lg" variant="success" className="flex-1">Il a payé</Button>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1">Annuler</Button>
        <Button variant="ghost" className="flex-1">Terminé</Button>
        <Button disabled className="flex-1">Valider</Button>
      </div>

      <div className="text-center">
        <Amount value={parseAmount(typed)} size="xl" />
      </div>
      <AmountKeypad value={typed} onChange={setTyped} />
    </main>
  )
}

export default App
