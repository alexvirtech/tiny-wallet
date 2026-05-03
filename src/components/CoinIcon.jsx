export function CoinIcon({ size = 'md' }) {
  const dims = {
    sm: { w: 24, h: 24 },
    md: { w: 36, h: 36 },
    lg: { w: 48, h: 48 },
  }
  const d = dims[size]

  return (
    <svg
      width={d.w}
      height={d.h}
      viewBox="0 0 64 64"
      class="inline-block align-middle mx-0.5"
      style="filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.2))"
    >
      {/* Dollar coin (back) */}
      <circle cx="34" cy="18" r="14" fill="#4E7A25" />
      <circle cx="34" cy="18" r="10.5" fill="#7BB44A" />
      <text x="34" y="23" text-anchor="middle" font-size="15" font-weight="800" font-family="'Fredoka', Arial, sans-serif" fill="#4E7A25">$</text>

      {/* Bitcoin coin (middle) */}
      <circle cx="20" cy="36" r="16" fill="#D4A44A" />
      <circle cx="20" cy="36" r="12" fill="#F2CC6B" />
      <text x="20" y="41.5" text-anchor="middle" font-size="16" font-weight="900" font-family="'Fredoka', Arial, sans-serif" fill="#D4A44A">₿</text>

      {/* Ethereum coin (front) */}
      <circle cx="44" cy="38" r="15" fill="#4CAFE0" />
      <circle cx="44" cy="38" r="11" fill="#B8E0F7" />
      <path
        d="M44 28 l-7 10.5 7 4 7-4Z M44 48 l-7-7.5 7 4 7-4Z"
        fill="#4CAFE0"
        fill-rule="evenodd"
      />
    </svg>
  )
}
