import { useState } from 'preact/hooks'
import { walletData, navigate } from '../lib/state.js'
import { networks } from '../data/networks.js'
import { Header } from '../components/Header.jsx'

export function Swap() {
  const wallet = walletData.value
  const [fromNetwork, setFromNetwork] = useState('')
  const [fromAsset, setFromAsset] = useState('')
  const [toNetwork, setToNetwork] = useState('')
  const [toAsset, setToAsset] = useState('')
  const [amount, setAmount] = useState('')

  if (!wallet) return null

  const fromAcct = fromNetwork ? wallet.accounts[fromNetwork] : null
  const toAcct = toNetwork ? wallet.accounts[toNetwork] : null

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
            <p class="font-body text-sm text-gray-500">Exchange assets across networks</p>
          </div>

          <div class="space-y-4">
            <div class="bg-pink-50 rounded-bubble p-4 border-2 border-dashed border-pink-200">
              <p class="font-fun text-xs text-pink-400 mb-2">From</p>
              <div class="grid grid-cols-2 gap-2">
                <select
                  class="input-fun text-sm"
                  value={fromNetwork}
                  onChange={e => { setFromNetwork(e.target.value); setFromAsset('') }}
                >
                  <option value="">Network...</option>
                  {networks.map(n => (
                    <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>
                  ))}
                </select>
                <select
                  class="input-fun text-sm"
                  value={fromAsset}
                  onChange={e => setFromAsset(e.target.value)}
                  disabled={!fromNetwork}
                >
                  <option value="">Asset...</option>
                  {fromAcct?.assets.map(a => (
                    <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                class="input-fun mt-2"
                placeholder="Amount..."
                value={amount}
                onInput={e => setAmount(e.target.value)}
                step="any"
                min="0"
              />
            </div>

            <div class="flex justify-center">
              <div class="w-10 h-10 rounded-full bg-candy-purple text-white flex items-center justify-center font-fun text-xl shadow-fun">
                ↕
              </div>
            </div>

            <div class="bg-blue-50 rounded-bubble p-4 border-2 border-dashed border-blue-200">
              <p class="font-fun text-xs text-blue-400 mb-2">To</p>
              <div class="grid grid-cols-2 gap-2">
                <select
                  class="input-fun text-sm"
                  value={toNetwork}
                  onChange={e => { setToNetwork(e.target.value); setToAsset('') }}
                >
                  <option value="">Network...</option>
                  {networks.map(n => (
                    <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>
                  ))}
                </select>
                <select
                  class="input-fun text-sm"
                  value={toAsset}
                  onChange={e => setToAsset(e.target.value)}
                  disabled={!toNetwork}
                >
                  <option value="">Asset...</option>
                  {toAcct?.assets.map(a => (
                    <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
                  ))}
                </select>
              </div>
              <div class="mt-2 bg-white rounded-bubble p-3 text-center">
                <p class="font-fun text-sm text-gray-400">Quote: —</p>
                <p class="font-body text-xs text-gray-300">Provider: TBD</p>
              </div>
            </div>

            <div class="bg-purple-50 rounded-bubble p-4 text-center border-2 border-dashed border-purple-200">
              <span class="text-3xl block mb-2">🚧</span>
              <p class="font-fun text-sm font-semibold text-purple-500">Coming Soon!</p>
              <p class="font-body text-xs text-gray-400 mt-1">
                Swap integration with LI.FI / SwapKit is planned
              </p>
            </div>

            <button class="btn-candy-purple w-full opacity-60 cursor-not-allowed" disabled>
              🔄 Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
