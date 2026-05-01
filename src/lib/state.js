import { signal, computed } from '@preact/signals'

export const walletData = signal(null)
export const isUnlocked = signal(false)
export const currentPage = signal('landing')
export const currentNetwork = signal(null)
export const showModal = signal(null)
export const toastMessage = signal(null)
export const password = signal(null)
export const balancesLoading = signal(false)
export const prices = signal({})

export const isWalletReady = computed(() => isUnlocked.value && walletData.value !== null)

export const totalBalance = computed(() => {
  if (!walletData.value) return '$0.00'
  const p = prices.value
  let total = 0
  for (const [networkId, account] of Object.entries(walletData.value.accounts)) {
    for (const asset of account.assets) {
      const bal = parseFloat(asset.balance || '0')
      const price = p[asset.symbol] || 0
      total += bal * price
    }
  }
  if (total === 0) return '$0.00'
  if (total < 0.01) return '<$0.01'
  return '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

export function navigate(page, data) {
  currentPage.value = page
  if (data?.network) currentNetwork.value = data.network
}

export function unlockWallet(data, pwd) {
  walletData.value = data
  password.value = pwd
  isUnlocked.value = true
  currentPage.value = 'dashboard'
}

export function lockWallet() {
  walletData.value = null
  password.value = null
  isUnlocked.value = false
  currentPage.value = 'landing'
  currentNetwork.value = null
}

export function showToast(message, duration = 3000) {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = null
  }, duration)
}

export function updateAccountBalance(networkId, assetSymbol, balance) {
  if (!walletData.value) return
  const account = walletData.value.accounts[networkId]
  if (!account) return

  if (assetSymbol) {
    const asset = account.assets.find(a => a.symbol === assetSymbol)
    if (asset) asset.balance = balance
  } else {
    account.balance = balance
  }

  walletData.value = { ...walletData.value }
}
