import type {
  MonogenicItem,
  PolygenicItem,
  CarrierItem,
  SecondaryItem,
  PgxCategory,
  LifestyleItem,
  ScreeningItem,
  ReportData,
} from './reportSchema'

export type {
  MonogenicItem,
  PolygenicItem,
  CarrierItem,
  SecondaryItem,
  PgxDrug,
  PgxCategory,
  LifestyleItem,
  FreqGroup,
  ScreeningItem,
  ReportData,
} from './reportSchema'

export const METABOLIZER_DEFS: Record<string, { abbr: string; def: string }> = {
  'Poor Metabolizer': {
    abbr: 'PM',
    def: 'Little to no enzyme function — the drug (or its active form) builds up or fails to activate.',
  },
  'Intermediate Metabolizer': {
    abbr: 'IM',
    def: 'Reduced enzyme function — partial effect on drug levels or activation.',
  },
  'Normal Metabolizer': {
    abbr: 'NM',
    def: 'Expected, typical enzyme function — standard dosing is usually appropriate.',
  },
  'Rapid Metabolizer': {
    abbr: 'RM',
    def: 'Increased enzyme function — the drug is cleared faster or activated more than expected.',
  },
  'Ultrarapid Metabolizer': {
    abbr: 'UM',
    def: 'Increased enzyme function — the drug is cleared faster or activated more than expected.',
  },
}

export const monogenic: MonogenicItem[] = [
  {
    id: 'mono-mlh1',
    gene: 'MLH1',
    variant: 'c.1852_1854del',
    condition: 'Lynch Syndrome',
    sub: 'Colorectal & endometrial cancer risk',
    classification: 'Pathogenic',
    result: 'Positive',
    tone: 'danger',
    plain: 'You carry a gene change strongly linked to Lynch syndrome, which raises lifetime risk of colorectal and endometrial cancer. This is actionable — earlier, more frequent screening can catch problems early, and genetic counseling is recommended.',
  },
  {
    id: 'mono-brca1',
    gene: 'BRCA1',
    variant: 'No pathogenic variant detected',
    condition: 'Hereditary Breast / Ovarian Cancer',
    sub: 'No increased hereditary risk identified',
    classification: 'Benign / Not Detected',
    result: 'Negative',
    tone: 'success',
    plain: 'No BRCA1 changes linked to hereditary breast or ovarian cancer were found in your sample.',
  },
  {
    id: 'mono-f5',
    gene: 'F5',
    variant: 'c.1601G>A (Factor V Leiden)',
    condition: 'Hereditary Thrombophilia',
    sub: 'Blood clotting risk',
    classification: 'Pathogenic, heterozygous',
    result: 'Positive',
    tone: 'caution',
    plain: 'You carry one copy of a variant that increases risk of blood clots. Mention this to any doctor before surgery, long-haul travel, or starting hormonal medication.',
  },
]

export const polygenic: PolygenicItem[] = [
  {
    id: 'poly-t2d',
    condition: 'Type 2 Diabetes',
    percentile: 82,
    category: 'Moderate',
    tone: 'caution',
    lifetime: '~24% (avg ~11%)',
    plain: 'Your combined genetic score places you above average risk for type 2 diabetes. Diet, weight, and activity level meaningfully affect whether this risk becomes reality.',
  },
  {
    id: 'poly-cad',
    condition: 'Coronary Artery Disease',
    percentile: 91,
    category: 'High',
    tone: 'danger',
    lifetime: '~19% by 65',
    plain: 'You score in the higher range for coronary artery disease risk. Regular cardiovascular checkups plus blood pressure and cholesterol management are especially worthwhile.',
  },
  {
    id: 'poly-mdd',
    condition: 'Major Depressive Disorder',
    percentile: 55,
    category: 'Average',
    tone: 'neutral',
    lifetime: '~16% (avg ~15%)',
    plain: 'Your genetic risk for depression is close to the population average — no notable genetic signal in either direction.',
  },
  {
    id: 'poly-amd',
    condition: 'Age-Related Macular Degeneration',
    percentile: 35,
    category: 'Low',
    tone: 'success',
    lifetime: '~4%',
    plain: 'Your genetic risk for age-related macular degeneration is lower than average.',
  },
]

export const carrier: CarrierItem[] = [
  { id: 'car-cftr', gene: 'CFTR', condition: 'Cystic Fibrosis', status: 'Carrier', tone: 'caution', note: 'Partner screening recommended before pregnancy.' },
  { id: 'car-hbb', gene: 'HBB', condition: 'Sickle Cell Disease', status: 'Not a carrier', tone: 'success', note: 'No increased reproductive risk identified.' },
  { id: 'car-gba', gene: 'GBA', condition: 'Gaucher Disease', status: 'Carrier', tone: 'caution', note: 'Consider genetic counseling if planning pregnancy.' },
]

export const secondary: SecondaryItem[] = [
  {
    id: 'sec-kcnq1',
    gene: 'KCNQ1',
    condition: 'Long QT Syndrome',
    sub: 'Cardiac arrhythmia risk',
    classification: 'Likely Pathogenic',
    result: 'Positive',
    tone: 'danger',
    plain: 'A finding unrelated to why you were originally tested, but medically important: this gene change is linked to an irregular heart-rhythm condition.',
    recommendation: 'Referral to cardiology for baseline ECG and further evaluation.',
  },
]

export const pgxCategories: PgxCategory[] = [
  {
    id: 'cat-cardio',
    name: 'Cardiovascular',
    drugs: [
      { id: 'pgx-clopidogrel', gene: 'CYP2C19', phenotype: 'Intermediate Metabolizer', tone: 'caution', drug: 'Clopidogrel (Plavix)', rec: 'Reduced activation to active metabolite — consider an alternative antiplatelet (e.g. prasugrel, ticagrelor) if clinically indicated.' },
      { id: 'pgx-warfarin1', gene: 'CYP2C9', phenotype: 'Normal Metabolizer', tone: 'success', drug: 'Warfarin', rec: 'Combine with VKORC1 result for dosing; no CYP2C9-driven dose adjustment anticipated.' },
      { id: 'pgx-warfarin2', gene: 'VKORC1', phenotype: 'Increased Sensitivity', tone: 'caution', drug: 'Warfarin', rec: 'Lower starting dose likely required — use a pharmacogenomic warfarin dosing calculator.' },
      { id: 'pgx-metoprolol', gene: 'CYP2D6', phenotype: 'Poor Metabolizer', tone: 'danger', drug: 'Metoprolol, Carvedilol', rec: 'Higher plasma levels expected at standard dose — monitor heart rate/blood pressure; consider a lower starting dose.' },
      { id: 'pgx-statin', gene: 'SLCO1B1', phenotype: 'Normal Function', tone: 'success', drug: 'Simvastatin, Atorvastatin', rec: 'Standard risk of statin-associated muscle symptoms.' },
    ],
  },
  {
    id: 'cat-psych',
    name: 'Psychiatric & Neuro',
    drugs: [
      { id: 'pgx-ssri1', gene: 'CYP2D6', phenotype: 'Poor Metabolizer', tone: 'danger', drug: 'Fluoxetine, Paroxetine, Risperidone', rec: 'Reduced clearance — increased risk of side effects at standard dose; consider dose reduction or an alternate agent.' },
      { id: 'pgx-ssri2', gene: 'CYP2C19', phenotype: 'Intermediate Metabolizer', tone: 'caution', drug: 'Citalopram, Escitalopram, Sertraline', rec: 'Modestly reduced clearance — start low, monitor for side effects before increasing dose.' },
      { id: 'pgx-carb1', gene: 'HLA-B*15:02', phenotype: 'Not Detected', tone: 'success', drug: 'Carbamazepine, Oxcarbazepine', rec: 'Standard dosing; low risk of drug-induced Stevens-Johnson syndrome/TEN from this marker.' },
      { id: 'pgx-carb2', gene: 'HLA-A*31:01', phenotype: 'Not Detected', tone: 'success', drug: 'Carbamazepine', rec: 'No elevated hypersensitivity risk identified from this marker.' },
    ],
  },
  {
    id: 'cat-pain',
    name: 'Pain Management',
    drugs: [
      { id: 'pgx-codeine', gene: 'CYP2D6', phenotype: 'Poor Metabolizer', tone: 'danger', drug: 'Codeine, Tramadol', rec: 'Minimal conversion to active form — expect diminished pain relief. Avoid codeine/tramadol; consider a non-CYP2D6-dependent alternative.' },
      { id: 'pgx-oxycodone', gene: 'CYP2D6', phenotype: 'Poor Metabolizer', tone: 'danger', drug: 'Oxycodone', rec: 'Reduced conversion to active metabolite — monitor efficacy closely, dose adjustment may be needed.' },
      { id: 'pgx-oprm1', gene: 'OPRM1', phenotype: 'A118G variant present', tone: 'neutral', drug: 'Opioids (general)', rec: 'May be associated with altered opioid sensitivity — one factor to weigh in pain management planning.' },
    ],
  },
  {
    id: 'cat-gi',
    name: 'Gastrointestinal',
    drugs: [
      { id: 'pgx-ppi', gene: 'CYP2C19', phenotype: 'Intermediate Metabolizer', tone: 'caution', drug: 'Omeprazole, Pantoprazole (PPIs)', rec: 'Somewhat higher drug exposure than typical — standard dosing usually effective; monitor symptom response.' },
    ],
  },
  {
    id: 'cat-onco',
    name: 'Oncology Support',
    drugs: [
      { id: 'pgx-5fu', gene: 'DPYD', phenotype: 'Normal Metabolizer', tone: 'success', drug: '5-Fluorouracil, Capecitabine', rec: 'No dose adjustment anticipated based on this gene; standard dosing protocols apply.' },
      { id: 'pgx-aza1', gene: 'TPMT', phenotype: 'Normal Metabolizer', tone: 'success', drug: 'Azathioprine, Mercaptopurine', rec: 'Standard starting dose; routine blood count monitoring per protocol.' },
      { id: 'pgx-aza2', gene: 'NUDT15', phenotype: 'Normal Metabolizer', tone: 'success', drug: 'Azathioprine, Mercaptopurine', rec: 'No elevated myelosuppression risk identified from this gene.' },
      { id: 'pgx-irino', gene: 'UGT1A1', phenotype: 'Intermediate (*1/*28)', tone: 'caution', drug: 'Irinotecan', rec: 'Modestly increased risk of neutropenia at higher doses — consider a reduced starting dose if this agent is used.' },
    ],
  },
  {
    id: 'cat-infect',
    name: 'Infectious Disease & Other',
    drugs: [
      { id: 'pgx-abacavir', gene: 'HLA-B*57:01', phenotype: 'Not Detected', tone: 'success', drug: 'Abacavir', rec: 'Low risk of hypersensitivity reaction; standard dosing appropriate.' },
      { id: 'pgx-g6pd', gene: 'G6PD', phenotype: 'Normal Activity', tone: 'success', drug: 'Sulfa drugs, Dapsone, Rasburicase', rec: 'No increased risk of drug-induced hemolysis identified.' },
      { id: 'pgx-tacro', gene: 'CYP3A5', phenotype: 'Poor Expresser (*3/*3)', tone: 'caution', drug: 'Tacrolimus', rec: 'Expected to require a lower weight-based starting dose if this transplant medication is prescribed; monitor trough levels.' },
    ],
  },
]

export const lifestyle: LifestyleItem[] = [
  { id: 'life-caffeine', trait: 'Caffeine Metabolism', result: 'Slow Metabolizer', tone: 'caution', interpretation: 'Caffeine clears more slowly for you; higher intake is linked to elevated blood pressure risk — moderate consumption advised.' },
  { id: 'life-lactose', trait: 'Lactose Tolerance', result: 'Likely Intolerant', tone: 'caution', interpretation: 'Reduced lactase persistence — dairy may cause GI discomfort.' },
  { id: 'life-vitd', trait: 'Vitamin D Levels', result: 'Predisposed to Lower Levels', tone: 'caution', interpretation: 'Genetic variants associated with lower baseline vitamin D — worth monitoring levels and considering supplementation.' },
  { id: 'life-actn3', trait: 'Exercise Response (ACTN3)', result: 'Power / Sprint Type', tone: 'info', interpretation: 'Genotype associated with fast-twitch muscle performance — may respond well to strength and power training.' },
  { id: 'life-per3', trait: 'Sleep Chronotype (PER3)', result: 'Intermediate', tone: 'neutral', interpretation: 'No strong genetic lean toward early-bird or night-owl chronotype.' },
  { id: 'life-aldh2', trait: 'Alcohol Flush Reaction (ALDH2)', result: 'Typical Metabolizer', tone: 'success', interpretation: 'No elevated flush-reaction variant detected.' },
]

export const urgentScreenings: ScreeningItem[] = [
  { id: 'scr-colon', test: 'Colonoscopy', frequency: 'Every 1–2 years', startingAge: 'age 25–30', linked: 'MLH1 — Lynch syndrome (colorectal cancer risk)', due: 'Due now', freqGroup: 'periodic' },
  { id: 'scr-egd', test: 'Upper endoscopy (EGD)', frequency: 'Every 2–3 years', startingAge: 'age 30–35', linked: 'MLH1 — Lynch syndrome (gastric/duodenal risk)', due: 'Due now', freqGroup: 'periodic' },
  { id: 'scr-tvus', test: 'Transvaginal ultrasound + endometrial biopsy', frequency: 'Annually', startingAge: 'age 30–35', linked: 'MLH1 — Lynch syndrome (endometrial cancer risk)', due: 'Due now', freqGroup: 'annual' },
  { id: 'scr-ua', test: 'Urinalysis', frequency: 'Annually', startingAge: 'age 30–35', linked: 'MLH1 — Lynch syndrome (urinary tract risk)', due: 'Due now', freqGroup: 'annual' },
  { id: 'scr-derm', test: 'Dermatologic skin exam', frequency: 'Annually', startingAge: 'age 30+', linked: 'MLH1 — Lynch syndrome-associated skin lesions', due: 'Due now', freqGroup: 'annual' },
  { id: 'scr-ecg', test: 'Baseline ECG + cardiology evaluation', frequency: 'Once, then as advised', startingAge: 'as soon as feasible', linked: 'KCNQ1 — Long QT syndrome', due: 'Due now', freqGroup: 'onetime' },
  { id: 'scr-echo', test: 'Echocardiogram', frequency: 'Baseline, then per cardiologist', startingAge: 'following ECG referral', linked: 'KCNQ1 — Long QT syndrome', due: 'After ECG', freqGroup: 'onetime' },
]

export const limitations: string[] = [
  'This test does not detect all possible genetic variants and cannot rule out all genetic risk for any condition.',
  'Polygenic risk scores are population-based estimates and may be less accurate for individuals whose ancestry differs from the reference population used to build the model.',
  'A negative result reduces but does not eliminate risk; family history remains clinically relevant.',
  'Environmental and lifestyle factors significantly influence whether genetic risk translates into disease.',
]

export const defaultReportData: ReportData = {
  schemaVersion: 1,
  patient: { name: 'Jane A. Sample' },
  monogenic,
  polygenic,
  carrier,
  secondary,
  pgxCategories,
  lifestyle,
  urgentScreenings,
  limitations,
}
