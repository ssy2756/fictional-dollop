import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { ReportDataSchema } from '../src/data/reportSchema.js'
import { insertReport, upsertReport } from './_lib/db.js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
}

const EXTRACTION_PROMPT = `You are extracting a comprehensive genetic testing report (PDF attached) into a structured JSON format for a patient-facing app.

Map each section of the report to the matching field in the schema:
- "Monogenic / Single-Gene Risk" tables -> monogenic
- "Polygenic Risk Scores" tables -> polygenic
- "Carrier Status" tables -> carrier
- "Secondary Findings" (medically actionable findings unrelated to the original reason for testing) -> secondary
- Pharmacogenomics tables, grouped by clinical area (e.g. Cardiovascular, Psychiatric & Neuro, Pain Management) -> pgxCategories, one entry per clinical-area heading with its drugs nested inside
- Lifestyle / nutrigenomics / wellness traits -> lifestyle
- Recommended screenings / follow-up testing -> urgentScreenings
- Stated limitations / disclaimers -> limitations (one string per bullet)
- Patient name (and report date if present) -> patient

For every finding, write the "tone" and any "plain"/"interpretation"/"note"/"recommendation" text yourself based on the clinical data — these are not literal report text, they are your own warm, reassuring, plain-language interpretation for a non-clinician reader. Never use alarming language.

Generate a short, stable, kebab-case "id" for every item (e.g. "mono-mlh1", "pgx-clopidogrel") — prefix ids within a section consistently (mono-, poly-, car-, sec-, pgx-, life-, scr-).

If the report contains a section or finding type that doesn't fit any of the fields above, do NOT force it into an unrelated category — put it in "extraSections" instead, or omit it if it's not clinically meaningful (e.g. lab accreditation boilerplate, page footers).

Do not fabricate findings that are not in the report. If a section is absent from the report, return an empty array for that field.`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Add it in the Vercel project\'s Environment Variables.' })
    return
  }

  const { pdfBase64, uid: rawUid } = (req.body ?? {}) as { pdfBase64?: unknown; uid?: unknown }
  if (typeof pdfBase64 !== 'string' || pdfBase64.length === 0) {
    res.status(400).json({ error: 'Missing pdfBase64 in request body' })
    return
  }
  const uid = typeof rawUid === 'string' && rawUid.trim() ? rawUid.trim().toUpperCase() : null

  const client = new Anthropic()

  try {
    const response = await client.messages.parse({
      model: 'claude-opus-4-8',
      max_tokens: 8000,
      output_config: { format: zodOutputFormat(ReportDataSchema) },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 },
            },
            { type: 'text', text: EXTRACTION_PROMPT },
          ],
        },
      ],
    })

    if (response.stop_reason === 'refusal') {
      res.status(422).json({ error: 'The model declined to process this document.' })
      return
    }

    if (!response.parsed_output) {
      res.status(422).json({ error: 'Could not extract structured data from this PDF.' })
      return
    }

    if (uid) {
      await upsertReport(uid, response.parsed_output)
      res.status(200).json({ uid, data: response.parsed_output })
      return
    }

    const newUid = await insertReport(response.parsed_output)
    res.status(201).json({ uid: newUid, data: response.parsed_output })
  } catch (err) {
    console.error('parse-report failed', err)
    res.status(500).json({ error: 'Failed to parse report.' })
  }
}
