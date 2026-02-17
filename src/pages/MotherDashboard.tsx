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
  Plus, Scale, TrendingUp, UserPlus, Send, Download, Film, Dumbbell, Star,
  Stethoscope, HelpCircle, BookOpen, FileText, X, FileCheck, ClipboardList, Sparkles, Activity, CheckSquare, Info
} from "lucide-react";
import { toast } from "sonner";
import mcpCardImage from "@/assets/mcp-taayi-card.jpeg";
// Note: Add your exercise image to src/assets/ folder and import it here
// import safeExercisesImage from "@/assets/safe-exercises-pregnancy.jpg";

const MotherDashboard = () => {
  const { t } = useLanguage();
  const {
    mothers, updateMotherWeight, markIFATaken, reportSymptoms,
    addFamilyMember, checkSchemeEligibility, addNotification, updateFatherDetails, updateHealthData,
    updateDeliveryReadiness, updateSkinCare, updateMedicalHistory
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
  const [deliveryQuizAnswers, setDeliveryQuizAnswers] = useState<{ [key: string]: string }>({});
  const [deliveryChecklist, setDeliveryChecklist] = useState<{ [key: string]: boolean }>({
    "Hospital selected": false,
    "Transport arranged": false,
    "Blood donor ready": false,
  });
  const [showFatherDetails, setShowFatherDetails] = useState(false);
  const [showFatherForm, setShowFatherForm] = useState(!mother.fatherName);
  const [fatherForm, setFatherForm] = useState({
    name: mother.fatherName || "",
    phone: mother.emergencyContact || "",
  });
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [showHowToApply, setShowHowToApply] = useState(false);
  const [documentsReady, setDocumentsReady] = useState<{ [key: string]: boolean }>({
    "Aadhaar Card": false,
    "Bank Account": false,
    "MCP Card": false,
    "Pregnancy Registration Proof": false,
    "Mobile Number": false,
  });
  const [healthDataEntered, setHealthDataEntered] = useState(
    mother.bp !== "120/80" || mother.hemoglobin !== 11 || mother.ancVisits > 0
  );
  const [healthForm, setHealthForm] = useState({
    bp: mother.bp || "120/80",
    hemoglobin: mother.hemoglobin.toString() || "11",
    ttVaccine: mother.ttVaccine || false,
    ancVisits: mother.ancVisits.toString() || "0",
  });

  const tabs = [
    { id: "dashboard", label: t("dashboard"), icon: Heart },
    { id: "mcp", label: t("mcp.card"), icon: Pill },
    { id: "nutrition", label: t("nutrition"), icon: Apple },
    { id: "delivery", label: "Delivery Options", icon: Stethoscope },
    { id: "danger", label: t("danger.signs"), icon: AlertTriangle },
    { id: "schemes", label: t("schemes"), icon: Shield },
    { id: "family", label: t("family.support"), icon: Users },
    { id: "delivery_prep", label: "Delivery Prep", icon: Baby },
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "gradient-mother text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
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

            {/* Father Details Section */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-card-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Father Details
                </h3>
                {mother.fatherName && (
                  <button
                    onClick={() => setShowFatherDetails(!showFatherDetails)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    {showFatherDetails ? "Hide" : "Show"} Details
                  </button>
                )}
              </div>

              {showFatherForm ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-heading font-semibold text-card-foreground">Father's Name</label>
                    <input
                      type="text"
                      value={fatherForm.name}
                      onChange={(e) => setFatherForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-muted rounded-lg text-sm border border-border focus:ring-2 focus:ring-primary"
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-heading font-semibold text-card-foreground">Father's Phone Number</label>
                    <input
                      type="tel"
                      value={fatherForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFatherForm(prev => ({ ...prev, phone: val }));
                      }}
                      className="w-full px-3 py-2 bg-muted rounded-lg text-sm border border-border focus:ring-2 focus:ring-primary"
                      placeholder="98XXXXXXXX"
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground">10 digits only</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!fatherForm.name || !fatherForm.phone) {
                          toast.error("Please fill all fields");
                          return;
                        }
                        if (fatherForm.phone.length !== 10) {
                          toast.error("Phone number must be exactly 10 digits");
                          return;
                        }
                        updateFatherDetails(0, fatherForm.name, fatherForm.phone);
                        setShowFatherForm(false);
                        setShowFatherDetails(true);
                        toast.success("Father details saved successfully");
                      }}
                      className="flex-1 gradient-mother text-primary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm"
                    >
                      Save Details
                    </button>
                    {mother.fatherName && (
                      <button
                        onClick={() => {
                          setShowFatherForm(false);
                          setFatherForm({ name: mother.fatherName, phone: mother.emergencyContact });
                        }}
                        className="px-4 py-2 bg-muted text-card-foreground rounded-lg font-heading font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {mother.fatherName && showFatherDetails ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Father's Name:</span>
                        <span className="text-sm font-heading font-semibold text-card-foreground">{mother.fatherName}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Phone Number:</span>
                        <a href={`tel:${mother.emergencyContact}`} className="text-sm font-heading font-semibold text-primary flex items-center gap-1">
                          <Phone className="w-4 h-4" /> {mother.emergencyContact}
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          setShowFatherForm(true);
                          setFatherForm({ name: mother.fatherName, phone: mother.emergencyContact });
                        }}
                        className="w-full mt-3 bg-muted text-card-foreground px-4 py-2 rounded-lg font-heading font-semibold text-sm hover:bg-muted/80"
                      >
                        Edit Details
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowFatherDetails(true)}
                      className="w-full gradient-mother text-primary-foreground px-4 py-3 rounded-lg font-heading font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" /> View Father Details
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "mcp" && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">{t("mcp.card")}</h3>

              {/* Health Data Input Form */}
              {!healthDataEntered ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">Please enter your health information to view your health progress:</p>

                  {/* Blood Pressure Input */}
                  <div className="p-4 bg-muted rounded-xl">
                    <label className="text-sm font-heading font-semibold text-card-foreground mb-2 block">Blood Pressure (BP)</label>
                    <input
                      type="text"
                      value={healthForm.bp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d/]/g, "");
                        if (val.length <= 7) {
                          setHealthForm(prev => ({ ...prev, bp: val }));
                        }
                      }}
                      placeholder="120/80"
                      className="w-full px-3 py-2 bg-card rounded-lg text-sm border border-border focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format: 120/80</p>
                  </div>

                  {/* Hemoglobin Input */}
                  <div className="p-4 bg-muted rounded-xl">
                    <label className="text-sm font-heading font-semibold text-card-foreground mb-2 block">Hemoglobin (g/dL)</label>
                    <input
                      type="number"
                      value={healthForm.hemoglobin}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (parseFloat(val) >= 5 && parseFloat(val) <= 20)) {
                          setHealthForm(prev => ({ ...prev, hemoglobin: val }));
                        }
                      }}
                      placeholder="11"
                      min="5"
                      max="20"
                      step="0.1"
                      className="w-full px-3 py-2 bg-card rounded-lg text-sm border border-border focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Normal range: 11-14 g/dL</p>
                  </div>

                  {/* TT Vaccine */}
                  <div className="p-4 bg-muted rounded-xl">
                    <label className="text-sm font-heading font-semibold text-card-foreground mb-2 block">TT Vaccine (Tetanus)</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ttVaccine"
                          checked={healthForm.ttVaccine === true}
                          onChange={() => setHealthForm(prev => ({ ...prev, ttVaccine: true }))}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-card-foreground">✅ Taken</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ttVaccine"
                          checked={healthForm.ttVaccine === false}
                          onChange={() => setHealthForm(prev => ({ ...prev, ttVaccine: false }))}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-card-foreground">❌ Not Taken</span>
                      </label>
                    </div>
                  </div>

                  {/* ANC Visits */}
                  <div className="p-4 bg-muted rounded-xl">
                    <label className="text-sm font-heading font-semibold text-card-foreground mb-2 block">ANC Visits Completed</label>
                    <input
                      type="number"
                      value={healthForm.ancVisits}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 4)) {
                          setHealthForm(prev => ({ ...prev, ancVisits: val }));
                        }
                      }}
                      placeholder="0"
                      min="0"
                      max="4"
                      className="w-full px-3 py-2 bg-card rounded-lg text-sm border border-border focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Total: 4 visits recommended</p>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => {
                      if (!healthForm.bp || !healthForm.hemoglobin || healthForm.ancVisits === "") {
                        toast.error("Please fill all fields");
                        return;
                      }
                      updateHealthData(0, {
                        bp: healthForm.bp,
                        hemoglobin: parseFloat(healthForm.hemoglobin),
                        ttVaccine: healthForm.ttVaccine,
                        ancVisits: parseInt(healthForm.ancVisits),
                      });
                      setHealthDataEntered(true);
                      toast.success("Health data saved! View your progress below.");
                    }}
                    className="w-full gradient-mother text-primary-foreground px-4 py-3 rounded-lg font-heading font-bold text-sm"
                  >
                    Save Health Data
                  </button>
                </div>
              ) : (
                <>
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

                  {/* Health Data Display */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
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

                  {/* Edit Health Data Button */}
                  <button
                    onClick={() => {
                      setHealthDataEntered(false);
                      setHealthForm({
                        bp: mother.bp,
                        hemoglobin: mother.hemoglobin.toString(),
                        ttVaccine: mother.ttVaccine,
                        ancVisits: mother.ancVisits.toString(),
                      });
                    }}
                    className="w-full bg-muted text-card-foreground px-4 py-2 rounded-lg font-heading font-semibold text-sm mb-4"
                  >
                    Edit Health Data
                  </button>
                </>
              )}
            </div>

            {/* Health Progress - Only show after data is entered */}
            {healthDataEntered && (
              <div className="bg-card rounded-2xl p-5 shadow-card">
                <h3 className="font-heading font-bold text-card-foreground mb-4">Health Progress</h3>
                <div className="flex justify-around flex-wrap gap-4">
                  <ProgressRing value={mother.ifaTablets} max={180} label="IFA Tablets" color="hsl(var(--primary))" />
                  <ProgressRing value={mother.ancVisits} max={4} label="ANC Visits" color="hsl(var(--secondary))" />
                  <ProgressRing value={mother.hemoglobin} max={14} label="Hemoglobin" color={mother.hemoglobin < 10 ? "hsl(var(--destructive))" : "hsl(var(--secondary))"} />
                  <ProgressRing value={mother.pregnancyWeek} max={40} label="Pregnancy" color="hsl(var(--accent))" />
                </div>
              </div>
            )}

            {/* MCP Taayi Card - Downloadable */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-secondary/30">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                📋 MCP (Taayi) Card
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Download your Mother & Child Protection Card and carry it to your Anganwadi or hospital visit.</p>

              {/* Blood Group Section */}
              <div className="bg-muted/30 rounded-xl p-4 mb-4 border border-border/50">
                <h4 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2 text-sm">
                  <Droplets className="w-4 h-4 text-destructive" /> Mother's Blood Group
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Unknown"].map((bg) => (
                    <button
                      key={bg}
                      onClick={() => updateMedicalHistory(0, { bloodGroup: bg as any })}
                      className={`py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${mother.bloodGroup === bg
                        ? "bg-primary text-primary-foreground shadow-sm scale-105"
                        : "bg-card text-muted-foreground hover:bg-primary/10 border border-border"
                        }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
                {mother.bloodGroup && mother.bloodGroup.endsWith("-") && (
                  <div className="mt-3 bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs text-destructive">Rh Negative Alert</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        Your blood group is Rh Negative. You may need an Anti-D injection during pregnancy.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Medical History Section */}
              <div className="bg-muted/30 rounded-xl p-4 mb-4 border border-border/50">
                <h4 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-primary" /> Pre-Existing Conditions
                </h4>
                <div className="space-y-2">
                  {[
                    "High Blood Pressure", "Diabetes", "Thyroid Disorder", "Heart Disease",
                    "Asthma", "Severe Anemia", "Epilepsy", "Previous C-Section", "Previous Miscarriage"
                  ].map((condition) => (
                    <label key={condition} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer bg-card hover:bg-primary/5 transition-colors border border-border/50">
                      <input
                        type="checkbox"
                        checked={mother.medicalHistory?.conditions?.includes(condition) || false}
                        onChange={(e) => {
                          const current = mother.medicalHistory?.conditions || [];
                          const newConditions = e.target.checked
                            ? [...current, condition]
                            : current.filter(c => c !== condition);
                          updateMedicalHistory(0, { medicalHistory: { ...mother.medicalHistory, conditions: newConditions, lastUpdated: new Date().toISOString().split("T")[0] } });
                        }}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span className="font-medium text-xs text-card-foreground">{condition}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="text-[10px] font-semibold text-muted-foreground mb-1 block">Other Conditions</label>
                  <textarea
                    placeholder="Specify..."
                    value={mother.medicalHistory?.otherCondition || ""}
                    onChange={(e) => updateMedicalHistory(0, { medicalHistory: { ...mother.medicalHistory, otherCondition: e.target.value, lastUpdated: new Date().toISOString().split("T")[0] } })}
                    className="w-full bg-card rounded-lg p-2 text-xs border border-border focus:ring-1 focus:ring-primary h-16 resize-none"
                  />
                </div>

                {(mother.medicalHistory?.conditions?.length > 0 || mother.medicalHistory?.otherCondition) && (
                  <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 flex items-center gap-2">
                    <Info className="w-3 h-3 text-yellow-600" />
                    <p className="text-[10px] text-yellow-800/80 leading-tight">
                      Visible only to health workers.
                    </p>
                  </div>
                )}
              </div>
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${i < waterGlasses ? "bg-secondary text-secondary-foreground scale-110" : "bg-muted text-muted-foreground"
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

              {/* Exercise Infographic Image */}
              <div className="mb-4 rounded-xl overflow-hidden border border-border bg-muted/50">
                <img
                  src="/safe-exercises-pregnancy.png"
                  alt="Safe exercises during pregnancy infographic - Shows 7 safe exercises: Cycling, Swimming, Yoga, Walking, Strength Training, Pilates, and Low-Impact Aerobics"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    // Fallback: Hide image container if image not found
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.display = 'none';
                    }
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground mb-4 text-center">📸 Visual guide to safe exercises during pregnancy</p>

              {[
                { name: "Walking (30 min daily)", desc: "Best cardio – improves circulation, reduces swelling", icon: "🚶‍♀️" },
                { name: "Strength Training", desc: "Strengthens pelvic muscles for easier delivery", icon: "💪" },
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
              <p className="text-xs text-muted-foreground mb-3">Relaxing & inspiring movies to enjoy during pregnancy and movies will be available in YOU TUBE</p>
              {[
                { name: " 21 and Pregnant", lang: "Telugu", desc: "A relatable story about young pregnancy, choices, and emotional responsibility that can help understand pregnancy experiences.", rating: "⭐ 4.5" },
                { name: "Maa", lang: "Tamil", desc: "A powerful emotional short about pregnancy, family acceptance, and the challenges faced by women great for empathy and awareness", rating: "⭐ 4.2" },
                { name: "Mozhi", lang: " Tamil", desc: "A heart-warming story about love, communication, family support and patience good for emotional well-being and positive mindset during pregnancy.", rating: "⭐ 4.0" },
                { name: "Mr. Pregnant (Kannada Dubbed Comedy)", lang: "Kannada", desc: "A light, humorous take on pregnancy themes with fun and family entertainment good for stress relief.", rating: "⭐ 4.6" },
                { name: "Badhaai Ho", lang: "Hindi", desc: "A feel-good comedy-drama about an unexpected pregnancy later in life and how the family navigates social awkwardness with love uplifting for maternal confidence.", rating: "⭐ 4.1" },
                { name: "Babies", lang: "English", desc: "A gentle, real-life documentary following babies from birth to the first year highlights early life, maternal care, and bonding", rating: "⭐ 4.3" },
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

        {activeTab === "delivery" && (
          <div className="space-y-6 animate-slide-up">
            {/* Normal Delivery Advantages */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-green-500/20">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Advantages of Normal Delivery
              </h3>

              <div className="mb-4">
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-2">For Mother:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Faster recovery (2–6 weeks)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Shorter hospital stay
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Less infection risk
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Less bleeding compared to surgery
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Can walk and care for baby sooner
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Lower cost
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-2">For Baby:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Better breathing (fluid clears naturally from lungs)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Early skin-to-skin contact
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Easier breastfeeding
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Stronger immunity development
                  </li>
                </ul>
              </div>
            </div>

            {/* When Normal Delivery is Safe */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-blue-500/20">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" /> When Normal Delivery is Safe
              </h3>
              <p className="text-sm text-muted-foreground mb-3">Normal delivery is usually safe if:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  Blood pressure is normal
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  No severe anemia
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  Baby position is head-down
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  No placenta problems
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  No previous complicated C-section
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  Labor progresses naturally
                </li>
              </ul>
            </div>

            {/* Possible Challenges */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-yellow-500/20">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" /> Possible Challenges in Normal Delivery
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground mb-3">
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  Labor pain (can last several hours)
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  Tearing in vaginal area
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  Need for stitches
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  Prolonged labor in some cases
                </li>
              </ul>
              <div className="bg-yellow-500/10 rounded-lg p-3 mt-3">
                <p className="text-xs font-heading font-semibold text-card-foreground mb-2">Pain relief options:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Breathing techniques</li>
                  <li>• Epidural anesthesia</li>
                  <li>• Support from partner/family</li>
                </ul>
              </div>
            </div>

            {/* C-Section Information */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-red-500/20">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-red-500" /> What is C-Section (Cesarean Delivery)?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                C-section is a surgical procedure where the baby is delivered through a cut made in the mother's abdomen and uterus.
                It is done when normal delivery is not safe for mother or baby.
              </p>

              <div className="mb-4">
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> When C-Section is Needed
                </h4>
                <p className="text-xs text-muted-foreground mb-2">Doctors may suggest C-section if:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    High blood pressure (severe preeclampsia)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Severe anemia
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Baby not getting oxygen
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Baby in breech position (legs first)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Placenta covering cervix (placenta previa)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Previous multiple C-sections
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Twin or multiple pregnancy (in some cases)
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    Labor not progressing
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-2">✅ Advantages of C-Section</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Can save mother and baby in emergency
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Safer when complications exist
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Planned surgery option in high-risk cases
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-2">⚠️ Risks of C-Section</h4>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-card-foreground mb-1">For Mother:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Longer recovery (6–8 weeks)</li>
                    <li>• More pain after surgery</li>
                    <li>• Higher infection risk</li>
                    <li>• More blood loss</li>
                    <li>• Risk in future pregnancies</li>
                    <li>• Scar formation</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-card-foreground mb-1">For Baby:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Slight breathing difficulty (sometimes)</li>
                    <li>• Slightly delayed breastfeeding start</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recovery Comparison */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Recovery Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-heading font-semibold text-card-foreground">Feature</th>
                      <th className="text-left py-2 px-3 font-heading font-semibold text-green-500">Normal Delivery</th>
                      <th className="text-left py-2 px-3 font-heading font-semibold text-red-500">C-Section</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3 text-muted-foreground">Hospital Stay</td>
                      <td className="py-2 px-3 text-green-600">1–2 days</td>
                      <td className="py-2 px-3 text-red-600">3–5 days</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3 text-muted-foreground">Recovery Time</td>
                      <td className="py-2 px-3 text-green-600">2–6 weeks</td>
                      <td className="py-2 px-3 text-red-600">6–8 weeks</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-2 px-3 text-muted-foreground">Pain</td>
                      <td className="py-2 px-3 text-green-600">Labor pain</td>
                      <td className="py-2 px-3 text-red-600">Surgery pain</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-muted-foreground">Future Pregnancy</td>
                      <td className="py-2 px-3 text-green-600">Easier</td>
                      <td className="py-2 px-3 text-red-600">Needs monitoring</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Important Awareness Points */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Important Awareness Points
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Normal delivery is natural and safe in most healthy pregnancies.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  C-section is life-saving when medically needed.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  C-section should NOT be done without medical reason.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Always follow doctor advice.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Birth preparedness reduces emergency C-sections.
                </li>
              </ul>
            </div>

            {/* Myths vs Facts */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Myths vs Facts
              </h3>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-heading font-semibold text-card-foreground mb-1">
                    <span className="text-red-500">❌ Myth:</span> C-section is easier than normal delivery.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500 font-semibold">✔ Fact:</span> C-section is major surgery and recovery is longer.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-heading font-semibold text-card-foreground mb-1">
                    <span className="text-red-500">❌ Myth:</span> Once C-section, always C-section.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500 font-semibold">✔ Fact:</span> Some women can have VBAC (vaginal birth after C-section) if doctor allows.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-heading font-semibold text-card-foreground mb-1">
                    <span className="text-red-500">❌ Myth:</span> Normal delivery damages body permanently.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500 font-semibold">✔ Fact:</span> With proper care and exercises, recovery is very good.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Section - Know Your Delivery Options */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-secondary/30">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" /> Know Your Delivery Options
              </h3>

              {/* Birth Preparedness Checklist */}
              <div className="mb-4">
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-3">Birth Preparedness Checklist</h4>
                {["Hospital selected?", "Transport arranged?", "Blood donor ready?"].map((item) => (
                  <label key={item} className="flex items-center gap-3 py-2 border-b border-border last:border-0 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary rounded"
                      checked={deliveryChecklist[item] || false}
                      onChange={(e) => setDeliveryChecklist(prev => ({ ...prev, [item]: e.target.checked }))}
                    />
                    <span className={`text-sm ${deliveryChecklist[item] ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{item}</span>
                  </label>
                ))}
                <div className="mt-3 bg-muted rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">
                    {Object.values(deliveryChecklist).filter(Boolean).length}/3 items ready ({Math.round((Object.values(deliveryChecklist).filter(Boolean).length / 3) * 100)}%)
                  </p>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="mb-4">
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-3">Are you prepared for birth? (Quick Check)</h4>
                <div className="space-y-3">
                  {[
                    { q: "Have you selected a hospital?", options: ["Yes", "No", "Not sure"] },
                    { q: "Is transport arranged for delivery day?", options: ["Yes", "No", "Planning"] },
                    { q: "Do you have a blood donor ready?", options: ["Yes", "No", "Not needed"] },
                  ].map((quiz, idx) => (
                    <div key={idx} className="bg-muted rounded-lg p-3">
                      <p className="text-xs font-semibold text-card-foreground mb-2">{quiz.q}</p>
                      <div className="flex gap-2 flex-wrap">
                        {quiz.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setDeliveryQuizAnswers(prev => ({ ...prev, [quiz.q]: opt }))}
                            className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold transition-all ${deliveryQuizAnswers[quiz.q] === opt
                              ? "bg-primary text-primary-foreground"
                              : "bg-card text-card-foreground hover:bg-primary/10"
                              }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h4 className="font-heading font-semibold text-sm text-card-foreground mb-3">Frequently Asked Questions</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <details className="bg-muted rounded-lg p-3">
                    <summary className="font-semibold text-card-foreground cursor-pointer">What is the best delivery method?</summary>
                    <p className="mt-2 text-xs">Normal delivery is best when both mother and baby are healthy. C-section is needed only when there are medical complications.</p>
                  </details>
                  <details className="bg-muted rounded-lg p-3">
                    <summary className="font-semibold text-card-foreground cursor-pointer">Can I choose C-section without medical reason?</summary>
                    <p className="mt-2 text-xs">No. C-section is major surgery and should only be done when medically necessary. Always follow your doctor's advice.</p>
                  </details>
                  <details className="bg-muted rounded-lg p-3">
                    <summary className="font-semibold text-card-foreground cursor-pointer">What if I had a C-section before?</summary>
                    <p className="mt-2 text-xs">You may be able to have a normal delivery (VBAC) if your doctor approves. Discuss this with your healthcare provider.</p>
                  </details>
                </div>
              </div>
            </div>

            {/* For Family Section */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-accent/20">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" /> For Family - How to Support
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  Support mother emotionally
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  Avoid forcing delivery type
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  Arrange transport early
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  Respect doctor's decision
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  Avoid unsafe home delivery
                </li>
              </ul>
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
                  <label key={symptom} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedSymptoms.includes(symptom) ? "bg-destructive/10 border border-destructive" : "bg-muted border border-transparent"
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
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20">
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-2 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" /> Government Schemes & Benefits
              </h2>
              <p className="text-sm text-muted-foreground">Get financial support and benefits for you and your baby</p>
            </div>

            {/* Required Documents Checklist */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" /> Required Documents Checklist
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Mark documents you have ready:</p>
              {Object.keys(documentsReady).map((doc) => (
                <label key={doc} className="flex items-center gap-3 py-2 border-b border-border last:border-0 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-primary rounded"
                    checked={documentsReady[doc] || false}
                    onChange={(e) => setDocumentsReady(prev => ({ ...prev, [doc]: e.target.checked }))}
                  />
                  <span className={`text-sm ${documentsReady[doc] ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                    {doc}
                  </span>
                </label>
              ))}
              <div className="mt-3 bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">
                  {Object.values(documentsReady).filter(Boolean).length}/5 documents ready
                </p>
              </div>
            </div>

            {/* Scheme Cards */}
            {[
              {
                id: "pmmvy",
                name: "TN-HFW-MAT-001",
                fullName: "Dr. Muthulakshmi Reddy Maternity Benefit Scheme",
                icon: "💰",
                benefit: "₹18,000",
                summary: "Get ₹18,000  during pregnancy",
                eligibility: ["Provides up to ₹18,000 financial assistance to pregnant and lactating women, including cash incentives and nutritional kits to promote maternal and child health. "],
                installments: 7,
                current: mother.schemeStatus.pmmvy === "Active" || mother.schemeStatus.pmmvy === "2nd Installment" ? 2 : mother.schemeStatus.pmmvy === "1st Installment" ? 1 : 0,
                status: mother.schemeStatus.pmmvy,
              },
              {
                id: "jsy",
                name: "PMMVY",
                fullName: "Pradhan Mantri Matru Vandana Yojana (PMMVY) – Tamil Nadu implementation",
                icon: "🏥",
                benefit: "₹5,000",
                summary: "Get ₹5,000 for delivery at hospital",
                eligibility: ["Benefit: Central maternity benefit providing ₹5,000 for the first live birth and ₹6,000 for the second (if girl) to pregnant and lactating mothers to support maternal health and nutrition."],
                installments: 1,
                current: mother.schemeStatus.jsy === "Eligible" ? 1 : 0,
                status: mother.schemeStatus.jsy,
              },
              {
                id: "jssk",
                name: "TN-HFW-DIG-003",
                fullName: "Thaimai App & Maternal Health Monitoring Scheme",
                icon: "🚑",
                benefit: "Free Services",
                summary: " A digital health initiative to track high-risk pregnancies, antenatal visits, immunisations, and deliver timely health reminders and baby care support in Tamil Nadu",
                eligibility: ["All pregnant women", "Delivery at government hospital"],
                installments: 0,
                current: 0,
                status: "Available",
              },
              {
                id: "icds",
                name: "ICDS Nutrition",
                fullName: "Integrated Child Development Services",
                icon: "🥛",
                benefit: "Monthly Ration",
                summary: "Get monthly nutrition support (food, milk, supplements)",
                eligibility: ["Registered at Anganwadi", "Pregnant or lactating"],
                installments: 9,
                current: mother.schemeStatus.nutrition === "Active" ? 5 : 0,
                status: mother.schemeStatus.nutrition,
              },
            ].map((scheme) => (
              <div key={scheme.id} className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/10 hover:border-primary/30 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{scheme.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-card-foreground">{scheme.name}</h3>
                    <p className="text-xs text-muted-foreground">{scheme.fullName}</p>
                    <p className="text-sm text-card-foreground mt-2">{scheme.summary}</p>
                    <div className="mt-2">
                      <span className="text-lg font-heading font-bold text-primary">{scheme.benefit}</span>
                      {scheme.installments > 0 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({scheme.installments} installments)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-heading font-bold ${scheme.status === "Active" || scheme.status === "Eligible" || scheme.status === "Available"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-accent/20 text-accent"
                    }`}>
                    {scheme.status}
                  </span>
                </div>

                {/* Eligibility Criteria */}
                <div className="bg-muted rounded-lg p-3 mb-3">
                  <p className="text-xs font-heading font-semibold text-card-foreground mb-2">Eligibility:</p>
                  <ul className="space-y-1">
                    {scheme.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress Bar for Installments */}
                {scheme.installments > 0 && (
                  <div className="mb-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${(scheme.current / scheme.installments) * 100}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scheme.current}/{scheme.installments} installments received
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const result = checkSchemeEligibility(0);
                      const isEligible = scheme.id === "pmmvy" ? result.pmmvy : scheme.id === "jsy" ? result.jsy : scheme.id === "icds" ? result.nutrition : true;
                      toast.success(isEligible ? `✅ You are eligible for ${scheme.name}!` : `❌ You may not be eligible. Contact Anganwadi for help.`);
                    }}
                    className="gradient-mother text-primary-foreground px-3 py-2 rounded-lg font-heading font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Check Eligibility
                  </button>
                  <button
                    onClick={() => {
                      setSelectedScheme(scheme.id);
                      setShowHowToApply(true);
                    }}
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-heading font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" /> How to Apply
                  </button>
                </div>
              </div>
            ))}

            {/* Need Help Button */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-accent/20">
              <h3 className="font-heading font-bold text-card-foreground mb-2">Need Help Applying?</h3>
              <p className="text-sm text-muted-foreground mb-3">Contact your Anganwadi worker for assistance</p>
              <button
                onClick={() => {
                  addNotification({
                    message: `📩 ${mother.name} needs help applying for government schemes`,
                    type: "warning",
                    targetRole: "worker"
                  });
                  toast.success("Anganwadi worker has been notified! They will contact you soon.");
                }}
                className="w-full gradient-worker text-primary-foreground px-4 py-3 rounded-lg font-heading font-bold text-sm flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" /> Contact Anganwadi for Help
              </button>
            </div>

            {/* How to Apply Modal */}
            {showHowToApply && selectedScheme && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-card rounded-2xl p-6 shadow-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-xl text-card-foreground">How to Apply</h3>
                    <button
                      onClick={() => {
                        setShowHowToApply(false);
                        setSelectedScheme(null);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <p className="text-sm font-heading font-semibold text-card-foreground mb-3">Step-by-Step Application Process:</p>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                          <span>Register your pregnancy at Anganwadi center</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                          <span>Complete your first ANC (Antenatal Care) visit</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                          <span>Submit required documents: Aadhaar, Bank passbook, MCP card</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">4</span>
                          <span>Fill the scheme application form (Anganwadi will help)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0">5</span>
                          <span>Track your installment status in this app</span>
                        </li>
                      </ol>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs font-heading font-semibold text-card-foreground mb-2">Required Documents:</p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          Aadhaar Card
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          Bank Account Passbook
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          MCP (Mother & Child Protection) Card
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          Pregnancy Registration Proof
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                          Mobile Number (linked to Aadhaar)
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          toast.info("Form download will be available soon. Contact Anganwadi for paper form.");
                        }}
                        className="flex-1 bg-muted text-card-foreground px-4 py-2 rounded-lg font-heading font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Download Form
                      </button>
                      <button
                        onClick={() => {
                          addNotification({
                            message: `📩 ${mother.name} needs help applying for ${selectedScheme.toUpperCase()} scheme`,
                            type: "warning",
                            targetRole: "worker"
                          });
                          toast.success("Anganwadi worker notified! They will help you apply.");
                          setShowHowToApply(false);
                          setSelectedScheme(null);
                        }}
                        className="flex-1 gradient-worker text-primary-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" /> Contact Anganwadi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
        {activeTab === "delivery_prep" && (
          <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20">
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-2 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Healthy Practices for Normal Delivery
              </h2>
              <p className="text-sm text-muted-foreground">Follow these daily habits to prepare your body for a natural birth.</p>
            </div>

            {/* Readiness Score */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-card-foreground">Normal Delivery Readiness</h3>
                <span className="text-2xl font-bold text-primary">{Math.round((mother.deliveryReadiness?.checklist?.length || 0) / 8 * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4">
                <div className="gradient-mother h-4 rounded-full transition-all duration-1000" style={{ width: `${((mother.deliveryReadiness?.checklist?.length || 0) / 8) * 100}%` }} />
              </div>
            </div>

            {/* Daily Checklist */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Daily Healthy Practices</h3>
              {[
                "Attend all ANC visits", "Take IFA & calcium daily", "Maintain balanced diet",
                "Drink 8–10 glasses of water", "Do doctor-approved walking", "Practice breathing exercises",
                "Sleep 7–8 hours", "Monitor BP & Hb levels"
              ].map((item) => (
                <label key={item} className="flex items-center gap-3 py-3 border-b border-border last:border-0 cursor-pointer">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${(mother.deliveryReadiness?.checklist || []).includes(item) ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                    }`}>
                    {(mother.deliveryReadiness?.checklist || []).includes(item) && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={(mother.deliveryReadiness?.checklist || []).includes(item)}
                    onChange={(e) => {
                      const current = mother.deliveryReadiness?.checklist || [];
                      const newChecklist = e.target.checked
                        ? [...current, item]
                        : current.filter(i => i !== item);
                      updateDeliveryReadiness(0, { checklist: newChecklist });
                    }}
                  />
                  <span className={(mother.deliveryReadiness?.checklist || []).includes(item) ? "text-primary font-semibold" : "text-card-foreground"}>{item}</span>
                </label>
              ))}
            </div>

            {/* Physical Preparation Guidance */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Physical Preparation</h3>
              <div className="mb-6 rounded-xl overflow-hidden shadow-md">
                <img src="/safe-exercises-pregnancy.png" alt="Best Exercises During Pregnancy" className="w-full h-auto object-cover" />
              </div>
              <div className="space-y-3">
                {[
                  { title: "Regular Walking", desc: "20–30 minutes daily. Improves stamina & helps labor progress.", icon: "🚶‍♀️" },
                  { title: "Pelvic Floor Exercises (Kegels)", desc: "Strengthens muscles. Supports easier pushing.", icon: "💪" },
                  { title: "Squatting Practice", desc: "Helps baby move into correct position. (Only if safe)", icon: "🧘‍♀️" }
                ].map((ex) => (
                  <div key={ex.title} className="bg-muted rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{ex.icon}</span>
                      <div>
                        <h4 className="font-heading font-bold text-card-foreground">{ex.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{ex.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const current = mother.deliveryReadiness?.practiced || [];
                        if (!current.includes(ex.title)) {
                          updateDeliveryReadiness(0, { practiced: [...current, ex.title] });
                          toast.success("Good job! Marked as practiced today.");
                        }
                      }}
                      className={`w-full mt-3 py-2 rounded-lg font-heading font-bold text-xs transition-colors ${(mother.deliveryReadiness?.practiced || []).includes(ex.title)
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-white text-primary border border-primary hover:bg-primary/5"
                        }`}
                    >
                      {(mother.deliveryReadiness?.practiced || []).includes(ex.title) ? "✅ Practiced Today" : "Mark as Practiced Today"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Preparation */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Mental Preparation</h3>
              <div className="bg-primary/5 rounded-xl p-4 mb-4">
                <p className="text-sm font-heading font-semibold text-primary mb-2">🧘‍♀️ Stress Level Tracker</p>
                <input
                  type="range" min="1" max="10"
                  value={mother.deliveryReadiness?.stressLevel || 5}
                  onChange={(e) => updateDeliveryReadiness(0, { stressLevel: parseInt(e.target.value) })}
                  className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Relaxed (1)</span>
                  <span>Stressed (10)</span>
                </div>
                <p className="text-center text-sm font-bold text-primary mt-2">Current Level: {mother.deliveryReadiness?.stressLevel || 5}/10</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-lg text-center">
                  <span className="text-2xl block mb-1">🌬️</span>
                  <p className="text-xs font-bold text-card-foreground">Breathing</p>
                  <p className="text-[10px] text-muted-foreground">Practice deep belly breathing</p>
                </div>
                <div className="bg-muted p-3 rounded-lg text-center">
                  <span className="text-2xl block mb-1">💖</span>
                  <p className="text-xs font-bold text-card-foreground">Affirmations</p>
                  <p className="text-[10px] text-muted-foreground">"My body knows how to birth"</p>
                </div>
              </div>
            </div>

            {/* Myths vs Facts */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Common Myths vs Facts</h3>
              <div className="space-y-3">
                <div className="bg-red-100/50 p-3 rounded-lg border border-red-100">
                  <p className="text-xs font-bold text-red-600">❌ Myth: Spicy food causes labor</p>
                  <p className="text-xs text-green-700 mt-1">✔ Fact: Labor starts naturally when baby is ready.</p>
                </div>
                <div className="bg-red-100/50 p-3 rounded-lg border border-red-100">
                  <p className="text-xs font-bold text-red-600">❌ Myth: Walking causes miscarriage</p>
                  <p className="text-xs text-green-700 mt-1">✔ Fact: Light walking is healthy in normal pregnancy.</p>
                </div>
              </div>
            </div>

            {/* Medical Note */}
            <div className="bg-accent/10 rounded-2xl p-5 border border-accent/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-card-foreground text-sm">Important Medical Note</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Normal delivery is safe in most healthy pregnancies. Always follow doctor advice.
                    C-section is life-saving when medically necessary.
                  </p>
                </div>
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
