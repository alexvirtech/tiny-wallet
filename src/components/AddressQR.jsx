import { useEffect, useRef } from 'preact/hooks'
import QRCode from 'qrcode'

export function AddressQR({ address, color = '#333333', size = 160 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!address || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, address, {
      width: size,
      margin: 2,
      color: { dark: color, light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(() => {})
  }, [address, color, size])

  if (!address) return null

  return (
    <canvas
      ref={canvasRef}
      class="rounded-bubble"
    />
  )
}
