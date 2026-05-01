import { useState } from 'preact/hooks'
import { navigate, unlockWallet, showToast } from '../lib/state.js'
import { createWalletData, saveWallet } from '../lib/wallet.js'
import { Warning } from '../components/Warning.jsx'
import { MnemonicQR } from '../components/MnemonicQR.jsx'

export function CreateWallet() {
  const [step, setStep] = useState(1)
  const [walletData, setWalletData] = useState(null)
  const [confirmWords, setConfirmWords] = useState({})
  const [confirmIndexes, setConfirmIndexes] = useState([])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backedUp, setBackedUp] = useState(false)

  const startCreation = () => {
    const data = createWalletData()
    setWalletData(data)
    const indexes = []
    while (indexes.length < 3) {
      const idx = Math.floor(Math.random() * 12)
      if (!indexes.includes(idx)) indexes.push(idx)
    }
    indexes.sort((a, b) => a - b)
    setConfirmIndexes(indexes)
    setStep(2)
  }

  const words = walletData?.mnemonic?.split(' ') || []

  const handleConfirmWords = () => {
    for (const idx of confirmIndexes) {
      if ((confirmWords[idx] || '').toLowerCase().trim() !== words[idx]) {
        setError(`Word #${idx + 1} doesn't match! Check your backup 🧐`)
        return
      }
    }
    setError('')
    setStep(4)
  }

  const handleSetPassword = async () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters! Make it fun but strong 💪')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords don\'t match! Try again 🤔')
      return
    }
    setError('')
    setLoading(true)
    try {
      await saveWallet(walletData, password)
      showToast('Wallet created! Welcome aboard! 🎉')
      unlockWallet(walletData, password)
    } catch (err) {
      setError('Oops! Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-dots">
      <div class="w-full max-w-lg animate-pop">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={() => step > 1 ? setStep(step - 1) : navigate('landing')}
        >
          ← Back
        </button>

        <div class="card-fun">
          <StepIndicator current={step} total={4} />

          {step === 1 && (
            <div class="text-center space-y-4">
              <span class="text-5xl inline-block animate-float">🌟</span>
              <h2 class="font-fun text-2xl font-bold text-gradient-fun">
                Create New Wallet
              </h2>
              <p class="font-body text-gray-500">
                We'll generate a secret phrase (mnemonic) for you.
                This is the ONLY way to recover your wallet!
              </p>
              <Warning
                type="warning"
                title="Super important!"
                message="Write down your secret phrase on paper. Never share it with anyone. If you lose it, your funds are gone forever!"
              />
              <button class="btn-candy-green w-full text-lg" onClick={startCreation}>
                🎲 Generate My Secret Phrase
              </button>
            </div>
          )}

          {step === 2 && (
            <div class="space-y-4">
              <h2 class="font-fun text-2xl font-bold text-center text-gradient-fun">
                ✍️ Write These Down!
              </h2>

              <Warning
                type="danger"
                title="BACKUP NOW!"
                message="Write these 12 words on paper RIGHT NOW. This is your only backup. Screenshots can be hacked!"
              />

              <div class="grid grid-cols-3 gap-2">
                {words.map((word, i) => (
                  <div
                    key={i}
                    class="flex items-center gap-2 p-2 rounded-bubble bg-purple-50
                           border border-purple-200"
                  >
                    <span class="font-fun text-xs text-purple-400 w-5">{i + 1}.</span>
                    <span class="font-fun font-semibold text-sm">{word}</span>
                  </div>
                ))}
              </div>

              <MnemonicQR mnemonic={walletData?.mnemonic} />

              <button
                class="btn-outline-fun border-candy-blue text-candy-blue w-full text-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(walletData?.mnemonic)
                  showToast('Mnemonic copied! 📋')
                }}
              >
                📋 Copy Mnemonic Phrase
              </button>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={backedUp}
                  onChange={e => setBackedUp(e.target.checked)}
                  class="w-5 h-5 rounded accent-candy-purple"
                />
                <span class="font-fun text-sm">
                  I've written down my secret phrase! ✅
                </span>
              </label>

              <button
                class="btn-candy-purple w-full"
                disabled={!backedUp}
                onClick={() => setStep(3)}
              >
                Next: Confirm Words →
              </button>
            </div>
          )}

          {step === 3 && (
            <div class="space-y-4">
              <h2 class="font-fun text-2xl font-bold text-center text-gradient-fun">
                🧩 Confirm Your Words
              </h2>
              <p class="font-body text-sm text-gray-500 text-center">
                Type the correct words to prove you backed them up!
              </p>

              <div class="space-y-3">
                {confirmIndexes.map(idx => (
                  <div key={idx}>
                    <label class="font-fun text-sm font-semibold text-gray-600">
                      Word #{idx + 1}
                    </label>
                    <input
                      type="text"
                      class="input-fun"
                      placeholder={`Enter word #${idx + 1}...`}
                      value={confirmWords[idx] || ''}
                      onInput={e => setConfirmWords({ ...confirmWords, [idx]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              {error && <p class="font-fun text-sm text-red-500">{error}</p>}

              <button class="btn-candy-purple w-full" onClick={handleConfirmWords}>
                ✅ Confirm
              </button>
            </div>
          )}

          {step === 4 && (
            <div class="space-y-4">
              <h2 class="font-fun text-2xl font-bold text-center text-gradient-fun">
                🔐 Set Your Password
              </h2>
              <p class="font-body text-sm text-gray-500 text-center">
                This password encrypts your wallet on this device.
              </p>

              <div class="space-y-3">
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600">Password</label>
                  <input
                    type="password"
                    class="input-fun"
                    placeholder="At least 6 characters..."
                    value={password}
                    onInput={e => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600">Confirm Password</label>
                  <input
                    type="password"
                    class="input-fun"
                    placeholder="Type it again..."
                    value={confirmPassword}
                    onInput={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSetPassword()}
                  />
                </div>
              </div>

              {error && <p class="font-fun text-sm text-red-500">{error}</p>}

              <button
                class="btn-candy-green w-full text-lg"
                onClick={handleSetPassword}
                disabled={loading}
              >
                {loading ? '🔄 Creating...' : '🚀 Create My Wallet!'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ current, total }) {
  return (
    <div class="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          class={`h-2 rounded-full transition-all duration-300 ${
            i + 1 <= current
              ? 'bg-candy-purple w-8'
              : 'bg-gray-200 w-4'
          }`}
        />
      ))}
    </div>
  )
}
