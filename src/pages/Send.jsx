import { useState } from 'preact/hooks'
import { walletData, navigate, currentNetwork, showToast } from '../lib/state.js'
import { networks, getNetwork } from '../data/networks.js'
import { Header } from '../components/Header.jsx'
import { Warning } from '../components/Warning.jsx'
import { Modal } from '../components/Modal.jsx'

export function Send() {
  const wallet = walletData.value
  const [selectedNetwork, setSelectedNetwork] = useState(currentNetwork.value || '')
  const [selectedAsset, setSelectedAsset] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  if (!wallet) return null

  const network = getNetwork(selectedNetwork)
  const account = network ? wallet.accounts[network.id] : null
  const assets = account?.assets || []

  const validateAddress = (addr) => {
    if (!addr) return null
    if (network?.type === 'evm' && !addr.startsWith('0x')) return 'EVM addresses start with 0x'
    if (network?.id === 'bitcoin' && !addr.startsWith('bc1') && !addr.startsWith('1') && !addr.startsWith('3'))
      return 'Invalid Bitcoin address format'
    if (addr.length < 10) return 'Address seems too short'
    return null
  }

  const addressWarning = validateAddress(recipient)
  const isValid = selectedNetwork && selectedAsset && recipient && amount && parseFloat(amount) > 0 && !addressWarning

  const handleSend = () => {
    setShowConfirm(true)
  }

  const handleConfirmSend = () => {
    setStatus('success')
    setShowConfirm(false)
    showToast('Transaction sent! (mock) 🎉')
  }

  if (status === 'success') {
    return (
      <div class="min-h-screen pb-20">
        <Header />
        <div class="page-container">
          <div class="card-fun text-center py-12 animate-pop">
            <span class="text-7xl block mb-4">🎉</span>
            <h2 class="font-fun text-2xl font-bold text-candy-green mb-2">
              Transaction Sent!
            </h2>
            <p class="font-body text-gray-500 mb-2">
              {amount} {selectedAsset} → {recipient.slice(0, 10)}...
            </p>
            <p class="font-body text-xs text-gray-400 mb-6">
              (This is a mock transaction — real blockchain integration needed)
            </p>
            <button class="btn-candy-purple" onClick={() => navigate('dashboard')}>
              🏠 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
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
            <span class="text-5xl block mb-2">📤</span>
            <h2 class="font-fun text-2xl font-bold text-gradient-fun">Send Crypto</h2>
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

            {selectedNetwork && (
              <div class="animate-pop">
                {network && (
                  <div
                    class="mb-3 px-3 py-2 rounded-bubble text-sm font-fun text-center"
                    style={{ backgroundColor: network.color + '15', color: network.color }}
                  >
                    Sending on {network.emoji} {network.name}
                  </div>
                )}

                <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                  💎 Asset
                </label>
                <select
                  class="input-fun"
                  value={selectedAsset}
                  onChange={e => setSelectedAsset(e.target.value)}
                >
                  <option value="">Pick an asset...</option>
                  {assets.map(a => (
                    <option key={a.symbol} value={a.symbol}>{a.symbol} — {a.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedAsset && (
              <>
                <div class="animate-pop">
                  <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                    📬 Recipient Address
                  </label>
                  <input
                    type="text"
                    class="input-fun font-mono text-sm"
                    placeholder="Paste the recipient's address..."
                    value={recipient}
                    onInput={e => setRecipient(e.target.value)}
                  />
                  {addressWarning && (
                    <p class="font-fun text-xs text-orange-500 mt-1">⚠️ {addressWarning}</p>
                  )}
                </div>

                <div class="animate-pop">
                  <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                    💰 Amount
                  </label>
                  <div class="relative">
                    <input
                      type="number"
                      class="input-fun pr-16"
                      placeholder="0.00"
                      value={amount}
                      onInput={e => setAmount(e.target.value)}
                      step="any"
                      min="0"
                    />
                    <span
                      class="absolute right-4 top-1/2 -translate-y-1/2 font-fun text-sm font-semibold"
                      style={{ color: network?.color }}
                    >
                      {selectedAsset}
                    </span>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-bubble p-3 animate-pop">
                  <div class="flex justify-between font-fun text-sm">
                    <span class="text-gray-400">Estimated Fee</span>
                    <span class="text-gray-500">~ 0.001 {network?.symbol} (placeholder)</span>
                  </div>
                </div>

                <Warning
                  type="warning"
                  message="Blockchain transactions cannot be reversed! Double-check the address and network before sending."
                />

                {error && <p class="font-fun text-sm text-red-500">{error}</p>}

                <button
                  class="btn-candy-pink w-full text-lg"
                  disabled={!isValid}
                  onClick={handleSend}
                >
                  📤 Review & Send
                </button>
              </>
            )}
          </div>
        </div>

        {showConfirm && (
          <Modal title="🔐 Confirm Transaction" onClose={() => setShowConfirm(false)}>
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-bubble p-4 space-y-2">
                <div class="flex justify-between font-fun text-sm">
                  <span class="text-gray-400">Network</span>
                  <span>{network?.emoji} {network?.name}</span>
                </div>
                <div class="flex justify-between font-fun text-sm">
                  <span class="text-gray-400">Asset</span>
                  <span>{selectedAsset}</span>
                </div>
                <div class="flex justify-between font-fun text-sm">
                  <span class="text-gray-400">Amount</span>
                  <span>{amount} {selectedAsset}</span>
                </div>
                <div class="flex justify-between font-fun text-sm">
                  <span class="text-gray-400">To</span>
                  <span class="font-mono text-xs truncate max-w-[200px]">{recipient}</span>
                </div>
              </div>

              <Warning
                type="danger"
                message="This action cannot be undone. Make sure everything is correct!"
              />

              <div>
                <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                  Enter your password to sign
                </label>
                <input
                  type="password"
                  class="input-fun"
                  placeholder="Your wallet password..."
                  value={confirmPassword}
                  onInput={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && confirmPassword && handleConfirmSend()}
                />
              </div>

              <div class="flex gap-3">
                <button
                  class="btn-candy-pink flex-1"
                  disabled={!confirmPassword}
                  onClick={handleConfirmSend}
                >
                  ✅ Confirm Send
                </button>
                <button
                  class="btn-outline-fun border-gray-300 text-gray-500 flex-1"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
