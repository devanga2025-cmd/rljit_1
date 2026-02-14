import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import DashboardHeader from "@/components/DashboardHeader";
import EmergencyButton from "@/components/EmergencyButton";
import StatCard from "@/components/StatCard";
import ProgressRing from "@/components/ProgressRing";
import {
  Baby, Calendar, AlertTriangle, Heart, Droplets, Apple,
  Shield, Phone, Users, ChevronRight, CheckCircle2, Circle, Pill,
  Plus, Scale, TrendingUp, UserPlus, Send, Download, Film, Dumbbell, Star
} from "lucide-react";
import { toast } from "sonner";
import mcpCardImage from "@/assets/mcp-taayi-card.jpeg";

const MotherDashboard = () => {
  const { t } = useLanguage();
  const {
    mothers, updateMotherWeight, markIFATaken, reportSymptoms,
    addFamilyMember, checkSchemeEligibility, addNotification
  } = useApp();
  const mother = mothers[0];
  const [activeTab, setActiveTab] = useState("dashboard");
  const [waterGlasses, setWaterGlasses] = useState(mother.waterIntake);
  const [foodChecked, setFoodChecked] = useState<string[]>(mother.foodChecklist);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [newWeight, setNewWeight] = useState(mother.weight.toString());
  const [showWeightTrend, setShowWeightTrend] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [familyForm, setFamilyForm] = useState({ name: "", relation: "", phone: "" });
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<{ pmmvy: boolean; jsy: boolean; nutrition: boolean } | null>(null);
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});
  const [birthChecklist, setBirthChecklist] = useState<{ [key: string]: boolean }>(mother.birthPreparedness || {});

  const tabs = [
    { id: "dashboard", label: t("dashboard"), icon: Heart },
    { id: "mcp", label: t("mcp.card"), icon: Pill },
    { id: "nutrition", label: t("nutrition"), icon: Apple },
    { id: "danger", label: t("danger.signs"), icon: AlertTriangle },
    { id: "schemes", label: t("schemes"), icon: Shield },
    { id: "family", label: t("family.support"), icon: Users },
  ];

  const dangerSymptoms = [
    "Severe headache", "Blurred vision", "Severe abdominal pain",
    "Vaginal bleeding", "Swelling of face/hands", "Reduced fetal movement",
    "High fever", "Convulsions", "Water breaking early",
  ];

  const foodItems = [
    { name: "Iron-rich foods (spinach, dates)", icon: "🥬" },
    { name: "Milk & dairy (2 glasses)", icon: "🥛" },
    { name: "Protein (dal, eggs, nuts)", icon: "🥚" },
    { name: "Fruits (2 servings)", icon: "🍎" },
    { name: "Green vegetables", icon: "🥦" },
    { name: "Whole grains (roti/rice)", icon: "🍚" },
  ];

  const getUrgencyLevel = () => {
    const hasCritical = selectedSymptoms.some(s => ["Vaginal bleeding", "Convulsions", "Water breaking early"].includes(s));
    if (hasCritical || selectedSymptoms.length >= 3) return { level: "CRITICAL", color: "bg-destructive text-destructive-foreground" };
    if (selectedSymptoms.length >= 1) return { level: "WARNING", color: "bg-accent text-accent-foreground" };
    return { level: "NORMAL", color: "bg-secondary text-secondary-foreground" };
  };

  const babyDevelopment = [
    "Your baby is about 37cm long and weighs ~1kg",
    "Baby can open and close eyes",
    "Brain is developing rapidly",
    "Baby responds to sound and light",
  ];

  const handleUpdateWeight = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w < 30 || w > 150) {
      toast.error("Please enter a valid weight (30-150 kg)");
      return;
    }
    updateMotherWeight(0, w);
    setShowWeightTrend(true);
  };

  const handleMarkIFA = () => {
    markIFATaken(0);
  };

  const handleReportSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }
    reportSymptoms(0, selectedSymptoms);
    toast.success("Symptoms reported and health worker notified");
  };

  const handleAddFamily = () => {
    if (!familyForm.name || !familyForm.relation || !familyForm.phone) {
      toast.error("Please fill all family member details");
      return;
    }
    addFamilyMember(0, familyForm);
    setFamilyForm({ name: "", relation: "", phone: "" });
    setShowFamilyForm(false);
  };

  const handleCheckEligibility = () => {
    const result = checkSchemeEligibility(0);
    setEligibilityResult(result);
    setShowEligibility(true);
  };

  const handleNotifyAnganwadi = () => {
    addNotification({
      message: `📩 ${mother.name} is requesting Anganwadi assistance`,
      type: "warning",
      targetRole: "worker"
    });
    toast.success("Anganwadi has been notified!");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title={`🤰 ${t("dashboard")} - ${localStorage.getItem("motherName") || mother.name}`} gradient="gradient-mother" />

      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "gradient-mother text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 pb-24">
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Baby} label={t("pregnancy.week")} value={`Week ${mother.pregnancyWeek}`} subtitle="of 40 weeks" />
              <StatCard icon={Calendar} label={t("due.date")} value={mother.dueDate} color="text-secondary" />
              <StatCard icon={AlertTriangle} label={t("risk.status")} value={t(mother.riskLevel)} color={mother.riskLevel === "high" ? "text-destructive" : mother.riskLevel === "medium" ? "text-accent" : "text-secondary"} />
              <StatCard icon={Calendar} label={t("next.anc")} value={mother.nextANC} color="text-primary" />
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Pregnancy Progress</h3>
              <div className="w-full bg-muted rounded-full h-4 mb-2">
                <div className="gradient-mother h-4 rounded-full transition-all duration-700" style={{ width: `${(mother.pregnancyWeek / 40) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{mother.pregnancyWeek} of 40 weeks completed ({Math.round((mother.pregnancyWeek / 40) * 100)}%)</p>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Baby className="w-5 h-5 text-primary" /> Baby Development This Week
              </h3>
              <ul className="space-y-2">
                {babyDevelopment.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">Today's Checklist</h3>
              {["Take IFA tablet", "Drink 8 glasses water", "Eat iron-rich food", "30 min walk", "Count baby kicks"].map((item, i) => (
                <label key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary rounded"
                    checked={checklist[item] || false}
                    onChange={(e) => {
                      setChecklist(prev => ({ ...prev, [item]: e.target.checked }));
                      if (item === "Take IFA tablet" && e.target.checked) handleMarkIFA();
                    }}
                  />
                  <span className={`text-sm ${checklist[item] ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{item}</span>
                </label>
              ))}
              <div className="mt-3 bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">{Object.values(checklist).filter(Boolean).length}/5 tasks done today</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mcp" && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">{t("mcp.card")}</h3>

              {/* Update Weight */}
              <div className="mb-4 p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <label className="text-sm font-heading font-semibold text-card-foreground">Update Weight</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="flex-1 px-3 py-2 bg-card rounded-lg text-sm font-heading font-semibold text-card-foreground border border-border focus:ring-2 focus:ring-primary"
                    step="0.1"
                  />
                  <button onClick={handleUpdateWeight} className="gradient-mother text-primary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm">
                    Save
                  </button>
                </div>
              </div>

              {/* Weight Trend */}
              {showWeightTrend && mother.weightHistory.length > 0 && (
                <div className="mb-4 p-4 bg-secondary/10 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-heading font-semibold text-card-foreground">Weight Trend</span>
                  </div>
                  <div className="flex items-end gap-1 h-20">
                    {mother.weightHistory.map((w, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{w.weight}</span>
                        <div className="w-full bg-secondary rounded-t" style={{ height: `${((w.weight - 45) / 30) * 100}%`, minHeight: "8px" }} />
                        <span className="text-[8px] text-muted-foreground">{w.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mark IFA */}
              <div className="mb-4 p-4 bg-muted rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-heading font-semibold text-card-foreground">IFA Tablets: {mother.ifaTablets}/180</p>
                    <p className="text-xs text-muted-foreground">Compliance: {Math.round((mother.ifaTablets / 180) * 100)}%</p>
                    {mother.ifaMissedDays >= 3 && (
                      <p className="text-xs text-destructive font-bold mt-1">⚠️ Missed {mother.ifaMissedDays} days!</p>
                    )}
                  </div>
                  <button onClick={handleMarkIFA} className="gradient-mother text-primary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm flex items-center gap-1">
                    <Pill className="w-4 h-4" /> Mark IFA Taken
                  </button>
                </div>
                <div className="w-full bg-border rounded-full h-2 mt-2">
                  <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${(mother.ifaTablets / 180) * 100}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Blood Pressure</label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-heading font-semibold text-card-foreground">{mother.bp}</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Hemoglobin (g/dL)</label>
                  <div className={`mt-1 px-3 py-2 rounded-lg text-sm font-heading font-semibold ${mother.hemoglobin < 10 ? "bg-destructive/10 text-destructive" : "bg-muted text-card-foreground"}`}>
                    {mother.hemoglobin}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">TT Vaccine</label>
                  <div className={`mt-1 px-3 py-2 rounded-lg text-sm font-heading font-semibold ${mother.ttVaccine ? "bg-secondary/20 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                    {mother.ttVaccine ? "✅ Complete" : "❌ Pending"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">ANC Visits</label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-heading font-semibold text-card-foreground">
                    {mother.ancVisits} / 4
                    {mother.ancVisits < Math.floor(mother.pregnancyWeek / 10) && (
                      <span className="text-destructive text-xs ml-1">⚠️ Overdue</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Health Progress</h3>
              <div className="flex justify-around flex-wrap gap-4">
                <ProgressRing value={mother.ifaTablets} max={180} label="IFA Tablets" color="hsl(var(--primary))" />
                <ProgressRing value={mother.ancVisits} max={4} label="ANC Visits" color="hsl(var(--secondary))" />
                <ProgressRing value={mother.hemoglobin} max={14} label="Hemoglobin" color={mother.hemoglobin < 10 ? "hsl(var(--destructive))" : "hsl(var(--secondary))"} />
                <ProgressRing value={mother.pregnancyWeek} max={40} label="Pregnancy" color="hsl(var(--accent))" />
              </div>
            </div>

            {/* MCP Taayi Card - Downloadable */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-secondary/30">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                📋 MCP (Taayi) Card
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Download your Mother & Child Protection Card and carry it to your Anganwadi or hospital visit.</p>
              <div className="rounded-xl overflow-hidden border border-border mb-3">
                <img src={mcpCardImage} alt="MCP Taayi Card" className="w-full h-auto" />
              </div>
              <a
                href={mcpCardImage}
                download="MCP-Taayi-Card.jpeg"
                className="w-full gradient-mother text-primary-foreground rounded-xl px-4 py-3 font-heading font-bold text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download MCP Card
              </a>
            </div>
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-secondary" /> Water Intake
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterGlasses(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                      i < waterGlasses ? "bg-secondary text-secondary-foreground scale-110" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    💧
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{waterGlasses}/8 glasses today</p>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">Daily Food Checklist</h3>
              {foodItems.map((item) => (
                <label key={item.name} className="flex items-center gap-3 py-3 border-b border-border last:border-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={foodChecked.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) setFoodChecked([...foodChecked, item.name]);
                      else setFoodChecked(foodChecked.filter(f => f !== item.name));
                    }}
                    className="w-5 h-5 accent-primary rounded"
                  />
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-card-foreground">{item.name}</span>
                </label>
              ))}
              <div className="mt-3 bg-muted rounded-lg p-3">
                <p className="text-xs font-heading font-semibold text-muted-foreground">Iron Score</p>
                <div className="w-full bg-border rounded-full h-2 mt-1">
                  <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${(foodChecked.length / foodItems.length) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{foodChecked.length}/{foodItems.length} items completed</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-secondary" /> Best Exercises During Pregnancy
              </h3>
              {[
                { name: "Walking (30 min daily)", desc: "Best cardio – improves circulation, reduces swelling", icon: "🚶‍♀️" },
                { name: "Pelvic Floor (Kegel) Exercises", desc: "Strengthens pelvic muscles for easier delivery", icon: "💪" },
                { name: "Prenatal Yoga", desc: "Reduces stress, improves flexibility & breathing", icon: "🧘‍♀️" },
                { name: "Swimming", desc: "Zero-impact exercise, relieves back pain", icon: "🏊‍♀️" },
                { name: "Deep Breathing (Pranayama)", desc: "Calms the mind, prepares for labor breathing", icon: "🌬️" },
                { name: "Cat-Cow Stretch", desc: "Eases back pain, improves spinal flexibility", icon: "🐱" },
                { name: "Squats (supported)", desc: "Prepares body for natural delivery position", icon: "🦵" },
              ].map((ex, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <span className="text-xl">{ex.icon}</span>
                  <div>
                    <p className="text-sm font-heading font-semibold text-card-foreground">{ex.name}</p>
                    <p className="text-xs text-muted-foreground">{ex.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Movie Suggestions */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Film className="w-5 h-5 text-primary" /> 🎬 Feel-Good Movies for You
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Relaxing & inspiring movies to enjoy during pregnancy</p>
              {[
                { name: "English Vinglish", lang: "Hindi", desc: "A heartwarming story about self-discovery and confidence", rating: "⭐ 4.5" },
                { name: "Mimi", lang: "Hindi", desc: "A beautiful journey of surrogacy and motherhood", rating: "⭐ 4.2" },
                { name: "Good Newwz", lang: "Hindi", desc: "Comedy-drama about parenthood & IVF – laugh therapy!", rating: "⭐ 4.0" },
                { name: "Secret Superstar", lang: "Hindi", desc: "Inspiring story of a mother's sacrifice & dreams", rating: "⭐ 4.6" },
                { name: "Tumhari Sulu", lang: "Hindi", desc: "Feel-good film about a housewife finding her passion", rating: "⭐ 4.1" },
                { name: "Nil Battey Sannata", lang: "Hindi", desc: "A mother's determination for her child's future", rating: "⭐ 4.3" },
              ].map((movie, i) => (
                <div key={i} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎥</span>
                    <div>
                      <p className="text-sm font-heading font-semibold text-card-foreground">{movie.name}</p>
                      <p className="text-[10px] text-primary font-bold">{movie.lang}</p>
                      <p className="text-xs text-muted-foreground">{movie.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-heading font-bold text-accent whitespace-nowrap">{movie.rating}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">{t("danger.signs")}</h3>
              <p className="text-sm text-muted-foreground mb-4">Select any symptoms you are experiencing:</p>
              <div className="space-y-2">
                {dangerSymptoms.map((symptom) => (
                  <label key={symptom} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedSymptoms.includes(symptom) ? "bg-destructive/10 border border-destructive" : "bg-muted border border-transparent"
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedSymptoms([...selectedSymptoms, symptom]);
                        else setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                      }}
                      className="w-4 h-4 accent-destructive"
                    />
                    <span className="text-sm text-card-foreground">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedSymptoms.length > 0 && (
              <div className={`rounded-2xl p-5 shadow-card ${getUrgencyLevel().color}`}>
                <h3 className="font-heading font-bold text-lg mb-2">⚠️ Urgency: {getUrgencyLevel().level}</h3>
                <p className="text-sm mb-4">
                  {getUrgencyLevel().level === "CRITICAL"
                    ? "Please call emergency services immediately!"
                    : "Contact your health worker or visit the nearest health center."}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <a href="tel:108" className="flex items-center gap-2 gradient-emergency text-primary-foreground px-4 py-2 rounded-xl font-heading font-bold text-sm">
                    <Phone className="w-4 h-4" /> Call 108
                  </a>
                  <button onClick={handleNotifyAnganwadi} className="bg-card/20 backdrop-blur px-4 py-2 rounded-xl font-heading font-bold text-sm">
                    Notify Anganwadi
                  </button>
                  <button onClick={handleReportSymptoms} className="bg-card/30 backdrop-blur px-4 py-2 rounded-xl font-heading font-bold text-sm flex items-center gap-1">
                    <Send className="w-3 h-3" /> Report Symptoms
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schemes" && (
          <div className="space-y-4 animate-slide-up">
            <button onClick={handleCheckEligibility} className="w-full gradient-mother text-primary-foreground rounded-xl px-4 py-3 font-heading font-bold text-sm flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Check Scheme Eligibility
            </button>

            {showEligibility && eligibilityResult && (
              <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20 animate-slide-up">
                <h3 className="font-heading font-bold text-card-foreground mb-3">Eligibility Results</h3>
                {[
                  { name: "PMMVY", eligible: eligibilityResult.pmmvy, desc: "₹5,000 in 3 installments" },
                  { name: "JSY", eligible: eligibilityResult.jsy, desc: "₹1,400 for institutional delivery" },
                  { name: "Nutrition Support", eligible: eligibilityResult.nutrition, desc: "Monthly nutrition ration" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-heading font-semibold text-card-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.eligible ? "bg-secondary/20 text-secondary" : "bg-destructive/20 text-destructive"}`}>
                      {s.eligible ? "✅ Eligible" : "❌ Not Eligible"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {[
              { name: "PMMVY (Pradhan Mantri Matru Vandana Yojana)", status: mother.schemeStatus.pmmvy, amount: "₹5,000", installments: 3, current: 2 },
              { name: "JSY (Janani Suraksha Yojana)", status: mother.schemeStatus.jsy, amount: "₹1,400", installments: 1, current: 0 },
              { name: "Nutrition Support Program", status: mother.schemeStatus.nutrition, amount: "Monthly ration", installments: 9, current: 5 },
            ].map((scheme, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-card-foreground">{scheme.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Benefit: {scheme.amount}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-heading font-bold ${
                    scheme.status === "Active" || scheme.status === "Eligible" ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"
                  }`}>
                    {scheme.status}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${(scheme.current / scheme.installments) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{scheme.current}/{scheme.installments} installments received</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "family" && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-card-foreground">Family Members</h3>
                <button onClick={() => setShowFamilyForm(!showFamilyForm)} className="gradient-mother text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-heading font-bold flex items-center gap-1">
                  <UserPlus className="w-3 h-3" /> Add Member
                </button>
              </div>

              {showFamilyForm && (
                <div className="bg-muted rounded-xl p-4 mb-4 space-y-3 animate-slide-up">
                  <input
                    type="text" placeholder="Name" value={familyForm.name}
                    onChange={(e) => setFamilyForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-card rounded-lg text-sm border border-border"
                  />
                  <select
                    value={familyForm.relation}
                    onChange={(e) => setFamilyForm(p => ({ ...p, relation: e.target.value }))}
                    className="w-full px-3 py-2 bg-card rounded-lg text-sm border border-border"
                  >
                    <option value="">Select relation</option>
                    <option value="Husband">Husband</option>
                    <option value="Mother">Mother</option>
                    <option value="Mother-in-law">Mother-in-law</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="tel" placeholder="Phone number" value={familyForm.phone}
                    onChange={(e) => setFamilyForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-card rounded-lg text-sm border border-border"
                  />
                  <button onClick={handleAddFamily} className="w-full gradient-mother text-primary-foreground py-2 rounded-lg font-heading font-bold text-sm">
                    Save Family Member
                  </button>
                </div>
              )}

              {mother.familyMembers.map((fm, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-heading font-semibold text-card-foreground">{fm.name}</p>
                    <p className="text-xs text-muted-foreground">{fm.relation}</p>
                  </div>
                  <a href={`tel:${fm.phone}`} className="text-primary text-xs flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {fm.phone}
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">🎒 Birth Preparedness Checklist</h3>
              {["Hospital identified", "Transport arranged", "Blood donor identified", "Money saved (₹5000+)", "Hospital bag packed", "Documents ready (Aadhaar, MCP card)", "Emergency numbers saved"].map((item, i) => (
                <label key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-primary"
                    checked={birthChecklist[item] || false}
                    onChange={(e) => setBirthChecklist(prev => ({ ...prev, [item]: e.target.checked }))}
                  />
                  <span className={`text-sm ${birthChecklist[item] ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{item}</span>
                </label>
              ))}
              <div className="mt-3 bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">
                  {Object.values(birthChecklist).filter(Boolean).length}/7 items ready ({Math.round((Object.values(birthChecklist).filter(Boolean).length / 7) * 100)}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <EmergencyButton />
    </div>
  );
};

export default MotherDashboard;
