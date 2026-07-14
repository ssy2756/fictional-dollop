import { useState } from 'react'
import { useReportData } from '../state/ReportDataContext'
import { SAMPLE_REPORT_UID } from '../data/constants'
import { ACCENT, ACCENT_ON, colors } from '../theme/tokens'

interface UidGateScreenProps {
  onOpenUpload: () => void
}

export default function UidGateScreen({ onOpenUpload }: UidGateScreenProps) {
  const { status, errorMessage, loadUid } = useReportData()
  const [value, setValue] = useState('')

  const loading = status === 'loading'

  const submit = () => {
    if (value.trim() && !loading) void loadUid(value)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
          Enter Your Report Code
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: colors.textBody2 }}>
          Enter the access code you received when your genetic report was uploaded.
        </div>
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="e.g. XJ4K9P2M"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid oklch(1 0 0 / 10%)',
          background: colors.cardBg,
          color: 'oklch(0.95 0.006 265)',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.08em',
          fontFamily: "'JetBrains Mono', monospace",
          outline: 'none',
          textAlign: 'center',
        }}
      />

      {status === 'error' && errorMessage && (
        <div
          style={{
            background: 'oklch(0.70 0.18 25 / 18%)',
            color: 'oklch(0.70 0.18 25)',
            fontSize: 13,
            fontWeight: 600,
            padding: 12,
            borderRadius: 12,
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        onClick={submit}
        style={{
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.6 : 1,
          background: ACCENT,
          color: ACCENT_ON,
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 14.5,
          padding: 14,
          borderRadius: 14,
        }}
      >
        {loading ? 'Loading…' : 'View Report'}
      </div>

      <div
        onClick={() => !loading && void loadUid(SAMPLE_REPORT_UID)}
        style={{
          cursor: loading ? 'default' : 'pointer',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 600,
          color: colors.textMuted,
        }}
      >
        Don't have a code? View the sample report
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 1, background: colors.cardBorder }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          or
        </div>
        <div style={{ flex: 1, height: 1, background: colors.cardBorder }} />
      </div>

      <div
        onClick={() => !loading && onOpenUpload()}
        style={{
          cursor: loading ? 'default' : 'pointer',
          textAlign: 'center',
          fontSize: 13.5,
          fontWeight: 700,
          color: ACCENT,
          padding: 14,
          borderRadius: 14,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        Upload a New Report
      </div>
    </div>
  )
}
