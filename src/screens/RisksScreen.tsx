import Badge from '../components/Badge'
import Card from '../components/Card'
import ExpandToggle from '../components/ExpandToggle'
import SectionHeader from '../components/SectionHeader'
import { useActiveReport } from '../state/ReportDataContext'
import type { ReportState } from '../state/useReportState'
import { TONE, colors } from '../theme/tokens'

interface RisksScreenProps {
  state: ReportState
}

export default function RisksScreen({ state }: RisksScreenProps) {
  const { data } = useActiveReport()
  const { monogenic, polygenic, carrier, secondary } = data
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader
          title="Single-Gene (Monogenic) Risk"
          subtitle="Well-established, high-confidence findings from individual genes."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {monogenic.map((item) => {
            const expanded = state.isExpanded(item.id)
            return (
              <Card key={item.id}>
                <div
                  onClick={() => state.toggleExpand(item.id)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: colors.textMeta,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {item.gene}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{item.condition}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>{item.sub}</div>
                  </div>
                  <Badge label={item.result} tone={item.tone} />
                </div>
                {expanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      paddingTop: 8,
                      borderTop: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    <div style={{ fontSize: 13, lineHeight: 1.55, color: colors.textBody }}>{item.plain}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: colors.textMuted }}>
                      <div>
                        Variant:{' '}
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: colors.textBody2 }}>
                          {item.variant}
                        </span>
                      </div>
                      <div>Classification: {item.classification}</div>
                    </div>
                  </div>
                )}
                <ExpandToggle expanded={expanded} onToggle={() => state.toggleExpand(item.id)} />
              </Card>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader
          title="Polygenic Risk Scores"
          subtitle="Aggregate scores from many common variants — probabilistic, not diagnostic."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {polygenic.map((item) => {
            const expanded = state.isExpanded(item.id)
            const toneText = TONE[item.tone].text
            return (
              <Card key={item.id} gap={10}>
                <div
                  onClick={() => state.toggleExpand(item.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{item.condition}</div>
                  <Badge label={item.category} tone={item.tone} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      position: 'relative',
                      height: 8,
                      borderRadius: 5,
                      background: colors.gaugeTrack,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: `${item.percentile}%`,
                        background: toneText,
                        borderRadius: 5,
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: colors.textFaint }}>
                    <div>{item.percentile}th percentile</div>
                    <div>Lifetime: {item.lifetime}</div>
                  </div>
                </div>
                {expanded && (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: colors.textBody,
                      paddingTop: 6,
                      borderTop: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    {item.plain}
                  </div>
                )}
                <ExpandToggle expanded={expanded} onToggle={() => state.toggleExpand(item.id)} />
              </Card>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader title="Carrier Status" subtitle="Relevant for family planning, not your own health." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {carrier.map((item) => (
            <Card key={item.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.textMeta }}>
                    {item.gene}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{item.condition}</div>
                </div>
                <Badge label={item.status} tone={item.tone} />
              </div>
              <div style={{ fontSize: 13, color: colors.textBody2 }}>{item.note}</div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHeader
          title="Secondary Findings"
          subtitle="Medically actionable findings unrelated to the original reason for testing."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {secondary.map((item) => {
            const expanded = state.isExpanded(item.id)
            const toneText = TONE[item.tone].text
            return (
              <Card key={item.id}>
                <div
                  onClick={() => state.toggleExpand(item.id)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.textMeta }}>
                      {item.gene}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{item.condition}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>{item.sub}</div>
                  </div>
                  <Badge label={item.result} tone={item.tone} />
                </div>
                {expanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      paddingTop: 8,
                      borderTop: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    <div style={{ fontSize: 13, lineHeight: 1.55, color: colors.textBody }}>{item.plain}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>Classification: {item.classification}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: toneText }}>{item.recommendation}</div>
                  </div>
                )}
                <ExpandToggle expanded={expanded} onToggle={() => state.toggleExpand(item.id)} />
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
