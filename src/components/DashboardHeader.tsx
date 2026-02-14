import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import LanguageToggle from "./LanguageToggle";
import appLogo from "@/assets/app-logo.jpeg";

interface DashboardHeaderProps {
  title: string;
  gradient: string;
}

const DashboardHeader = ({ title, gradient }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { notifications } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className={`${gradient} px-4 py-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={appLogo} alt="Care4Mom" className="w-8 h-8 rounded-full object-cover border-2 border-primary-foreground/30" />
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-primary-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-primary-foreground/80" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
