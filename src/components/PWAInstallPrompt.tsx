
interface PWAInstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

/**
 * Banner component to prompt PWA installation
 */
export function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t-4 border-blue-600 p-4 shadow-2xl z-40 animate-slide-up">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white mb-1">
            Install Minesweeper
          </h3>
          <p className="text-sm text-gray-300">
            Install this app for offline play and quick access
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onInstall}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            Install
          </button>

          <button
            onClick={onDismiss}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
