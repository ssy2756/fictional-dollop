import type { VercelRequest, VercelResponse } from '@vercel/node'
import { insertReport, upsertReport } from './_lib/db.js'
import { ReportDataSchema } from '../src/data/reportSchema.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = (req.body ?? {}) as { uid?: unknown; data?: unknown }
  const parsed = ReportDataSchema.safeParse(body.data)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid report data.' })
    return
  }

  const uid = typeof body.uid === 'string' && body.uid.trim() ? body.uid.trim().toUpperCase() : null

  try {
    if (uid) {
      await upsertReport(uid, parsed.data)
      res.status(200).json({ uid, data: parsed.data })
      return
    }

    const newUid = await insertReport(parsed.data)
    res.status(201).json({ uid: newUid, data: parsed.data })
  } catch (err) {
    console.error('save report failed', err)
    res.status(500).json({ error: 'Failed to save report.' })
  }
}
