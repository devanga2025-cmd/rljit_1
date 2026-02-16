import { Phone, X, Activity, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";

const EmergencyButton = () => {
  const { t } = useLanguage();
  const { mothers } = useApp();
  const mother = mothers[0]; // Assuming current user is first mother for now
  const [showModal, setShowModal] = useState(false);

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="bg-card w-full max-w-md rounded-3xl p-6 shadow-hero border-2 border-destructive relative animate-in zoom-in-50">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="mx-auto bg-destructive/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Phone className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-heading font-black text-destructive mb-2">Emergency Assistance</h2>
            <p className="text-muted-foreground text-sm">Target health worker and ambulance have been notified.</p>
          </div>

          <a
            href="tel:108"
            className="w-full gradient-emergency text-primary-foreground text-xl font-heading font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-6 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Phone className="w-6 h-6" /> Call 108 Now
          </a>

          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Vital Information
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Blood Group</p>
                <p className={`text-lg font-heading font-bold ${mother.bloodGroup?.endsWith("-") ? "text-destructive" : "text-card-foreground"}`}>
                  {mother.bloodGroup || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pregnancy</p>
                <p className="text-lg font-heading font-bold text-card-foreground">Week {mother.pregnancyWeek}</p>
              </div>
            </div>

            {mother.medicalHistory?.conditions?.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">Medical Conditions</p>
                <div className="flex flex-wrap gap-1">
                  {mother.medicalHistory.conditions.map(c => (
                    <span key={c} className="bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded text-xs font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="w-full mt-4 bg-secondary/10 text-secondary hover:bg-secondary/20 py-3 rounded-xl font-heading font-bold text-sm flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Share Location with Health Worker
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowModal(true)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 gradient-emergency px-5 py-3 rounded-full shadow-hero text-primary-foreground font-heading font-bold text-lg animate-pulse-soft hover:scale-105 transition-transform"
    >
      <Phone className="w-5 h-5" />
      {t("emergency")}
    </button>
  );
};

export default EmergencyButton;
