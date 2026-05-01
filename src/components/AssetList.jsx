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
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center font-fun font-bold text-sm text-white"
              style={{ backgroundColor: network.color }}
            >
              {asset.symbol.slice(0, 2)}
            </div>
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
