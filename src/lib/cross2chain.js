const API = import.meta.env.VITE_CROSS2CHAIN_API_URL || 'https://api.cross2chain.com'

export const SWAP_ASSETS = [
  { id: 'BTC.BTC', symbol: 'BTC', name: 'Bitcoin', chain: 'Bitcoin', networkId: 'bitcoin', decimals: 8 },
  { id: 'ETH.ETH', symbol: 'ETH', name: 'Ether', chain: 'Ethereum', networkId: 'ethereum', decimals: 18 },
  { id: 'ETH.USDC', symbol: 'USDC', name: 'USD Coin', chain: 'Ethereum', networkId: 'ethereum', decimals: 6 },
  { id: 'ETH.USDT', symbol: 'USDT', name: 'Tether', chain: 'Ethereum', networkId: 'ethereum', decimals: 6 },
  { id: 'ETH.FLIP', symbol: 'FLIP', name: 'Chainflip', chain: 'Ethereum', networkId: 'ethereum', decimals: 18 },
  { id: 'ETH.WBTC', symbol: 'WBTC', name: 'Wrapped BTC', chain: 'Ethereum', networkId: 'ethereum', decimals: 8 },
  { id: 'ARB.ETH', symbol: 'ETH', name: 'Ether', chain: 'Arbitrum', networkId: 'arbitrum', decimals: 18 },
  { id: 'ARB.USDC', symbol: 'USDC', name: 'USD Coin', chain: 'Arbitrum', networkId: 'arbitrum', decimals: 6 },
  { id: 'ARB.USDT', symbol: 'USDT', name: 'Tether', chain: 'Arbitrum', networkId: 'arbitrum', decimals: 6 },
  { id: 'SOL.SOL', symbol: 'SOL', name: 'Solana', chain: 'Solana', networkId: 'solana', decimals: 9 },
  { id: 'SOL.USDC', symbol: 'USDC', name: 'USD Coin', chain: 'Solana', networkId: 'solana', decimals: 6 },
  { id: 'SOL.USDT', symbol: 'USDT', name: 'Tether', chain: 'Solana', networkId: 'solana', decimals: 6 },
]

export const TERMINAL_STATUSES = ['completed', 'failed', 'refunded']

export const STATUS_LABELS = {
  waiting_for_deposit: 'Waiting for deposit',
  deposit_detected: 'Deposit detected',
  confirming_source: 'Confirming on source chain',
  swap_executing: 'Swap in progress',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
}

const CHAIN_COLORS = {
  Bitcoin: '#F7931A',
  Ethereum: '#627EEA',
  Arbitrum: '#12AAFF',
  Solana: '#9945FF',
}

export function getAsset(id) {
  return SWAP_ASSETS.find(a => a.id === id)
}

export function getChainColor(chain) {
  return CHAIN_COLORS[chain] || '#888'
}

async function apiCall(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || data.errors?.[0] || `API error: ${res.status}`)
  return data
}

export async function getQuotes({ fromAsset, toAsset, amount, destinationAddress, refundAddress }) {
  return apiCall('/api/v1/quotes', {
    method: 'POST',
    body: JSON.stringify({ fromAsset, toAsset, amount, destinationAddress, refundAddress }),
  })
}

export async function createSwap(quote, destinationAddress, refundAddress) {
  return apiCall('/api/v1/swaps', {
    method: 'POST',
    body: JSON.stringify({ quote, destinationAddress, refundAddress }),
  })
}

export async function getSwapStatus(swapId) {
  const data = await apiCall(`/api/v1/swaps/${swapId}`)
  return data.swap
}
