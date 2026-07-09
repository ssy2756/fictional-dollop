import { colors } from '../theme/tokens'

interface SectionHeaderProps {
  title: string
  subtitle: string
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary }}>{title}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: colors.textMuted }}>{subtitle}</div>
    </div>
  )
}
