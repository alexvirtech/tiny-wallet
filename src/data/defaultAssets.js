export const defaultAssets = {
  bitcoin: [
    { symbol: 'BTC', name: 'Bitcoin', native: true, decimals: 8 },
  ],
  ethereum: [
    { symbol: 'ETH', name: 'Ether', native: true, decimals: 18 },
    { symbol: 'USDT', name: 'Tether', contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
    { symbol: 'USDC', name: 'USD Coin', contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', contract: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
  ],
  avalanche: [
    { symbol: 'AVAX', name: 'Avalanche', native: true, decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', contract: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6 },
    { symbol: 'USDT', name: 'Tether', contract: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', decimals: 6 },
    { symbol: 'WETH', name: 'Wrapped Ether', contract: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', decimals: 18 },
  ],
  arbitrum: [
    { symbol: 'ETH', name: 'Ether', native: true, decimals: 18 },
    { symbol: 'ARB', name: 'Arbitrum', contract: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', contract: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
    { symbol: 'USDT', name: 'Tether', contract: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
  ],
  solana: [
    { symbol: 'SOL', name: 'Solana', native: true, decimals: 9 },
    { symbol: 'USDC', name: 'USD Coin', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
    { symbol: 'USDT', name: 'Tether', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
    { symbol: 'JUP', name: 'Jupiter', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', decimals: 6 },
  ],
  bnb: [
    { symbol: 'BNB', name: 'BNB', native: true, decimals: 18 },
    { symbol: 'USDT', name: 'Tether', contract: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', contract: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18 },
    { symbol: 'CAKE', name: 'PancakeSwap', contract: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18 },
  ],
  dogecoin: [
    { symbol: 'DOGE', name: 'Dogecoin', native: true, decimals: 8 },
  ],
  zcash: [
    { symbol: 'ZEC', name: 'Zcash', native: true, decimals: 8 },
  ],
}

export const walletPresets = [
  { id: 'metamask', name: 'MetaMask', emoji: '🦊', paths: { evm: "m/44'/60'/0'/0/i" } },
  { id: 'ledger', name: 'Ledger', emoji: '🔑', paths: { evm: "m/44'/60'/0'/0/i", bitcoin: "m/84'/0'/0'/0/i", solana: "m/44'/501'/i'/0'" } },
  { id: 'trustwallet', name: 'Trust Wallet', emoji: '🛡️', paths: { evm: "m/44'/60'/0'/0/i", solana: "m/44'/501'/i'/0'" } },
  { id: 'phantom', name: 'Phantom', emoji: '👻', paths: { solana: "m/44'/501'/i'/0'" } },
  { id: 'coinomi', name: 'Coinomi', emoji: '🪙', paths: { evm: "m/44'/60'/0'/0/i", bitcoin: "m/44'/0'/0'/0/i" } },
  { id: 'custom', name: 'Custom', emoji: '⚙️', paths: {} },
]
