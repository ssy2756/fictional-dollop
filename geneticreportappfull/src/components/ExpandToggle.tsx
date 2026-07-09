import { ACCENT } from '../theme/tokens'

interface ExpandToggleProps {
  expanded: boolean
  onToggle: () => void
  expandedLabel?: string
  collapsedLabel?: string
}

export default function ExpandToggle({
  expanded,
  onToggle,
  expandedLabel = 'Show less',
  collapsedLabel = 'What this means',
}: ExpandToggleProps) {
  return (
    <div
      onClick={onToggle}
      style={{ cursor: 'pointer', fontSize: 12, fontWeight: 600, color: ACCENT }}
    >
      {expanded ? expandedLabel : collapsedLabel}
    </div>
  )
}
