import { useState, useEffect, forwardRef } from "react";
import { Download, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallAppButton = forwardRef<HTMLButtonElement>((_, ref) => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "To install this app:\n\n" +
        "📱 iPhone/iPad: Tap the Share button (⬆️) → 'Add to Home Screen'\n\n" +
        "📱 Android: Tap the menu (⋮) → 'Add to Home Screen' or 'Install App'"
      );
    }
  };

  if (isInstalled) return null;

  return (
    <button
      ref={ref}
      onClick={handleInstall}
      className="w-full max-w-sm flex items-center justify-center gap-3 bg-card border-2 border-primary/30 text-foreground rounded-2xl px-6 py-4 shadow-card hover:shadow-card-hover hover:border-primary/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
    >
      <Smartphone className="w-6 h-6 text-primary" />
      <span className="font-heading font-bold text-base">{t("install.app")}</span>
      <Download className="w-5 h-5 text-muted-foreground" />
    </button>
  );
});

InstallAppButton.displayName = "InstallAppButton";

export default InstallAppButton;
