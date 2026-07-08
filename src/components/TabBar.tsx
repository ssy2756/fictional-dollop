import { ACCENT, colors } from '../theme/tokens'

export type TabId = 'home' | 'risks' | 'meds' | 'lifestyle' | 'plan'

const TAB_DEFS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'risks', label: 'Risks' },
  { id: 'meds', label: 'Meds' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'plan', label: 'Plan' },
]

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 5,
        background: colors.tabBarBg,
        borderTop: `1px solid ${colors.tabBarBorder}`,
        display: 'flex',
        padding: '8px 6px calc(env(safe-area-inset-bottom, 0px) + 12px)',
      }}
    >
      {TAB_DEFS.map((t) => {
        const isActive = t.id === active
        return (
          <div
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              flex: 1,
              minHeight: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isActive ? ACCENT : colors.tabInactiveDot,
              }}
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? colors.tabActiveLabel : colors.tabInactiveLabel,
              }}
            >
              {t.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
