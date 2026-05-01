export function CoinIcon({ size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-base',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-3xl',
  }

  return (
    <span
      class={`${sizes[size]} inline-flex items-center justify-center rounded-full
              font-fun rotate-[-8deg] align-middle mx-0.5
              border-2 border-amber-600`}
      style={{
        background: 'linear-gradient(145deg, #FFE566, #FFD93D, #F5A623)',
        boxShadow: '0 2px 6px rgba(245, 166, 35, 0.4), inset 0 1px 2px rgba(255,255,255,0.5)',
        color: '#7C4D0A',
        fontWeight: 900,
        WebkitTextStroke: '0.5px #7C4D0A',
        lineHeight: 1,
      }}
    >
      ₿
    </span>
  )
}
