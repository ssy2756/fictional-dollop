import { useCallback, useState } from 'react'
import type { TabId } from '../components/TabBar'

const CARDS_EXPANDED_BY_DEFAULT = false
const SHOW_REMINDERS = true

export function useReportState() {
  const [tab, setTab] = useState<TabId>('home')
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [reminders, setReminders] = useState<Record<string, boolean>>({})
  const [medFilter, setMedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [screeningFreq, setScreeningFreq] = useState('all')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareConfirmed, setShareConfirmed] = useState(false)

  const isExpanded = useCallback(
    (id: string) => expandedIds[id] ?? CARDS_EXPANDED_BY_DEFAULT,
    [expandedIds],
  )
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !(prev[id] ?? CARDS_EXPANDED_BY_DEFAULT) }))
  }, [])

  const toggleCheck = useCallback((id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const openShare = useCallback(() => {
    setShareOpen(true)
    setShareConfirmed(false)
  }, [])
  const closeShare = useCallback(() => setShareOpen(false), [])
  const confirmShare = useCallback(() => setShareConfirmed(true), [])

  const setHover = useCallback((id: string | null) => setHoverId(id), [])
  const toggleHoverClick = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setHoverId((prev) => (prev === id ? null : id))
  }, [])

  return {
    tab,
    setTab,
    isExpanded,
    toggleExpand,
    checklist,
    toggleCheck,
    reminders,
    toggleReminder,
    medFilter,
    setMedFilter,
    searchQuery,
    setSearchQuery,
    hoverId,
    setHover,
    toggleHoverClick,
    screeningFreq,
    setScreeningFreq,
    shareOpen,
    shareConfirmed,
    openShare,
    closeShare,
    confirmShare,
    showReminders: SHOW_REMINDERS,
  }
}

export type ReportState = ReturnType<typeof useReportState>
