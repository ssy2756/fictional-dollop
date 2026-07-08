import type { CSSProperties, ReactNode } from 'react'
import { colors } from '../theme/tokens'

interface CardProps {
  children: ReactNode
  onClick?: () => void
  gap?: number
  style?: CSSProperties
}

export default function Card({ children, onClick, gap = 8, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 16,
        padding: '14px 16px',
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        display: 'flex',
        flexDirection: 'column',
        gap,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
