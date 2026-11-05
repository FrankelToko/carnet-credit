import { formatAmount } from '../domain/money'
import type { Money } from '../domain/types'
import { cx } from './cx'

type Size = 'md' | 'lg' | 'xl'

interface AmountProps {
  value: Money
  size?: Size
  className?: string
}

const NUMBER_SIZES: Record<Size, string> = {
  md: 'text-lg',
  lg: 'text-3xl',
  xl: 'text-5xl',
}

const UNIT_SIZES: Record<Size, string> = {
  md: 'text-xs',
  lg: 'text-base',
  xl: 'text-xl',
}

export const Amount = ({ value, size = 'md', className }: AmountProps) => (
  <span className={cx('font-extrabold tracking-tight', NUMBER_SIZES[size], className)}>
    {formatAmount(value)}{' '}
    <span className={cx('font-bold', UNIT_SIZES[size])}>FCFA</span>
  </span>
)
