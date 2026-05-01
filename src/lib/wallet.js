import { encrypt, decrypt } from './crypto.js'
import { storageSet, storageGet, storageDelete, storageClear } from './storage.js'
import { networks } from '../data/networks.js'
import { defaultAssets } from '../data/defaultAssets.js'
import { deriveAddresses } from './derive.js'

const WORDLIST_SIZE = 2048

function generateMockMnemonic() {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
    'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
    'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
    'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
    'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
    'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
    'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
    'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
    'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
    'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
    'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
    'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
    'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
    'avoid', 'awake', 'aware', 'awesome', 'awful', 'awkward', 'axis', 'baby',
    'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo',
    'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic',
    'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef',
    'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench',
    'benefit', 'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid',
    'bike', 'bind', 'biology', 'bird', 'birth', 'bitter', 'black', 'blade',
    'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom',
    'blow', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil',
    'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow',
    'boss', 'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand',
    'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge', 'brief', 'bright',
    'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown',
    'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk',
    'bullet', 'bundle', 'bunny', 'burden', 'burger', 'burst', 'bus', 'business',
    'busy', 'butter', 'buyer', 'buzz', 'cabbage', 'cabin', 'cable', 'cactus',
    'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'can', 'canal',
  ]

  const selected = []
  const randomValues = crypto.getRandomValues(new Uint16Array(12))
  for (let i = 0; i < 12; i++) {
    selected.push(words[randomValues[i] % words.length])
  }
  return selected.join(' ')
}

function generateMockAddress(networkId) {
  const hex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  switch (networkId) {
    case 'bitcoin':
      return 'bc1q' + hex.slice(0, 38)
    case 'ethereum':
    case 'avalanche':
    case 'arbitrum':
    case 'bnb':
      return '0x' + hex.slice(0, 40)
    case 'solana':
      return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 44)
    case 'dogecoin':
      return 'D' + hex.slice(0, 33)
    case 'zcash':
      return 't1' + hex.slice(0, 33)
    default:
      return '0x' + hex
  }
}

export function createWalletData(existingMnemonic) {
  const mnemonic = existingMnemonic || generateMockMnemonic()
  const derived = deriveAddresses(mnemonic)
  const accounts = {}

  for (const network of networks) {
    accounts[network.id] = {
      address: derived[network.id] || generateMockAddress(network.id),
      balance: '0',
      assets: (defaultAssets[network.id] || []).map(a => ({
        ...a,
        balance: '0',
      })),
      derivationPath: network.derivationPath,
      accountIndex: 0,
      addressIndex: 0,
    }
  }

  return { mnemonic, accounts, createdAt: Date.now() }
}

export async function saveWallet(walletData, password) {
  const json = JSON.stringify(walletData)
  const encrypted = await encrypt(json, password)
  await storageSet('encryptedWallet', encrypted)
  await storageSet('walletMeta', {
    createdAt: walletData.createdAt,
    networksCount: Object.keys(walletData.accounts).length,
  })
}

export async function loadWallet(password) {
  const encrypted = await storageGet('encryptedWallet')
  if (!encrypted) throw new Error('No wallet found')
  const json = await decrypt(encrypted, password)
  return JSON.parse(json)
}

export async function deleteWallet() {
  await storageClear()
}

export async function exportEncryptedBackup() {
  const encrypted = await storageGet('encryptedWallet')
  if (!encrypted) throw new Error('No wallet to export')
  return encrypted
}

export async function importEncryptedBackup(encryptedData, password) {
  const json = await decrypt(encryptedData, password)
  const walletData = JSON.parse(json)
  await storageSet('encryptedWallet', encryptedData)
  return walletData
}

export { generateMockMnemonic, generateMockAddress }
