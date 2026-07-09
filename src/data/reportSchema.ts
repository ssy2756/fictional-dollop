import { z } from 'zod'

export const ToneSchema = z
  .enum(['danger', 'caution', 'success', 'neutral', 'info'])
  .describe(
    'Color-coding for how much attention this finding deserves. danger = pathogenic/positive result or high relative risk that warrants medical follow-up. caution = heterozygous carrier, moderate risk, or a result worth discussing with a doctor but not urgent. success = negative/benign result or low relative risk — reassuring. neutral = average/inconclusive, no notable signal either way. info = purely informational trait, not a health risk (e.g. a lifestyle/fitness genotype).',
  )

export const MonogenicItemSchema = z.object({
  id: z.string().describe('Short stable slug, e.g. "mono-mlh1"'),
  gene: z.string().describe('Gene symbol, e.g. "MLH1"'),
  variant: z.string().describe('The specific variant/allele notation, or "No pathogenic variant detected" if negative'),
  condition: z.string().describe('The condition/disease this gene-finding is associated with'),
  sub: z.string().describe('One short clause describing the health implication, e.g. "Colorectal & endometrial cancer risk"'),
  classification: z.string().describe('ACMG-style classification as printed in the report, e.g. "Pathogenic", "Benign / Not Detected"'),
  result: z.string().describe('Short badge label: "Positive" or "Negative"'),
  tone: ToneSchema,
  plain: z
    .string()
    .describe(
      'A warm, reassuring 2-4 sentence plain-language explanation of what this finding means for the patient and what they should do about it. Avoid alarming language. Written for a non-clinician.',
    ),
})

export const PolygenicItemSchema = z.object({
  id: z.string(),
  condition: z.string(),
  percentile: z.number().describe('Percentile vs. reference population, 0-100'),
  category: z.string().describe('Short relative-risk label, e.g. "Low", "Average", "Moderate", "High"'),
  tone: ToneSchema,
  lifetime: z.string().describe('Lifetime risk estimate as printed, e.g. "~24% (avg ~11%)"'),
  plain: z.string().describe('2-3 sentence plain-language explanation, reassuring tone, non-clinician audience'),
})

export const CarrierItemSchema = z.object({
  id: z.string(),
  gene: z.string(),
  condition: z.string(),
  status: z.string().describe('"Carrier" or "Not a carrier"'),
  tone: ToneSchema,
  note: z.string().describe('One short sentence on the reproductive-planning implication'),
})

export const SecondaryItemSchema = z.object({
  id: z.string(),
  gene: z.string(),
  condition: z.string(),
  sub: z.string(),
  classification: z.string(),
  result: z.string(),
  tone: ToneSchema,
  plain: z.string(),
  recommendation: z.string().describe('One short sentence: the concrete next clinical step'),
})

export const PgxDrugSchema = z.object({
  id: z.string(),
  gene: z.string(),
  phenotype: z
    .string()
    .describe(
      'The metabolizer phenotype exactly as printed, e.g. "Poor Metabolizer", "Intermediate Metabolizer", "Normal Metabolizer", "Increased Sensitivity", "Not Detected". Only use "Poor/Intermediate/Normal/Rapid/Ultrarapid Metabolizer" when that is literally the term used.',
    ),
  tone: ToneSchema,
  drug: z.string().describe('Drug or drug class name(s), comma-separated if multiple'),
  rec: z.string().describe('1-2 sentence clinical recommendation as it would appear in the report'),
})

export const PgxCategorySchema = z.object({
  id: z.string(),
  name: z.string().describe('Clinical area heading, e.g. "Cardiovascular", "Pain Management"'),
  drugs: z.array(PgxDrugSchema),
})

export const LifestyleItemSchema = z.object({
  id: z.string(),
  trait: z.string(),
  result: z.string().describe('Short badge label for the genotype/result'),
  tone: ToneSchema,
  interpretation: z.string().describe('1-2 sentence plain-language interpretation'),
})

export const FreqGroupSchema = z
  .enum(['annual', 'periodic', 'onetime'])
  .describe('Bucket for filter chips: annual = every year, periodic = every 1-3 years, onetime = a single baseline test')

export const ScreeningItemSchema = z.object({
  id: z.string(),
  test: z.string().describe('Name of the screening/test'),
  frequency: z.string().describe('How often, as printed, e.g. "Every 1-2 years"'),
  startingAge: z.string().describe('When to start, e.g. "age 25-30"'),
  linked: z.string().describe('Which finding/gene this screening is driven by, e.g. "MLH1 — Lynch syndrome (colorectal cancer risk)"'),
  due: z.string().describe('Short due-status badge, e.g. "Due now", "After ECG"'),
  freqGroup: FreqGroupSchema,
})

export const GenericSectionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  detail: z.string().optional().describe('Optional supporting sentence'),
  badge: z.string().optional().describe('Optional short badge label'),
  tone: ToneSchema.optional(),
})

export const GenericSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(GenericSectionItemSchema),
})

export const PatientInfoSchema = z.object({
  name: z.string().describe('Patient full name as printed on the report'),
  reportDate: z.string().optional().describe('Report date as printed, if present'),
})

export const ReportDataSchema = z.object({
  schemaVersion: z.literal(1),
  patient: PatientInfoSchema,
  monogenic: z.array(MonogenicItemSchema).describe('Single-gene / monogenic disease-risk findings'),
  polygenic: z.array(PolygenicItemSchema).describe('Polygenic risk scores for complex/common conditions'),
  carrier: z.array(CarrierItemSchema).describe('Reproductive carrier-status findings'),
  secondary: z
    .array(SecondaryItemSchema)
    .describe('Medically actionable findings unrelated to the original reason for testing'),
  pgxCategories: z
    .array(PgxCategorySchema)
    .describe('Pharmacogenomics findings grouped by clinical area (e.g. Cardiovascular, Pain Management)'),
  lifestyle: z.array(LifestyleItemSchema).describe('Lifestyle / nutrigenomics / wellness trait findings'),
  urgentScreenings: z
    .array(ScreeningItemSchema)
    .describe('Priority screening recommendations driven by the monogenic and secondary findings'),
  limitations: z.array(z.string()).describe('The report’s stated limitations/disclaimers, one string per bullet'),
  extraSections: z
    .array(GenericSectionSchema)
    .optional()
    .describe(
      'Use this ONLY for report sections/categories that do not fit any of the fields above (e.g. a wholly new category introduced in a newer report version). Do not force unrelated findings into an existing category just to avoid using this field.',
    ),
})

export type Tone = z.infer<typeof ToneSchema>
export type MonogenicItem = z.infer<typeof MonogenicItemSchema>
export type PolygenicItem = z.infer<typeof PolygenicItemSchema>
export type CarrierItem = z.infer<typeof CarrierItemSchema>
export type SecondaryItem = z.infer<typeof SecondaryItemSchema>
export type PgxDrug = z.infer<typeof PgxDrugSchema>
export type PgxCategory = z.infer<typeof PgxCategorySchema>
export type LifestyleItem = z.infer<typeof LifestyleItemSchema>
export type FreqGroup = z.infer<typeof FreqGroupSchema>
export type ScreeningItem = z.infer<typeof ScreeningItemSchema>
export type GenericSection = z.infer<typeof GenericSectionSchema>
export type ReportData = z.infer<typeof ReportDataSchema>
