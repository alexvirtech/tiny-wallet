function CuteCoin({ symbol, bg, fg, x, y, size = 50, delay = '0s', rotate = 0 }) {
  return (
    <div
      class="absolute animate-float"
      style={`top:${y};left:${x};animation-delay:${delay};opacity:0.25;transform:rotate(${rotate}deg)`}
    >
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="19" fill={bg} />
        <circle cx="20" cy="20" r="14" fill={fg} />
        <text x="20" y="26" text-anchor="middle" font-size="16" font-weight="800" font-family="'Fredoka', Arial, sans-serif" fill={bg}>{symbol}</text>
      </svg>
    </div>
  )
}

export function Decorations() {
  return (
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <span class="absolute text-5xl top-[5%] left-[8%] animate-float" style="animation-delay: 0s; opacity: 0.15">⭐</span>
      <span class="absolute text-4xl top-[15%] right-[12%] animate-float" style="animation-delay: 0.5s; opacity: 0.15">🌟</span>
      <span class="absolute text-3xl bottom-[10%] right-[8%] animate-float" style="animation-delay: 1.5s; opacity: 0.15">✨</span>
      <span class="absolute text-5xl top-[40%] left-[3%] animate-float" style="animation-delay: 2s; opacity: 0.2">🌈</span>
      <span class="absolute text-3xl top-[80%] left-[15%] animate-float" style="animation-delay: 1.3s; opacity: 0.15">🦋</span>
      <span class="absolute text-4xl top-[25%] left-[85%] animate-float" style="animation-delay: 0.3s; opacity: 0.15">🎀</span>

      <CuteCoin symbol="₿" bg="#F7931A" fg="#FEDE8D" x="85%" y="4%" size={56} delay="0.2s" rotate={12} />
      <CuteCoin symbol="Ξ" bg="#627EEA" fg="#B8C9F7" x="4%" y="16%" size={48} delay="1.1s" rotate={-8} />
      <CuteCoin symbol="◆" bg="#9945FF" fg="#D4B0FF" x="90%" y="30%" size={40} delay="0.6s" rotate={15} />
      <CuteCoin symbol="Ð" bg="#C2A633" fg="#F5E6A3" x="2%" y="50%" size={52} delay="1.8s" rotate={-12} />
      <CuteCoin symbol="◈" bg="#E84142" fg="#F7B4B4" x="88%" y="55%" size={44} delay="0.4s" rotate={20} />
      <CuteCoin symbol="$" bg="#4E7A25" fg="#B5D99C" x="6%" y="75%" size={46} delay="1.6s" rotate={-5} />
      <CuteCoin symbol="₿" bg="#F3BA2F" fg="#FBE5A0" x="82%" y="78%" size={38} delay="0.9s" rotate={10} />
      <CuteCoin symbol="Ξ" bg="#28A0F0" fg="#A8DAF7" x="12%" y="38%" size={36} delay="2.2s" rotate={-18} />

      <div class="absolute top-0 left-0 w-full h-2"
        style="background: linear-gradient(90deg, #FF6B9D, #FFD93D, #44E55A, #4DA6FF, #C44DFF, #FF6B9D)" />
    </div>
  )
}
