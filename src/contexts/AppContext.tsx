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
  deliveryReadiness: {
    checklist: string[];
    score: number;
    practiced: string[];
    stressLevel: number;
  };
  skinCare: {
    dailyChecklist: string[];
    streak: number;
    lastLogDate: string;
  };
  medicalHistory: {
    conditions: string[];
    otherCondition: string;
    lastUpdated: string;
  };
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "Unknown";
  gmail?: string;
  password?: string;
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
  updateFatherDetails: (motherIndex: number, fatherName: string, fatherPhone: string) => void;
  updateHealthData: (motherIndex: number, data: { bp?: string; hemoglobin?: number; ttVaccine?: boolean; ancVisits?: number }) => void;
  updateDeliveryReadiness: (motherIndex: number, data: Partial<MotherData['deliveryReadiness']>) => void;
  updateSkinCare: (motherIndex: number, data: Partial<MotherData['skinCare']>) => void;
  updateMedicalHistory: (motherIndex: number, data: Partial<Pick<MotherData, "bloodGroup" | "medicalHistory">>) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  registerMother: (data: Partial<MotherData>) => Promise<any>;
  registerFather: (data: any) => Promise<any>;
  registerHealthWorker: (data: any) => Promise<any>;
  loginUser: (email: string, password: string) => Promise<any>;
  fetchMothers: () => Promise<void>;
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
    deliveryReadiness: { checklist: [], score: 0, practiced: [], stressLevel: 3 },
    skinCare: { dailyChecklist: [], streak: 0, lastLogDate: "" },
    bloodGroup: "O+",
    medicalHistory: { conditions: [], otherCondition: "", lastUpdated: "" },
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
    deliveryReadiness: { checklist: [], score: 0, practiced: [], stressLevel: 5 },
    skinCare: { dailyChecklist: [], streak: 0, lastLogDate: "" },
    bloodGroup: "B-",
    medicalHistory: { conditions: ["High Blood Pressure"], otherCondition: "", lastUpdated: "2026-01-10" },
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
    deliveryReadiness: { checklist: [], score: 0, practiced: [], stressLevel: 2 },
    skinCare: { dailyChecklist: [], streak: 0, lastLogDate: "" },
    bloodGroup: "Unknown",
    medicalHistory: { conditions: [], otherCondition: "", lastUpdated: "" },
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

  const updateFatherDetails = useCallback((motherIndex: number, fatherName: string, fatherPhone: string) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      toast.success("Father details updated successfully");
      return { ...m, fatherName, emergencyContact: fatherPhone };
    }));
  }, []);

  const updateHealthData = useCallback((motherIndex: number, data: { bp?: string; hemoglobin?: number; ttVaccine?: boolean; ancVisits?: number }) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      const updated = { ...m };
      if (data.bp !== undefined) updated.bp = data.bp;
      if (data.hemoglobin !== undefined) updated.hemoglobin = data.hemoglobin;
      if (data.ttVaccine !== undefined) updated.ttVaccine = data.ttVaccine;
      if (data.ancVisits !== undefined) updated.ancVisits = data.ancVisits;
      toast.success("Health data updated successfully");
      return updated;
    }));
  }, []);

  const updateDeliveryReadiness = useCallback((motherIndex: number, data: Partial<MotherData['deliveryReadiness']>) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      return { ...m, deliveryReadiness: { ...m.deliveryReadiness, ...data } };
    }));
  }, []);

  const updateSkinCare = useCallback((motherIndex: number, data: Partial<MotherData['skinCare']>) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;
      return { ...m, skinCare: { ...m.skinCare, ...data } };
    }));
  }, []);

  const updateMedicalHistory = useCallback((motherIndex: number, data: Partial<Pick<MotherData, "bloodGroup" | "medicalHistory">>) => {
    setMothers(prev => prev.map((m, i) => {
      if (i !== motherIndex) return m;

      const updatedMother = { ...m, ...data };

      // Logic: Check for Rh Negative
      if (data.bloodGroup && ["A-", "B-", "O-", "AB-"].includes(data.bloodGroup)) {
        toast.warning("⚠️ Rh Negative Blood Group - Requires doctor monitoring for Anti-D injection.");
        addNotification({
          message: `🩸 Medical Alert: ${m.name} has Rh Negative blood group (${data.bloodGroup}). Check Anti-D status.`,
          type: "urgent",
          targetRole: "worker"
        });
      }

      // Logic: Risk Scoring based on conditions
      if (data.medicalHistory && data.medicalHistory.conditions.length > 0) {
        const highRiskConditions = ["High Blood Pressure", "Diabetes", "Heart Disease", "Epilepsy", "Severe Anemia"];
        const isHighRisk = data.medicalHistory.conditions.some(c => highRiskConditions.includes(c));

        if (isHighRisk && m.riskLevel !== "high") {
          updatedMother.riskLevel = "high";
          toast.error("⚠️ Risk level updated to HIGH due to medical history.");
          addNotification({
            message: `🔴 High Risk Alert: ${m.name} marked high risk due to ${data.medicalHistory.conditions.join(", ")}`,
            type: "urgent",
            targetRole: "worker"
          });
        }
      }

      return updatedMother;
    }));
  }, [addNotification]);

  const sendChatMessage = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg = { ...msg, id: Date.now().toString(), timestamp: new Date() };
    setChatMessages(prev => [...prev, newMsg]);
    toast.success("Message sent to health worker");
  }, []);

  /* ================= INTEGRATION: LOGIN ================= */
  const loginUser = useCallback(async (email: string, password: string) => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    try {
      console.log(`Attempting login to ${API_URL}/api/login`);
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login failed");

      localStorage.setItem("token", result.token);
      localStorage.setItem("userRole", result.role);
      toast.success("Login successful!");
      return result;
    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.name === "TypeError" && error.message === "Failed to fetch"
        ? "Cannot connect to server. Please ensure the backend is running."
        : (error.message || "Connection error");
      toast.error(msg);
      throw error;
    }
  }, []);

  /* ================= INTEGRATION: REGISTER MOTHER ================= */
  const registerMother = useCallback(async (data: Partial<MotherData>) => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    try {
      console.log("Attempting to register mother:", data);
      const response = await fetch(`${API_URL}/api/register/mother`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: data.name,
          age: data.age,
          phone_number: data.phone,
          village: data.village,
          location: data.location,
          blood_group: data.bloodGroup || "Unknown",
          pre_existing_conditions: data.medicalHistory ? JSON.stringify(data.medicalHistory) : null,
          email: data.gmail,
          password: data.password,
          lmp_date: data.lmpDate
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");

      toast.success("Mother registered successfully!");
      return result;
    } catch (error: any) {
      console.error("Registration Error:", error);
      const msg = error.name === "TypeError" && error.message === "Failed to fetch"
        ? "Cannot connect to server. Please ensure the backend is running."
        : (error.message || "Registration failed");
      toast.error(msg);
      throw error;
    }
  }, []);

  /* ================= INTEGRATION: REGISTER FATHER ================= */
  const registerFather = useCallback(async (data: any) => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    try {
      const response = await fetch(`${API_URL}/api/register/father`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          father_name: data.fatherName,
          wife_name: data.wifeName,
          wife_age: data.wifeAge,
          location: data.location,
          email: data.gmail,
          password: data.password
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");
      toast.success("Father registered successfully!");
      return result;
    } catch (error: any) {
      const msg = error.name === "TypeError" && error.message === "Failed to fetch"
        ? "Cannot connect to server. Please ensure the backend is running."
        : (error.message || "Registration failed");
      toast.error(msg);
      throw error;
    }
  }, []);

  /* ================= INTEGRATION: REGISTER WORKER ================= */
  const registerHealthWorker = useCallback(async (data: any) => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    try {
      const response = await fetch(`${API_URL}/api/register/healthworker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.name,
          anganwadi_location: data.anganwadiLocation,
          email: data.gmail,
          password: data.password
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Registration failed");
      toast.success("Health Worker registered successfully!");
      return result;
    } catch (error: any) {
      const msg = error.name === "TypeError" && error.message === "Failed to fetch"
        ? "Cannot connect to server. Please ensure the backend is running."
        : (error.message || "Registration failed");
      toast.error(msg);
      throw error;
    }
  }, []);

  const fetchMothers = useCallback(async () => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");
    try {
      const response = await fetch(`${API_URL}/api/mothers`);
      if (!response.ok) throw new Error("Failed to fetch mothers");
      const data = await response.json();

      // Map backend data to frontend MotherData structure
      const mappedMothers: MotherData[] = data.map((m: any) => {
        let pregnancyWeek = 28;
        let dueDate = "2026-05-15";

        if (m.lmp_date) {
          const lmp = new Date(m.lmp_date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - lmp.getTime());
          pregnancyWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

          const edd = new Date(lmp.getTime());
          edd.setDate(edd.getDate() + 280); // 280 days = 40 weeks
          dueDate = edd.toISOString().split("T")[0];
        }

        return {
          id: m.id.toString(),
          name: m.full_name,
          age: m.age,
          village: m.village,
          location: m.location,
          phone: m.phone_number,
          pregnancyWeek,
          dueDate,
          lmpDate: m.lmp_date || "2025-08-15",
          riskLevel: m.blood_group?.endsWith("-") ? "high" : "low",
          nextANC: "2026-02-20",
          weight: 60,
          weightHistory: [],
          bp: "120/80",
          hemoglobin: 12,
          ifaTablets: 90,
          ifaMissedDays: 0,
          ttVaccine: true,
          ancVisits: 2,
          waterIntake: 8,
          foodChecklist: [],
          dangerSigns: [],
          schemeStatus: { pmmvy: "Pending", jsy: "Eligible", nutrition: "Active" },
          schemeEligibility: { pmmvy: true, jsy: true, nutrition: true },
          fatherName: "N/A",
          emergencyContact: m.phone_number,
          verified: false,
          mcpNumber: "",
          familyMembers: [],
          birthPreparedness: {},
          transportReady: false,
          hospitalBagReady: false,
          hospitalBagItems: {},
          deliveryReadiness: { checklist: [], score: 0, practiced: [], stressLevel: 3 },
          skinCare: { dailyChecklist: [], streak: 0, lastLogDate: "" },
          bloodGroup: m.blood_group as MotherData["bloodGroup"],
          medicalHistory: m.pre_existing_conditions ? JSON.parse(m.pre_existing_conditions) : { conditions: [], otherCondition: "", lastUpdated: "" },
          status: "active",
          gmail: m.email
        };
      });

      setMothers(mappedMothers);
    } catch (error) {
      console.error("Error fetching mothers:", error);
      toast.error("Failed to load mothers list from server");
    }
  }, []);

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
      confirmTransport, updateHospitalBag, updateFatherDetails, updateHealthData, updateDeliveryReadiness, updateSkinCare, updateMedicalHistory, chatMessages, sendChatMessage,
      registerMother, registerFather, registerHealthWorker, loginUser, fetchMothers, generateReport
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
