import { useState, useRef, useEffect, useCallback } from 'preact/hooks'
import { navigate, unlockWallet, showToast } from '../lib/state.js'
import { createWalletData, saveWallet } from '../lib/wallet.js'
import { parseQrData, decryptQrPayload, extractMnemonic } from '../lib/wallet2qr.js'
import { Warning } from '../components/Warning.jsx'
import jsQR from 'jsqr'

export function RestoreFromQR() {
  const [mode, setMode] = useState(null)
  const [step, setStep] = useState(1)
  const [scannedData, setScannedData] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [qrPassword, setQrPassword] = useState('')
  const [walletPassword, setWalletPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const scannerRef = useRef(null)
  const fileInputRef = useRef(null)

  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      clearInterval(scannerRef.current)
      scannerRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const processQrResult = useCallback((data) => {
    setScannedData(data)
    if (mode === 'simple') {
      const words = data.trim().split(/\s+/)
      if (words.length === 12 || words.length === 24) {
        setMnemonic(data.trim())
        setError('')
        setStep(3)
      } else {
        setError(`Expected 12 or 24 words but got ${words.length}. Is this the right QR code?`)
      }
    } else {
      setError('')
      setStep(3)
    }
  }, [mode])

  const startCamera = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch {
      setError('Could not access camera. Try uploading a QR image instead.')
    }
  }

  useEffect(() => {
    if (!cameraActive || !videoRef.current) return

    const video = videoRef.current
    if (video.paused) {
      video.play().catch(() => {})
    }

    const canvas = canvasRef.current
    if (!canvas) return

    scannerRef.current = setInterval(() => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA) return
      if (!video.videoWidth || !video.videoHeight) return
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, canvas.width, canvas.height)
      if (code) {
        stopCamera()
        processQrResult(code.data)
      }
    }, 250)

    return () => {
      if (scannerRef.current) {
        clearInterval(scannerRef.current)
        scannerRef.current = null
      }
    }
  }, [cameraActive, stopCamera, processQrResult])

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, canvas.width, canvas.height)
      URL.revokeObjectURL(img.src)

      if (code) {
        processQrResult(code.data)
      } else {
        setError('No QR code found in this image. Try a clearer photo.')
      }
    }
    img.onerror = () => {
      setError('Failed to load the image file.')
    }
    img.src = URL.createObjectURL(file)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDecryptQR = async () => {
    if (!qrPassword) return
    setLoading(true)
    setError('')
    try {
      const envelope = parseQrData(scannedData)
      const decrypted = decryptQrPayload(envelope, qrPassword)

      if (!decrypted) {
        setError('Wrong password or unrecognized QR format.')
        setLoading(false)
        return
      }

      const mnemonicResult = extractMnemonic(decrypted)

      if (mnemonicResult) {
        setMnemonic(mnemonicResult)
        setStep(4)
      } else {
        setError('Decrypted data does not contain a valid mnemonic (expected 12 or 24 words).')
      }
    } catch {
      setError('Decryption failed. Check your password and QR code.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async () => {
    if (walletPassword.length < 6) {
      setError('Password needs at least 6 characters!')
      return
    }
    if (walletPassword !== confirmPassword) {
      setError("Passwords don't match!")
      return
    }
    setError('')
    setLoading(true)
    try {
      const walletData = createWalletData(mnemonic)
      await saveWallet(walletData, walletPassword)
      showToast('Wallet restored from QR! 🎉')
      unlockWallet(walletData, walletPassword)
    } catch (err) {
      setError('Something went wrong: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (cameraActive) {
      stopCamera()
      return
    }
    if (step > 2) {
      setStep(step - 1)
      setError('')
      return
    }
    if (step === 2) {
      setMode(null)
      setStep(1)
      setError('')
      return
    }
    navigate('landing')
  }

  const passwordStepVisible = (step === 3 && mode === 'simple' && mnemonic)
    || (step === 4 && mode === 'encrypted' && mnemonic)

  return (
    <div class="min-h-screen flex items-center justify-center p-4 bg-dots">
      <div class="w-full max-w-lg animate-pop">
        <button
          class="font-fun text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1"
          onClick={goBack}
        >
          ← Back
        </button>

        <div class="card-fun">
          {/* Video always in DOM — opacity-0 when inactive (display:none and zero-size break mobile) */}
          <video
            ref={videoRef}
            class={cameraActive && step === 2
              ? 'w-full rounded-bubble'
              : 'absolute w-full opacity-0 pointer-events-none -z-50'}
            playsInline
            autoPlay
            muted
          />
          <canvas ref={canvasRef} class="absolute opacity-0 pointer-events-none -z-50" />

          {/* Step 1: Mode selection */}
          {step === 1 && (
            <div class="space-y-4 text-center">
              <span class="text-5xl inline-block animate-float sticker">📷</span>
              <h2 class="font-fun text-2xl font-bold text-gradient-fun">
                Restore from QR Code
              </h2>
              <p class="font-body text-sm text-gray-500">
                Choose the type of QR code you have
              </p>

              <div class="space-y-3 pt-2">
                <button
                  class="w-full p-5 rounded-bubble border-3 border-dashed border-blue-300
                         bg-blue-50/50 text-left hover:border-blue-500
                         hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => { setMode('simple'); setStep(2) }}
                >
                  <div class="flex items-start gap-3">
                    <span class="text-3xl">📝</span>
                    <div>
                      <p class="font-fun font-bold text-base text-blue-700">Simple QR</p>
                      <p class="font-body text-sm text-gray-500 mt-0.5">
                        QR code contains your mnemonic phrase as plain text
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  class="w-full p-5 rounded-bubble border-3 border-dashed border-purple-300
                         bg-purple-50/50 text-left hover:border-purple-500
                         hover:bg-purple-50 transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => { setMode('encrypted'); setStep(2) }}
                >
                  <div class="flex items-start gap-3">
                    <span class="text-3xl">🔐</span>
                    <div>
                      <p class="font-fun font-bold text-base text-purple-700">Encrypted QR</p>
                      <p class="font-body text-sm text-gray-500 mt-0.5">
                        Password-protected QR created with wallet2qr or similar tools
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Scan QR */}
          {step === 2 && mode && (
            <div class="space-y-4">
              <div class="text-center">
                <span class="text-4xl block mb-2">
                  {mode === 'simple' ? '📝' : '🔐'}
                </span>
                <h2 class="font-fun text-xl font-bold text-gradient-fun">
                  Scan {mode === 'simple' ? 'Simple' : 'Encrypted'} QR
                </h2>
              </div>

              {mode === 'simple' && (
                <Warning
                  type="warning"
                  title="Stay safe!"
                  message="Make sure nobody is watching your screen. A simple QR contains your mnemonic in plain text."
                />
              )}

              {cameraActive && (
                <p class="font-fun text-sm text-gray-400 text-center animate-pulse">
                  Point camera at QR code...
                </p>
              )}

              {!cameraActive && (
                <div class="space-y-3">
                  <button class="btn-candy-blue w-full" onClick={startCamera}>
                    📸 Scan with Camera
                  </button>

                  <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                      <div class="w-full border-t-2 border-dashed border-gray-200" />
                    </div>
                    <div class="relative flex justify-center">
                      <span class="px-3 bg-white font-fun text-sm text-gray-400">or</span>
                    </div>
                  </div>

                  <label class="btn-candy-purple w-full block text-center cursor-pointer">
                    🖼️ Upload QR Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      class="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}

              {cameraActive && (
                <button
                  class="btn-outline-fun border-red-300 text-red-400 w-full text-sm"
                  onClick={stopCamera}
                >
                  ✖ Stop Camera
                </button>
              )}

              {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}
            </div>
          )}

          {/* Step 3 (encrypted): Enter QR password */}
          {step === 3 && mode === 'encrypted' && !mnemonic && (
            <div class="space-y-4">
              <div class="text-center">
                <span class="text-4xl block mb-2">🔑</span>
                <h2 class="font-fun text-xl font-bold text-gradient-fun">
                  Enter QR Password
                </h2>
                <p class="font-body text-sm text-gray-500 mt-1">
                  This is the password used when the encrypted QR was created
                </p>
              </div>

              <div class="bg-green-50 rounded-bubble p-3 border-2 border-dashed border-green-300 text-center">
                <span class="font-fun text-sm text-green-600 font-bold">
                  ✅ QR code scanned successfully!
                </span>
              </div>

              <input
                type="password"
                class="input-fun text-center"
                placeholder="QR encryption password..."
                value={qrPassword}
                onInput={e => setQrPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDecryptQR()}
                autofocus
              />

              {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}

              <button
                class="btn-candy-purple w-full"
                onClick={handleDecryptQR}
                disabled={loading || !qrPassword}
              >
                {loading ? '🔄 Decrypting...' : '🔓 Decrypt QR Data'}
              </button>
            </div>
          )}

          {/* Final step: Set wallet password */}
          {passwordStepVisible && (
            <div class="space-y-4">
              <div class="text-center">
                <span class="text-4xl block mb-2">🔐</span>
                <h2 class="font-fun text-xl font-bold text-gradient-fun">
                  Set Wallet Password
                </h2>
                <p class="font-body text-sm text-gray-500 mt-1">
                  Encrypt your restored wallet on this device
                </p>
              </div>

              <div class="bg-green-50 rounded-bubble p-3 border-2 border-dashed border-green-300 text-center">
                <span class="font-fun text-sm text-green-600 font-bold">
                  ✅ Mnemonic recovered — {mnemonic.split(/\s+/).length} words
                </span>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">Password</label>
                  <input
                    type="password"
                    class="input-fun"
                    placeholder="At least 6 characters..."
                    value={walletPassword}
                    onInput={e => setWalletPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label class="font-fun text-sm font-semibold text-gray-600 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    class="input-fun"
                    placeholder="Type it again..."
                    value={confirmPassword}
                    onInput={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSetPassword()}
                  />
                </div>
              </div>

              {error && <p class="font-fun text-sm text-red-500 font-bold">{error}</p>}

              <button
                class="btn-candy-green w-full text-lg"
                onClick={handleSetPassword}
                disabled={loading}
              >
                {loading ? '🔄 Restoring...' : '🚀 Restore My Wallet!'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
