
interface PWAUpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

/**
 * Notification component to alert users of available updates
 */
export function PWAUpdateNotification({ onUpdate, onDismiss }: PWAUpdateNotificationProps) {
  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-2xl z-50 max-w-sm animate-slide-down">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <div className="flex-1">
          <h4 className="font-bold mb-1">Update Available</h4>
          <p className="text-sm text-blue-100 mb-3">
            A new version is ready to install
          </p>

          <div className="flex gap-2">
            <button
              onClick={onUpdate}
              className="px-4 py-1.5 bg-white text-blue-600 font-semibold rounded hover:bg-blue-50 transition-colors text-sm"
            >
              Update Now
            </button>

            <button
              onClick={onDismiss}
              className="px-4 py-1.5 bg-blue-700 text-white font-semibold rounded hover:bg-blue-800 transition-colors text-sm"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
