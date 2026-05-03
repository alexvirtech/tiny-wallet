function CuteCoin({ symbol, bg, fg, x, y, size = 50, delay = '0s', rotate = 0 }) {
  return (
    <div
      class="absolute animate-float"
      style={`top:${y};left:${x};animation-delay:${delay};opacity:0.25;transform:rotate(${rotate}deg)`}
    >
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="19" fill={bg} />
        <circle cx="20" cy="20" r="16.5" fill={fg} />
        <text x="20" y="27.5" text-anchor="middle" font-size="22" font-weight="900" font-family="'Fredoka', Arial, sans-serif" fill={bg}>{symbol}</text>
      </svg>
    </div>
  )
}

export function Decorations() {
  return (
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Childish decorations — spread evenly in gaps */}
      <span class="absolute text-4xl top-[3%] left-[45%] animate-float" style="animation-delay: 0s; opacity: 0.15">⭐</span>
      <span class="absolute text-4xl top-[22%] right-[40%] animate-float" style="animation-delay: 0.5s; opacity: 0.15">🌟</span>
      <span class="absolute text-5xl top-[45%] left-[48%] animate-float" style="animation-delay: 2s; opacity: 0.2">🌈</span>
      <span class="absolute text-3xl top-[68%] right-[45%] animate-float" style="animation-delay: 1.3s; opacity: 0.15">🦋</span>
      <span class="absolute text-4xl top-[85%] left-[42%] animate-float" style="animation-delay: 0.3s; opacity: 0.15">🎀</span>
      <span class="absolute text-3xl top-[92%] right-[35%] animate-float" style="animation-delay: 1.5s; opacity: 0.15">✨</span>

      {/* Crypto coins — evenly distributed, alternating left/right */}
      <CuteCoin symbol="₿" bg="#F7931A" fg="#FEDE8D" x="82%" y="2%" size={58} delay="0.2s" rotate={10} />
      <CuteCoin symbol="Ξ" bg="#627EEA" fg="#B8C9F7" x="3%" y="14%" size={54} delay="1.1s" rotate={-8} />
      <CuteCoin symbol="◆" bg="#9945FF" fg="#D4B0FF" x="85%" y="26%" size={50} delay="0.6s" rotate={14} />
      <CuteCoin symbol="Ð" bg="#C2A633" fg="#F5E6A3" x="2%" y="38%" size={56} delay="1.8s" rotate={-10} />
      <CuteCoin symbol="◈" bg="#E84142" fg="#F7B4B4" x="84%" y="50%" size={52} delay="0.4s" rotate={16} />
      <CuteCoin symbol="Ł" bg="#345D9D" fg="#A8C4E8" x="3%" y="62%" size={48} delay="1.6s" rotate={-6} />
      <CuteCoin symbol="◇" bg="#F3BA2F" fg="#FBE5A0" x="83%" y="74%" size={54} delay="0.9s" rotate={12} />
      <CuteCoin symbol="₳" bg="#0033AD" fg="#99B3E6" x="4%" y="86%" size={46} delay="2.2s" rotate={-14} />

      <div class="absolute top-0 left-0 w-full h-2"
        style="background: linear-gradient(90deg, #FF6B9D, #FFD93D, #44E55A, #4DA6FF, #C44DFF, #FF6B9D)" />
    </div>
  )
}
