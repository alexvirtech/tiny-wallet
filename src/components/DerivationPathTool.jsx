import { useState } from 'preact/hooks'
import { generateMockAddress } from '../lib/wallet.js'
import { Warning } from './Warning.jsx'

export function DerivationPathTool({ network, account }) {
  const [path, setPath] = useState(account.derivationPath)
  const [accountIndex, setAccountIndex] = useState(account.accountIndex || 0)
  const [addressIndex, setAddressIndex] = useState(account.addressIndex || 0)
  const [scannedAddresses, setScannedAddresses] = useState([])
  const [showCustom, setShowCustom] = useState(false)
  const [customPath, setCustomPath] = useState('')

  const handleScanNext20 = () => {
    const addresses = []
    for (let i = 0; i < 20; i++) {
      addresses.push({
        index: addressIndex + i,
        address: generateMockAddress(network.id),
        balance: '0',
      })
    }
    setScannedAddresses(addresses)
  }

  const handleGenerateNext = () => {
    setAddressIndex(prev => prev + 1)
  }

  return (
    <div class="space-y-4">
      <Warning
        type="info"
        title="What are derivation paths?"
        message="Use this only if you restored a wallet but do not see your expected funds. Different wallets may use different paths to generate addresses."
      />

      <div class="space-y-3">
        <div>
          <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
            Current Derivation Path
          </label>
          <div class="input-fun bg-gray-50 font-mono text-sm">{path}</div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
              Account Index
            </label>
            <input
              type="number"
              class="input-fun text-center"
              value={accountIndex}
              min="0"
              onInput={e => setAccountIndex(parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
              Address Index
            </label>
            <input
              type="number"
              class="input-fun text-center"
              value={addressIndex}
              min="0"
              onInput={e => setAddressIndex(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button class="btn-candy-blue text-sm" onClick={handleGenerateNext}>
            ➡️ Next Address
          </button>
          <button class="btn-candy-purple text-sm" onClick={handleScanNext20}>
            🔍 Scan Next 20
          </button>
          <button
            class="btn-outline-fun border-candy-orange text-candy-orange text-sm"
            onClick={() => setShowCustom(!showCustom)}
          >
            ✏️ Custom Path
          </button>
        </div>

        {showCustom && (
          <div class="animate-pop space-y-2">
            <Warning
              type="warning"
              title="Advanced Feature"
              message="Only change this if you know what you're doing. Wrong paths will show different addresses."
            />
            <input
              type="text"
              class="input-fun font-mono text-sm"
              placeholder="m/44'/60'/0'/0/0"
              value={customPath}
              onInput={e => setCustomPath(e.target.value)}
            />
            <button
              class="btn-candy-orange text-sm"
              onClick={() => {
                if (customPath) setPath(customPath)
              }}
            >
              Apply Custom Path
            </button>
          </div>
        )}

        {scannedAddresses.length > 0 && (
          <div class="animate-pop">
            <h4 class="font-fun font-semibold text-sm mb-2">📋 Scanned Addresses</h4>
            <div class="space-y-1.5 max-h-64 overflow-y-auto">
              {scannedAddresses.map(addr => (
                <div
                  key={addr.index}
                  class="flex items-center justify-between p-2 rounded-bubble
                         bg-gray-50 border border-gray-200 text-sm"
                >
                  <span class="font-fun text-gray-400">#{addr.index}</span>
                  <span class="font-mono text-xs truncate max-w-[200px] mx-2">
                    {addr.address}
                  </span>
                  <span class="font-fun text-gray-400">{addr.balance} {network.symbol}</span>
                </div>
              ))}
            </div>
            <p class="font-body text-xs text-gray-400 mt-2 text-center">
              Balance scanning is a placeholder — real RPC integration needed
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
