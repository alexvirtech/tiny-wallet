import { navigate } from '../lib/state.js'
import { CryptoIcon } from './CryptoIcon.jsx'

export function NetworkCard({ network, account }) {
  const nativeAsset = account.assets.find(a => a.native)
  const otherAssets = account.assets.filter(a => !a.native)
  const balanceDisplay = nativeAsset
    ? `${parseFloat(nativeAsset.balance || '0').toFixed(network.decimals > 4 ? 8 : 4)}`
    : '0.0000'

  return (
    <div
      class="card-network cursor-pointer group relative overflow-hidden"
      style={{
        borderColor: network.color,
        background: `linear-gradient(145deg, ${network.bgColor}, white, ${network.bgColor}50)`,
      }}
      onClick={() => navigate('networkDetail', { network: network.id })}
    >
      <div class="absolute top-0 left-0 right-0 h-1.5 rounded-t-blob" style={{ background: network.color }} />

      <div class="flex items-center gap-3 mb-3 mt-1">
        <CryptoIcon symbol={network.symbol} networkId={network.id} size={40} class="group-hover:animate-wiggle" />
        <div>
          <h3 class="font-fun font-bold text-xl" style={{ color: network.color }}>
            {network.name}
          </h3>
          <p class="font-fun text-sm font-medium" style={{ color: network.color + 'aa' }}>
            {network.symbol}: {balanceDisplay}
          </p>
        </div>
      </div>

      {otherAssets.length > 0 && (
        <div class="mb-3">
          <p class="font-fun text-xs text-gray-400 mb-1.5 font-bold">Assets:</p>
          <div class="flex flex-wrap gap-1.5">
            {account.assets.map(asset => (
              <span
                key={asset.symbol}
                class="px-2.5 py-1 rounded-full text-xs font-fun font-bold border-2"
                style={{
                  backgroundColor: network.color + '12',
                  color: network.color,
                  borderColor: network.color + '30',
                }}
              >
                {asset.symbol}
              </span>
            ))}
          </div>
        </div>
      )}

      <div class="flex gap-2 mt-auto pt-3 border-t-2 border-dashed" style={{ borderColor: network.color + '25' }}>
        <CardBtn
          label="Receive"
          emoji="📥"
          color={network.color}
          onClick={e => { e.stopPropagation(); navigate('receive', { network: network.id }) }}
        />
        <CardBtn
          label="Send"
          emoji="📤"
          color={network.color}
          onClick={e => { e.stopPropagation(); navigate('send', { network: network.id }) }}
        />
        {otherAssets.length > 0 && (
          <CardBtn
            label="Assets"
            emoji="💎"
            color={network.color}
            onClick={e => { e.stopPropagation(); navigate('networkDetail', { network: network.id }) }}
          />
        )}
        <CardBtn
          label="More"
          emoji="⚡"
          color={network.color}
          onClick={e => { e.stopPropagation(); navigate('networkDetail', { network: network.id }) }}
        />
      </div>
    </div>
  )
}

function CardBtn({ label, emoji, color, onClick }) {
  return (
    <button
      class="flex-1 py-2 rounded-full text-xs font-fun font-bold
             transition-all duration-200 hover:scale-105 active:scale-95
             border-2"
      style={{
        backgroundColor: color + '10',
        color: color,
        borderColor: color + '25',
      }}
      onClick={onClick}
    >
      <span class="mr-0.5">{emoji}</span>
      <span class="hidden xs:inline">{label}</span>
    </button>
  )
}
