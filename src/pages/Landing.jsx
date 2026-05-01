import { useState, useEffect } from 'preact/hooks'
import { navigate, unlockWallet } from '../lib/state.js'
import { hasWallet } from '../lib/storage.js'
import { loadWallet } from '../lib/wallet.js'
import { SecurityInfo } from '../components/SecurityBadge.jsx'
import { CoinIcon } from '../components/CoinIcon.jsx'

export function Landing() {
  const [existingWallet, setExistingWallet] = useState(false)
  const [showUnlock, setShowUnlock] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    hasWallet().then(setExistingWallet)
  }, [])

  const handleUnlock = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const data = await loadWallet(password)
      unlockWallet(data, password)
    } catch {
      setError('Wrong password! Try again 🙈')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-stars relative overflow-hidden">
      <Decorations />

      <div class="w-full max-w-md text-center animate-bounce-in relative z-10">
        <h1 class="font-fun text-6xl font-bold text-gradient-rainbow mb-2 text-shadow-fun">
          Tiny<CoinIcon size="lg" />Wallet
        </h1>

        <p class="font-fun text-xl text-candy-purple/70 mb-2 font-medium">
          No app. No extension.
        </p>
        <p class="font-fun text-lg mb-8">
          <span class="text-gradient-fun font-bold text-xl">
            Just your wallet in the browser!
          </span>
          <span class="inline-block ml-1 animate-wiggle">🌈</span>
        </p>

        {existingWallet && !showUnlock && (
          <div class="card-fun mb-6 animate-pop bubble-bg">
            <p class="font-fun text-base text-candy-purple mb-3">
              <span class="text-2xl mr-1">🎉</span> Welcome back, friend!
            </p>
            <button
              class="btn-candy-purple w-full text-xl"
              onClick={() => setShowUnlock(true)}
            >
              🔓 Unlock My Wallet
            </button>
          </div>
        )}

        {showUnlock && (
          <div class="card-fun mb-6 animate-pop bubble-bg">
            <h3 class="font-fun text-xl font-bold mb-4 text-gradient-fun">
              🔑 Enter your password
            </h3>
            <input
              type="password"
              class="input-fun mb-3 text-center text-lg"
              placeholder="Your super secret password..."
              value={password}
              onInput={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              autofocus
            />
            {error && (
              <p class="font-fun text-sm text-red-500 mb-3 font-bold">{error}</p>
            )}
            <button
              class="btn-candy-purple w-full text-lg"
              onClick={handleUnlock}
              disabled={loading || !password}
            >
              {loading ? '🔄 Unlocking...' : '🔓 Unlock!'}
            </button>
            <button
              class="mt-3 text-sm font-fun text-candy-purple/50 hover:text-candy-purple font-bold"
              onClick={() => setShowUnlock(false)}
            >
              ← Back
            </button>
          </div>
        )}

        {!showUnlock && (
          <div class="space-y-3 mb-8">
            <button
              class="btn-candy-green w-full text-xl"
              onClick={() => navigate('create')}
            >
              ✨ Create New Wallet
            </button>

            <button
              class="btn-candy-blue w-full text-xl"
              onClick={() => navigate('restore')}
            >
              📝 Restore from Mnemonic
            </button>

            <button
              class="btn-candy-orange w-full text-xl opacity-75"
              onClick={() => {}}
            >
              📷 Restore from QR
              <span class="text-sm ml-1 opacity-70">(soon!)</span>
            </button>
          </div>
        )}

        <div class="space-y-5 mt-8">
          <SecurityInfo />

          <div class="card-fun text-left space-y-4 bubble-bg">
            <Feature
              emoji="🔒"
              title="Your keys stay in YOUR browser"
              desc="Private keys are born here and never leave. Pinky promise!"
            />
            <div class="border-t border-dashed border-candy-purple/15" />
            <Feature
              emoji="🚫"
              title="Nothing is uploaded. Zero. Nada."
              desc="We don't even have servers. It's just you and your browser!"
            />
            <div class="border-t border-dashed border-candy-purple/15" />
            <Feature
              emoji="💾"
              title="Encrypted backup supported"
              desc="Export your wallet as an encrypted file anytime. Safety first!"
            />
          </div>
        </div>

        <p class="font-fun text-sm text-candy-purple/40 mt-8 font-medium">
          Made with 💜 for crypto newbies and pros alike
        </p>
      </div>
    </div>
  )
}

function Feature({ emoji, title, desc }) {
  return (
    <div class="flex gap-3 items-start">
      <span class="text-2xl flex-shrink-0 sticker">{emoji}</span>
      <div>
        <p class="font-fun font-bold text-base text-gray-700">{title}</p>
        <p class="font-body text-sm text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

function Decorations() {
  return (
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <span class="absolute text-5xl opacity-10 top-[5%] left-[8%] animate-float" style="animation-delay: 0s">⭐</span>
      <span class="absolute text-4xl opacity-10 top-[15%] right-[12%] animate-float" style="animation-delay: 0.5s">🌟</span>
      <span class="absolute text-6xl opacity-8 bottom-[20%] left-[5%] animate-float" style="animation-delay: 1s">💫</span>
      <span class="absolute text-3xl opacity-10 bottom-[10%] right-[8%] animate-float" style="animation-delay: 1.5s">✨</span>
      <span class="absolute text-4xl opacity-8 top-[40%] left-[3%] animate-float" style="animation-delay: 2s">🌈</span>
      <span class="absolute text-5xl opacity-8 top-[60%] right-[5%] animate-float" style="animation-delay: 0.8s">🎈</span>
      <span class="absolute text-3xl opacity-10 top-[80%] left-[15%] animate-float" style="animation-delay: 1.3s">🦋</span>
      <span class="absolute text-4xl opacity-10 top-[25%] left-[85%] animate-float" style="animation-delay: 0.3s">🎀</span>

      <div class="absolute top-0 left-0 w-full h-2"
        style="background: linear-gradient(90deg, #FF6B9D, #FFD93D, #44E55A, #4DA6FF, #C44DFF, #FF6B9D)" />
    </div>
  )
}
