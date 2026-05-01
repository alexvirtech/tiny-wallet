import CryptoJS from 'crypto-js'

export function parseQrData(raw) {
  try {
    const url = new URL(raw)
    const ds = url.searchParams.get('ds') ?? ''
    const v = url.searchParams.get('v')

    if (v === '3') {
      return {
        version: 3,
        ds,
        mode: url.searchParams.get('m') || 'a',
        salt: url.searchParams.get('s') ?? '',
        provider: url.searchParams.get('p') || null,
        providerIdHash: url.searchParams.get('ph') || null,
        wrappedKey1: url.searchParams.get('w1') || null,
        wrappedKey2: url.searchParams.get('w2') || null,
      }
    }

    if (v === '2') {
      return {
        version: 2,
        ds,
        pepper: url.searchParams.get('pep') ?? 'google',
        subHash: url.searchParams.get('sh') ?? '',
      }
    }

    return { version: 1, ds }
  } catch {
    const dsMatch = raw.match(/[?&]ds=([^&]*)/)
    if (dsMatch) return { version: 1, ds: dsMatch[1] }
    return { version: 0, ds: raw }
  }
}

export function decryptV1(ciphertext, password) {
  try {
    const decoded = decodeURIComponent(ciphertext)
    const decrypted = CryptoJS.AES.decrypt(decoded, password)
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    if (!result) return null
    if (/[\x00-\x08\x0E-\x1F]/.test(result)) return null
    return result
  } catch {
    return null
  }
}

export function decryptV2(ciphertext, password, pepper) {
  return decryptV1(ciphertext, password + ':' + pepper)
}

export function decryptQrPayload(envelope, password) {
  if (envelope.version === 1 || envelope.version === 0) {
    return decryptV1(envelope.ds, password)
  }

  if (envelope.version === 2) {
    return null
  }

  if (envelope.version === 3) {
    return null
  }

  return null
}

export function extractMnemonic(decryptedText) {
  if (!decryptedText) return null

  try {
    const parsed = JSON.parse(decryptedText)
    if (parsed.mnemonic) return parsed.mnemonic
    if (parsed.seed) return parsed.seed
    if (parsed.phrase) return parsed.phrase
  } catch {
    // not JSON
  }

  const words = decryptedText.trim().split(/\s+/)
  if (words.length === 12 || words.length === 24) {
    return decryptedText.trim()
  }

  return null
}
