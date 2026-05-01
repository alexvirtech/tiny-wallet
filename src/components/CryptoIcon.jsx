import { useState } from 'preact/hooks'
import { getIcon, getNetworkIconSymbol } from '../data/icons.js'

export function CryptoIcon({ symbol, networkId, size = 32, class: className = '' }) {
  const [failed, setFailed] = useState(false)
  const iconSymbol = networkId ? getNetworkIconSymbol(networkId, symbol) : symbol
  const url = getIcon(iconSymbol)

  if (!url || failed) {
    return (
      <div
        class={`inline-flex items-center justify-center rounded-full bg-gray-200 font-fun font-bold text-gray-500 flex-shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {symbol?.slice(0, 2)}
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={symbol}
      width={size}
      height={size}
      class={`rounded-full flex-shrink-0 ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}
