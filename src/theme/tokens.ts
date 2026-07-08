export type Tone = 'danger' | 'caution' | 'success' | 'neutral' | 'info'

export const ACCENT = '#FF6B4A'
export const ACCENT_ON = '#1a1208'

export function hexToRgba(hex: string, alpha: number): string {
  let h = (hex || ACCENT).replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.substring(0, 2), 16) || 0
  const g = parseInt(h.substring(2, 4), 16) || 0
  const b = parseInt(h.substring(4, 6), 16) || 0
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const ACCENT_SOFT = hexToRgba(ACCENT, 0.16)
export const ACCENT_SOFT_2 = hexToRgba(ACCENT, 0.32)

export const TONE: Record<Tone, { text: string; bg: string }> = {
  danger: { text: 'oklch(0.70 0.18 25)', bg: 'oklch(0.70 0.18 25 / 18%)' },
  caution: { text: 'oklch(0.78 0.15 90)', bg: 'oklch(0.78 0.15 90 / 18%)' },
  success: { text: 'oklch(0.74 0.15 150)', bg: 'oklch(0.74 0.15 150 / 16%)' },
  neutral: { text: 'oklch(0.78 0.02 265)', bg: 'oklch(0.78 0.02 265 / 14%)' },
  info: { text: 'oklch(0.74 0.12 230)', bg: 'oklch(0.74 0.12 230 / 18%)' },
}

export const colors = {
  appBg: 'oklch(0.13 0.008 265)',
  cardBg: 'oklch(0.18 0.011 265)',
  cardBorder: 'oklch(1 0 0 / 7%)',
  chipInactiveBg: 'oklch(0.22 0.012 265)',
  chipInactiveFg: 'oklch(0.82 0.01 265)',
  tooltipBg: 'oklch(0.23 0.013 265)',
  tooltipBorder: 'oklch(1 0 0 / 12%)',
  tabBarBg: 'oklch(0.15 0.009 265)',
  tabBarBorder: 'oklch(1 0 0 / 8%)',
  sheetBg: 'oklch(0.16 0.01 265)',
  sheetBorder: 'oklch(1 0 0 / 10%)',
  sheetOverlay: 'oklch(0 0 0 / 55%)',
  gaugeTrack: 'oklch(0.24 0.013 265)',
  badgeCircleBg: 'oklch(0.24 0.013 265)',

  textPrimary: 'oklch(0.97 0.006 265)',
  textSecondary: 'oklch(0.82 0.01 265)',
  textBody: 'oklch(0.78 0.012 265)',
  textBody2: 'oklch(0.72 0.012 265)',
  textCategory: 'oklch(0.65 0.01 265)',
  textHeading2: 'oklch(0.62 0.012 265)',
  textPatientName: 'oklch(0.60 0.01 265)',
  textMeta: 'oklch(0.58 0.01 265)',
  textMuted: 'oklch(0.55 0.01 265)',
  textFaint: 'oklch(0.52 0.01 265)',
  textLinked: 'oklch(0.50 0.01 265)',
  textLimitation: 'oklch(0.48 0.01 265)',
  textFooter: 'oklch(0.45 0.01 265)',
  tabInactiveDot: 'oklch(0.42 0.01 265)',
  tabActiveLabel: 'oklch(0.95 0.006 265)',
  tabInactiveLabel: 'oklch(0.52 0.01 265)',

  homeCountDanger: 'oklch(0.68 0.16 25)',
  homeCountCaution: 'oklch(0.75 0.15 90)',

  successConfirmBg: 'oklch(0.74 0.15 150 / 16%)',
  successConfirmText: 'oklch(0.78 0.15 150)',
}
