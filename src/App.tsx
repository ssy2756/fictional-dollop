import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import RisksScreen from './screens/RisksScreen'
import MedsScreen from './screens/MedsScreen'
import LifestyleScreen from './screens/LifestyleScreen'
import PlanScreen from './screens/PlanScreen'
import UidGateScreen from './screens/UidGateScreen'
import TabBar from './components/TabBar'
import ShareSheet from './components/ShareSheet'
import InstallSheet from './components/InstallSheet'
import UploadSheet from './components/UploadSheet'
import { useReportState } from './state/useReportState'
import { useInstallPrompt } from './state/useInstallPrompt'
import { ReportDataProvider, useReportData, useActiveReport } from './state/ReportDataContext'
import { SAMPLE_REPORT_UID } from './data/constants'
import { colors } from './theme/tokens'

const TAB_TITLES = {
  home: 'Overview',
  risks: 'Health Risks',
  meds: 'Medications',
  lifestyle: 'Lifestyle',
  plan: 'Action Plan',
}

interface MainAppProps {
  onOpenUpload: () => void
}

function MainApp({ onOpenUpload }: MainAppProps) {
  const state = useReportState()
  const install = useInstallPrompt()
  const { uid, data, logout } = useActiveReport()
  const isSample = uid === SAMPLE_REPORT_UID

  return (
    <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isSample && (
        <div
          style={{
            textAlign: 'center',
            padding: 'calc(env(safe-area-inset-top, 0px) + 14px) 16px 0',
            fontSize: 9,
            letterSpacing: '0.02em',
            color: colors.textLinked,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          SAMPLE REPORT — FICTIONAL DATA, NOT A REAL PATIENT
        </div>
      )}

      <div
        style={{
          paddingTop: isSample ? 8 : 'calc(env(safe-area-inset-top, 0px) + 14px)',
          paddingRight: 20,
          paddingBottom: 14,
          paddingLeft: 20,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 13, color: colors.textPatientName, fontWeight: 500 }}>{data.patient.name}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
            {TAB_TITLES[state.tab]}
          </div>
        </div>
        <div
          onClick={logout}
          style={{
            cursor: 'pointer',
            fontSize: 11.5,
            fontWeight: 600,
            color: colors.textMuted,
            paddingTop: 4,
            whiteSpace: 'nowrap',
          }}
        >
          Switch code
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 20px 28px' }}>
        {state.tab === 'home' && (
          <HomeScreen
            onNavigate={state.setTab}
            onOpenShare={state.openShare}
            onOpenUpload={onOpenUpload}
            canInstall={install.canOfferInstall}
            onInstall={install.promptInstall}
          />
        )}
        {state.tab === 'risks' && <RisksScreen state={state} />}
        {state.tab === 'meds' && <MedsScreen state={state} />}
        {state.tab === 'lifestyle' && <LifestyleScreen />}
        {state.tab === 'plan' && <PlanScreen state={state} />}
      </div>

      <TabBar active={state.tab} onChange={state.setTab} />

      <ShareSheet
        open={state.shareOpen}
        confirmed={state.shareConfirmed}
        onClose={state.closeShare}
        onConfirm={state.confirmShare}
      />

      <InstallSheet open={install.iosInstructionsOpen} onClose={install.closeIosInstructions} />
    </div>
  )
}

interface AppGateProps {
  onOpenUpload: () => void
}

function AppGate({ onOpenUpload }: AppGateProps) {
  const { status } = useReportData()
  return status === 'ready' ? <MainApp onOpenUpload={onOpenUpload} /> : <UidGateScreen onOpenUpload={onOpenUpload} />
}

function App() {
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <ReportDataProvider>
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', background: colors.appBg }}>
        <AppGate onOpenUpload={() => setUploadOpen(true)} />
        <UploadSheet open={uploadOpen} onClose={() => setUploadOpen(false)} />
      </div>
    </ReportDataProvider>
  )
}

export default App
