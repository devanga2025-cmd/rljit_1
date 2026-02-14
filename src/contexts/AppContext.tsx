import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

interface WeightRecord {
  date: string;
  weight: number;
}

interface MotherData {
  id: string;
  name: string;
  age: number;
  village: string;
  location: string;
  phone: string;
  pregnancyWeek: number;
  dueDate: string;
  lmpDate: string;
  riskLevel: "low" | "medium" | "high";
  nextANC: string;
  weight: number;
  weightHistory: WeightRecord[];
  bp: string;
  hemoglobin: number;
  ifaTablets: number;
  ifaMissedDays: number;
  ttVaccine: boolean;
  ancVisits: number;
  waterIntake: number;
  foodChecklist: string[];
  dangerSigns: string[];
  schemeStatus: { pmmvy: string; jsy: string; nutrition: string };
  schemeEligibility: { pmmvy: boolean; jsy: boolean; nutrition: boolean };
  fatherName: string;
  emergencyContact: string;
  verified: boolean;
  mcpNumber: string;
  familyMembers: { name: string; relation: string; phone: string }[];
  birthPreparedness: { [key: string]: boolean };
  transportReady: boolean;
  hospitalBagReady: boolean;
  hospitalBagItems: { [key: string]: boolean };
  status: "pending" | "active";
}

interface Notification {
  id: string;
  message: string;
  type: "info" | "warning" | "urgent";
  timestamp: Date;
  read: boolean;
  targetRole: "mother" | "father" | "worker" | "all";
}

interface Visit {
  id: string;
  motherId: string;
  date: string;
  notes: string;
  type: "home" | "clinic";
  bp?: string;
  weight?: number;
  riskFound?: boolean;
}

interface ChatMessage {
  id: string;
  from: "father" | "worker";
  message: string;
  timestamp: Date;
}

interface AppContextType {
  mothers: MotherData[];
  setMothers: React.Dispatch<React.SetStateAction<MotherData[]>>;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  visits: Visit[];
  addVisit: (v: Omit<Visit, "id">) => void;
  fatherTasks: { id: string; task: string; done: boolean }[];
  toggleFatherTask: (id: string) => void;
  updateMotherWeight: (motherIndex: number, weight: number) => void;
  markIFATaken: (motherIndex: number) => void;
  reportSymptoms: (motherIndex: number, symptoms: string[]) => void;
  addFamilyMember: (motherIndex: number, member: { name: string; relation: string; phone: string }) => void;
  checkSchemeEligibility: (motherIndex: number) => { pmmvy: boolean; jsy: boolean; nutrition: boolean };
  verifyMother: (motherIndex: number) => void;
  markHighRisk: (motherIndex: number) => void;
  sendReminder: (motherIndex: number, reminderType: string) => void;
  confirmTransport: (motherIndex: number) => void;
  updateHospitalBag: (motherIndex: number, item: string, checked: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  registerMother: (data: Partial<MotherData>) => void;
  generateReport: () => { total: number; highRisk: number; overdueANC: number; verified: number; homeVisits: number; pending: number };
}

const sampleMothers: MotherData[] = [
  {
    id: "m1", name: "Priya Sharma", age: 25, village: "Hulimavu", location: "Bangalore South",
    phone: "9876543210", pregnancyWeek: 28, dueDate: "2026-05-15", lmpDate: "2025-08-15",
    riskLevel: "low", nextANC: "2026-02-20", weight: 62,
    weightHistory: [{ date: "2026-01-01", weight: 60 }, { date: "2026-01-15", weight: 61 }, { date: "2026-02-01", weight: 62 }],
    bp: "120/80", hemoglobin: 11.5, ifaTablets: 90, ifaMissedDays: 0,
    ttVaccine: true, ancVisits: 3, waterIntake: 6,
    foodChecklist: ["Iron-rich foods", "Milk", "Green vegetables"], dangerSigns: [],
    schemeStatus: { pmmvy: "2nd Installment", jsy: "Eligible", nutrition: "Active" },
    schemeEligibility: { pmmvy: true, jsy: true, nutrition: true },
    fatherName: "Rahul Sharma", emergencyContact: "9876543210", verified: true, mcpNumber: "MCP-2026-001",
    familyMembers: [{ name: "Rahul Sharma", relation: "Husband", phone: "9876543210" }],
    birthPreparedness: { "Hospital identified": true, "Transport arranged": false, "Money saved": true },
    transportReady: false, hospitalBagReady: false,
    hospitalBagItems: { "Clothes for baby": false, "Sanitary pads": false, "Documents": true, "Money": true, "Emergency numbers": true },
    status: "active"
  },
  {
    id: "m2", name: "Anita Devi", age: 22, village: "Jayanagar", location: "Bangalore South",
    phone: "9876543211", pregnancyWeek: 34, dueDate: "2026-03-28", lmpDate: "2025-07-01",
    riskLevel: "high", nextANC: "2026-02-15", weight: 55,
    weightHistory: [{ date: "2026-01-01", weight: 54 }, { date: "2026-02-01", weight: 55 }],
    bp: "140/95", hemoglobin: 8.2, ifaTablets: 45, ifaMissedDays: 5,
    ttVaccine: true, ancVisits: 2, waterIntake: 4,
    foodChecklist: ["Iron-rich foods"], dangerSigns: ["High BP", "Severe anemia"],
    schemeStatus: { pmmvy: "1st Installment", jsy: "Eligible", nutrition: "Pending" },
    schemeEligibility: { pmmvy: true, jsy: true, nutrition: true },
    fatherName: "Suresh Kumar", emergencyContact: "9876543211", verified: true, mcpNumber: "MCP-2026-002",
    familyMembers: [{ name: "Suresh Kumar", relation: "Husband", phone: "9876543211" }],
    birthPreparedness: { "Hospital identified": true, "Transport arranged": false },
    transportReady: false, hospitalBagReady: false,
    hospitalBagItems: {},
    status: "active"
  },
  {
    id: "m3", name: "Kavita Gowda", age: 28, village: "Basavanagudi", location: "Bangalore South",
    phone: "9876543212", pregnancyWeek: 16, dueDate: "2026-07-10", lmpDate: "2025-10-01",
    riskLevel: "medium", nextANC: "2026-02-25", weight: 58,
    weightHistory: [{ date: "2026-01-15", weight: 57 }, { date: "2026-02-01", weight: 58 }],
    bp: "130/85", hemoglobin: 9.8, ifaTablets: 30, ifaMissedDays: 2,
    ttVaccine: false, ancVisits: 1, waterIntake: 5,
    foodChecklist: ["Milk", "Fruits"], dangerSigns: ["Missed TT vaccine"],
    schemeStatus: { pmmvy: "Applied", jsy: "Pending", nutrition: "Active" },
    schemeEligibility: { pmmvy: true, jsy: false, nutrition: true },
    fatherName: "Ravi Gowda", emergencyContact: "9876543212", verified: false, mcpNumber: "",
    familyMembers: [],
    birthPreparedness: {},
    transportReady: false, hospitalBagReady: false,
    hospitalBagItems: {},
    status: "pending"
  },
];

const defaultFatherTasks = [
  { id: "1", task: "Arrange transport to hospital", done: false },
  { id: "2", task: "Buy iron & calcium supplements", done: true },
  { id: "3", task: "Accompany to next ANC visit", done: false },
  { id: "4", task: "Prepare hospital bag", done: false },
  { id: "5", task: "Save emergency money (₹5000)", done: true },
  { id: "6", task: "Know nearest blood bank", done: false },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mothers, setMothers] = useState<MotherData[]>(sampleMothers);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", message: "New mother registered: Kavita Gowda (Basavanagudi)", type: "info", timestamp: new Date(), read: false, targetRole: "worker" },
    { id: "2", message: "HIGH RISK: Anita Devi - BP 140/95, Hb 8.2", type: "urgent", timestamp: new Date(), read: false, targetRole: "worker" },
  ]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [fatherTasks, setFatherTasks] = useState(defaultFatherTasks);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif = { ...n, id: Date.now().toString(), timestamp: new Date(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    toast(n.message, { description: n.type === "urgent" ? "⚠️ Urgent" : undefined });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const addVisit = useCallback((v: Omit<Visit, "id">) => {
    setVisits(prev => [{ ...v, id: Date.now().toString() }, ...prev]);
  }, []);

  const toggleFatherTask = useCallback((id: string) => {
    setFatherTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const updateMotherWeight = useCallback((motherIndex: number, weight: number) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      const newHistory = [...m.weightHistory, { date: new Date().toISOString().split("T")[0], weight }];
      const prevWeight = m.weight;
      const diff = weight - prevWeight;
      const abnormal = diff > 3 || diff < -2;
      if (abnormal) {
        addNotification({
          message: `⚠️ Abnormal weight change for ${m.name}: ${prevWeight}kg → ${weight}kg (${diff > 0 ? "+" : ""}${diff.toFixed(1)}kg)`,
          type: "warning",
          targetRole: "worker"
        });
      }
      toast.success(`Weight updated: ${weight}kg (${diff > 0 ? "+" : ""}${diff.toFixed(1)}kg change)`);
      return { ...m, weight, weightHistory: newHistory };
    }));
  }, [addNotification]);

  const markIFATaken = useCallback((motherIndex: number) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      const newCount = m.ifaTablets + 1;
      toast.success(`IFA tablet marked! Total: ${newCount} tablets`);
      if (m.ifaMissedDays >= 3) {
        addNotification({
          message: `⚠️ ${m.name} had missed ${m.ifaMissedDays} days of IFA before resuming`,
          type: "warning",
          targetRole: "worker"
        });
      }
      return { ...m, ifaTablets: newCount, ifaMissedDays: 0 };
    }));
  }, [addNotification]);

  const reportSymptoms = useCallback((motherIndex: number, symptoms: string[]) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      const severe = symptoms.length >= 3;
      if (severe || symptoms.some(s => ["Vaginal bleeding", "Convulsions", "Water breaking early"].includes(s))) {
        addNotification({
          message: `🚨 CRITICAL: ${m.name} reports severe symptoms: ${symptoms.join(", ")}`,
          type: "urgent",
          targetRole: "worker"
        });
        addNotification({
          message: `🚨 Emergency alert for ${m.name} - Please call 108 immediately`,
          type: "urgent",
          targetRole: "father"
        });
      } else if (symptoms.length > 0) {
        addNotification({
          message: `⚠️ ${m.name} reports symptoms: ${symptoms.join(", ")}`,
          type: "warning",
          targetRole: "worker"
        });
      }
      return { ...m, dangerSigns: [...new Set([...m.dangerSigns, ...symptoms])] };
    }));
  }, [addNotification]);

  const addFamilyMember = useCallback((motherIndex: number, member: { name: string; relation: string; phone: string }) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      toast.success(`Family member ${member.name} added successfully`);
      addNotification({
        message: `New family member added for ${m.name}: ${member.name} (${member.relation})`,
        type: "info",
        targetRole: "worker"
      });
      return { ...m, familyMembers: [...m.familyMembers, member] };
    }));
  }, [addNotification]);

  const checkSchemeEligibility = useCallback((motherIndex: number) => {
    const m = mothers[motherIndex];
    const pmmvy = m.ancVisits >= 1 && m.pregnancyWeek >= 6;
    const jsy = m.age >= 19 && (m.riskLevel !== "high" || true);
    const nutrition = m.pregnancyWeek >= 12;
    setMothers(prev => prev.map((mot, i) =>
      i === motherIndex ? { ...mot, schemeEligibility: { pmmvy, jsy, nutrition } } : mot
    ));
    toast.success("Scheme eligibility checked!");
    return { pmmvy, jsy, nutrition };
  }, [mothers]);

  const verifyMother = useCallback((motherIndex: number) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      const mcpNumber = `MCP-2026-${String(Date.now()).slice(-4)}`;
      toast.success(`${m.name} verified! MCP: ${mcpNumber}`);
      addNotification({
        message: `✅ ${m.name} has been verified. MCP Number: ${mcpNumber}`,
        type: "info",
        targetRole: "all"
      });
      return { ...m, verified: true, status: "active" as const, mcpNumber };
    }));
  }, [addNotification]);

  const markHighRisk = useCallback((motherIndex: number) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      toast.error(`${m.name} marked as HIGH RISK`);
      addNotification({
        message: `🔴 HIGH RISK: ${m.name} has been flagged. Alert sent to ANM/PHC.`,
        type: "urgent",
        targetRole: "all"
      });
      return { ...m, riskLevel: "high" as const };
    }));
  }, [addNotification]);

  const sendReminder = useCallback((motherIndex: number, reminderType: string) => {
    const m = mothers[motherIndex];
    toast.success(`Reminder sent to ${m.name}: ${reminderType}`);
    addNotification({
      message: `📩 Reminder sent to ${m.name}: ${reminderType}`,
      type: "info",
      targetRole: "mother"
    });
    addNotification({
      message: `📩 Reminder for your wife: ${reminderType}`,
      type: "info",
      targetRole: "father"
    });
  }, [mothers, addNotification]);

  const confirmTransport = useCallback((motherIndex: number) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      toast.success("Transport confirmed! Birth preparedness score updated.");
      addNotification({
        message: `✅ Transport arranged for ${m.name} by family`,
        type: "info",
        targetRole: "worker"
      });
      return { ...m, transportReady: true, birthPreparedness: { ...m.birthPreparedness, "Transport arranged": true } };
    }));
  }, [addNotification]);

  const updateHospitalBag = useCallback((motherIndex: number, item: string, checked: boolean) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      const newItems = { ...m.hospitalBagItems, [item]: checked };
      const allReady = Object.values(newItems).every(v => v);
      if (allReady && Object.keys(newItems).length >= 5) {
        toast.success("🎒 Hospital bag fully packed!");
        addNotification({
          message: `✅ Hospital bag packed for ${m.name}`,
          type: "info",
          targetRole: "worker"
        });
      }
      return { ...m, hospitalBagItems: newItems, hospitalBagReady: allReady };
    }));
  }, [addNotification]);

  const sendChatMessage = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg = { ...msg, id: Date.now().toString(), timestamp: new Date() };
    setChatMessages(prev => [...prev, newMsg]);
    toast.success("Message sent to health worker");
  }, []);

  const registerMother = useCallback((data: Partial<MotherData>) => {
    const lmp = data.lmpDate ? new Date(data.lmpDate) : new Date();
    const today = new Date();
    const diffWeeks = Math.floor((today.getTime() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);

    const newMother: MotherData = {
      id: `m${Date.now()}`,
      name: data.name || "",
      age: data.age || 25,
      village: data.village || "",
      location: data.location || "",
      phone: data.phone || "",
      pregnancyWeek: Math.min(diffWeeks, 42),
      dueDate: dueDate.toISOString().split("T")[0],
      lmpDate: data.lmpDate || "",
      riskLevel: "low",
      nextANC: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      weight: 55,
      weightHistory: [],
      bp: "120/80",
      hemoglobin: 11,
      ifaTablets: 0,
      ifaMissedDays: 0,
      ttVaccine: false,
      ancVisits: 0,
      waterIntake: 0,
      foodChecklist: [],
      dangerSigns: [],
      schemeStatus: { pmmvy: "Not Applied", jsy: "Pending", nutrition: "Pending" },
      schemeEligibility: { pmmvy: false, jsy: false, nutrition: false },
      fatherName: "",
      emergencyContact: data.phone || "",
      verified: false,
      mcpNumber: "",
      familyMembers: [],
      birthPreparedness: {},
      transportReady: false,
      hospitalBagReady: false,
      hospitalBagItems: {},
      status: "pending"
    };

    setMothers(prev => [...prev, newMother]);
    addNotification({
      message: `New mother registered: ${newMother.name} (${newMother.village})`,
      type: "info",
      targetRole: "worker"
    });
    toast.success(`Welcome ${newMother.name}! Your pregnancy dashboard is ready.`);
  }, [addNotification]);

  const generateReport = useCallback(() => {
    return {
      total: mothers.length,
      highRisk: mothers.filter(m => m.riskLevel === "high").length,
      overdueANC: mothers.filter(m => m.ancVisits < Math.floor(m.pregnancyWeek / 10)).length,
      verified: mothers.filter(m => m.verified).length,
      homeVisits: visits.length,
      pending: mothers.filter(m => !m.verified).length,
    };
  }, [mothers, visits]);

  return (
    <AppContext.Provider value={{
      mothers, setMothers, notifications, addNotification, markNotificationRead,
      visits, addVisit, fatherTasks, toggleFatherTask,
      updateMotherWeight, markIFATaken, reportSymptoms, addFamilyMember,
      checkSchemeEligibility, verifyMother, markHighRisk, sendReminder,
      confirmTransport, updateHospitalBag, chatMessages, sendChatMessage,
      registerMother, generateReport
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
