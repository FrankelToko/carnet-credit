import { Delete } from 'lucide-react'
import { pressKey, type Key } from '../domain/amountInput'

const KEYS: Key[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', 'backspace']

interface AmountKeypadProps {
  value: string
  onChange: (value: string) => void
}

export const AmountKeypad = ({ value, onChange }: AmountKeypadProps) => (
  <div className="grid grid-cols-3 gap-2">
    {KEYS.map((key) => (
      <button
        key={key}
        type="button"
        aria-label={key === 'backspace' ? 'Effacer' : undefined}
        onClick={() => onChange(pressKey(value, key))}
        className="flex h-16 items-center justify-center rounded-2xl border border-line bg-white text-2xl font-bold text-ink active:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
      >
        {key === 'backspace' ? <Delete aria-hidden="true" /> : key}
      </button>
    ))}
  </div>
)
