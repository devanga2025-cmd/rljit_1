import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import EmergencyButton from "@/components/EmergencyButton";
import InstallAppButton from "@/components/InstallAppButton";
import heroImage from "@/assets/hero-mother.jpg";
import appLogo from "@/assets/app-logo.jpeg";
import { Heart, Users, Building2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const roles = [
    { key: "role.mother", icon: Heart, path: "/mother/register", gradient: "gradient-mother", emoji: "🤰" },
    { key: "role.father", icon: Users, path: "/father/register", gradient: "gradient-father", emoji: "👨‍👩‍👧" },
    { key: "role.worker", icon: Building2, path: "/worker/register", gradient: "gradient-worker", emoji: "🏥" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 opacity-10">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
      </div>
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <img src={appLogo} alt="Care4Mom" className="w-9 h-9 rounded-full object-cover shadow-md" />
            <span className="font-heading font-bold text-lg text-foreground">{t("app.title")}</span>
          </div>
          <LanguageToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {/* Hero Image */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 mb-6 animate-float">
            <img src={appLogo} alt="Mother and baby care" className="w-full h-full object-cover rounded-3xl shadow-hero" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground text-center mb-2">
            {t("app.title")}
          </h1>
          <h2 className="text-lg font-heading font-semibold text-primary mb-2">{t("role.select")}</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-10 font-body">
            {t("app.tagline")}
          </p>

          {/* Role Buttons */}
          <div className="w-full max-w-sm space-y-4">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => navigate(role.path)}
                className={`w-full ${role.gradient} text-primary-foreground rounded-2xl px-6 py-5 flex items-center gap-4 shadow-hero hover:scale-[1.03] hover:shadow-card-hover active:scale-[0.98] transition-all duration-200`}
              >
                <span className="text-3xl">{role.emoji}</span>
                <span className="font-heading font-bold text-lg text-left flex-1">{t(role.key)}</span>
                <role.icon className="w-6 h-6 opacity-80" />
              </button>
            ))}

            {/* Install App Button */}
            <InstallAppButton />
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 px-4">
          <p className="text-xs text-muted-foreground font-body">
            © 2026 Care4Mom & Baby · Safe Motherhood Initiative
          </p>
        </footer>
      </div>

      <EmergencyButton />
    </div>
  );
};

export default Index;
