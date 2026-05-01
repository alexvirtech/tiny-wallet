import { lockWallet, navigate, currentPage } from '../lib/state.js'
import { CoinIcon } from './CoinIcon.jsx'

export function Header() {
  const page = currentPage.value

  return (
    <header class="sticky top-0 z-30">
      <div class="h-1.5" style="background: linear-gradient(90deg, #FF6B9D, #FFD93D, #44E55A, #4DA6FF, #C44DFF, #FF6B9D)" />
      <div class="bg-white/85 backdrop-blur-lg border-b-3 border-dashed border-candy-pink/20">
        <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            class="flex items-center gap-2 group"
            onClick={() => navigate('dashboard')}
          >
            <span class="font-fun text-2xl font-bold text-gradient-fun">Tiny<CoinIcon size="sm" />Wallet</span>
          </button>

          <nav class="flex items-center gap-1.5">
            <NavBtn
              active={page === 'dashboard'}
              onClick={() => navigate('dashboard')}
              emoji="🏠"
              label="Home"
            />
            <NavBtn
              active={page === 'settings'}
              onClick={() => navigate('settings')}
              emoji="⚙️"
              label="Settings"
            />
            <button
              class="ml-2 px-4 py-2 rounded-full font-fun text-sm font-bold
                     border-3 border-dashed border-red-300 text-red-400
                     hover:bg-red-50 hover:text-red-600 hover:border-red-400
                     transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={lockWallet}
            >
              🔒 Lock
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavBtn({ active, onClick, emoji, label }) {
  return (
    <button
      class={`px-4 py-2 rounded-full font-fun text-sm font-bold transition-all duration-200
        ${active
          ? 'bg-candy-purple/15 text-candy-purple border-2 border-candy-purple/30'
          : 'text-gray-400 hover:bg-purple-50 hover:text-candy-purple border-2 border-transparent'
        }`}
      onClick={onClick}
    >
      <span class="mr-1">{emoji}</span>
      <span class="hidden sm:inline">{label}</span>
    </button>
  )
}
