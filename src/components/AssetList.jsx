import { CryptoIcon } from './CryptoIcon.jsx'

export function AssetList({ assets, network, onAssetClick }) {
  return (
    <div class="space-y-2">
      {assets.map(asset => (
        <div
          key={asset.symbol}
          class="flex items-center justify-between p-3 rounded-bubble
                 border-2 border-dashed border-gray-200 hover:border-candy-purple/30
                 transition-all duration-200 cursor-pointer hover:bg-purple-50/30"
          onClick={() => onAssetClick?.(asset)}
        >
          <div class="flex items-center gap-3">
            <CryptoIcon symbol={asset.symbol} size={40} />
            <div>
              <p class="font-fun font-semibold text-sm">{asset.symbol}</p>
              <p class="font-body text-xs text-gray-400">{asset.name}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-fun font-semibold text-sm">
              {parseFloat(asset.balance || '0').toFixed(asset.decimals > 6 ? 8 : 4)}
            </p>
            <p class="font-body text-xs text-gray-400">$0.00</p>
          </div>
        </div>
      ))}
    </div>
  )
}
