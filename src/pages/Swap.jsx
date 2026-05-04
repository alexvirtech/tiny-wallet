import { useState, useEffect, useRef } from 'preact/hooks'
import { walletData, navigate, showToast } from '../lib/state.js'
import { Header } from '../components/Header.jsx'
import { Warning } from '../components/Warning.jsx'
import { CryptoIcon } from '../components/CryptoIcon.jsx'
import { AddressQR } from '../components/AddressQR.jsx'
import {
  SWAP_ASSETS, TERMINAL_STATUSES, STATUS_LABELS,
  getAsset, getChainColor,
  getQuotes, createSwap, getSwapStatus,
} from '../lib/cross2chain.js'
import { fetchPrices, formatUsd } from '../lib/prices.js'

export function Swap() {
  const wallet = walletData.value
  const [fromId, setFromId] = useState('BTC.BTC')
  const [toId, setToId] = useState('ETH.ETH')
  const [amount, setAmount] = useState('')
  const [picking, setPicking] = useState(null)
  const [quote, setQuote] = useState(null)
  const [swap, setSwap] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [prices, setPrices] = useState({})
  const pollerRef = useRef(null)

  const fromAsset = getAsset(fromId)
  const toAsset = getAsset(toId)

  useEffect(() => {
    fetchPrices().then(setPrices)
    return () => { if (pollerRef.current) clearInterval(pollerRef.current) }
  }, [])

  if (!wallet) return null

  const fromAccount = wallet.accounts[fromAsset.networkId]
  const fromAddr = fromAccount?.address
  const toAddr = wallet.accounts[toAsset.networkId]?.address

  const fromBalance = fromAccount?.assets?.find(a => a.symbol === fromAsset.symbol)?.balance || '0'
  const usdEstimate = formatUsd(fromAsset.symbol, amount, prices)

  const handlePick = (side, assetId) => {
    const picked = getAsset(assetId)
    if (side === 'from') {
      setFromId(assetId)
      if (toAsset.chain === picked.chain) {
        const alt = SWAP_ASSETS.find(a => a.chain !== picked.chain)
        if (alt) setToId(alt.id)
      }
    } else {
      setToId(assetId)
      if (fromAsset.chain === picked.chain) {
        const alt = SWAP_ASSETS.find(a => a.chain !== picked.chain)
        if (alt) setFromId(alt.id)
      }
    }
    setPicking(null)
    setQuote(null)
    setError('')
  }

  const handleFlip = () => {
    setFromId(toId)
    setToId(fromId)
    setQuote(null)
    setError('')
  }

  const handleGetQuote = async () => {
    setError('')
    setQuote(null)
    setLoading(true)
    try {
      const data = await getQuotes({
        fromAsset: fromId,
        toAsset: toId,
        amount,
        destinationAddress: toAddr,
        refundAddress: fromAddr,
      })
      if (data.errors?.length) {
        setError(data.errors.join('. '))
      } else {
        setQuote(data)
      }
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
        const s = await getSwapStatus(swapId)
        setStatus(s.status)
        setSwap(prev => ({ ...prev, ...s }))
        if (TERMINAL_STATUSES.includes(s.status)) {
          clearInterval(pollerRef.current)
          pollerRef.current = null
          if (s.status === 'completed') showToast('Swap completed! 🎉')
          if (s.status === 'refunded') showToast('Swap refunded')
          if (s.status === 'failed') showToast('Swap failed')
        }
      } catch { /* keep polling */ }
    }, 10000)
  }

  const resetSwap = () => {
    if (pollerRef.current) clearInterval(pollerRef.current)
    setQuote(null)
    setSwap(null)
    setStatus(null)
    setAmount('')
    setError('')
  }

  // --- Loading overlay while fetching quote ---
  if (loading && !swap) {
    return (
      <div class="min-h-screen pb-20">
        <Header />
        <div class="page-container">
          <div class="card-fun max-w-lg mx-auto animate-pop text-center py-12 space-y-4">
            <div class="text-5xl animate-spin" style="animation-duration: 2s">🔄</div>
            <h2 class="font-fun text-xl font-bold text-gradient-fun">
              {quote ? 'Creating swap...' : 'Fetching quote from Chainflip...'}
            </h2>
            <p class="font-body text-sm text-gray-400">This may take a few seconds</p>
            <div class="flex justify-center gap-1">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  class="w-2.5 h-2.5 rounded-full bg-candy-purple animate-bounce"
                  style={`animation-delay: ${i * 0.15}s`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Asset picker ---
  if (picking) {
    const otherAsset = picking === 'from' ? toAsset : fromAsset
    return (
      <div class="min-h-screen pb-20">
        <Header />
        <div class="page-container">
          <button
            class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
            onClick={() => setPicking(null)}
          >
            ← Back
          </button>
          <div class="card-fun max-w-lg mx-auto animate-pop">
            <h2 class="font-fun text-xl font-bold text-gradient-fun text-center mb-4">
              Select {picking === 'from' ? 'Source' : 'Destination'} Asset
            </h2>
            <p class="font-body text-xs text-gray-400 text-center mb-3">
              Cross-chain swaps only — pick an asset on a different chain
            </p>
            <div class="space-y-1">
              {SWAP_ASSETS.map(a => {
                const selected = picking === 'from' ? fromId === a.id : toId === a.id
                const sameChain = !selected && a.chain === otherAsset.chain
                const disabled = sameChain || a.id === otherAsset.id
                return (
                  <button
                    key={a.id}
                    class={`w-full flex items-center gap-3 p-3 rounded-bubble transition-all ${
                      selected
                        ? 'bg-candy-purple/10 border-2 border-candy-purple'
                        : disabled
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => !disabled && handlePick(picking, a.id)}
                    disabled={disabled}
                  >
                    <CryptoIcon symbol={a.symbol} size={28} />
                    <div class="text-left flex-1">
                      <span class="font-fun font-bold text-sm">{a.symbol}</span>
                      <span class="font-body text-xs text-gray-400 ml-2">{a.name}</span>
                      {sameChain && <span class="font-body text-xs text-red-400 ml-1">(same chain)</span>}
                    </div>
                    <span
                      class="font-fun text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: getChainColor(a.chain) }}
                    >
                      {a.chain}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Active swap: deposit instructions + status ---
  if (swap) {
    const isTerminal = TERMINAL_STATUSES.includes(status)
    const hasMemo = swap.memo && swap.requiresMemo !== false

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
                  title={`Send ${swap.sourceAmount} ${fromAsset.symbol}`}
                  message={`Send exactly ${swap.sourceAmount} ${fromAsset.symbol} (${fromAsset.chain}) to the deposit address below. Do NOT close this page.`}
                />

                <div class="bg-gray-50 rounded-bubble p-4 text-center">
                  <p class="font-fun text-xs text-gray-400 mb-2">Deposit Address</p>
                  <AddressQR address={swap.depositAddress} color={getChainColor(fromAsset.chain)} size={160} />
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

                {hasMemo && (
                  <div class="bg-orange-50 rounded-bubble p-4 border-2 border-dashed border-orange-300">
                    <p class="font-fun text-xs text-orange-600 font-bold mb-1">
                      Memo (REQUIRED)
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
                      message="You MUST include this memo in your transaction. Without it, the swap cannot complete and funds may be lost."
                    />
                  </div>
                )}

                {swap.recommendedGasRate && fromAsset.networkId === 'bitcoin' && (
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
                      <span class="text-green-600 font-bold">
                        {swap.actualOutput || swap.expectedOutput} {toAsset.symbol}
                      </span>
                    </div>
                    {swap.destinationTxHash && (
                      <div class="flex justify-between font-fun text-xs">
                        <span class="text-gray-400">Tx Hash</span>
                        <span class="font-mono text-gray-500 truncate max-w-[180px]">{swap.destinationTxHash}</span>
                      </div>
                    )}
                  </div>
                )}
                {status === 'refunded' && (
                  <div class="bg-yellow-50 rounded-bubble p-4">
                    <p class="font-fun text-sm text-yellow-700">Funds returned to your {fromAsset.symbol} address</p>
                    {swap.refundTxHash && (
                      <p class="font-mono text-xs text-gray-500 mt-1 break-all">{swap.refundTxHash}</p>
                    )}
                  </div>
                )}
                {status === 'failed' && (
                  <Warning type="danger" message="The swap failed. Your funds may be refunded automatically." />
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
              <Row label="Direction" value={`${fromAsset.symbol} (${fromAsset.chain}) → ${toAsset.symbol} (${toAsset.chain})`} />
              <Row label="Amount" value={`${swap.sourceAmount} ${fromAsset.symbol}`} />
              <Row label="Expected" value={`${swap.expectedOutput} ${toAsset.symbol}`} />
              <Row label="Status" value={STATUS_LABELS[status] || status} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Quote review ---
  if (quote) {
    const route = quote.recommendedRoute
    const outUsd = formatUsd(toAsset.symbol, route.expectedOutput, prices)
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
              <div class="flex items-center justify-between p-4 rounded-bubble bg-gray-50">
                <div class="flex items-center gap-2">
                  <CryptoIcon symbol={fromAsset.symbol} size={32} />
                  <div>
                    <p class="font-fun font-bold text-lg">{route.sourceAmount}</p>
                    <p class="font-fun text-xs text-gray-400">{fromAsset.symbol} ({fromAsset.chain})</p>
                    {usdEstimate && <p class="font-body text-xs text-gray-400">{usdEstimate}</p>}
                  </div>
                </div>
                <span class="font-fun text-xl text-gray-400">→</span>
                <div class="flex items-center gap-2 text-right">
                  <div>
                    <p class="font-fun font-bold text-lg text-green-600">{route.expectedOutput}</p>
                    <p class="font-fun text-xs text-gray-400">{toAsset.symbol} ({toAsset.chain})</p>
                    {outUsd && <p class="font-body text-xs text-gray-400">{outUsd}</p>}
                  </div>
                  <CryptoIcon symbol={toAsset.symbol} size={32} />
                </div>
              </div>

              <div class="bg-gray-50 rounded-bubble p-3 space-y-2">
                {route.provider && <Row label="Provider" value={route.provider} />}
                <Row label="Min output" value={`${route.minimumOutput} ${toAsset.symbol}`} />
                {route.networkFees && <Row label="Network fees" value={route.networkFees} />}
                {route.protocolFees && <Row label="Protocol fees" value={route.protocolFees} />}
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

  // --- Default: asset selection + amount input ---
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
            <p class="font-body text-sm text-gray-500">Cross-chain swaps via Chainflip</p>
          </div>

          <div class="space-y-4">
            {/* From */}
            <div class="bg-pink-50 rounded-bubble p-4 border-2 border-dashed border-pink-200">
              <div class="flex items-center justify-between mb-3">
                <p class="font-fun text-xs text-pink-400">You send</p>
                <button
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all border border-gray-200"
                  onClick={() => setPicking('from')}
                >
                  <CryptoIcon symbol={fromAsset.symbol} size={20} />
                  <span class="font-fun font-bold text-sm">{fromAsset.symbol}</span>
                  <span class="font-body text-xs text-gray-400">{fromAsset.chain}</span>
                  <span class="text-gray-300">▾</span>
                </button>
              </div>
              <input
                type="number"
                class="input-fun text-lg"
                placeholder="Amount..."
                value={amount}
                onInput={e => setAmount(e.target.value)}
                step="any"
              />
              <div class="flex items-center justify-between mt-1.5">
                <p class="font-fun text-xs text-gray-400">
                  Balance: {fromBalance} {fromAsset.symbol}
                  {parseFloat(fromBalance) > 0 && (
                    <button
                      class="ml-1.5 text-candy-purple font-bold underline"
                      onClick={() => setAmount(fromBalance)}
                    >
                      max
                    </button>
                  )}
                </p>
                {usdEstimate && (
                  <p class="font-body text-xs text-gray-400">{usdEstimate}</p>
                )}
              </div>
            </div>

            {/* Flip button */}
            <div class="flex justify-center">
              <button
                class="w-10 h-10 rounded-full bg-candy-purple text-white flex items-center justify-center font-fun text-xl shadow-fun hover:scale-110 transition-transform"
                onClick={handleFlip}
                title="Swap direction"
              >
                ↕
              </button>
            </div>

            {/* To */}
            <div class="bg-blue-50 rounded-bubble p-4 border-2 border-dashed border-blue-200">
              <div class="flex items-center justify-between mb-1">
                <p class="font-fun text-xs text-blue-400">You receive</p>
                <button
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all border border-gray-200"
                  onClick={() => setPicking('to')}
                >
                  <CryptoIcon symbol={toAsset.symbol} size={20} />
                  <span class="font-fun font-bold text-sm">{toAsset.symbol}</span>
                  <span class="font-body text-xs text-gray-400">{toAsset.chain}</span>
                  <span class="text-gray-300">▾</span>
                </button>
              </div>
              <p class="font-fun text-sm text-gray-400">
                Get a quote to see the estimated output
              </p>
            </div>

            {/* Addresses */}
            <div class="bg-gray-50 rounded-bubble p-3 space-y-1">
              <Row label={`From (${fromAsset.chain})`} value={truncAddr(fromAddr)} mono />
              <Row label={`To (${toAsset.chain})`} value={truncAddr(toAddr)} mono />
            </div>

            {fromAsset.chain === toAsset.chain && (
              <Warning
                type="warning"
                message="Same-chain swaps are not supported. Please select assets on different chains."
              />
            )}

            {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}

            <button
              class="btn-candy-purple w-full text-lg"
              onClick={handleGetQuote}
              disabled={!amount || parseFloat(amount) <= 0 || loading || fromAsset.chain === toAsset.chain}
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
