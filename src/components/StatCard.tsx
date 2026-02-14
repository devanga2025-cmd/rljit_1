import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

const StatCard = ({ icon: Icon, label, value, subtitle, color = "text-primary" }: StatCardProps) => (
  <div className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow animate-slide-up">
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg bg-muted ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-body text-muted-foreground">{label}</p>
        <p className="text-lg font-heading font-bold text-card-foreground truncate">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default StatCard;
