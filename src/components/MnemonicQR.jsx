import { useEffect, useRef } from 'preact/hooks'
import QRCode from 'qrcode'

export function MnemonicQR({ mnemonic }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!mnemonic || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, mnemonic, {
      width: 200,
      margin: 2,
      color: { dark: '#333333', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(() => {})
  }, [mnemonic])

  if (!mnemonic) return null

  return (
    <div class="flex flex-col items-center gap-2 py-3">
      <canvas
        ref={canvasRef}
        class="rounded-bubble border-3 border-dashed border-candy-purple/20"
      />
      <p class="font-fun text-xs text-gray-400">
        Scan to back up your phrase
      </p>
    </div>
  )
}
