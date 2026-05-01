import { toastMessage } from '../lib/state.js'

export function Toast() {
  const message = toastMessage.value
  if (!message) return null

  return (
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-pop">
      <div class="bg-gray-800 text-white font-fun px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
        <span>✨</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
