import { useState } from 'preact/hooks'
import { walletData, navigate, currentNetwork, showToast } from '../lib/state.js'
import { networks, getNetwork } from '../data/networks.js'
import { Header } from '../components/Header.jsx'
import { Warning } from '../components/Warning.jsx'
import { CryptoIcon } from '../components/CryptoIcon.jsx'

export function Receive() {
  const wallet = walletData.value
  const [selectedNetwork, setSelectedNetwork] = useState(currentNetwork.value || '')
  const [selectedAsset, setSelectedAsset] = useState('')

  if (!wallet) return null

  const network = getNetwork(selectedNetwork)
  const account = network ? wallet.accounts[network.id] : null

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard?.writeText(account.address)
      showToast('Address copied! 📋')
    }
  }

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
            <span class="text-5xl block mb-2">📥</span>
            <h2 class="font-fun text-2xl font-bold text-gradient-fun">Receive Crypto</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                🌐 Network
              </label>
              <select
                class="input-fun"
                value={selectedNetwork}
                onChange={e => {
                  setSelectedNetwork(e.target.value)
                  setSelectedAsset('')
                }}
              >
                <option value="">Pick a network...</option>
                {networks.map(n => (
                  <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>
                ))}
              </select>
            </div>

            {selectedNetwork && account && (
              <div class="animate-pop space-y-4">
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                    💎 Asset
                  </label>
                  <select
                    class="input-fun"
                    value={selectedAsset}
                    onChange={e => setSelectedAsset(e.target.value)}
                  >
                    <option value="">Select asset (optional)...</option>
                    {account.assets.map(a => (
                      <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
                    ))}
                  </select>
                </div>

                <div
                  class="rounded-bubble p-6 text-center"
                  style={{ backgroundColor: network.bgColor }}
                >
                  <div class="w-40 h-40 bg-white rounded-bubble border-3 border-dashed mx-auto mb-4 flex items-center justify-center"
                    style={{ borderColor: network.color + '50' }}
                  >
                    <div class="text-center">
                      <CryptoIcon symbol={network.symbol} networkId={network.id} size={48} class="mx-auto" />
                      <p class="font-body text-xs text-gray-400 mt-1">QR Code</p>
                    </div>
                  </div>

                  <div class="bg-white rounded-bubble p-4 mb-4">
                    <p class="font-fun text-xs text-gray-400 mb-1">Your {network.name} Address</p>
                    <p class="font-mono text-sm break-all text-gray-700">{account.address}</p>
                  </div>

                  <button class="btn-candy-blue w-full" onClick={copyAddress}>
                    📋 Copy Address
                  </button>
                </div>

                <Warning
                  type="warning"
                  message={`Send only ${network.name}-compatible assets to this address. Sending assets from another network may result in permanent loss!`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
