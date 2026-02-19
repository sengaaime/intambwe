import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-forest-900 text-white p-4 rounded-xl shadow-2xl z-50 border border-forest-700 flex items-center gap-4"
        >
          <div className="p-2 bg-forest-800 rounded-lg">
            <Download size={24} className="text-forest-300" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">Install Intambwe</h3>
            <p className="text-xs text-forest-300">Add to home screen for quick access</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="p-2 hover:bg-forest-800 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-forest-500 hover:bg-forest-400 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
