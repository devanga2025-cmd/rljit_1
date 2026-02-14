import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmergencyButton = () => {
  const { t } = useLanguage();
  return (
    <a
      href="tel:108"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 gradient-emergency px-5 py-3 rounded-full shadow-hero text-primary-foreground font-heading font-bold text-lg animate-pulse-soft hover:scale-105 transition-transform"
    >
      <Phone className="w-5 h-5" />
      {t("emergency")}
    </a>
  );
};

export default EmergencyButton;
