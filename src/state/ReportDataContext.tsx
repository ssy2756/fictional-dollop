import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ReportDataSchema, type ReportData } from '../data/reportSchema'

const UID_STORAGE_KEY = 'genetic-report-uid'

export type ReportStatus = 'idle' | 'loading' | 'error' | 'ready'

interface ReportDataContextValue {
  uid: string | null
  data: ReportData | null
  status: ReportStatus
  errorMessage: string | null
  loadUid: (uid: string) => Promise<void>
  setData: (data: ReportData, uid: string) => void
  logout: () => void
}

const ReportDataContext = createContext<ReportDataContextValue | null>(null)

function readStoredUid(): string | null {
  try {
    return localStorage.getItem(UID_STORAGE_KEY)
  } catch {
    return null
  }
}

function persistUid(uid: string | null) {
  try {
    if (uid) localStorage.setItem(UID_STORAGE_KEY, uid)
    else localStorage.removeItem(UID_STORAGE_KEY)
  } catch {
    // localStorage unavailable (private browsing, quota) — session still works in memory
  }
}

async function fetchReport(uid: string): Promise<ReportData> {
  const res = await fetch(`/api/report/${encodeURIComponent(uid)}`)
  const body: unknown = await res.json()
  if (!res.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : 'Failed to load report.'
    throw new Error(message)
  }
  const parsed = ReportDataSchema.safeParse(body)
  if (!parsed.success) throw new Error('The stored report did not match the expected format.')
  return parsed.data
}

export function ReportDataProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null)
  const [data, setDataState] = useState<ReportData | null>(null)
  const [status, setStatus] = useState<ReportStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadUid = useCallback(async (rawUid: string) => {
    const nextUid = rawUid.trim().toUpperCase()
    if (!nextUid) return
    setStatus('loading')
    setErrorMessage(null)
    try {
      const report = await fetchReport(nextUid)
      setUid(nextUid)
      setDataState(report)
      setStatus('ready')
      persistUid(nextUid)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load report.')
    }
  }, [])

  useEffect(() => {
    const stored = readStoredUid()
    if (stored) void loadUid(stored)
    // Only ever run on mount — loadUid is stable (empty dep array) so this isn't stale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setData = useCallback((next: ReportData, nextUid: string) => {
    setUid(nextUid)
    setDataState(next)
    setStatus('ready')
    setErrorMessage(null)
    persistUid(nextUid)
  }, [])

  const logout = useCallback(() => {
    setUid(null)
    setDataState(null)
    setStatus('idle')
    setErrorMessage(null)
    persistUid(null)
  }, [])

  const value = useMemo(
    () => ({ uid, data, status, errorMessage, loadUid, setData, logout }),
    [uid, data, status, errorMessage, loadUid, setData, logout],
  )

  return <ReportDataContext.Provider value={value}>{children}</ReportDataContext.Provider>
}

export function useReportData(): ReportDataContextValue {
  const ctx = useContext(ReportDataContext)
  if (!ctx) throw new Error('useReportData must be used within a ReportDataProvider')
  return ctx
}

/**
 * For the tab screens, which only ever mount once a report is loaded (App.tsx gates on
 * status === 'ready'). Avoids every screen having to deal with a possibly-null report.
 */
export function useActiveReport(): { uid: string; data: ReportData; setData: (data: ReportData, uid: string) => void; logout: () => void } {
  const ctx = useReportData()
  if (!ctx.data || !ctx.uid) {
    throw new Error('useActiveReport called before a report was loaded')
  }
  return { uid: ctx.uid, data: ctx.data, setData: ctx.setData, logout: ctx.logout }
}
