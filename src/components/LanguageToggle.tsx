import { forwardRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = forwardRef<HTMLDivElement>((_, ref) => {
  const { lang, setLang } = useLanguage();
  const langs = [
    { code: "en" as const, label: "EN" },
    { code: "kn" as const, label: "ಕನ್ನಡ" },
    { code: "hi" as const, label: "हिंदी" },
  ];

  return (
    <div ref={ref} className="flex gap-1 bg-card rounded-full p-1 shadow-card">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-heading font-semibold transition-all ${
            lang === l.code
              ? "gradient-mother text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
});

LanguageToggle.displayName = "LanguageToggle";

export default LanguageToggle;
