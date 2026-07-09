import { useMemo } from 'react'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Chip from '../components/Chip'
import ExpandToggle from '../components/ExpandToggle'
import { METABOLIZER_DEFS } from '../data/reportData'
import { useReportData } from '../state/ReportDataContext'
import type { ReportState } from '../state/useReportState'
import { colors } from '../theme/tokens'

interface MedsScreenProps {
  state: ReportState
}

export default function MedsScreen({ state }: MedsScreenProps) {
  const { data } = useReportData()
  const { pgxCategories } = data
  const searchQuery = state.searchQuery.trim().toLowerCase()

  const visibleCategories = useMemo(() => {
    const matchesSearch = (d: (typeof pgxCategories)[number]['drugs'][number]) =>
      !searchQuery ||
      d.drug.toLowerCase().includes(searchQuery) ||
      d.gene.toLowerCase().includes(searchQuery) ||
      d.phenotype.toLowerCase().includes(searchQuery)

    return pgxCategories
      .filter((c) => state.medFilter === 'all' || c.id === state.medFilter)
      .map((c) => ({ ...c, drugs: c.drugs.filter(matchesSearch) }))
      .filter((c) => c.drugs.length > 0)
  }, [pgxCategories, searchQuery, state.medFilter])

  const noMedsResults = visibleCategories.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input
        type="text"
        value={state.searchQuery}
        onChange={(e) => state.setSearchQuery(e.target.value)}
        placeholder="Search medications, genes, or phenotypes"
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 14,
          border: '1px solid oklch(1 0 0 / 10%)',
          background: colors.cardBg,
          color: 'oklch(0.95 0.006 265)',
          fontSize: 13.5,
          fontFamily: "'Manrope', system-ui, sans-serif",
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        <Chip label="All" active={state.medFilter === 'all'} onClick={() => state.setMedFilter('all')} />
        {pgxCategories.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            active={state.medFilter === c.id}
            onClick={() => state.setMedFilter(c.id)}
          />
        ))}
      </div>

      {noMedsResults && (
        <div style={{ fontSize: 13, color: colors.textMuted, padding: '12px 2px' }}>
          No medications match your search.
        </div>
      )}

      {visibleCategories.map((cat) => (
        <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: colors.textCategory,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {cat.name}
          </div>
          {cat.drugs.map((item) => {
            const expanded = state.isExpanded(item.id)
            const def = METABOLIZER_DEFS[item.phenotype]
            const hovering = state.hoverId === item.id
            const tooltipVisible = !!def && hovering
            return (
              <Card key={item.id}>
                <div
                  onClick={() => state.toggleExpand(item.id)}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: colors.textMeta }}>
                      {item.gene}
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: colors.textPrimary }}>{item.drug}</div>
                  </div>
                  <div
                    onMouseEnter={() => def && state.setHover(item.id)}
                    onMouseLeave={() => def && state.setHover(null)}
                    style={{ position: 'relative' }}
                  >
                    <Badge
                      label={def ? def.abbr : item.phenotype}
                      tone={item.tone}
                      cursor={def ? 'help' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (def) state.toggleHoverClick(item.id)
                      }}
                    />
                    {tooltipVisible && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          marginTop: 6,
                          width: 190,
                          background: colors.tooltipBg,
                          border: `1px solid ${colors.tooltipBorder}`,
                          borderRadius: 10,
                          padding: '10px 12px',
                          fontSize: 11.5,
                          lineHeight: 1.45,
                          color: 'oklch(0.85 0.012 265)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                          zIndex: 20,
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontWeight: 800, color: colors.textPrimary, marginBottom: 3 }}>
                          {item.phenotype}
                        </div>
                        <div>{def?.def}</div>
                      </div>
                    )}
                  </div>
                </div>
                {expanded && (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: colors.textBody,
                      paddingTop: 8,
                      borderTop: `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    {item.rec}
                  </div>
                )}
                <ExpandToggle expanded={expanded} onToggle={() => state.toggleExpand(item.id)} />
              </Card>
            )
          })}
        </div>
      ))}
    </div>
  )
}
