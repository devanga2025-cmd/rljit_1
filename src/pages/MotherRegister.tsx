import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import LanguageToggle from "@/components/LanguageToggle";
import EmergencyButton from "@/components/EmergencyButton";
import PrivacyConsentDialog from "@/components/PrivacyConsentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";

const MotherRegister = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { registerMother, loginUser } = useApp();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    village: "",
    location: "",
    gmail: "",
    phone: "",
    password: "",
    lmpDate: "",
  });
  const [calculatedWeek, setCalculatedWeek] = useState<number | null>(null);
  const [calculatedDueDate, setCalculatedDueDate] = useState<string>("");
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<React.FormEvent | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "lmpDate" && value) {
      const lmp = new Date(value);
      const today = new Date();
      const weeks = Math.floor((today.getTime() - lmp.getTime()) / (7 * 24 * 60 * 60 * 1000));
      const due = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
      setCalculatedWeek(Math.min(Math.max(weeks, 0), 42));
      setCalculatedDueDate(due.toISOString().split("T")[0]);
    }
  };

  // Note: Consent dialog will be shown when form is submitted if consent is missing

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingFormData(e);
    setFormSubmitted(true);
    setShowConsentDialog(true);
  };

  const proceedWithRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (isLogin) {
        await loginUser(form.gmail, form.password);
        localStorage.setItem("userRole", "mother");
        navigate("/mother");
      } else {
        if (!form.lmpDate) {
          toast.error("Please enter your Last Menstrual Period (LMP) date");
          return;
        }
        if (parseInt(form.age) < 20 || parseInt(form.age) > 40) {
          toast.error("Age must be between 20 and 40");
          return;
        }
        if (form.phone.length !== 10) {
          toast.error("Phone number must be exactly 10 digits");
          return;
        }

        await registerMother({
          name: form.name,
          age: parseInt(form.age),
          village: form.village,
          location: form.location,
          phone: form.phone,
          lmpDate: form.lmpDate,
          gmail: form.gmail,
          password: form.password
        });

        localStorage.setItem("motherName", form.name);
        setIsLogin(true); // Switch to login after successful register
        toast.info("Please login with your new account");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleConsentAccept = () => {
    setShowConsentDialog(false);
    // Mark as accepted for this session
    sessionStorage.setItem("privacyConsent_mother_session", "true");

    if (formSubmitted && pendingFormData) {
      proceedWithRegistration();
      setFormSubmitted(false);
      setPendingFormData(null);
    }
  };

  const handleConsentCancel = () => {
    setShowConsentDialog(false);
    setFormSubmitted(false);
    setPendingFormData(null);
    toast.error("Action cancelled. Consent is required to proceed.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-background to-rose-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body text-sm">Back</span>
        </button>
        <LanguageToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-hero border-primary/20">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full gradient-mother flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl text-foreground">
              🤰 {isLogin ? "Mother Login" : "Mother Registration"}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-body">
              {isLogin ? "Welcome back! Login to your account" : "Create your account to get started"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-heading font-semibold">Full Name</Label>
                    <Input id="name" placeholder="Enter your full name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="font-heading font-semibold">Age</Label>
                      <Input id="age" type="number" placeholder="Age" value={form.age} onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) {
                          handleChange("age", val);
                        }
                      }} required min={20} max={40} />
                      <p className="text-xs text-muted-foreground">Age must be between 20-40</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-heading font-semibold">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        handleChange("phone", val);
                      }} required minLength={10} maxLength={10} />
                      <p className="text-xs text-muted-foreground">10 digits only</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="village" className="font-heading font-semibold">Village</Label>
                      <Input id="village" placeholder="Your village" value={form.village} onChange={(e) => handleChange("village", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="font-heading font-semibold">Location</Label>
                      <Input id="location" placeholder="District/Taluk" value={form.location} onChange={(e) => handleChange("location", e.target.value)} required />
                    </div>
                  </div>

                  {/* LMP Date */}
                  <div className="space-y-2">
                    <Label htmlFor="lmpDate" className="font-heading font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Last Menstrual Period (LMP) Date
                    </Label>
                    <Input id="lmpDate" type="date" value={form.lmpDate} onChange={(e) => handleChange("lmpDate", e.target.value)} required />
                  </div>

                  {calculatedWeek !== null && (
                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 animate-slide-up">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-heading font-semibold text-card-foreground">Auto-Calculated:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Pregnancy Week</p>
                          <p className="text-lg font-heading font-bold text-primary">Week {calculatedWeek}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expected Due Date</p>
                          <p className="text-lg font-heading font-bold text-primary">{calculatedDueDate}</p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-3">
                        <div className="gradient-mother h-2 rounded-full transition-all" style={{ width: `${(calculatedWeek / 40) * 100}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{calculatedWeek}/40 weeks</p>
                    </div>
                  )}
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="gmail" className="font-heading font-semibold">Gmail</Label>
                <Input id="gmail" type="email" placeholder="yourname@gmail.com" value={form.gmail} onChange={(e) => handleChange("gmail", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-heading font-semibold">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full gradient-mother text-primary-foreground font-heading font-bold text-lg py-6 rounded-xl shadow-hero hover:scale-[1.02] transition-transform">
                {isLogin ? "Login" : "Register"} →
              </Button>
              <p className="text-center text-sm text-muted-foreground font-body">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <EmergencyButton />

      <PrivacyConsentDialog
        open={showConsentDialog}
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
        userType="mother"
      />
    </div>
  );
};

export default MotherRegister;
