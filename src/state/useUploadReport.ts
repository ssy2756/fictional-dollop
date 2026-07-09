import { useCallback, useState } from 'react'
import { ReportDataSchema } from '../data/reportSchema'
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

export function useUploadReport() {
  const { setData } = useReportData()
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setErrorMessage(null)
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
          body: JSON.stringify({ pdfBase64 }),
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

        const parsed = ReportDataSchema.safeParse(body)
        if (!parsed.success) {
          setStatus('error')
          setErrorMessage('The parsed report did not match the expected format.')
          return
        }

        setData(parsed.data)
        setStatus('success')
      } catch {
        setStatus('error')
        setErrorMessage('Network error — could not reach the server.')
      }
    },
    [setData],
  )

  return { status, errorMessage, upload, reset }
}
