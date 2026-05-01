export function SecurityBadge() {
  return (
    <div class="badge-fun bg-green-100 text-green-700 border-2 border-dashed border-green-300">
      <span class="text-base">🔒</span>
      <span class="font-bold">Local wallet</span>
      <span>•</span>
      <span class="font-bold">encrypted</span>
      <span class="text-base">✨</span>
    </div>
  )
}

export function SecurityInfo() {
  return (
    <div class="flex flex-wrap gap-2 justify-center">
      <span class="badge-fun bg-green-50 text-green-600 border-2 border-dashed border-green-300">
        🏠 Local only
      </span>
      <span class="badge-fun bg-blue-50 text-blue-600 border-2 border-dashed border-blue-300">
        🔐 Encrypted
      </span>
      <span class="badge-fun bg-purple-50 text-purple-600 border-2 border-dashed border-purple-300">
        🚫 No servers
      </span>
      <span class="badge-fun bg-orange-50 text-orange-600 border-2 border-dashed border-orange-300">
        ✍️ Password signing
      </span>
    </div>
  )
}
