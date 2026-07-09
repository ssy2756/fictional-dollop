import Chip from '../components/Chip'
import SectionHeader from '../components/SectionHeader'
import { useReportData } from '../state/ReportDataContext'
import type { FreqGroup } from '../data/reportData'
import type { ReportState } from '../state/useReportState'
import { ACCENT, ACCENT_ON, TONE, colors } from '../theme/tokens'

interface PlanScreenProps {
  state: ReportState
}

const FREQ_DEFS: { id: 'all' | FreqGroup; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'annual', label: 'Annual' },
  { id: 'periodic', label: 'Every 1–3 Yrs' },
  { id: 'onetime', label: 'One-Time' },
]

export default function PlanScreen({ state }: PlanScreenProps) {
  const { data } = useReportData()
  const { limitations, urgentScreenings } = data
  const visible =
    state.screeningFreq === 'all'
      ? urgentScreenings
      : urgentScreenings.filter((s) => s.freqGroup === state.screeningFreq)

  const linkedGenes = [...new Set(urgentScreenings.map((s) => s.linked.split(' — ')[0]))]
  const screeningSubtitle =
    linkedGenes.length > 0
      ? `Driven by the ${linkedGenes.join(' and ')} findings.`
      : 'Driven by your health-risk findings.'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader title="Priority Screening" subtitle={screeningSubtitle} />

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {FREQ_DEFS.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              active={state.screeningFreq === f.id}
              onClick={() => state.setScreeningFreq(f.id)}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map((s) => {
            const checked = !!state.checklist[s.id]
            const reminderSet = !!state.reminders[s.id]
            const dueTone = s.due === 'Due now' ? 'danger' : s.due === 'Conditional' ? 'neutral' : 'caution'
            const toneColors = TONE[dueTone]
            return (
              <div
                key={s.id}
                style={{
                  borderRadius: 16,
                  padding: '14px 16px',
                  background: colors.cardBg,
                  border: `1px solid ${colors.cardBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: colors.textPrimary }}>{s.test}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>
                      {s.frequency} · starts {s.startingAge}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '4px 9px',
                      borderRadius: 999,
                      color: toneColors.text,
                      background: toneColors.bg,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.due}
                  </div>
                </div>
                <div style={{ fontSize: 11.5, fontStyle: 'italic', color: colors.textLinked }}>{s.linked}</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingTop: 8,
                    borderTop: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <div
                    onClick={() => state.toggleCheck(s.id)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 4px 0' }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        border: `1.5px solid ${ACCENT}`,
                        background: checked ? ACCENT : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 900,
                        color: checked ? ACCENT_ON : 'transparent',
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.textBody }}>Scheduled</div>
                  </div>
                  {state.showReminders && (
                    <div
                      onClick={() => state.toggleReminder(s.id)}
                      style={{ cursor: 'pointer', marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: ACCENT, padding: 4 }}
                    >
                      {reminderSet ? 'Reminder set ✓' : 'Remind me'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.textHeading2 }}>Limitations</div>
        {limitations.map((l, i) => (
          <div key={i} style={{ fontSize: 12, lineHeight: 1.5, color: colors.textLimitation, display: 'flex', gap: 8 }}>
            <div>•</div>
            <div>{l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
