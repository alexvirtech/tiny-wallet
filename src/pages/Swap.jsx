import { useState, useEffect, useRef } from 'preact/hooks'
import { walletData, navigate, showToast } from '../lib/state.js'
import { Header } from '../components/Header.jsx'
import { Warning } from '../components/Warning.jsx'
import { CryptoIcon } from '../components/CryptoIcon.jsx'
import { AddressQR } from '../components/AddressQR.jsx'
import {
  SWAP_PAIRS, LIMITS, TERMINAL_STATUSES, STATUS_LABELS,
  getQuotes, createSwap, getSwapStatus,
} from '../lib/cross2chain.js'

const DIRECTIONS = [
  { key: 'BTC_TO_ETH', label: 'BTC → ETH', from: 'BTC', to: 'ETH', color: '#F7931A' },
  { key: 'ETH_TO_BTC', label: 'ETH → BTC', from: 'ETH', to: 'BTC', color: '#627EEA' },
]

export function Swap() {
  const wallet = walletData.value
  const [direction, setDirection] = useState('BTC_TO_ETH')
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState(null)
  const [swap, setSwap] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pollerRef = useRef(null)

  const dir = DIRECTIONS.find(d => d.key === direction)
  const pair = SWAP_PAIRS[direction]
  const limits = LIMITS[dir.from]

  useEffect(() => {
    return () => {
      if (pollerRef.current) clearInterval(pollerRef.current)
    }
  }, [])

  if (!wallet) return null

  const fromAddr = wallet.accounts[pair.fromNetwork]?.address
  const toAddr = wallet.accounts[pair.toNetwork]?.address

  const amountNum = parseFloat(amount)
  const amountValid = amount && !isNaN(amountNum) && amountNum >= limits.min && amountNum <= limits.max

  const handleGetQuote = async () => {
    setError('')
    setQuote(null)
    setLoading(true)
    try {
      const data = await getQuotes({
        fromAsset: pair.fromAsset,
        toAsset: pair.toAsset,
        amount,
        destinationAddress: toAddr,
        refundAddress: fromAddr,
      })
      setQuote(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSwap = async () => {
    if (!quote?.recommendedRoute) return
    setError('')
    setLoading(true)
    try {
      const data = await createSwap(quote.recommendedRoute, toAddr, fromAddr)
      setSwap(data.swap)
      setStatus(data.swap.status)
      startPolling(data.swap.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (swapId) => {
    if (pollerRef.current) clearInterval(pollerRef.current)
    pollerRef.current = setInterval(async () => {
      try {
        const data = await getSwapStatus(swapId)
        setStatus(data.status)
        if (data.destinationTxHash) {
          setSwap(prev => ({ ...prev, destinationTxHash: data.destinationTxHash }))
        }
        if (data.refundTxHash) {
          setSwap(prev => ({ ...prev, refundTxHash: data.refundTxHash }))
        }
        if (data.actualOutput) {
          setSwap(prev => ({ ...prev, actualOutput: data.actualOutput }))
        }
        if (TERMINAL_STATUSES.includes(data.status)) {
          clearInterval(pollerRef.current)
          pollerRef.current = null
          if (data.status === 'completed') showToast('Swap completed! 🎉')
          if (data.status === 'refunded') showToast('Swap refunded')
          if (data.status === 'failed') showToast('Swap failed')
        }
      } catch {
        // polling error, keep trying
      }
    }, 20000)
  }

  const resetSwap = () => {
    if (pollerRef.current) clearInterval(pollerRef.current)
    setQuote(null)
    setSwap(null)
    setStatus(null)
    setAmount('')
    setError('')
  }

  // Active swap — show deposit instructions and status
  if (swap) {
    const isTerminal = TERMINAL_STATUSES.includes(status)
    const isBtcToEth = direction === 'BTC_TO_ETH'

    return (
      <div class="min-h-screen pb-20">
        <Header />
        <div class="page-container">
          <div class="card-fun max-w-lg mx-auto animate-pop">
            <div class="text-center mb-4">
              <span class="text-4xl block mb-2">
                {status === 'completed' ? '🎉' : status === 'failed' ? '❌' : status === 'refunded' ? '↩️' : '⏳'}
              </span>
              <h2 class="font-fun text-xl font-bold text-gradient-fun">
                {isTerminal ? STATUS_LABELS[status] : 'Swap In Progress'}
              </h2>
            </div>

            <SwapStatusBar status={status} />

            {!isTerminal && (
              <div class="space-y-4 mt-4">
                <Warning
                  type="warning"
                  title={`Send ${swap.sourceAmount} ${dir.from}`}
                  message={`Send exactly ${swap.sourceAmount} ${dir.from} to the deposit address below. Do NOT close this page.`}
                />

                <div class="bg-gray-50 rounded-bubble p-4 text-center">
                  <p class="font-fun text-xs text-gray-400 mb-2">Deposit Address</p>
                  <AddressQR address={swap.depositAddress} color={dir.color} size={160} />
                  <p class="font-mono text-xs break-all text-gray-700 mt-3">{swap.depositAddress}</p>
                  <button
                    class="font-fun text-xs text-candy-blue mt-2 underline"
                    onClick={() => {
                      navigator.clipboard?.writeText(swap.depositAddress)
                      showToast('Address copied!')
                    }}
                  >
                    Copy address
                  </button>
                </div>

                {isBtcToEth && swap.memo && (
                  <div class="bg-orange-50 rounded-bubble p-4 border-2 border-dashed border-orange-300">
                    <p class="font-fun text-xs text-orange-600 font-bold mb-1">
                      OP_RETURN Memo (REQUIRED)
                    </p>
                    <p class="font-mono text-xs break-all text-gray-700">{swap.memo}</p>
                    <button
                      class="font-fun text-xs text-candy-blue mt-2 underline"
                      onClick={() => {
                        navigator.clipboard?.writeText(swap.memo)
                        showToast('Memo copied!')
                      }}
                    >
                      Copy memo
                    </button>
                    <Warning
                      type="danger"
                      message="You MUST include this memo as an OP_RETURN output in your BTC transaction. Without it, the swap cannot complete and funds will be refunded minus fees."
                    />
                  </div>
                )}

                {swap.recommendedGasRate && isBtcToEth && (
                  <p class="font-body text-xs text-gray-400 text-center">
                    Recommended fee rate: {swap.recommendedGasRate} sat/vbyte
                  </p>
                )}
              </div>
            )}

            {isTerminal && (
              <div class="space-y-3 mt-4">
                {status === 'completed' && (
                  <div class="bg-green-50 rounded-bubble p-4 space-y-2">
                    <div class="flex justify-between font-fun text-sm">
                      <span class="text-gray-400">Received</span>
                      <span class="text-green-600 font-bold">{swap.actualOutput || swap.expectedOutput} {dir.to}</span>
                    </div>
                    {swap.destinationTxHash && (
                      <div class="flex justify-between font-fun text-xs">
                        <span class="text-gray-400">Tx Hash</span>
                        <span class="font-mono text-gray-500 truncate max-w-[180px]">{swap.destinationTxHash}</span>
                      </div>
                    )}
                  </div>
                )}
                {status === 'refunded' && swap.refundTxHash && (
                  <div class="bg-yellow-50 rounded-bubble p-4">
                    <p class="font-fun text-sm text-yellow-700">Funds returned to your {dir.from} address</p>
                    <p class="font-mono text-xs text-gray-500 mt-1 break-all">{swap.refundTxHash}</p>
                  </div>
                )}
                {status === 'failed' && (
                  <Warning type="danger" message="The swap failed. Your funds may be refunded automatically. If not, contact the provider." />
                )}
                <button class="btn-candy-purple w-full" onClick={resetSwap}>
                  Start New Swap
                </button>
                <button
                  class="btn-outline-fun border-gray-300 text-gray-500 w-full text-sm"
                  onClick={() => navigate('dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            )}

            <div class="mt-4 bg-gray-50 rounded-bubble p-3 space-y-1">
              <div class="flex justify-between font-fun text-xs">
                <span class="text-gray-400">Direction</span>
                <span>{dir.label}</span>
              </div>
              <div class="flex justify-between font-fun text-xs">
                <span class="text-gray-400">Amount</span>
                <span>{swap.sourceAmount} {dir.from}</span>
              </div>
              <div class="flex justify-between font-fun text-xs">
                <span class="text-gray-400">Expected</span>
                <span>{swap.expectedOutput} {dir.to}</span>
              </div>
              <div class="flex justify-between font-fun text-xs">
                <span class="text-gray-400">Status</span>
                <span>{STATUS_LABELS[status] || status}</span>
              </div>
              {swap.protectionScore != null && (
                <div class="flex justify-between font-fun text-xs">
                  <span class="text-gray-400">Safety</span>
                  <span class={swap.protectionScore >= 50 ? 'text-green-600' : 'text-red-500'}>
                    {swap.protectionScore}/100
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quote view — show quote details and confirm button
  if (quote) {
    const route = quote.recommendedRoute
    return (
      <div class="min-h-screen pb-20">
        <Header />
        <div class="page-container">
          <button
            class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
            onClick={() => setQuote(null)}
          >
            ← Back to amount
          </button>
          <div class="card-fun max-w-lg mx-auto animate-pop">
            <div class="text-center mb-4">
              <span class="text-4xl block mb-2">💱</span>
              <h2 class="font-fun text-xl font-bold text-gradient-fun">Swap Quote</h2>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 rounded-bubble" style={{ backgroundColor: dir.color + '10' }}>
                <div class="flex items-center gap-2">
                  <CryptoIcon symbol={dir.from} size={32} />
                  <div>
                    <p class="font-fun font-bold text-lg">{route.sourceAmount}</p>
                    <p class="font-fun text-xs text-gray-400">{dir.from}</p>
                  </div>
                </div>
                <span class="font-fun text-xl text-gray-400">→</span>
                <div class="flex items-center gap-2">
                  <CryptoIcon symbol={dir.to} size={32} />
                  <div>
                    <p class="font-fun font-bold text-lg text-green-600">{route.expectedOutput}</p>
                    <p class="font-fun text-xs text-gray-400">{dir.to}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-bubble p-3 space-y-2">
                <Row label="Provider" value={route.provider} />
                <Row label="Route" value={route.routeLabel} />
                <Row label="Min output" value={`${route.minimumOutput} ${dir.to}`} />
                <Row label="Network fees" value={route.networkFees} />
                <Row label="Slippage" value={`${route.slippagePercent}%`} />
                <Row label="Est. time" value={`~${Math.ceil(route.estimatedTimeSeconds / 60)} min`} />
                {quote.protectionScore != null && (
                  <Row
                    label="Safety score"
                    value={`${quote.protectionScore}/100`}
                    valueClass={quote.protectionScore >= 50 ? 'text-green-600' : 'text-red-500 font-bold'}
                  />
                )}
              </div>

              {quote.protectionScore != null && quote.protectionScore < 50 && (
                <Warning type="danger" title="Low safety score" message="This route has a low protection score. Proceed with caution." />
              )}

              {quote.warnings?.length > 0 && (
                <Warning type="warning" message={quote.warnings.join('. ')} />
              )}

              <p class="font-body text-xs text-gray-400 text-center">
                Quote expires in ~2 minutes. Fetch a new one if needed.
              </p>

              {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}

              <button
                class="btn-candy-green w-full text-lg"
                onClick={handleCreateSwap}
                disabled={loading}
              >
                {loading ? '🔄 Creating swap...' : '🚀 Start Swap'}
              </button>

              <button
                class="btn-outline-fun border-gray-300 text-gray-500 w-full text-sm"
                onClick={() => setQuote(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default — direction + amount input
  return (
    <div class="min-h-screen pb-20">
      <Header />

      <div class="page-container">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={() => navigate('dashboard')}
        >
          ← Back
        </button>

        <div class="card-fun max-w-lg mx-auto animate-pop">
          <div class="text-center mb-6">
            <span class="text-5xl block mb-2">🔄</span>
            <h2 class="font-fun text-2xl font-bold text-gradient-fun">Swap</h2>
            <p class="font-body text-sm text-gray-500">Cross-chain swaps via Cross2Chain</p>
          </div>

          <div class="space-y-4">
            <div class="flex gap-2">
              {DIRECTIONS.map(d => (
                <button
                  key={d.key}
                  class={`flex-1 py-3 rounded-bubble font-fun text-sm font-bold transition-all flex items-center justify-center gap-2
                    ${direction === d.key
                      ? 'text-white shadow-candy'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  style={direction === d.key ? { backgroundColor: d.color } : {}}
                  onClick={() => { setDirection(d.key); setQuote(null); setError('') }}
                >
                  <CryptoIcon symbol={d.from} size={20} />
                  →
                  <CryptoIcon symbol={d.to} size={20} />
                </button>
              ))}
            </div>

            <div class="bg-pink-50 rounded-bubble p-4 border-2 border-dashed border-pink-200">
              <p class="font-fun text-xs text-pink-400 mb-2 flex items-center gap-1.5">
                <CryptoIcon symbol={dir.from} size={16} /> You send ({dir.from})
              </p>
              <input
                type="number"
                class="input-fun text-lg"
                placeholder={`${limits.min} — ${limits.max}`}
                value={amount}
                onInput={e => setAmount(e.target.value)}
                step="any"
                min={limits.min}
                max={limits.max}
              />
              {amount && !amountValid && (
                <p class="font-fun text-xs text-red-400 mt-1">
                  Amount must be between {limits.min} and {limits.max} {dir.from}
                </p>
              )}
            </div>

            <div class="flex justify-center">
              <div class="w-10 h-10 rounded-full text-white flex items-center justify-center font-fun text-xl shadow-fun" style={{ backgroundColor: dir.color }}>
                ↓
              </div>
            </div>

            <div class="bg-blue-50 rounded-bubble p-4 border-2 border-dashed border-blue-200">
              <p class="font-fun text-xs text-blue-400 mb-1 flex items-center gap-1.5">
                <CryptoIcon symbol={dir.to} size={16} /> You receive ({dir.to})
              </p>
              <p class="font-fun text-sm text-gray-400">
                Get a quote to see the estimated output
              </p>
            </div>

            <div class="bg-gray-50 rounded-bubble p-3 space-y-1">
              <Row label="From address" value={truncAddr(fromAddr)} mono />
              <Row label="To address" value={truncAddr(toAddr)} mono />
            </div>

            {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}

            <button
              class="btn-candy-purple w-full text-lg"
              onClick={handleGetQuote}
              disabled={!amountValid || loading}
            >
              {loading ? '🔄 Getting quote...' : '💱 Get Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, valueClass = '', mono }) {
  return (
    <div class="flex justify-between font-fun text-xs">
      <span class="text-gray-400">{label}</span>
      <span class={`${mono ? 'font-mono' : ''} ${valueClass}`}>{value}</span>
    </div>
  )
}

function SwapStatusBar({ status }) {
  const steps = [
    'waiting_for_deposit',
    'deposit_detected',
    'confirming_source',
    'swap_executing',
    'destination_prepared',
    'completed',
  ]
  const current = steps.indexOf(status)
  const isFailed = status === 'failed' || status === 'refunded'

  return (
    <div class="flex items-center gap-1 px-2">
      {steps.map((s, i) => (
        <div
          key={s}
          class={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            isFailed
              ? 'bg-red-200'
              : i <= current
                ? 'bg-candy-green'
                : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function truncAddr(addr) {
  if (!addr) return '—'
  return addr.slice(0, 8) + '...' + addr.slice(-6)
}
