import Badge from '../components/Badge'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import { lifestyle } from '../data/reportData'
import { colors } from '../theme/tokens'

export default function LifestyleScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title="Lifestyle & Nutrigenomics"
        subtitle="Wellness indicators to inform daily habits — not medical diagnoses."
      />
      {lifestyle.map((item) => (
        <Card key={item.id}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{item.trait}</div>
            <Badge label={item.result} tone={item.tone} />
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: colors.textBody2 }}>{item.interpretation}</div>
        </Card>
      ))}
    </div>
  )
}
