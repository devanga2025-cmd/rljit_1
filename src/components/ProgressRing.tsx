interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  label: string;
  color?: string;
}

const ProgressRing = ({ value, max, size = 80, label, color = "hsl(var(--primary))" }: ProgressRingProps) => {
  const pct = Math.min((value / max) * 100, 100);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="text-xs font-heading font-semibold text-card-foreground">{Math.round(pct)}%</span>
      <span className="text-[10px] text-muted-foreground text-center">{label}</span>
    </div>
  );
};

export default ProgressRing;
