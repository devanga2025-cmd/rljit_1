import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import DashboardHeader from "@/components/DashboardHeader";
import EmergencyButton from "@/components/EmergencyButton";
import StatCard from "@/components/StatCard";
import { Baby, Calendar, AlertTriangle, CheckCircle2, Circle, Phone, MapPin, Bell, Heart, Send, MessageSquare, Truck, Briefcase, BookOpen, Stethoscope, Pill, Star } from "lucide-react";
import { toast } from "sonner";

const FatherDashboard = () => {
  const { t } = useLanguage();
  const {
    mothers, fatherTasks, toggleFatherTask, notifications,
    confirmTransport, updateHospitalBag, chatMessages, sendChatMessage, addNotification
  } = useApp();
  const mother = mothers[0];
  const [activeTab, setActiveTab] = useState("summary");
  const [chatInput, setChatInput] = useState("");
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  const hospitalBagItems = [
    "Clothes for mother", "Clothes for baby", "Sanitary pads",
    "Towels", "Documents (Aadhaar, MCP card)", "Money (₹5000+)",
    "Emergency contact list", "Snacks & water"
  ];

  const tabs = [
    { id: "summary", label: "Mother's Summary", icon: Heart },
    { id: "tasks", label: t("support.tasks"), icon: CheckCircle2 },
    { id: "guidance", label: t("weekly.guidance"), icon: Baby },
    { id: "health", label: "Doctors & Medicine", icon: Stethoscope },
    { id: "emergency", label: t("emergency"), icon: Phone },
  ];

  const weeklyGuidance = [
    { title: `Week ${mother.pregnancyWeek}: Your Baby`, content: "Your baby weighs about 1kg now and can open/close eyes. Brain is developing rapidly. Baby responds to your voice – talk and sing!" },
    { title: "Support Your Wife By…", content: "Help with household chores, ensure she takes IFA tablets daily, accompany her on evening walks, and remind her to drink water frequently." },
    { title: "Prepare For Delivery", content: "Identify the nearest hospital, save emergency contact numbers, arrange reliable transport, and keep ₹5,000 ready for emergencies." },
  ];

  const preparednessScore = () => {
    const items = [
      mother.transportReady,
      mother.hospitalBagReady,
      fatherTasks.filter(t => t.done).length >= 4,
    ];
    return Math.round((items.filter(Boolean).length / items.length) * 100);
  };

  const handleConfirmTransport = () => {
    confirmTransport(0);
  };

  const handleBagItem = (item: string, checked: boolean) => {
    updateHospitalBag(0, item, checked);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    sendChatMessage({ from: "father", message: chatInput.trim() });
    setChatInput("");
  };

  const handleViewAppointment = () => {
    setShowAppointmentDetails(true);
    toast.success("Reminder will be sent 24 hours before the appointment");
    addNotification({
      message: `📅 Reminder set: ANC visit on ${mother.nextANC}`,
      type: "info",
      targetRole: "father"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title={`👨‍👩‍👧 ${localStorage.getItem("fatherName") || "Father"}'s Dashboard`} gradient="gradient-father" />

      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "gradient-father text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"
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
        {activeTab === "summary" && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Baby} label={t("pregnancy.week")} value={`Week ${mother.pregnancyWeek}`} color="text-secondary" />
              <StatCard icon={Calendar} label={t("due.date")} value={mother.dueDate} color="text-secondary" />
              <StatCard icon={Calendar} label={t("next.anc")} value={mother.nextANC} color="text-primary" />
              <StatCard icon={AlertTriangle} label={t("risk.status")} value={t(mother.riskLevel)} color={mother.riskLevel === "high" ? "text-destructive" : "text-secondary"} />
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-2">Pregnancy Progress</h3>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="gradient-father h-3 rounded-full transition-all" style={{ width: `${(mother.pregnancyWeek / 40) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{mother.pregnancyWeek}/40 weeks • {40 - mother.pregnancyWeek} weeks remaining</p>
            </div>

            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-2">Birth Preparedness Score</h3>
              <div className="w-full bg-muted rounded-full h-4">
                <div className={`h-4 rounded-full transition-all ${preparednessScore() >= 80 ? "bg-secondary" : preparednessScore() >= 50 ? "bg-accent" : "bg-destructive"}`} style={{ width: `${preparednessScore()}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{preparednessScore()}% ready</p>
            </div>

            {/* View Appointment */}
            <button onClick={handleViewAppointment} className="w-full gradient-father text-primary-foreground rounded-xl px-4 py-3 font-heading font-bold text-sm flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> View Next Appointment
            </button>

            {showAppointmentDetails && (
              <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20 animate-slide-up">
                <h3 className="font-heading font-bold text-card-foreground mb-3">📅 Next Appointment</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-heading font-semibold text-card-foreground">{mother.nextANC}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-heading font-semibold text-card-foreground">ANC Visit #{mother.ancVisits + 1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reminder:</span>
                    <span className="text-secondary font-heading font-semibold">✅ Set (24hrs before)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4 animate-slide-up">
            {/* Transport & Hospital Bag Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleConfirmTransport}
                className={`rounded-xl p-4 font-heading font-bold text-sm text-center ${mother.transportReady
                  ? "bg-secondary/20 text-secondary border-2 border-secondary"
                  : "gradient-father text-primary-foreground"
                  }`}
              >
                <Truck className="w-6 h-6 mx-auto mb-1" />
                {mother.transportReady ? "✅ Transport Ready" : "Confirm Transport"}
              </button>
              <button
                onClick={() => setActiveTab("tasks")}
                className={`rounded-xl p-4 font-heading font-bold text-sm text-center ${mother.hospitalBagReady
                  ? "bg-secondary/20 text-secondary border-2 border-secondary"
                  : "bg-accent text-accent-foreground"
                  }`}
              >
                <Briefcase className="w-6 h-6 mx-auto mb-1" />
                {mother.hospitalBagReady ? "✅ Bag Ready" : "Pack Hospital Bag"}
              </button>
            </div>

            {/* Hospital Bag Checklist */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">🎒 Hospital Bag Items</h3>
              {hospitalBagItems.map((item) => (
                <label key={item} className="flex items-center gap-3 py-2 border-b border-border last:border-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mother.hospitalBagItems[item] || false}
                    onChange={(e) => handleBagItem(item, e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className={`text-sm ${mother.hospitalBagItems[item] ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{item}</span>
                </label>
              ))}
              <div className="mt-3 bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">
                  {Object.values(mother.hospitalBagItems).filter(Boolean).length}/{hospitalBagItems.length} items packed
                </p>
              </div>
            </div>

            {/* Support Checklist */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-4">Support Checklist</h3>
              <div className="space-y-1">
                {fatherTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleFatherTask(task.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${task.done ? "bg-secondary/10" : "bg-muted"
                      }`}
                  >
                    {task.done ? <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                    <span className={`text-sm ${task.done ? "line-through text-muted-foreground" : "text-card-foreground"}`}>{task.task}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{fatherTasks.filter(t => t.done).length}/{fatherTasks.length} tasks completed</p>
              </div>
            </div>

            {/* Ask Health Worker Chat */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Ask Health Worker
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                {chatMessages.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No messages yet. Ask your health worker anything!</p>
                )}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`p-2 rounded-lg text-sm ${msg.from === "father" ? "bg-primary/10 text-card-foreground ml-8" : "bg-muted text-card-foreground mr-8"}`}>
                    <p>{msg.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm border-0"
                />
                <button onClick={handleSendChat} className="gradient-father text-primary-foreground px-4 py-2 rounded-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "guidance" && (
          <div className="space-y-4 animate-slide-up">
            {weeklyGuidance.map((g, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 shadow-card">
                <h3 className="font-heading font-bold text-card-foreground mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.content}</p>
              </div>
            ))}

            {/* Book Suggestions */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-primary/20">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> 📚 Books to Gift Your Wife
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Reading reduces stress and helps bonding – surprise her with one!</p>
              {[
                { title: "The Pregnancy Book", author: "Public Health Agency (Northern Ireland)", desc: " Comprehensive guide covering pregnancy stages, health tips, antenatal care and emotional support for expectant mothers", icon: "📖" },
                { title: "Sukhaprasavam (Telugu)", author: "G. Samaram", desc: "A classic Telugu pregnancy book that discusses prenatal care, childbirth, and mental preparedness in simple language.", icon: "🌿" },
                { title: "Aai Hotana (Hindi)", author: "Prayas Health Group", desc: "A sensitive and simple booklet for pregnant women covering emotional and physical changes during pregnancy.", icon: "👶" },
                { title: "Garbha Samskara Pregnancy Guide (Kannada)", author: "pregnancy care principles", desc: " Explains positive practices, prenatal rituals, and mental well-being during pregnancy, drawing from cultural and supportive guidance.", icon: "📊" },
                { title: "கர்ப்பம் மற்றும் குழந்தைப் பராமரிப்பு (Karppam Matrum Kuzhanthaip Paaramarippu)", author: "Dr. N. Meenakshi (Pregnancy & Childcare Guide)", desc: " A helpful Tamil book that explains pregnancy stages, women’s health care, nutrition tips,", icon: "👨‍👩‍👧" },
              ].map((book, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <span className="text-2xl">{book.icon}</span>
                  <div>
                    <p className="text-sm font-heading font-semibold text-card-foreground">{book.title}</p>
                    <p className="text-[10px] text-primary font-bold">by {book.author}</p>
                    <p className="text-xs text-muted-foreground">{book.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div className="space-y-4 animate-slide-up">
            {/* Doctor List */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" /> 🏥 Doctors to Contact
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Keep these numbers saved for emergencies</p>
              {[
                { name: "Dr. Priya Sharma", spec: "Obstetrician & Gynecologist", phone: "9876543210", hospital: "District Hospital", avail: "Mon-Sat, 9AM-5PM" },
                { name: "Dr. Ramesh Kumar", spec: "General Physician", phone: "9876543211", hospital: "PHC Jayanagar", avail: "Mon-Fri, 10AM-4PM" },
                { name: "Dr. Anjali Desai", spec: "Pediatrician (for baby)", phone: "9876543212", hospital: "Mother & Child Hospital", avail: "Mon-Sat, 9AM-6PM" },
                { name: "Dr. Suresh Patil", spec: "Emergency Medicine", phone: "9876543213", hospital: "Government Hospital", avail: "24/7 Emergency" },
                { name: "ANM Lakshmi", spec: "Auxiliary Nurse Midwife", phone: "9876543214", hospital: "Sub-center", avail: "Mon-Sat, 8AM-4PM" },
              ].map((doc, i) => (
                <div key={i} className="py-3 border-b border-border last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-heading font-semibold text-card-foreground">{doc.name}</p>
                      <p className="text-xs text-primary font-bold">{doc.spec}</p>
                      <p className="text-xs text-muted-foreground">🏥 {doc.hospital}</p>
                      <p className="text-xs text-muted-foreground">🕐 {doc.avail}</p>
                    </div>
                    <a href={`tel:${doc.phone}`} className="gradient-father text-primary-foreground px-3 py-2 rounded-lg text-xs font-heading font-bold flex items-center gap-1 shrink-0">
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Tablets */}
            <div className="bg-card rounded-2xl p-5 shadow-card border-2 border-destructive/20">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <Pill className="w-5 h-5 text-destructive" /> 💊 Essential Tablets & Medicine
              </h3>
              <p className="text-xs text-destructive font-bold mb-3">⚠️ Always consult a doctor before taking any medicine</p>
              {[
                { name: "IFA Tablets (Iron + Folic Acid)", purpose: "Prevents anemia – take 1 daily after meals", status: "Daily", icon: "🔴" },
                { name: "Calcium Tablets (500mg)", purpose: "Strong bones for mother & baby – take 2 daily", status: "Daily", icon: "🦴" },
                { name: "Folic Acid (5mg)", purpose: "Prevents birth defects – critical in first trimester", status: "Daily", icon: "💚" },
                { name: "Paracetamol (500mg)", purpose: "For fever/headache ONLY – doctor approved dose", status: "Emergency", icon: "🌡️" },
                { name: "ORS Packets", purpose: "For dehydration during vomiting/diarrhea", status: "Emergency", icon: "💧" },
                { name: "Antacid (Ranitidine)", purpose: "For severe acidity – only if prescribed", status: "As needed", icon: "🫗" },
              ].map((med, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <span className="text-xl">{med.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-heading font-semibold text-card-foreground">{med.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${med.status === "Daily" ? "bg-secondary/20 text-secondary" : med.status === "Emergency" ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"
                        }`}>{med.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{med.purpose}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Emergency Kit Checklist */}
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">🩺 Emergency Kit Checklist</h3>
              {["IFA + Calcium tablets (30 day supply)", "ORS packets (5 nos)", "Paracetamol (strip)", "Thermometer", "BP Monitor (if available)", "Clean cloth/towels", "Torch with batteries", "Emergency money (₹5000)"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-2 text-sm text-muted-foreground border-b border-border last:border-0">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="space-y-4 animate-slide-up">
            <a href="tel:108" className="block gradient-emergency text-primary-foreground rounded-2xl p-6 shadow-hero text-center">
              <Phone className="w-10 h-10 mx-auto mb-2" />
              <h3 className="font-heading font-bold text-2xl">Call 108</h3>
              <p className="text-sm opacity-90">Emergency Ambulance Service</p>
            </a>
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Nearest Facilities
              </h3>
              {["District Hospital (5 km)", "PHC Jayanagar (2 km)", "Anganwadi Center (0.5 km)"].map((place, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-card-foreground">{place}</span>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-2xl p-5 shadow-card">
              <h3 className="font-heading font-bold text-card-foreground mb-3">Contact Anganwadi</h3>
              <a href="tel:9876543213" className="gradient-worker text-primary-foreground rounded-xl px-4 py-3 font-heading font-bold text-sm inline-flex items-center gap-2">
                <Phone className="w-4 h-4" /> Call Health Worker
              </a>
            </div>
          </div>
        )}
      </main>

      <EmergencyButton />
    </div>
  );
};

export default FatherDashboard;
