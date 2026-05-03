function CryptoLogo({ type, x, y, size = 48, delay = '0s', rotate = 0 }) {
  const logos = {
    btc: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#F7931A" />
        <path d="M27.1 17.6c.4-2.5-1.5-3.8-4.2-4.7l.9-3.5-2.1-.5-.8 3.4c-.6-.1-1.1-.3-1.7-.4l.8-3.4-2.1-.5-.9 3.5c-.5-.1-.9-.2-1.4-.3l-2.9-.7-.6 2.2s1.5.4 1.5.4c.9.2 1 .7 1 1.2l-1 4c.1 0 .1 0 .2.1h-.2l-1.4 5.6c-.1.3-.4.7-1 .5 0 0-1.5-.4-1.5-.4l-1 2.4 2.7.7c.5.1 1 .3 1.5.4l-.9 3.6 2.1.5.9-3.5c.6.2 1.1.3 1.7.4l-.9 3.5 2.1.5.9-3.5c3.7.7 6.5.4 7.7-2.9.9-2.7 0-4.2-2-5.2 1.4-.3 2.5-1.3 2.8-3.2zm-5 7c-.7 2.7-5.2 1.2-6.7.9l1.2-4.8c1.5.4 6.2 1.1 5.5 3.9zm.7-7.1c-.6 2.4-4.4 1.2-5.6.9l1.1-4.3c1.2.3 5.2.9 4.5 3.4z" fill="white" />
      </svg>
    ),
    eth: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <path d="M20 3 L7 21 L20 28 L33 21Z" fill="#627EEA" />
        <path d="M7 21 L20 28 L20 3Z" fill="#627EEA" opacity="0.8" />
        <path d="M33 21 L20 28 L20 3Z" fill="#8C9EF0" />
        <path d="M20 37 L7 23.5 L20 30.5 L33 23.5Z" fill="#627EEA" />
        <path d="M7 23.5 L20 30.5 L20 37Z" fill="#627EEA" opacity="0.8" />
        <path d="M33 23.5 L20 30.5 L20 37Z" fill="#8C9EF0" />
      </svg>
    ),
    sol: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#9945FF" />
          <stop offset="100%" stop-color="#14F195" />
        </linearGradient>
        <path d="M6 28.5 h24 l4-4 h-24z M6 20 h24 l4 4 h-24z M6 11.5 h24 l4-4 h-24z" fill="url(#sg)" />
      </svg>
    ),
    doge: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#C2A633" />
        <text x="20" y="28" text-anchor="middle" font-size="26" font-weight="900" font-family="'Fredoka', Arial, sans-serif" fill="white">Ð</text>
      </svg>
    ),
    avax: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#E84142" />
        <path d="M13 28 L20 10 L23.5 18 L19 18 L16.5 23 L25 23 L27 28Z" fill="white" />
      </svg>
    ),
    ltc: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#345D9D" />
        <text x="20" y="28" text-anchor="middle" font-size="28" font-weight="900" font-family="'Fredoka', Arial, sans-serif" fill="white">Ł</text>
      </svg>
    ),
    bnb: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect x="8.6" y="8.6" width="22.8" height="22.8" rx="2" fill="#F3BA2F" transform="rotate(45 20 20)" />
        <rect x="15" y="15" width="10" height="10" rx="1" fill="white" transform="rotate(45 20 20)" />
      </svg>
    ),
    ada: (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="20" fill="#0033AD" />
        <circle cx="20" cy="20" r="4" fill="white" />
        <circle cx="20" cy="10" r="2.5" fill="white" />
        <circle cx="20" cy="30" r="2.5" fill="white" />
        <circle cx="11.3" cy="15" r="2.5" fill="white" />
        <circle cx="28.7" cy="15" r="2.5" fill="white" />
        <circle cx="11.3" cy="25" r="2.5" fill="white" />
        <circle cx="28.7" cy="25" r="2.5" fill="white" />
      </svg>
    ),
  }

  return (
    <div
      class="absolute animate-float"
      style={`top:${y};left:${x};animation-delay:${delay};opacity:0.2;transform:rotate(${rotate}deg)`}
    >
      {logos[type]}
    </div>
  )
}

export function Decorations() {
  return (
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Childish emojis scattered in between */}
      <span class="absolute text-4xl top-[8%] left-[50%] animate-float" style="animation-delay: 0s; opacity: 0.15">⭐</span>
      <span class="absolute text-5xl top-[35%] left-[45%] animate-float" style="animation-delay: 2s; opacity: 0.2">🌈</span>
      <span class="absolute text-3xl top-[58%] left-[50%] animate-float" style="animation-delay: 1.3s; opacity: 0.15">🦋</span>
      <span class="absolute text-4xl top-[82%] left-[48%] animate-float" style="animation-delay: 0.3s; opacity: 0.15">🎀</span>
      <span class="absolute text-3xl top-[20%] left-[30%] animate-float" style="animation-delay: 1.5s; opacity: 0.15">✨</span>
      <span class="absolute text-4xl top-[70%] left-[65%] animate-float" style="animation-delay: 0.5s; opacity: 0.15">🌟</span>

      {/* Crypto logos — scattered across full page */}
      <CryptoLogo type="btc" x="8%" y="3%" size={52} delay="0.2s" rotate={10} />
      <CryptoLogo type="eth" x="72%" y="10%" size={46} delay="1.1s" rotate={-8} />
      <CryptoLogo type="sol" x="20%" y="25%" size={50} delay="0.6s" rotate={5} />
      <CryptoLogo type="doge" x="75%" y="33%" size={48} delay="1.8s" rotate={-12} />
      <CryptoLogo type="avax" x="5%" y="48%" size={44} delay="0.4s" rotate={14} />
      <CryptoLogo type="bnb" x="68%" y="55%" size={50} delay="1.6s" rotate={-6} />
      <CryptoLogo type="ltc" x="15%" y="70%" size={46} delay="0.9s" rotate={8} />
      <CryptoLogo type="ada" x="78%" y="80%" size={42} delay="2.2s" rotate={-10} />

      <div class="absolute top-0 left-0 w-full h-2"
        style="background: linear-gradient(90deg, #FF6B9D, #FFD93D, #44E55A, #4DA6FF, #C44DFF, #FF6B9D)" />
    </div>
  )
}
