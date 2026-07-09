import { colors } from '../theme/tokens'

interface InstallSheetProps {
  open: boolean
  onClose: () => void
}

const STEPS = [
  { icon: '⎋', text: <>Tap the <strong>Share</strong> icon in Safari's toolbar.</> },
  { icon: '➕', text: <>Scroll down and tap <strong>Add to Home Screen</strong>.</> },
  { icon: '✓', text: <>Tap <strong>Add</strong> in the top-right corner to confirm.</> },
]

export default function InstallSheet({ open, onClose }: InstallSheetProps) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: colors.sheetOverlay,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: colors.sheetBg,
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px calc(env(safe-area-inset-bottom, 0px) + 34px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          borderTop: `1px solid ${colors.sheetBorder}`,
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'oklch(1 0 0 / 18%)', margin: '0 auto' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary }}>Add to Home Screen</div>
          <div
            onClick={onClose}
            style={{
              cursor: 'pointer',
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'oklch(0.24 0.013 265)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: 'oklch(0.75 0.01 265)',
            }}
          >
            ✕
          </div>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'oklch(0.68 0.012 265)' }}>
          Safari doesn't let apps trigger this automatically — a couple of taps gets you a home-screen icon with
          quick, full-screen access.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.4, color: colors.textBody }}>{step.text}</div>
            </div>
          ))}
        </div>
        <div
          onClick={onClose}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: colors.textMuted,
            paddingTop: 2,
          }}
        >
          Got it
        </div>
      </div>
    </div>
  )
}
