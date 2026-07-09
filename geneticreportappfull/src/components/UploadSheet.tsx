import { useRef } from 'react'
import { useUploadReport } from '../state/useUploadReport'
import { ACCENT, ACCENT_ON, colors } from '../theme/tokens'

interface UploadSheetProps {
  open: boolean
  onClose: () => void
}

export default function UploadSheet({ open, onClose }: UploadSheetProps) {
  const { status, errorMessage, upload, reset } = useUploadReport()
  const inputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) void upload(file)
  }

  const close = () => {
    if (status !== 'uploading') {
      reset()
      onClose()
    }
  }

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
      onClick={close}
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
          <div style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary }}>Upload New Report</div>
          {status !== 'uploading' && (
            <div
              onClick={close}
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
          )}
        </div>

        {status === 'success' ? (
          <>
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
              ✓ Report parsed and loaded
            </div>
            <div
              onClick={close}
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
              Done
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'oklch(0.68 0.012 265)' }}>
              Upload a PDF genetic test report — we'll extract it into the same view you're using now. This can take
              up to a minute. Max file size 4MB.
            </div>

            {status === 'error' && errorMessage && (
              <div
                style={{
                  background: 'oklch(0.70 0.18 25 / 18%)',
                  color: 'oklch(0.70 0.18 25)',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 12,
                  borderRadius: 12,
                }}
              >
                {errorMessage}
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={status === 'uploading'}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => status !== 'uploading' && inputRef.current?.click()}
              style={{
                cursor: status === 'uploading' ? 'default' : 'pointer',
                background: status === 'uploading' ? colors.cardBg : ACCENT,
                color: status === 'uploading' ? colors.textMuted : ACCENT_ON,
                textAlign: 'center',
                fontWeight: 800,
                fontSize: 14.5,
                padding: 14,
                borderRadius: 14,
                border: status === 'uploading' ? `1px solid ${colors.cardBorder}` : 'none',
              }}
            >
              {status === 'uploading'
                ? 'Parsing report…'
                : status === 'error'
                  ? 'Choose a Different PDF'
                  : 'Choose PDF File'}
            </div>
          </>
        )}

        {status !== 'uploading' && (
          <div
            onClick={close}
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
        )}
      </div>
    </div>
  )
}
