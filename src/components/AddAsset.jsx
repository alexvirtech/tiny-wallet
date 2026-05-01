import { useState } from 'preact/hooks'
import { showToast } from '../lib/state.js'
import { Warning } from './Warning.jsx'
import { CryptoIcon } from './CryptoIcon.jsx'

export function AddAsset({ network, account }) {
  const [contract, setContract] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimals, setDecimals] = useState('')

  const isEvm = network.type === 'evm'
  const isSolana = network.type === 'solana'
  const isUtxo = network.type === 'utxo'

  const handleAdd = () => {
    showToast(`${symbol || 'Token'} added! (mock) 🎉`)
    setContract('')
    setName('')
    setSymbol('')
    setDecimals('')
  }

  if (isUtxo) {
    return (
      <div class="card-fun space-y-4">
        <div class="text-center">
          <CryptoIcon symbol={network.symbol} networkId={network.id} size={40} class="mx-auto mb-2" />
          <h3 class="font-fun text-lg font-semibold">{network.name} is a native-coin network</h3>
          <p class="font-body text-sm text-gray-500 mt-2">
            In this MVP, {network.name} only supports its native {network.symbol} coin.
            Custom tokens are not applicable for this network.
          </p>
        </div>
        <Warning
          type="info"
          title="Need more addresses?"
          message='Use the "Advanced" tab to discover additional addresses using different derivation paths or indexes.'
        />
      </div>
    )
  }

  return (
    <div class="card-fun space-y-4">
      <h3 class="font-fun text-lg font-semibold text-center">
        ➕ Add a Token to {network.name}
      </h3>

      <div>
        <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
          {isSolana ? 'Token Mint Address' : 'Contract Address'}
        </label>
        <input
          type="text"
          class="input-fun font-mono text-sm"
          placeholder={isSolana ? 'Enter Solana token mint...' : '0x...'}
          value={contract}
          onInput={e => setContract(e.target.value)}
        />
        <p class="font-body text-xs text-gray-400 mt-1">
          {isEvm && 'Paste the ERC-20 token contract address'}
          {isSolana && 'Paste the SPL token mint address'}
        </p>
      </div>

      {isEvm && (
        <>
          <Warning
            type="info"
            message="Token details will auto-fill when blockchain RPC is connected. For now, fill them manually."
          />

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                Token Name
              </label>
              <input
                type="text"
                class="input-fun text-sm"
                placeholder="e.g. Uniswap"
                value={name}
                onInput={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
                Symbol
              </label>
              <input
                type="text"
                class="input-fun text-sm"
                placeholder="e.g. UNI"
                value={symbol}
                onInput={e => setSymbol(e.target.value)}
              />
            </div>
          </div>

          <div class="w-1/2">
            <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">
              Decimals
            </label>
            <input
              type="number"
              class="input-fun text-sm"
              placeholder="18"
              value={decimals}
              onInput={e => setDecimals(e.target.value)}
            />
          </div>
        </>
      )}

      <button
        class="btn-candy-green w-full"
        onClick={handleAdd}
        disabled={!contract}
      >
        ➕ Add Token
      </button>
    </div>
  )
}
