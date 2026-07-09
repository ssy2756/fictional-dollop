import { ACCENT, ACCENT_ON, colors } from '../theme/tokens'

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export default function Chip({ label, active, onClick }: ChipProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        flexShrink: 0,
        padding: '9px 14px',
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 700,
        background: active ? ACCENT : colors.chipInactiveBg,
        color: active ? ACCENT_ON : colors.chipInactiveFg,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}
