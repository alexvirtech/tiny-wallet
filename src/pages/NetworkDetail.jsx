import { useState } from 'preact/hooks'
import { walletData, navigate, currentNetwork, showToast } from '../lib/state.js'
import { getNetwork } from '../data/networks.js'
import { Header } from '../components/Header.jsx'
import { AssetList } from '../components/AssetList.jsx'
import { CryptoIcon } from '../components/CryptoIcon.jsx'
import { DerivationPathTool } from '../components/DerivationPathTool.jsx'
import { AddAsset } from '../components/AddAsset.jsx'
import { AddressQR } from '../components/AddressQR.jsx'

export function NetworkDetail() {
  const wallet = walletData.value
  const networkId = currentNetwork.value
  const network = getNetwork(networkId)
  const [tab, setTab] = useState('assets')

  if (!wallet || !network) return null

  const account = wallet.accounts[networkId]

  const copyAddress = () => {
    navigator.clipboard?.writeText(account.address)
    showToast('Address copied! 📋')
  }

  return (
    <div class="min-h-screen pb-20">
      <Header />

      <div class="page-container">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={() => navigate('dashboard')}
        >
          ← Back to Dashboard
        </button>

        <div
          class="card-fun mb-6 animate-pop"
          style={{ borderColor: network.color + '50' }}
        >
          <div class="flex items-center gap-4 mb-4">
            <CryptoIcon symbol={network.symbol} networkId={network.id} size={48} />
            <div>
              <h2 class="font-fun text-2xl font-bold" style={{ color: network.color }}>
                {network.name}
              </h2>
              <p class="font-body text-sm text-gray-500">
                {network.symbol} Network
              </p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-bubble p-4 mb-4">
            <p class="font-fun text-xs text-gray-400 mb-1">Your Address</p>
            <p class="font-mono text-sm break-all text-gray-700">{account.address}</p>
          </div>

          <div class="mb-4 rounded-bubble p-4 flex flex-col items-center"
            style={{ backgroundColor: network.bgColor }}
          >
            <AddressQR address={account.address} color={network.color} size={160} />
            <p class="font-fun text-xs text-gray-400 mt-2">Scan to send to this address</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn-candy-blue text-sm flex-1" onClick={copyAddress}>
              📋 Copy Address
            </button>
            <button
              class="btn-candy-green text-sm flex-1"
              onClick={() => navigate('receive', { network: networkId })}
            >
              📥 Receive
            </button>
            <button
              class="btn-candy-pink text-sm flex-1"
              onClick={() => navigate('send', { network: networkId })}
            >
              📤 Send
            </button>
          </div>
        </div>

        <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['assets', 'transactions', 'addAsset', 'advanced'].map(t => (
            <button
              key={t}
              class={`px-4 py-2 rounded-full font-fun text-sm whitespace-nowrap transition-all
                ${tab === t
                  ? 'text-white shadow-candy'
                  : 'bg-white text-gray-500 border-2 border-dashed border-gray-200 hover:border-candy-purple/30'
                }`}
              style={tab === t ? { backgroundColor: network.color } : {}}
              onClick={() => setTab(t)}
            >
              {t === 'assets' && '💎 Assets'}
              {t === 'transactions' && '📜 History'}
              {t === 'addAsset' && '➕ Add Asset'}
              {t === 'advanced' && '⚡ Advanced'}
            </button>
          ))}
        </div>

        <div class="animate-pop">
          {tab === 'assets' && (
            <AssetList assets={account.assets} network={network} />
          )}

          {tab === 'transactions' && (
            <div class="card-fun text-center py-8">
              <span class="text-5xl block mb-3">📭</span>
              <h3 class="font-fun text-lg font-semibold text-gray-500">No transactions yet</h3>
              <p class="font-body text-sm text-gray-400 mt-1">
                Your transaction history will show up here
              </p>
              <p class="font-body text-xs text-gray-300 mt-2">
                (Transaction fetching requires RPC integration)
              </p>
            </div>
          )}

          {tab === 'addAsset' && (
            <AddAsset network={network} account={account} />
          )}

          {tab === 'advanced' && (
            <DerivationPathTool network={network} account={account} />
          )}
        </div>
      </div>
    </div>
  )
}
