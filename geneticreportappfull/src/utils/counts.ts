import type { ReportData } from '../data/reportSchema'

interface Toned {
  tone: string
}

function attentionCount<T extends Toned>(items: T[]): number {
  return items.filter((x) => x.tone === 'danger' || x.tone === 'caution').length
}

export function computeCounts(data: ReportData) {
  const allPgxDrugs = data.pgxCategories.flatMap((c) => c.drugs)
  return {
    risksTotal: data.monogenic.length + data.polygenic.length + data.carrier.length + data.secondary.length,
    risksAttention:
      attentionCount(data.monogenic) + attentionCount(data.secondary) + attentionCount(data.carrier),
    medsTotal: allPgxDrugs.length,
    medsAttention: attentionCount(allPgxDrugs),
    lifestyleTotal: data.lifestyle.length,
    lifestyleAttention: attentionCount(data.lifestyle),
    planUrgent: data.urgentScreenings.length,
  }
}
