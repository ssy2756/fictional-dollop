import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getReportByUid } from '../_lib/db.js'
import { ReportDataSchema } from '../../src/data/reportSchema.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const uid = typeof req.query.uid === 'string' ? req.query.uid.trim().toUpperCase() : ''
  if (!uid) {
    res.status(400).json({ error: 'Missing uid' })
    return
  }

  try {
    const data = await getReportByUid(uid)
    if (!data) {
      res.status(404).json({ error: 'No report found for this code.' })
      return
    }

    const parsed = ReportDataSchema.safeParse(data)
    if (!parsed.success) {
      res.status(500).json({ error: 'Stored report data is malformed.' })
      return
    }

    res.status(200).json(parsed.data)
  } catch (err) {
    console.error('get report failed', err)
    res.status(500).json({ error: 'Failed to load report.' })
  }
}
