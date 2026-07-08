import {
  carrier,
  lifestyle,
  monogenic,
  pgxCategories,
  polygenic,
  secondary,
  urgentScreenings,
} from '../data/reportData'

interface Toned {
  tone: string
}

function attentionCount<T extends Toned>(items: T[]): number {
  return items.filter((x) => x.tone === 'danger' || x.tone === 'caution').length
}

const allPgxDrugs = pgxCategories.flatMap((c) => c.drugs)

export const counts = {
  risksTotal: monogenic.length + polygenic.length + carrier.length + secondary.length,
  risksAttention: attentionCount(monogenic) + attentionCount(secondary) + attentionCount(carrier),
  medsTotal: allPgxDrugs.length,
  medsAttention: attentionCount(allPgxDrugs),
  lifestyleTotal: lifestyle.length,
  lifestyleAttention: attentionCount(lifestyle),
  planUrgent: urgentScreenings.length,
}
