import type { CSSProperties } from 'react'
import { TONE, type Tone } from '../theme/tokens'

interface BadgeProps {
  label: string
  tone: Tone
  small?: boolean
  onClick?: (e: React.MouseEvent) => void
  cursor?: CSSProperties['cursor']
}

export default function Badge({ label, tone, small, onClick, cursor }: BadgeProps) {
  const t = TONE[tone]
  return (
    <div
      onClick={onClick}
      style={{
        fontSize: small ? 10.5 : 11,
        fontWeight: 700,
        padding: small ? '4px 9px' : '5px 10px',
        borderRadius: 999,
        color: t.text,
        background: t.bg,
        whiteSpace: 'nowrap',
        textAlign: 'right',
        cursor: cursor ?? 'default',
      }}
    >
      {label}
    </div>
  )
}
