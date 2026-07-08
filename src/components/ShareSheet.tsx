import { ACCENT, ACCENT_ON, colors } from '../theme/tokens'

interface ShareSheetProps {
  open: boolean
  confirmed: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ShareSheet({ open, confirmed, onClose, onConfirm }: ShareSheetProps) {
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
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary }}>Share Report</div>
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
          Send the full 7-page comprehensive PDF report — all findings, medication guidance and your action plan.
        </div>
        {!confirmed ? (
          <div
            onClick={onConfirm}
            style={{
              cursor: 'pointer',
              background: ACCENT,
              color: ACCENT_ON,
              textAlign: 'center',
              fontWeight: 800,
              fontSize: 14.5,
              padding: 14,
              borderRadius: 14,
            }}
          >
            Share Comprehensive PDF Report
          </div>
        ) : (
          <div
            style={{
              background: colors.successConfirmBg,
              color: colors.successConfirmText,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              padding: 14,
              borderRadius: 14,
            }}
          >
            ✓ Ready to share — check your device's share sheet
          </div>
        )}
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
          Cancel
        </div>
      </div>
    </div>
  )
}
