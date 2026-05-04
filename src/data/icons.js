const BASE = 'https://assets.coingecko.com/coins/images'

export const icons = {
  BTC: `${BASE}/1/small/bitcoin.png`,
  ETH: `${BASE}/279/small/ethereum.png`,
  AVAX: `${BASE}/12559/small/Avalanche_Circle_RedWhite_Trans.png`,
  ARB: `${BASE}/16547/small/arb.png`,
  SOL: `${BASE}/4128/small/solana.png`,
  BNB: `${BASE}/825/small/bnb-icon2_2x.png`,
  DOGE: `${BASE}/5/small/dogecoin.png`,
  ZEC: `${BASE}/486/small/circle-zcash-color.png`,
  USDT: `${BASE}/325/small/Tether.png`,
  USDC: `${BASE}/6319/small/usdc.png`,
  WBTC: `${BASE}/7598/small/wrapped_bitcoin_wbtc.png`,
  WETH: `${BASE}/2518/small/weth.png`,
  CAKE: `${BASE}/12632/small/pancakeswap-cake-logo_%281%29.png`,
  JUP: `${BASE}/34188/small/jup.png`,
  FLIP: `${BASE}/28791/small/chainflip.png`,
  DOT: `${BASE}/12171/small/polkadot.png`,
}

const networkIconOverride = {
  arbitrum: 'ARB',
}

export function getIcon(symbol) {
  return icons[symbol] || null
}

export function getNetworkIconSymbol(networkId, symbol) {
  return networkIconOverride[networkId] || symbol
}
