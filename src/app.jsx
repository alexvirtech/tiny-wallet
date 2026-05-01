import { currentPage } from './lib/state.js'
import { Landing } from './pages/Landing.jsx'
import { CreateWallet } from './pages/CreateWallet.jsx'
import { RestoreWallet } from './pages/RestoreWallet.jsx'
import { RestoreFromQR } from './pages/RestoreFromQR.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { NetworkDetail } from './pages/NetworkDetail.jsx'
import { Send } from './pages/Send.jsx'
import { Receive } from './pages/Receive.jsx'
import { Swap } from './pages/Swap.jsx'
import { FindFunds } from './pages/FindFunds.jsx'
import { Settings } from './pages/Settings.jsx'
import { Toast } from './components/Toast.jsx'

const pages = {
  landing: Landing,
  create: CreateWallet,
  restore: RestoreWallet,
  restoreQR: RestoreFromQR,
  dashboard: Dashboard,
  networkDetail: NetworkDetail,
  send: Send,
  receive: Receive,
  swap: Swap,
  findFunds: FindFunds,
  settings: Settings,
}

export function App() {
  const page = currentPage.value
  const Page = pages[page] || Landing

  return (
    <>
      <Page />
      <Toast />
    </>
  )
}
