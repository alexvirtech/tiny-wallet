export function Modal({ title, children, onClose }) {
  return (
    <div class="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        class="relative bg-white rounded-blob p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto
               shadow-2xl border-3 border-dashed border-candy-purple/30 animate-pop"
        onClick={e => e.stopPropagation()}
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-fun text-xl font-bold text-gradient-fun">{title}</h3>
          <button
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                   hover:bg-red-100 hover:text-red-500 transition-colors font-fun text-lg"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
