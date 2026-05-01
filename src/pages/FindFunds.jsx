import { useState } from 'preact/hooks'
import { navigate } from '../lib/state.js'
import { networks } from '../data/networks.js'
import { walletPresets } from '../data/defaultAssets.js'
import { generateMockAddress } from '../lib/wallet.js'
import { Header } from '../components/Header.jsx'
import { Warning } from '../components/Warning.jsx'
import { CryptoIcon } from '../components/CryptoIcon.jsx'

export function FindFunds() {
  const [step, setStep] = useState(1)
  const [selectedNetworks, setSelectedNetworks] = useState([])
  const [selectedPreset, setSelectedPreset] = useState('')
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState([])

  const toggleNetwork = (id) => {
    setSelectedNetworks(prev =>
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    )
  }

  const handleScan = () => {
    setScanning(true)
    setTimeout(() => {
      const mockResults = selectedNetworks.map(nId => {
        const net = networks.find(n => n.id === nId)
        return {
          network: net,
          addresses: Array.from({ length: 3 }).map((_, i) => ({
            index: i,
            address: generateMockAddress(nId),
            balance: '0',
          })),
        }
      })
      setResults(mockResults)
      setScanning(false)
      setStep(4)
    }, 2000)
  }

  return (
    <div class="min-h-screen pb-20">
      <Header />

      <div class="page-container">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={() => step > 1 ? setStep(step - 1) : navigate('dashboard')}
        >
          ← Back
        </button>

        <div class="card-fun max-w-lg mx-auto animate-pop">
          <div class="text-center mb-6">
            <span class="text-5xl block mb-2">🔍</span>
            <h2 class="font-fun text-2xl font-bold text-gradient-fun">Find My Old Funds</h2>
            <p class="font-body text-sm text-gray-500">
              Scan different address paths to find your crypto
            </p>
          </div>

          {step === 1 && (
            <div class="space-y-4">
              <h3 class="font-fun font-semibold text-lg">
                Step 1: Select Networks to Scan
              </h3>
              <div class="grid grid-cols-2 gap-2">
                {networks.map(n => (
                  <button
                    key={n.id}
                    class={`p-3 rounded-bubble border-2 text-left transition-all duration-200
                      ${selectedNetworks.includes(n.id)
                        ? 'border-solid shadow-md'
                        : 'border-dashed border-gray-200 hover:border-gray-300'
                      }`}
                    style={selectedNetworks.includes(n.id) ? {
                      borderColor: n.color,
                      backgroundColor: n.bgColor,
                    } : {}}
                    onClick={() => toggleNetwork(n.id)}
                  >
                    <CryptoIcon symbol={n.symbol} networkId={n.id} size={24} class="mr-2 inline-block" />
                    <span class="font-fun text-sm font-semibold">{n.name}</span>
                  </button>
                ))}
              </div>
              <button
                class="btn-candy-blue w-full"
                disabled={selectedNetworks.length === 0}
                onClick={() => setStep(2)}
              >
                Next: Choose Wallet Type →
              </button>
            </div>
          )}

          {step === 2 && (
            <div class="space-y-4">
              <h3 class="font-fun font-semibold text-lg">
                Step 2: What Wallet Did You Use Before?
              </h3>
              <p class="font-body text-sm text-gray-500">
                Different wallets use different address paths.
                This helps us know where to look!
              </p>
              <div class="grid grid-cols-2 gap-2">
                {walletPresets.map(preset => (
                  <button
                    key={preset.id}
                    class={`p-4 rounded-bubble border-2 text-center transition-all duration-200
                      ${selectedPreset === preset.id
                        ? 'border-candy-purple bg-purple-50 border-solid shadow-fun'
                        : 'border-dashed border-gray-200 hover:border-purple-200'
                      }`}
                    onClick={() => setSelectedPreset(preset.id)}
                  >
                    <span class="text-3xl block mb-1">{preset.emoji}</span>
                    <span class="font-fun text-sm font-semibold">{preset.name}</span>
                  </button>
                ))}
              </div>
              <button
                class="btn-candy-purple w-full"
                disabled={!selectedPreset}
                onClick={() => setStep(3)}
              >
                Next: Scan →
              </button>
            </div>
          )}

          {step === 3 && (
            <div class="space-y-4 text-center">
              <h3 class="font-fun font-semibold text-lg">
                Step 3: Ready to Scan!
              </h3>
              <p class="font-body text-sm text-gray-500">
                We'll scan the first 20 address indexes on each selected network
                using the {walletPresets.find(p => p.id === selectedPreset)?.name} derivation paths.
              </p>

              <div class="bg-blue-50 rounded-bubble p-4">
                <p class="font-fun text-sm text-blue-600">
                  Networks: {selectedNetworks.length} selected
                </p>
                <p class="font-fun text-sm text-blue-600">
                  Wallet: {walletPresets.find(p => p.id === selectedPreset)?.emoji}{' '}
                  {walletPresets.find(p => p.id === selectedPreset)?.name}
                </p>
                <p class="font-fun text-sm text-blue-600">
                  Indexes: 0 — 19
                </p>
              </div>

              <Warning
                type="info"
                message="This scan is a placeholder. Real scanning requires blockchain RPC connections to check balances."
              />

              <button
                class="btn-candy-green w-full text-lg"
                onClick={handleScan}
                disabled={scanning}
              >
                {scanning ? (
                  <>🔄 Scanning... please wait</>
                ) : (
                  <>🔍 Start Scanning</>
                )}
              </button>
            </div>
          )}

          {step === 4 && (
            <div class="space-y-4">
              <h3 class="font-fun font-semibold text-lg text-center">
                📋 Scan Results
              </h3>

              {results.map(r => (
                <div key={r.network.id} class="space-y-2">
                  <h4 class="font-fun font-semibold text-sm flex items-center gap-1.5">
                    <CryptoIcon symbol={r.network.symbol} networkId={r.network.id} size={20} /> {r.network.name}
                  </h4>
                  {r.addresses.map(addr => (
                    <div
                      key={addr.index}
                      class="flex items-center justify-between p-2 rounded-bubble
                             bg-gray-50 border border-gray-200 text-sm"
                    >
                      <span class="font-fun text-gray-400">#{addr.index}</span>
                      <span class="font-mono text-xs truncate max-w-[180px]">
                        {addr.address}
                      </span>
                      <button
                        class="px-2 py-1 rounded-full text-xs font-fun"
                        style={{
                          backgroundColor: r.network.color + '15',
                          color: r.network.color,
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              <p class="font-body text-xs text-gray-400 text-center">
                Balances are placeholders — real RPC needed to check actual funds
              </p>

              <button
                class="btn-candy-purple w-full"
                onClick={() => navigate('dashboard')}
              >
                🏠 Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
