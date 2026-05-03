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
              class="btn-candy-orange w-full text-xl"
              onClick={() => navigate('restoreQR')}
            >
              📷 Restore from QR
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

function CuteCoin({ symbol, bg, fg, x, y, size = 36, delay = '0s', rotate = 0 }) {
  return (
    <div
      class="absolute animate-float"
      style={`top:${y};left:${x};animation-delay:${delay};opacity:0.13;transform:rotate(${rotate}deg)`}
    >
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="19" fill={bg} />
        <circle cx="20" cy="20" r="14" fill={fg} />
        <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="800" font-family="'Fredoka', Arial, sans-serif" fill={bg}>{symbol}</text>
      </svg>
    </div>
  )
}

function Decorations() {
  return (
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Original childish decorations */}
      <span class="absolute text-5xl opacity-10 top-[5%] left-[8%] animate-float" style="animation-delay: 0s">⭐</span>
      <span class="absolute text-4xl opacity-10 top-[15%] right-[12%] animate-float" style="animation-delay: 0.5s">🌟</span>
      <span class="absolute text-3xl opacity-10 bottom-[10%] right-[8%] animate-float" style="animation-delay: 1.5s">✨</span>
      <span class="absolute text-4xl opacity-8 top-[40%] left-[3%] animate-float" style="animation-delay: 2s">🌈</span>
      <span class="absolute text-3xl opacity-10 top-[80%] left-[15%] animate-float" style="animation-delay: 1.3s">🦋</span>
      <span class="absolute text-4xl opacity-10 top-[25%] left-[85%] animate-float" style="animation-delay: 0.3s">🎀</span>

      {/* Crypto coin decorations */}
      <CuteCoin symbol="₿" bg="#F7931A" fg="#FEDE8D" x="88%" y="6%" size={42} delay="0.2s" rotate={12} />
      <CuteCoin symbol="Ξ" bg="#627EEA" fg="#B8C9F7" x="6%" y="18%" size={34} delay="1.1s" rotate={-8} />
      <CuteCoin symbol="◆" bg="#9945FF" fg="#D4B0FF" x="92%" y="35%" size={28} delay="0.6s" rotate={15} />
      <CuteCoin symbol="Ð" bg="#C2A633" fg="#F5E6A3" x="3%" y="55%" size={38} delay="1.8s" rotate={-12} />
      <CuteCoin symbol="◈" bg="#E84142" fg="#F7B4B4" x="90%" y="58%" size={30} delay="0.4s" rotate={20} />
      <CuteCoin symbol="$" bg="#4E7A25" fg="#B5D99C" x="8%" y="78%" size={32} delay="1.6s" rotate={-5} />
      <CuteCoin symbol="₿" bg="#F3BA2F" fg="#FBE5A0" x="85%" y="82%" size={26} delay="0.9s" rotate={10} />
      <CuteCoin symbol="Ξ" bg="#28A0F0" fg="#A8DAF7" x="15%" y="42%" size={24} delay="2.2s" rotate={-18} />

      <div class="absolute top-0 left-0 w-full h-2"
        style="background: linear-gradient(90deg, #FF6B9D, #FFD93D, #44E55A, #4DA6FF, #C44DFF, #FF6B9D)" />
    </div>
  )
}
