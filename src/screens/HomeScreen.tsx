import { ACCENT, ACCENT_SOFT, ACCENT_SOFT_2, colors } from '../theme/tokens'
import { computeCounts } from '../utils/counts'
import { useReportData } from '../state/ReportDataContext'
import type { TabId } from '../components/TabBar'

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void
  onOpenShare: () => void
  onOpenUpload: () => void
  canInstall: boolean
  onInstall: () => void
}

interface SummaryRowProps {
  title: string
  meta: string
  count: number
  countColor: string
  onClick: () => void
}

interface ActionRowProps {
  title: string
  meta: string
  icon: string
  onClick: () => void
}

function SummaryRow({ title, meta, count, countColor, onClick }: SummaryRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 18,
        padding: '16px 18px',
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{title}</div>
        <div style={{ fontSize: 12.5, color: colors.textMeta }}>{meta}</div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: countColor }}>
        {count}
      </div>
    </div>
  )
}

function ActionRow({ title, meta, icon, onClick }: ActionRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 18,
        padding: '16px 18px',
        background: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{title}</div>
        <div style={{ fontSize: 12.5, color: colors.textMeta }}>{meta}</div>
      </div>
      <div style={{ fontSize: 20, color: ACCENT }}>{icon}</div>
    </div>
  )
}

export default function HomeScreen({ onNavigate, onOpenShare, onOpenUpload, canInstall, onInstall }: HomeScreenProps) {
  const { data } = useReportData()
  const counts = computeCounts(data)

  const attentionItems = [...data.monogenic, ...data.secondary].filter(
    (i) => i.tone === 'danger' || i.tone === 'caution',
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {attentionItems.length > 0 && (
        <div
          onClick={() => onNavigate('plan')}
          style={{
            cursor: 'pointer',
            borderRadius: 18,
            padding: '16px 18px',
            background: ACCENT_SOFT,
            border: `1px solid ${ACCENT_SOFT_2}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.textPrimary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {attentionItems.length} finding{attentionItems.length > 1 ? 's' : ''} to review with your doctor
            </div>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.5, color: colors.textSecondary }}>
            {attentionItems.map((i) => `${i.condition} (${i.gene})`).join(', ')} {attentionItems.length > 1 ? 'were' : 'was'} found.
            {attentionItems.length > 1 ? ' These are' : ' This is'} manageable with the right follow-up.
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginTop: 2 }}>View action plan →</div>
        </div>
      )}

      <div style={{ fontSize: 14, lineHeight: 1.6, color: colors.textBody2 }}>
        Your results cover disease risk, medication response and lifestyle traits. Most findings are reassuring or
        routine — a couple are worth a conversation with your doctor. Tap any card to dig in.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SummaryRow
          title="Health Risks"
          meta={`${counts.risksTotal} findings reviewed · ${counts.risksAttention} to watch`}
          count={counts.risksAttention}
          countColor={colors.homeCountDanger}
          onClick={() => onNavigate('risks')}
        />
        <SummaryRow
          title="Medications"
          meta={`${counts.medsTotal} gene-drug pairs · ${counts.medsAttention} to discuss`}
          count={counts.medsAttention}
          countColor={colors.homeCountCaution}
          onClick={() => onNavigate('meds')}
        />
        <SummaryRow
          title="Lifestyle"
          meta={`${counts.lifestyleTotal} traits · ${counts.lifestyleAttention} worth adjusting`}
          count={counts.lifestyleAttention}
          countColor={colors.homeCountCaution}
          onClick={() => onNavigate('lifestyle')}
        />
        <SummaryRow
          title="Action Plan"
          meta={`${counts.planUrgent} priority screenings recommended`}
          count={counts.planUrgent}
          countColor={colors.homeCountDanger}
          onClick={() => onNavigate('plan')}
        />
      </div>

      <ActionRow
        title="Share Report"
        meta="Send the comprehensive PDF to a doctor or family member"
        icon="⇪"
        onClick={onOpenShare}
      />

      <ActionRow
        title="Upload New Report"
        meta="Replace this data with a new PDF genetic test report"
        icon="⇧"
        onClick={onOpenUpload}
      />

      {canInstall && (
        <ActionRow
          title="Install App"
          meta="Add to your home screen for quick, full-screen access"
          icon="⇩"
          onClick={onInstall}
        />
      )}
    </div>
  )
}
