import { walletData, navigate, totalBalance } from '../lib/state.js'
import { networks } from '../data/networks.js'
import { NetworkCard } from '../components/NetworkCard.jsx'
import { SecurityBadge } from '../components/SecurityBadge.jsx'
import { Header } from '../components/Header.jsx'

export function Dashboard() {
  const wallet = walletData.value
  if (!wallet) return null

  return (
    <div class="min-h-screen pb-20">
      <Header />

      <div class="page-container">
        <div class="text-center mb-8 animate-pop">
          <p class="font-fun text-sm text-candy-purple/50 mb-1 font-bold">
            ✨ Total Estimated Balance ✨
          </p>
          <h2 class="font-fun text-5xl font-bold text-gradient-rainbow mb-3 text-shadow-fun">
            {totalBalance.value}
          </h2>
          <SecurityBadge />
        </div>

        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <ActionBtn emoji="📥" label="Receive" color="green" onClick={() => navigate('receive')} />
          <ActionBtn emoji="📤" label="Send" color="pink" onClick={() => navigate('send')} />
          <ActionBtn emoji="🔄" label="Swap" color="purple" onClick={() => navigate('swap')} />
          <ActionBtn emoji="🔍" label="Find Funds" color="blue" onClick={() => navigate('findFunds')} />
        </div>

        <h3 class="font-fun text-lg font-bold text-gradient-fun mb-4 text-center">
          🌐 Your Networks 🌐
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {networks.map((network, i) => (
            <div key={network.id} class="animate-pop" style={{ animationDelay: `${i * 0.05}s` }}>
              <NetworkCard
                network={network}
                account={wallet.accounts[network.id]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ emoji, label, color, onClick }) {
  const colors = {
    green: 'btn-candy-green',
    pink: 'btn-candy-pink',
    purple: 'btn-candy-purple',
    blue: 'btn-candy-blue',
  }

  return (
    <button class={`${colors[color]} !text-base !px-6`} onClick={onClick}>
      <span class="mr-1.5">{emoji}</span>
      {label}
    </button>
  )
}
