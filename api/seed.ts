import type { VercelRequest, VercelResponse } from '@vercel/node'
import { seedReportIfMissing } from './_lib/db.js'
import { defaultReportData } from '../src/data/reportData.js'
import { SAMPLE_REPORT_UID } from '../src/data/constants.js'

// Safe to call more than once — ON CONFLICT DO NOTHING means it never overwrites.
const SEED_UID = SAMPLE_REPORT_UID

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const inserted = await seedReportIfMissing(SEED_UID, defaultReportData)
    res.status(200).json({
      uid: SEED_UID,
      inserted,
      message: inserted
        ? `Seeded the sample report under code ${SEED_UID}.`
        : `Code ${SEED_UID} already exists — nothing changed.`,
    })
  } catch (err) {
    console.error('seed failed', err)
    res.status(500).json({ error: 'Failed to seed report.' })
  }
}
