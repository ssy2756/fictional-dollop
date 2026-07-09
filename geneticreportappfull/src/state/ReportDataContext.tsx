import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { defaultReportData } from '../data/reportData'
import { ReportDataSchema, type ReportData } from '../data/reportSchema'

const STORAGE_KEY = 'genetic-report-data-v1'

function loadStoredReportData(): ReportData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultReportData
    const parsed = ReportDataSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : defaultReportData
  } catch {
    return defaultReportData
  }
}

interface ReportDataContextValue {
  data: ReportData
  isDefault: boolean
  setData: (data: ReportData) => void
  resetToDefault: () => void
}

const ReportDataContext = createContext<ReportDataContextValue | null>(null)

export function ReportDataProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<ReportData>(() => loadStoredReportData())

  const setData = useCallback((next: ReportData) => {
    setDataState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // localStorage unavailable (private browsing, quota) — data still updates in memory
    }
  }, [])

  const resetToDefault = useCallback(() => {
    setDataState(defaultReportData)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo(
    () => ({ data, isDefault: data === defaultReportData, setData, resetToDefault }),
    [data, setData, resetToDefault],
  )

  return <ReportDataContext.Provider value={value}>{children}</ReportDataContext.Provider>
}

export function useReportData(): ReportDataContextValue {
  const ctx = useContext(ReportDataContext)
  if (!ctx) throw new Error('useReportData must be used within a ReportDataProvider')
  return ctx
}
