import type { HTMLAttributes } from 'react'
import { cx } from './cx'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx('rounded-2xl border border-line bg-white p-4 shadow-sm', className)}
    {...props}
  />
)
