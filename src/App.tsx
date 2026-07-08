import HomeScreen from './screens/HomeScreen'
import RisksScreen from './screens/RisksScreen'
import MedsScreen from './screens/MedsScreen'
import LifestyleScreen from './screens/LifestyleScreen'
import PlanScreen from './screens/PlanScreen'
import TabBar from './components/TabBar'
import ShareSheet from './components/ShareSheet'
import InstallSheet from './components/InstallSheet'
import { useReportState } from './state/useReportState'
import { useInstallPrompt } from './state/useInstallPrompt'
import { colors } from './theme/tokens'

const TAB_TITLES = {
  home: 'Overview',
  risks: 'Health Risks',
  meds: 'Medications',
  lifestyle: 'Lifestyle',
  plan: 'Action Plan',
}

function App() {
  const state = useReportState()
  const install = useInstallPrompt()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', background: colors.appBg }}>
      <div style={{ width: '100%', maxWidth: 480, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

        <div style={{ padding: '8px 20px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 13, color: colors.textPatientName, fontWeight: 500 }}>Jane A. Sample</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
            {TAB_TITLES[state.tab]}
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 20px 28px' }}>
          {state.tab === 'home' && (
            <HomeScreen
              onNavigate={state.setTab}
              onOpenShare={state.openShare}
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
    </div>
  )
}

export default App
