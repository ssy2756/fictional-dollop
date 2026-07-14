import { randomInt } from 'node:crypto'
import { sql } from '@vercel/postgres'
import type { ReportData } from '../../src/data/reportSchema.js'

// Excludes visually ambiguous characters (0/O, 1/I/L) so codes are easy to read and type back.
const UID_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const UID_LENGTH = 8

export function generateUid(): string {
  let uid = ''
  for (let i = 0; i < UID_LENGTH; i++) {
    uid += UID_ALPHABET[randomInt(UID_ALPHABET.length)]
  }
  return uid
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && err.code === '23505'
}

export async function getReportByUid(uid: string): Promise<ReportData | null> {
  const { rows } = await sql<{ data: ReportData }>`SELECT data FROM reports WHERE uid = ${uid}`
  return rows[0]?.data ?? null
}

/** Inserts a new report under a freshly generated UID, retrying on the rare collision. Returns the UID. */
export async function insertReport(data: ReportData): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const uid = generateUid()
    try {
      await sql`INSERT INTO reports (uid, data) VALUES (${uid}, ${JSON.stringify(data)}::jsonb)`
      return uid
    } catch (err) {
      if (isUniqueViolation(err)) continue
      throw err
    }
  }
  throw new Error('Failed to generate a unique UID after several attempts')
}

/** Creates or overwrites the report at this exact UID. */
export async function upsertReport(uid: string, data: ReportData): Promise<void> {
  await sql`
    INSERT INTO reports (uid, data, updated_at)
    VALUES (${uid}, ${JSON.stringify(data)}::jsonb, now())
    ON CONFLICT (uid) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
  `
}

/** Seeds a report at a fixed UID only if that UID doesn't already exist. Returns whether it inserted. */
export async function seedReportIfMissing(uid: string, data: ReportData): Promise<boolean> {
  const { rowCount } = await sql`
    INSERT INTO reports (uid, data) VALUES (${uid}, ${JSON.stringify(data)}::jsonb)
    ON CONFLICT (uid) DO NOTHING
  `
  return (rowCount ?? 0) > 0
}
