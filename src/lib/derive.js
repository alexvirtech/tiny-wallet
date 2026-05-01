import { mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { HDKey } from '@scure/bip32'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { ripemd160 } from '@noble/hashes/legacy.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { bech32 } from '@scure/base'
import { secp256k1 } from '@noble/curves/secp256k1.js'

function toHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

function checksumAddress(hex40) {
  const lower = hex40.toLowerCase()
  const hash = toHex(keccak_256(new TextEncoder().encode(lower)))
  let result = '0x'
  for (let i = 0; i < 40; i++) {
    result += parseInt(hash[i], 16) >= 8 ? lower[i].toUpperCase() : lower[i]
  }
  return result
}

function deriveEvmAddress(seed) {
  const master = HDKey.fromMasterSeed(seed)
  const child = master.derive("m/44'/60'/0'/0/0")
  const uncompressed = secp256k1.getPublicKey(child.privateKey, false)
  const pubBytes = uncompressed.slice(1)
  const addrBytes = keccak_256(pubBytes).slice(-20)
  return checksumAddress(toHex(addrBytes))
}

function hash160(data) {
  return ripemd160(sha256(data))
}

function deriveBtcAddress(seed) {
  const master = HDKey.fromMasterSeed(seed)
  const child = master.derive("m/84'/0'/0'/0/0")
  const pubkey = secp256k1.getPublicKey(child.privateKey, true)
  const h = hash160(pubkey)
  const words = bech32.toWords(h)
  words.unshift(0)
  return bech32.encode('bc', words)
}

export function isValidMnemonicPhrase(mnemonic) {
  return validateMnemonic(mnemonic.trim().toLowerCase(), wordlist)
}

export function deriveAddresses(mnemonic) {
  const seed = mnemonicToSeedSync(mnemonic.trim().toLowerCase())
  const evmAddress = deriveEvmAddress(seed)
  const btcAddress = deriveBtcAddress(seed)

  return {
    bitcoin: btcAddress,
    ethereum: evmAddress,
    avalanche: evmAddress,
    arbitrum: evmAddress,
    bnb: evmAddress,
    solana: null,
    dogecoin: null,
    zcash: null,
  }
}
