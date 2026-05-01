import { useState } from 'preact/hooks'
import { walletData, lockWallet, navigate, showToast, password as storedPassword } from '../lib/state.js'
import { saveWallet, deleteWallet, exportEncryptedBackup } from '../lib/wallet.js'
import { Header } from '../components/Header.jsx'
import { Warning } from '../components/Warning.jsx'
import { Modal } from '../components/Modal.jsx'
import { MnemonicQR } from '../components/MnemonicQR.jsx'

export function Settings() {
  const wallet = walletData.value
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [mnemonicPassword, setMnemonicPassword] = useState('')
  const [mnemonicRevealed, setMnemonicRevealed] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')

  if (!wallet) return null

  const handleExportBackup = async () => {
    try {
      const backup = await exportEncryptedBackup()
      const blob = new Blob([backup], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tinywallet-backup-${Date.now()}.enc`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Backup exported! Keep it safe! 💾')
    } catch {
      showToast('Failed to export backup')
    }
  }

  const handleExportAddresses = () => {
    const addresses = Object.entries(wallet.accounts).map(([id, acc]) =>
      `${id}: ${acc.address}`
    ).join('\n')
    const blob = new Blob([addresses], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tinywallet-addresses-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Addresses exported! 📋')
  }

  const handleRevealMnemonic = () => {
    if (mnemonicPassword === storedPassword.value) {
      setMnemonicRevealed(true)
      setError('')
    } else {
      setError('Wrong password! 🙈')
    }
  }

  const handleClearWallet = async () => {
    await deleteWallet()
    showToast('Wallet cleared! 🗑️')
    lockWallet()
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setError('Password needs at least 6 characters!')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match!")
      return
    }
    try {
      await saveWallet(wallet, newPassword)
      storedPassword.value = newPassword
      showToast('Password changed! 🔐')
      setShowChangePassword(false)
      setNewPassword('')
      setConfirmNewPassword('')
    } catch {
      setError('Failed to change password')
    }
  }

  return (
    <div class="min-h-screen pb-20">
      <Header />

      <div class="page-container">
        <div class="max-w-lg mx-auto space-y-4 animate-pop">
          <div class="text-center mb-6">
            <span class="text-5xl block mb-2">⚙️</span>
            <h2 class="font-fun text-2xl font-bold text-gradient-fun">Settings</h2>
          </div>

          <SettingsGroup title="🔒 Security">
            <SettingsBtn
              emoji="🔐"
              label="Lock Wallet"
              desc="Lock your wallet now"
              onClick={lockWallet}
            />
            <SettingsBtn
              emoji="🔑"
              label="Change Password"
              desc="Update your encryption password"
              onClick={() => setShowChangePassword(true)}
            />
            <SettingsBtn
              emoji="👁️"
              label="Show Secret Phrase"
              desc="Reveal your mnemonic (dangerous!)"
              onClick={() => setShowMnemonic(true)}
              danger
            />
          </SettingsGroup>

          <SettingsGroup title="💾 Backup">
            <SettingsBtn
              emoji="📦"
              label="Export Encrypted Backup"
              desc="Download your encrypted wallet file"
              onClick={handleExportBackup}
            />
            <SettingsBtn
              emoji="📋"
              label="Export Public Addresses"
              desc="Download a list of your addresses"
              onClick={handleExportAddresses}
            />
          </SettingsGroup>

          <SettingsGroup title="🎛️ Preferences">
            <div class="flex items-center justify-between p-3">
              <div>
                <p class="font-fun text-sm font-semibold">🧪 Show Test Networks</p>
                <p class="font-body text-xs text-gray-400">Display testnet networks</p>
              </div>
              <div class="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5" />
              </div>
            </div>
            <div class="flex items-center justify-between p-3">
              <div>
                <p class="font-fun text-sm font-semibold">⚡ Advanced Mode</p>
                <p class="font-body text-xs text-gray-400">Show advanced features</p>
              </div>
              <div class="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5" />
              </div>
            </div>
          </SettingsGroup>

          <SettingsGroup title="⏱️ Auto-Lock">
            <div class="p-3">
              <p class="font-fun text-sm font-semibold mb-2">Session Timeout</p>
              <select class="input-fun text-sm">
                <option>5 minutes</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
              <p class="font-body text-xs text-gray-400 mt-1">
                Auto-lock timer placeholder — not yet implemented
              </p>
            </div>
          </SettingsGroup>

          <SettingsGroup title="🚨 Danger Zone">
            <SettingsBtn
              emoji="🗑️"
              label="Clear All Wallet Data"
              desc="Delete everything from this browser"
              onClick={() => setShowClearConfirm(true)}
              danger
            />
          </SettingsGroup>
        </div>

        {showMnemonic && (
          <Modal title="👁️ Secret Phrase" onClose={() => {
            setShowMnemonic(false)
            setMnemonicRevealed(false)
            setMnemonicPassword('')
            setError('')
          }}>
            {!mnemonicRevealed ? (
              <div class="space-y-4">
                <Warning
                  type="danger"
                  title="DANGER!"
                  message="Anyone who sees your secret phrase can steal ALL your funds! Never share it. Never screenshot it."
                />
                <input
                  type="password"
                  class="input-fun"
                  placeholder="Enter your password..."
                  value={mnemonicPassword}
                  onInput={e => setMnemonicPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRevealMnemonic()}
                />
                {error && <p class="font-fun text-sm text-red-500">{error}</p>}
                <button class="btn-candy-pink w-full" onClick={handleRevealMnemonic}>
                  🔓 Reveal
                </button>
              </div>
            ) : (
              <div class="space-y-4">
                <Warning
                  type="danger"
                  message="Write this down on paper and store it safely. Close this dialog when done!"
                />
                <div class="grid grid-cols-3 gap-2">
                  {wallet.mnemonic.split(' ').map((word, i) => (
                    <div key={i} class="flex items-center gap-2 p-2 rounded-bubble bg-red-50 border border-red-200">
                      <span class="font-fun text-xs text-red-400 w-5">{i + 1}.</span>
                      <span class="font-fun font-semibold text-sm">{word}</span>
                    </div>
                  ))}
                </div>
                <MnemonicQR mnemonic={wallet.mnemonic} />
                <button
                  class="btn-outline-fun border-candy-blue text-candy-blue w-full text-sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(wallet.mnemonic)
                    showToast('Mnemonic copied! 📋')
                  }}
                >
                  📋 Copy Mnemonic Phrase
                </button>
              </div>
            )}
          </Modal>
        )}

        {showClearConfirm && (
          <Modal title="🗑️ Clear Wallet" onClose={() => setShowClearConfirm(false)}>
            <Warning
              type="danger"
              title="This cannot be undone!"
              message="All wallet data will be permanently deleted from this browser. Make sure you have your secret phrase backed up!"
              onConfirm={handleClearWallet}
              onCancel={() => setShowClearConfirm(false)}
              confirmText="🗑️ Yes, delete everything"
              cancelText="Cancel"
            />
          </Modal>
        )}

        {showChangePassword && (
          <Modal title="🔑 Change Password" onClose={() => {
            setShowChangePassword(false)
            setNewPassword('')
            setConfirmNewPassword('')
            setError('')
          }}>
            <div class="space-y-4">
              <div>
                <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">New Password</label>
                <input
                  type="password"
                  class="input-fun"
                  placeholder="At least 6 characters..."
                  value={newPassword}
                  onInput={e => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  class="input-fun"
                  placeholder="Type it again..."
                  value={confirmNewPassword}
                  onInput={e => setConfirmNewPassword(e.target.value)}
                />
              </div>
              {error && <p class="font-fun text-sm text-red-500">{error}</p>}
              <button class="btn-candy-green w-full" onClick={handleChangePassword}>
                🔐 Change Password
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

function SettingsGroup({ title, children }) {
  return (
    <div class="card-fun">
      <h3 class="font-fun font-semibold text-sm text-gray-500 mb-3">{title}</h3>
      <div class="divide-y divide-dashed divide-gray-200">
        {children}
      </div>
    </div>
  )
}

function SettingsBtn({ emoji, label, desc, onClick, danger }) {
  return (
    <button
      class={`w-full flex items-center gap-3 p-3 text-left rounded-bubble transition-all duration-200
        ${danger ? 'hover:bg-red-50' : 'hover:bg-purple-50/30'}`}
      onClick={onClick}
    >
      <span class="text-xl">{emoji}</span>
      <div class="flex-1">
        <p class={`font-fun text-sm font-semibold ${danger ? 'text-red-500' : ''}`}>{label}</p>
        <p class="font-body text-xs text-gray-400">{desc}</p>
      </div>
      <span class="text-gray-300">→</span>
    </button>
  )
}
