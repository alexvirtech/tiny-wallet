const EVM_RPCS = {
  ethereum: 'https://ethereum-rpc.publicnode.com',
  arbitrum: 'https://arbitrum-one-rpc.publicnode.com',
  avalanche: 'https://avalanche-c-chain-rpc.publicnode.com',
  bnb: 'https://bsc-rpc.publicnode.com',
}

const MEMPOOL_API = 'https://mempool.space/api'

const ERC20_BALANCE_SIG = '0x70a08231'

async function jsonRpc(url, method, params) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`RPC ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.result
}

function weiToDecimal(hex, decimals) {
  const raw = BigInt(hex || '0x0')
  if (raw === 0n) return '0'
  const divisor = 10n ** BigInt(decimals)
  const intPart = raw / divisor
  const fracPart = raw % divisor
  if (fracPart === 0n) return intPart.toString()
  const fracStr = fracPart.toString().padStart(decimals, '0').replace(/0+$/, '')
  return `${intPart}.${fracStr}`
}

async function fetchEvmNativeBalance(networkId, address) {
  const rpc = EVM_RPCS[networkId]
  if (!rpc || !address) return '0'
  try {
    const hex = await jsonRpc(rpc, 'eth_getBalance', [address, 'latest'])
    return weiToDecimal(hex, 18)
  } catch (e) {
    console.warn(`[balance] ${networkId} native failed:`, e.message)
    return '0'
  }
}

async function fetchErc20Balance(networkId, tokenContract, address, decimals) {
  const rpc = EVM_RPCS[networkId]
  if (!rpc || !address || !tokenContract) return '0'
  try {
    const data = ERC20_BALANCE_SIG + address.slice(2).toLowerCase().padStart(64, '0')
    const hex = await jsonRpc(rpc, 'eth_call', [{ to: tokenContract, data }, 'latest'])
    return weiToDecimal(hex, decimals)
  } catch (e) {
    console.warn(`[balance] ${networkId} ERC20 ${tokenContract} failed:`, e.message)
    return '0'
  }
}

async function fetchBtcBalance(address) {
  if (!address) return '0'
  try {
    const res = await fetch(`${MEMPOOL_API}/address/${address}`)
    if (!res.ok) throw new Error(`mempool ${res.status}`)
    const data = await res.json()
    const confirmed = (data.chain_stats?.funded_txo_sum || 0) - (data.chain_stats?.spent_txo_sum || 0)
    const unconfirmed = (data.mempool_stats?.funded_txo_sum || 0) - (data.mempool_stats?.spent_txo_sum || 0)
    const total = confirmed + unconfirmed
    if (total <= 0) return '0'
    return (total / 1e8).toString()
  } catch (e) {
    console.warn('[balance] BTC failed:', e.message)
    return '0'
  }
}

export async function fetchAllBalances(accounts) {
  const updates = {}

  const promises = Object.entries(accounts).map(async ([networkId, account]) => {
    if (!account.address) return

    const assetUpdates = []

    if (EVM_RPCS[networkId]) {
      for (const asset of account.assets) {
        if (asset.native) {
          const bal = await fetchEvmNativeBalance(networkId, account.address)
          assetUpdates.push({ symbol: asset.symbol, balance: bal })
        } else if (asset.contract) {
          const bal = await fetchErc20Balance(networkId, asset.contract, account.address, asset.decimals)
          assetUpdates.push({ symbol: asset.symbol, balance: bal })
        }
      }
    } else if (networkId === 'bitcoin') {
      const bal = await fetchBtcBalance(account.address)
      assetUpdates.push({ symbol: 'BTC', balance: bal })
    }

    if (assetUpdates.length > 0) {
      updates[networkId] = assetUpdates
    }
  })

  await Promise.all(promises)
  console.log('[balance] fetch complete, updates:', JSON.stringify(updates).slice(0, 500))
  return updates
}
