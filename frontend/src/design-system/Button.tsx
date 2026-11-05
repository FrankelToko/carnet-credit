import type { ButtonHTMLAttributes } from 'react'
import { cx } from './cx'

type Variant = 'primary' | 'success' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-night text-white active:bg-night/90',
  success: 'bg-teal text-white active:bg-teal/90',
  secondary: 'border-2 border-night bg-transparent text-night active:bg-night/5',
  ghost: 'bg-transparent text-night active:bg-night/5',
}

const SIZES: Record<Size, string> = {
  md: 'h-12 px-5 text-base',
  lg: 'h-16 px-6 text-lg',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cx(
      'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-colors',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
      'disabled:cursor-not-allowed disabled:opacity-50',
      VARIANTS[variant],
      SIZES[size],
      fullWidth && 'w-full',
      className,
    )}
    {...props}
  />
)
