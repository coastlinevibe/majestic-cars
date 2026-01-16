import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
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
      <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
        <div className="bg-gradient-to-br from-card via-card to-secondary border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Download size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg">Install Majestic Cars</h3>
                  <p className="text-muted-foreground text-xs">Quick access to your dream car</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-lg"
                aria-label="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground">Browse cars offline</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Monitor size={16} className="text-primary" />
                </div>
                <span className="text-muted-foreground">Faster loading times</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleInstall}
                className="flex-1 font-semibold shadow-lg"
                size="lg"
              >
                <Download size={18} className="mr-2" />
                Install Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="lg"
                className="px-6"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show manual prompt as fallback
  if (showManualPrompt && !isInstalled) {
    return (
      <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
        <div className="bg-gradient-to-br from-card via-card to-secondary border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Download size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg">Add to Home Screen</h3>
                  <p className="text-muted-foreground text-xs">Install for quick access</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-lg"
                aria-label="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              Install Majestic Cars on your device for faster access and a better browsing experience.
            </p>

            <div className="bg-secondary/50 rounded-xl p-4 mb-5 border border-border">
              <p className="text-foreground font-semibold text-sm mb-2">How to install:</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>📱 <span className="font-medium">Android:</span> Tap menu (⋮) → "Install app"</p>
                <p>🍎 <span className="font-medium">iOS:</span> Tap Share → "Add to Home Screen"</p>
                <p>💻 <span className="font-medium">Desktop:</span> Click install icon in address bar</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
