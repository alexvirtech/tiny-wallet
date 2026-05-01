import { useState } from 'preact/hooks'
import { navigate, unlockWallet, showToast } from '../lib/state.js'
import { createWalletData, saveWallet } from '../lib/wallet.js'
import { Warning } from '../components/Warning.jsx'

export function RestoreWallet() {
  const [step, setStep] = useState(1)
  const [mnemonic, setMnemonic] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMnemonicSubmit = () => {
    const words = mnemonic.trim().split(/\s+/)
    if (words.length !== 12 && words.length !== 24) {
      setError('Please enter 12 or 24 words! 📝')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSetPassword = async () => {
    if (password.length < 6) {
      setError('Password needs at least 6 characters! 💪')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords don\'t match! 🤔')
      return
    }
    setError('')
    setLoading(true)
    try {
      const walletData = createWalletData(mnemonic.trim().toLowerCase())
      await saveWallet(walletData, password)
      showToast('Wallet restored! Welcome back! 🎉')
      unlockWallet(walletData, password)
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-dots">
      <div class="w-full max-w-lg animate-pop">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={() => step > 1 ? setStep(1) : navigate('landing')}
        >
          ← Back
        </button>

        <div class="card-fun">
          <div class="flex items-center justify-center gap-2 mb-6">
            <div class={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-candy-blue w-8' : 'bg-gray-200 w-4'}`} />
            <div class={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-candy-blue w-8' : 'bg-gray-200 w-4'}`} />
          </div>

          {step === 1 && (
            <div class="space-y-4">
              <div class="text-center">
                <span class="text-5xl inline-block animate-float">📝</span>
                <h2 class="font-fun text-2xl font-bold text-gradient-fun mt-2">
                  Restore Your Wallet
                </h2>
                <p class="font-body text-sm text-gray-500 mt-1">
                  Enter your 12 or 24 word secret phrase
                </p>
              </div>

              <Warning
                type="warning"
                title="Stay safe!"
                message="Make sure nobody is watching your screen. Never enter your mnemonic on a website you don't trust!"
              />

              <textarea
                class="input-fun h-32 resize-none font-mono text-sm"
                placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                value={mnemonic}
                onInput={e => setMnemonic(e.target.value)}
              />

              <p class="font-body text-xs text-gray-400 text-center">
                Words: {mnemonic.trim() ? mnemonic.trim().split(/\s+/).length : 0} / 12
              </p>

              {error && <p class="font-fun text-sm text-red-500">{error}</p>}

              <button
                class="btn-candy-blue w-full text-lg"
                onClick={handleMnemonicSubmit}
              >
                Next: Set Password →
              </button>
            </div>
          )}

          {step === 2 && (
            <div class="space-y-4">
              <div class="text-center">
                <span class="text-5xl inline-block">🔐</span>
                <h2 class="font-fun text-2xl font-bold text-gradient-fun mt-2">
                  Set Your Password
                </h2>
                <p class="font-body text-sm text-gray-500 mt-1">
                  Encrypt your restored wallet
                </p>
              </div>

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
                {loading ? '🔄 Restoring...' : '🚀 Restore My Wallet!'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
