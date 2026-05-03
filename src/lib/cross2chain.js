const API = 'https://api.cross2chain.com'

export const SWAP_PAIRS = {
  BTC_TO_ETH: { fromAsset: 'BTC.BTC', toAsset: 'ETH.ETH', fromNetwork: 'bitcoin', toNetwork: 'ethereum' },
  ETH_TO_BTC: { fromAsset: 'ETH.ETH', toAsset: 'BTC.BTC', fromNetwork: 'ethereum', toNetwork: 'bitcoin' },
}

export const LIMITS = {
  BTC: { min: 0.0001, max: 10 },
  ETH: { min: 0.01, max: 100 },
}

export const TERMINAL_STATUSES = ['completed', 'failed', 'refunded']

export const STATUS_LABELS = {
  waiting_for_deposit: 'Waiting for deposit',
  deposit_detected: 'Deposit detected',
  confirming_source: 'Confirming on source chain',
  swap_executing: 'Swap in progress',
  destination_prepared: 'Funds arriving',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
}

async function apiCall(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `API error: ${res.status}`)
  return data
}

export async function getQuotes({ fromAsset, toAsset, amount, destinationAddress, refundAddress }) {
  return apiCall('/v1/quotes', {
    method: 'POST',
    body: JSON.stringify({ fromAsset, toAsset, amount, destinationAddress, refundAddress }),
  })
}

export async function createSwap(quote, destinationAddress, refundAddress) {
  return apiCall('/v1/swaps', {
    method: 'POST',
    body: JSON.stringify({ quote, destinationAddress, refundAddress }),
  })
}

export async function getSwapStatus(swapId) {
  return apiCall(`/v1/swaps/${swapId}/status`)
}

export async function checkHealth() {
  try {
    const data = await apiCall('/v1/health')
    return data.status === 'ok'
  } catch {
    return false
  }
}
