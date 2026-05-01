export function CoinIcon({ size = 'md' }) {
  const dims = {
    sm: { w: 24, h: 24, font: 15, dy: 1 },
    md: { w: 36, h: 36, font: 22, dy: 1 },
    lg: { w: 48, h: 48, font: 30, dy: 2 },
  }
  const d = dims[size]

  return (
    <svg
      width={d.w}
      height={d.h}
      viewBox="0 0 48 48"
      class="inline-block align-middle mx-0.5"
      style="transform: rotate(-8deg); filter: drop-shadow(2px 3px 4px rgba(200, 120, 0, 0.4))"
    >
      <defs>
        <radialGradient id={`coin-shine-${size}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#FFE08A" />
          <stop offset="40%" stop-color="#F7931A" />
          <stop offset="100%" stop-color="#C06A00" />
        </radialGradient>
        <radialGradient id={`coin-inner-${size}`} cx="40%" cy="35%" r="50%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.25)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* coin edge / rim */}
      <circle cx="24" cy="25" r="22" fill="#A05E00" />
      {/* coin body */}
      <circle cx="24" cy="24" r="22" fill={`url(#coin-shine-${size})`} />
      {/* inner rim */}
      <circle cx="24" cy="24" r="18" fill="none" stroke="#C07800" stroke-width="1.2" opacity="0.5" />
      {/* highlight gloss */}
      <circle cx="24" cy="24" r="22" fill={`url(#coin-inner-${size})`} />

      {/* ₿ symbol — embossed look with shadow + highlight */}
      <text
        x="24"
        y="32"
        text-anchor="middle"
        font-size="28"
        font-weight="900"
        font-family="'Fredoka', Arial, sans-serif"
        fill="#8B5A00"
      >
        ₿
      </text>
      <text
        x="24"
        y="31"
        text-anchor="middle"
        font-size="28"
        font-weight="900"
        font-family="'Fredoka', Arial, sans-serif"
        fill="#FFFFFF"
      >
        ₿
      </text>
      <text
        x="24"
        y="31.5"
        text-anchor="middle"
        font-size="28"
        font-weight="900"
        font-family="'Fredoka', Arial, sans-serif"
        fill="#FFF5D4"
        opacity="0.9"
      >
        ₿
      </text>
    </svg>
  )
}
