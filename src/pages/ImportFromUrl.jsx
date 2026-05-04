import { useState } from 'preact/hooks'
import { navigate, unlockWallet, showToast } from '../lib/state.js'
import { createWalletData, saveWallet } from '../lib/wallet.js'
import { parseQrData, decryptQrPayload, extractMnemonic } from '../lib/wallet2qr.js'

export function ImportFromUrl({ importData }) {
  const [mnemonic, setMnemonic] = useState(
    importData.type === 'plain' ? importData.mnemonic : ''
  )
  const [qrPassword, setQrPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [decrypted, setDecrypted] = useState(importData.type === 'plain')

  const handleDecrypt = async () => {
    if (!qrPassword) return
    setLoading(true)
    setError('')
    try {
      const envelope = parseQrData(importData.rawUrl)
      const result = decryptQrPayload(envelope, qrPassword)

      if (!result) {
        setError('Wrong password or unrecognized QR format.')
        setLoading(false)
        return
      }

      const mnemonicResult = extractMnemonic(result)
      if (mnemonicResult) {
        setMnemonic(mnemonicResult)
        setDecrypted(true)
      } else {
        setError('Decrypted data does not contain a valid mnemonic (expected 12 or 24 words).')
      }
    } catch {
      setError('Decryption failed. Check your password.')
    } finally {
      setLoading(false)
    }
  }

  const words = mnemonic ? mnemonic.trim().split(/\s+/) : []
  const wordCount = words.length
  const isValid = wordCount === 12 || wordCount === 24

  if (decrypted && !isValid) {
    return (
      <div class="min-h-screen flex items-center justify-center p-4 bg-dots">
        <div class="w-full max-w-lg animate-pop">
          <div class="card-fun text-center space-y-4">
            <span class="text-5xl inline-block">❌</span>
            <h2 class="font-fun text-2xl font-bold text-red-500">Invalid Mnemonic</h2>
            <p class="font-body text-sm text-gray-500">
              Expected 12 or 24 words, got {wordCount}.
            </p>
            <button class="btn-candy-blue w-full text-lg" onClick={() => navigate('landing')}>
              ← Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    if (password.length < 6) {
      setError('Password needs at least 6 characters! 💪')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords don\'t match! 🤔')
      return
    }
    setError('')
    setLoading(true)
    try {
      const walletData = createWalletData(mnemonic.trim().toLowerCase())
      await saveWallet(walletData, password)
      showToast('Wallet imported from Wallet2QR! 🎉')
      unlockWallet(walletData, password)
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-dots">
      <div class="w-full max-w-lg animate-pop">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={() => navigate('landing')}
        >
          ← Back
        </button>

        <div class="card-fun space-y-4">
          {/* Encrypted QR: password prompt */}
          {!decrypted && (
            <>
              <div class="text-center">
                <span class="text-5xl inline-block animate-float">🔐</span>
                <h2 class="font-fun text-2xl font-bold text-gradient-fun mt-2">
                  Encrypted QR Detected
                </h2>
                <p class="font-body text-sm text-gray-500 mt-1">
                  Enter the password used when the QR was created
                </p>
              </div>

              <input
                type="password"
                class="input-fun text-center"
                placeholder="QR encryption password..."
                value={qrPassword}
                onInput={e => setQrPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDecrypt()}
                autofocus
              />

              {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}

              <button
                class="btn-candy-purple w-full text-lg"
                onClick={handleDecrypt}
                disabled={loading || !qrPassword}
              >
                {loading ? '🔄 Decrypting...' : '🔓 Decrypt'}
              </button>
            </>
          )}

          {/* Decrypted: set wallet password */}
          {decrypted && isValid && (
            <>
              <div class="text-center">
                <span class="text-5xl inline-block animate-float">🔗</span>
                <h2 class="font-fun text-2xl font-bold text-gradient-fun mt-2">
                  Import from Wallet2QR
                </h2>
                <p class="font-body text-sm text-gray-500 mt-1">
                  {wordCount}-word mnemonic received. Set a password to encrypt it locally.
                </p>
              </div>

              <div class="bg-green-50 border border-green-200 rounded-xl p-3">
                <p class="font-fun text-xs text-green-600 font-bold mb-1">Mnemonic detected ({wordCount} words)</p>
                <p class="font-mono text-xs text-green-700 break-words">
                  {words.slice(0, 3).join(' ')} ... {words.slice(-2).join(' ')}
                </p>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600">Password</label>
                  <input
                    type="password"
                    class="input-fun"
                    placeholder="At least 6 characters..."
                    value={password}
                    onInput={e => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600">Confirm Password</label>
                  <input
                    type="password"
                    class="input-fun"
                    placeholder="Type it again..."
                    value={confirmPassword}
                    onInput={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                  />
                </div>
              </div>

              {error && <p class="font-fun text-sm text-red-500">{error}</p>}

              <button
                class="btn-candy-green w-full text-lg"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? '🔄 Importing...' : '🚀 Import & Open Wallet!'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
