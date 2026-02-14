import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import DashboardHeader from "@/components/DashboardHeader";
import EmergencyButton from "@/components/EmergencyButton";
import {
  Users, AlertTriangle, Bell, ClipboardList, FileText,
  Eye, Calendar, Phone, CheckCircle2, XCircle, Search,
  ShieldAlert, Send, Download, UserCheck, Image
} from "lucide-react";
import { toast } from "sonner";
import mcpCardImage from "@/assets/mcp-taayi-card.jpeg";

const WorkerDashboard = () => {
  const { t } = useLanguage();
  const {
    mothers, notifications, visits, addVisit,
    verifyMother, markHighRisk, sendReminder, generateReport, addNotification
  } = useApp();
  const [activeTab, setActiveTab] = useState("registry");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMother, setSelectedMother] = useState<number | null>(null);
  const [visitNotes, setVisitNotes] = useState("");
  const [visitMotherIdx, setVisitMotherIdx] = useState(0);
  const [visitBP, setVisitBP] = useState("");
  const [visitWeight, setVisitWeight] = useState("");
  const [reminderMother, setReminderMother] = useState(0);
  const [reminderType, setReminderType] = useState("ANC Visit");
  const [reportData, setReportData] = useState<ReturnType<typeof generateReport> | null>(null);

  const tabs = [
    { id: "registry", label: t("mother.registry"), icon: Users },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "highrisk", label: t("high.risk"), icon: AlertTriangle },
    { id: "visits", label: t("visit.tracking"), icon: ClipboardList },
    { id: "mcpcard", label: "MCP Card", icon: Image },
    { id: "reports", label: t("reports"), icon: FileText },
  ];

  const filteredMothers = mothers.filter(m => {
    const matchRisk = filterRisk === "all" || m.riskLevel === filterRisk;
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.village.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRisk && matchSearch;
  });

  const highRiskMothers = mothers.filter(m => m.riskLevel === "high" || m.hemoglobin < 9 || m.ancVisits < 2);

  const handleVerify = (idx: number) => {
    verifyMother(idx);
  };

  const handleMarkHighRisk = (idx: number) => {
    markHighRisk(idx);
  };

  const handleLogVisit = (type: "home" | "clinic") => {
    const riskFound = visitBP.split("/").some(v => Number(v) > 130) || (parseFloat(visitWeight) > 0 && parseFloat(visitWeight) < 45);
    addVisit({
      motherId: mothers[visitMotherIdx]?.id || "0",
      date: new Date().toISOString().split("T")[0],
      notes: visitNotes,
      type,
      bp: visitBP || undefined,
      weight: visitWeight ? parseFloat(visitWeight) : undefined,
      riskFound
    });
    if (riskFound) {
      addNotification({
        message: `⚠️ Risk detected during ${type} visit for ${mothers[visitMotherIdx]?.name}: ${visitBP ? `BP ${visitBP}` : ""} ${visitWeight ? `Weight ${visitWeight}kg` : ""}`,
        type: "urgent",
        targetRole: "worker"
      });
      toast.error("⚠️ Risk factors detected during visit!");
    } else {
      toast.success(`${type === "home" ? "Home" : "Clinic"} visit logged successfully`);
    }
    setVisitNotes("");
    setVisitBP("");
    setVisitWeight("");
  };

  const handleSendReminder = () => {
    sendReminder(reminderMother, reminderType);
  };

  const handleGenerateReport = () => {
    const data = generateReport();
    setReportData(data);
    toast.success("Monthly report generated!");
  };

  const handleExportReport = () => {
    if (!reportData) return;
    const csv = `Report Date,${new Date().toISOString().split("T")[0]}\nTotal Mothers,${reportData.total}\nHigh Risk,${reportData.highRisk}\nOverdue ANC,${reportData.overdueANC}\nVerified,${reportData.verified}\nHome Visits,${reportData.homeVisits}\nPending Verification,${reportData.pending}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported as CSV!");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title={`🏥 ${localStorage.getItem("workerName") || "Anganwadi"} Dashboard ${localStorage.getItem("workerId") ? `(ID: ${localStorage.getItem("workerId")})` : ""}`} gradient="gradient-worker" />

      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id ? "gradient-worker text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
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
        {activeTab === "registry" && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text" placeholder="Search by name or village..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-card rounded-xl text-sm border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-card rounded-xl px-3 py-2.5 text-sm border border-border focus:ring-2 focus:ring-primary">
                <option value="all">All Risk</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium</option>
                <option value="low">Low Risk</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card rounded-xl p-3 shadow-card text-center">
                <p className="text-2xl font-heading font-bold text-primary">{mothers.length}</p>
                <p className="text-[10px] text-muted-foreground">Total Mothers</p>
              </div>
              <div className="bg-card rounded-xl p-3 shadow-card text-center">
                <p className="text-2xl font-heading font-bold text-destructive">{mothers.filter(m => m.riskLevel === "high").length}</p>
                <p className="text-[10px] text-muted-foreground">High Risk</p>
              </div>
              <div className="bg-card rounded-xl p-3 shadow-card text-center">
                <p className="text-2xl font-heading font-bold text-secondary">{mothers.filter(m => m.verified).length}</p>
                <p className="text-[10px] text-muted-foreground">Verified</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-3 font-heading font-semibold text-muted-foreground">Name</th>
                      <th className="text-left px-4 py-3 font-heading font-semibold text-muted-foreground">Village</th>
                      <th className="text-center px-4 py-3 font-heading font-semibold text-muted-foreground">Week</th>
                      <th className="text-center px-4 py-3 font-heading font-semibold text-muted-foreground">Risk</th>
                      <th className="text-center px-4 py-3 font-heading font-semibold text-muted-foreground">Status</th>
                      <th className="text-center px-4 py-3 font-heading font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMothers.map((m, i) => {
                      const realIdx = mothers.findIndex(mot => mot.id === m.id);
                      return (
                        <tr key={m.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-heading font-semibold text-card-foreground">{m.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{m.village}</td>
                          <td className="px-4 py-3 text-center">{m.pregnancyWeek}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.riskLevel === "high" ? "bg-destructive/15 text-destructive" :
                              m.riskLevel === "medium" ? "bg-accent/15 text-accent" :
                              "bg-secondary/15 text-secondary"
                            }`}>{m.riskLevel.toUpperCase()}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {m.verified ? <CheckCircle2 className="w-4 h-4 text-secondary mx-auto" /> : <XCircle className="w-4 h-4 text-accent mx-auto" />}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => setSelectedMother(realIdx)} className="text-primary hover:text-primary/80 p-1" title="View">
                                <Eye className="w-4 h-4" />
                              </button>
                              {!m.verified && (
                                <button onClick={() => handleVerify(realIdx)} className="text-secondary hover:text-secondary/80 p-1" title="Verify">
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              )}
                              {m.riskLevel !== "high" && (
                                <button onClick={() => handleMarkHighRisk(realIdx)} className="text-destructive hover:text-destructive/80 p-1" title="Mark High Risk">
                                  <ShieldAlert className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedMother !== null && (
              <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-card-foreground">{mothers[selectedMother].name}</h3>
                  <button onClick={() => setSelectedMother(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {[
                    ["Village", mothers[selectedMother].village],
                    ["Week", mothers[selectedMother].pregnancyWeek],
                    ["Due Date", mothers[selectedMother].dueDate],
                    ["Weight", `${mothers[selectedMother].weight} kg`],
                    ["BP", mothers[selectedMother].bp],
                    ["Hemoglobin", `${mothers[selectedMother].hemoglobin} g/dL`],
                    ["IFA Tablets", mothers[selectedMother].ifaTablets],
                    ["ANC Visits", `${mothers[selectedMother].ancVisits}/4`],
                    ["TT Vaccine", mothers[selectedMother].ttVaccine ? "Done" : "Pending"],
                    ["Father", mothers[selectedMother].fatherName],
                    ["Emergency", mothers[selectedMother].emergencyContact],
                    ["MCP Number", mothers[selectedMother].mcpNumber || "Not assigned"],
                    ["Transport", mothers[selectedMother].transportReady ? "Ready" : "Not arranged"],
                    ["Danger Signs", mothers[selectedMother].dangerSigns.join(", ") || "None"],
                  ].map(([label, val], i) => (
                    <div key={i}>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className={`font-heading font-semibold ${
                        label === "Hemoglobin" && Number(String(val).replace(" g/dL", "")) < 10 ? "text-destructive" :
                        label === "TT Vaccine" && val === "Pending" ? "text-destructive" :
                        label === "Transport" && val === "Not arranged" ? "text-accent" : "text-card-foreground"
                      }`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="space-y-3 animate-slide-up">
            <h3 className="font-heading font-bold text-card-foreground">Notifications & Alerts</h3>
            {notifications.map((n) => (
              <div key={n.id} className={`bg-card rounded-xl p-4 shadow-card border-l-4 ${
                n.type === "urgent" ? "border-destructive" : n.type === "warning" ? "border-accent" : "border-secondary"
              }`}>
                <p className="text-sm text-card-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.timestamp.toLocaleString()}</p>
              </div>
            ))}

            {mothers.filter(m => !m.verified).length > 0 && (
              <div className="bg-accent/10 rounded-2xl p-4 border border-accent">
                <h4 className="font-heading font-bold text-sm text-accent mb-2">Pending Verification ({mothers.filter(m => !m.verified).length})</h4>
                {mothers.filter(m => !m.verified).map((m) => {
                  const realIdx = mothers.findIndex(mot => mot.id === m.id);
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-card-foreground">{m.name} – {m.village}</span>
                      <button onClick={() => handleVerify(realIdx)} className="gradient-worker text-primary-foreground px-3 py-1 rounded-lg text-xs font-heading font-bold flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Verify
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Send Reminder */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h4 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" /> Send Reminder
              </h4>
              <select value={reminderMother} onChange={(e) => setReminderMother(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm mb-2 border-0">
                {mothers.map((m, i) => <option key={i} value={i}>{m.name} – {m.village}</option>)}
              </select>
              <select value={reminderType} onChange={(e) => setReminderType(e.target.value)}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm mb-3 border-0">
                <option value="ANC Visit">ANC Visit Reminder</option>
                <option value="Vaccination">Vaccination Reminder</option>
                <option value="IFA Tablets">IFA Tablets Reminder</option>
                <option value="Delivery Planning">Delivery Planning</option>
                <option value="Nutrition">Nutrition Counseling</option>
              </select>
              <button onClick={handleSendReminder} className="gradient-worker text-primary-foreground px-4 py-2 rounded-xl font-heading font-bold text-sm flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Reminder
              </button>
            </div>
          </div>
        )}

        {activeTab === "highrisk" && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/30">
              <h3 className="font-heading font-bold text-destructive mb-1">⚠️ High Risk Mothers ({highRiskMothers.length})</h3>
              <p className="text-xs text-muted-foreground">Immediate attention required</p>
            </div>
            {highRiskMothers.map((m) => {
              const realIdx = mothers.findIndex(mot => mot.id === m.id);
              return (
                <div key={m.id} className="bg-card rounded-2xl p-4 shadow-card border-l-4 border-destructive">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-card-foreground">{m.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{m.village} · Week {m.pregnancyWeek}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedMother(realIdx)} className="text-primary p-1" title="View Profile">
                        <Eye className="w-4 h-4" />
                      </button>
                      {m.riskLevel !== "high" && (
                        <button onClick={() => handleMarkHighRisk(realIdx)} className="text-destructive p-1" title="Confirm High Risk">
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.hemoglobin < 9 && <span className="bg-destructive/15 text-destructive px-2 py-0.5 rounded-full text-[10px] font-bold">Severe Anemia (Hb: {m.hemoglobin})</span>}
                    {m.bp.split("/").some(v => Number(v) > 130) && <span className="bg-destructive/15 text-destructive px-2 py-0.5 rounded-full text-[10px] font-bold">High BP ({m.bp})</span>}
                    {m.ancVisits < 2 && <span className="bg-accent/15 text-accent px-2 py-0.5 rounded-full text-[10px] font-bold">Missed ANC ({m.ancVisits}/4)</span>}
                    {!m.transportReady && <span className="bg-accent/15 text-accent px-2 py-0.5 rounded-full text-[10px] font-bold">No Transport</span>}
                    {m.dangerSigns.map((s, j) => <span key={j} className="bg-destructive/15 text-destructive px-2 py-0.5 rounded-full text-[10px] font-bold">{s}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "visits" && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">Log New Visit</h3>
              <select value={visitMotherIdx} onChange={(e) => setVisitMotherIdx(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm mb-3 border-0">
                {mothers.map((m, i) => <option key={i} value={i}>{m.name} – {m.village}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground">BP Reading</label>
                  <input type="text" placeholder="e.g. 120/80" value={visitBP} onChange={(e) => setVisitBP(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-xl text-sm border-0" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Weight (kg)</label>
                  <input type="number" placeholder="e.g. 58" value={visitWeight} onChange={(e) => setVisitWeight(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-xl text-sm border-0" />
                </div>
              </div>
              <textarea placeholder="Visit notes..." value={visitNotes} onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full px-3 py-2.5 bg-muted rounded-xl text-sm mb-3 border-0 resize-none h-24" />
              <div className="flex gap-2">
                <button onClick={() => handleLogVisit("home")}
                  className="gradient-worker text-primary-foreground px-4 py-2 rounded-xl font-heading font-bold text-sm">
                  Log Home Visit
                </button>
                <button onClick={() => handleLogVisit("clinic")}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-heading font-bold text-sm">
                  Log Clinic Visit
                </button>
              </div>
            </div>

            {visits.length > 0 && (
              <div className="bg-card rounded-2xl p-5 shadow-card">
                <h3 className="font-heading font-bold text-card-foreground mb-3">Recent Visits ({visits.length})</h3>
                {visits.map((v) => (
                  <div key={v.id} className={`border-b border-border last:border-0 py-3 ${v.riskFound ? "bg-destructive/5 rounded-lg px-2" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{v.date}</span>
                      <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-heading">{v.type}</span>
                      {v.riskFound && <span className="text-[10px] bg-destructive/15 text-destructive px-2 py-0.5 rounded-full font-bold">⚠️ Risk</span>}
                    </div>
                    {v.bp && <p className="text-xs text-muted-foreground">BP: {v.bp}</p>}
                    {v.weight && <p className="text-xs text-muted-foreground">Weight: {v.weight}kg</p>}
                    <p className="text-sm text-card-foreground">{v.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "mcpcard" && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-secondary/30">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                📋 MCP (Taayi) Card Template
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Download and print the MCP card for registered mothers. Use this during home visits and ANC checkups.</p>
              <div className="rounded-xl overflow-hidden border border-border mb-3">
                <img src={mcpCardImage} alt="MCP Taayi Card" className="w-full h-auto" />
              </div>
              <a
                href={mcpCardImage}
                download="MCP-Taayi-Card.jpeg"
                className="w-full gradient-worker text-primary-foreground rounded-xl px-4 py-3 font-heading font-bold text-sm flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download MCP Card
              </a>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4 animate-slide-up">
            <button onClick={handleGenerateReport}
              className="w-full gradient-worker text-primary-foreground rounded-xl px-4 py-3 font-heading font-bold text-sm flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Generate Monthly Report
            </button>

            {reportData && (
              <>
                <div className="bg-card rounded-2xl p-5 shadow-card animate-slide-up">
                  <h3 className="font-heading font-bold text-card-foreground mb-4">Monthly Summary – {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Total Registered", reportData.total, "text-primary"],
                      ["High Risk", reportData.highRisk, "text-destructive"],
                      ["Overdue ANC", reportData.overdueANC, "text-accent"],
                      ["Verified", reportData.verified, "text-secondary"],
                      ["Home Visits", reportData.homeVisits, "text-primary"],
                      ["Pending Verification", reportData.pending, "text-accent"],
                    ].map(([label, val, color], i) => (
                      <div key={i} className="bg-muted rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">{label as string}</p>
                        <p className={`text-xl font-heading font-bold ${color}`}>{val as number}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleExportReport}
                  className="w-full bg-card border-2 border-primary text-primary rounded-xl px-4 py-3 font-heading font-bold text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Export Report (CSV)
                </button>
              </>
            )}
          </div>
        )}
      </main>

      <EmergencyButton />
    </div>
  );
};

export default WorkerDashboard;
