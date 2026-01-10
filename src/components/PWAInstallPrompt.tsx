import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('App installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show manual prompt after 5 seconds if no native prompt
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        console.log('Showing manual install prompt');
        setShowManualPrompt(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManualPrompt(false);
  };

  // Show native prompt if available
  if (showPrompt && deferredPrompt && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-slide-up">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Download size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-sm md:text-base">Install App</h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  Install Majestic Cars on your device for quick access and offline browsing.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="flex-1"
            >
              <Download size={16} className="mr-2" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show manual prompt as fallback
  if (showManualPrompt && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-slide-up">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Download size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-sm md:text-base">Get App</h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  Add Majestic Cars to your home screen for quick access.
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                alert('To install:\n\n📱 Android: Tap menu (⋮) → "Install app"\n\n🍎 iOS: Tap Share → "Add to Home Screen"\n\n💻 Desktop: Click install icon in address bar');
                handleDismiss();
              }}
              size="sm"
              className="flex-1"
            >
              <Download size={16} className="mr-2" />
              How to Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
