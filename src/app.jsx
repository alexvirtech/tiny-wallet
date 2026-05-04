import { useState, useEffect } from 'preact/hooks'
import { currentPage } from './lib/state.js'
import { Landing } from './pages/Landing.jsx'
import { CreateWallet } from './pages/CreateWallet.jsx'
import { RestoreWallet } from './pages/RestoreWallet.jsx'
import { RestoreFromQR } from './pages/RestoreFromQR.jsx'
import { ImportFromUrl } from './pages/ImportFromUrl.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { NetworkDetail } from './pages/NetworkDetail.jsx'
import { Send } from './pages/Send.jsx'
import { Receive } from './pages/Receive.jsx'
import { Swap } from './pages/Swap.jsx'
import { FindFunds } from './pages/FindFunds.jsx'
import { Settings } from './pages/Settings.jsx'
import { Toast } from './components/Toast.jsx'
import { Decorations } from './components/Decorations.jsx'

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

function getUrlImport() {
  const params = new URLSearchParams(window.location.search)
  const m = params.get('m')
  const ds = params.get('ds')

  if (!m && !ds) return null

  if (ds) {
    const rawUrl = window.location.href
    window.history.replaceState(null, '', window.location.pathname)
    return { type: 'encrypted', rawUrl }
  }

  window.history.replaceState(null, '', window.location.pathname)
  return { type: 'plain', mnemonic: m }
}

export function App() {
  const [urlImport] = useState(getUrlImport)
  const page = currentPage.value
  const Page = pages[page] || Landing

  if (urlImport && page === 'landing') {
    return (
      <>
        <Decorations />
        <ImportFromUrl importData={urlImport} />
        <Toast />
      </>
    )
  }

  return (
    <>
      <Decorations />
      <Page />
      <Toast />
    </>
  )
}
