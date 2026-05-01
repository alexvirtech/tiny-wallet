export function Warning({ title, message, type = 'warning', onConfirm, onCancel, confirmText = 'I understand', cancelText = 'Cancel' }) {
  const styles = {
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      icon: '⚠️',
      btnClass: 'btn-candy-orange',
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      icon: '🚨',
      btnClass: 'btn-candy-pink',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      icon: '💡',
      btnClass: 'btn-candy-blue',
    },
  }

  const s = styles[type] || styles.warning

  return (
    <div class={`${s.bg} border-2 border-dashed ${s.border} rounded-bubble p-5 animate-pop`}>
      <div class="flex items-start gap-3">
        <span class="text-2xl flex-shrink-0">{s.icon}</span>
        <div class="flex-1">
          {title && <h4 class="font-fun font-semibold text-lg mb-1">{title}</h4>}
          <p class="font-body text-sm text-gray-600 leading-relaxed">{message}</p>
          {(onConfirm || onCancel) && (
            <div class="flex gap-3 mt-4">
              {onConfirm && (
                <button class={`${s.btnClass} text-sm`} onClick={onConfirm}>
                  {confirmText}
                </button>
              )}
              {onCancel && (
                <button class="btn-outline-fun border-gray-300 text-gray-500 text-sm" onClick={onCancel}>
                  {cancelText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
