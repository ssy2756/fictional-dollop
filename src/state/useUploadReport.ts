import { useCallback, useState } from 'react'
import { ReportDataSchema, type ReportData } from '../data/reportSchema'
import { useReportData } from './ReportDataContext'

export type UploadStatus = 'idle' | 'uploading' | 'error' | 'success'

const MAX_FILE_BYTES = 4 * 1024 * 1024

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const commaIndex = result.indexOf(',')
      resolve(commaIndex === -1 ? result : result.slice(commaIndex + 1))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

interface ParseReportResponse {
  uid: string
  data: ReportData
}

export function useUploadReport() {
  const { uid: currentUid, setData } = useReportData()
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultUid, setResultUid] = useState<string | null>(null)
  const [isNewUid, setIsNewUid] = useState(false)

  const reset = useCallback(() => {
    setStatus('idle')
    setErrorMessage(null)
    setResultUid(null)
    setIsNewUid(false)
  }, [])

  const upload = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        setStatus('error')
        setErrorMessage('Please choose a PDF file.')
        return
      }
      if (file.size > MAX_FILE_BYTES) {
        setStatus('error')
        setErrorMessage('This PDF is too large (max 4MB).')
        return
      }

      setStatus('uploading')
      setErrorMessage(null)

      try {
        const pdfBase64 = await fileToBase64(file)
        const res = await fetch('/api/parse-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfBase64, uid: currentUid ?? undefined }),
        })

        const body: unknown = await res.json()

        if (!res.ok) {
          const message =
            body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
              ? body.error
              : 'Failed to parse this report.'
          setStatus('error')
          setErrorMessage(message)
          return
        }

        const uidCandidate = body && typeof body === 'object' && 'uid' in body ? body.uid : null
        const dataCandidate = body && typeof body === 'object' && 'data' in body ? body.data : null
        const parsed = ReportDataSchema.safeParse(dataCandidate)
        if (!parsed.success || typeof uidCandidate !== 'string') {
          setStatus('error')
          setErrorMessage('The parsed report did not match the expected format.')
          return
        }

        const response: ParseReportResponse = { uid: uidCandidate, data: parsed.data }
        setResultUid(response.uid)
        setIsNewUid(response.uid !== currentUid)
        setData(response.data, response.uid)
        setStatus('success')
      } catch {
        setStatus('error')
        setErrorMessage('Network error — could not reach the server.')
      }
    },
    [currentUid, setData],
  )

  return { status, errorMessage, resultUid, isNewUid, upload, reset }
}
