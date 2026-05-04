const COINGECKO_IDS = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  USDC: 'usd-coin',
  USDT: 'tether',
  FLIP: 'chainflip',
  WBTC: 'wrapped-bitcoin',
  DOT: 'polkadot',
}

let priceCache = {}
let lastFetch = 0
const TTL = 120000

export async function fetchPrices() {
  if (Date.now() - lastFetch < TTL && Object.keys(priceCache).length) return priceCache
  try {
    const ids = [...new Set(Object.values(COINGECKO_IDS))].join(',')
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    )
    if (!res.ok) return priceCache
    const data = await res.json()
    const prices = {}
    for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
      prices[symbol] = data[id]?.usd ?? null
    }
    priceCache = prices
    lastFetch = Date.now()
    return prices
  } catch {
    return priceCache
  }
}

export function formatUsd(symbol, amount, prices) {
  if (!prices || !amount) return null
  const n = parseFloat(amount)
  if (isNaN(n) || n <= 0) return null
  const price = prices[symbol]
  if (price == null) return null
  const usd = n * price
  if (usd < 0.01) return '< $0.01'
  return `≈ $${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
