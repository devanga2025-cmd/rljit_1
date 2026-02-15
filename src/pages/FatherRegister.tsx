import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import EmergencyButton from "@/components/EmergencyButton";
import PrivacyConsentDialog from "@/components/PrivacyConsentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const FatherRegister = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    fatherName: "",
    wifeName: "",
    wifeAge: "",
    location: "",
    gmail: "",
    password: "",
  });
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<React.FormEvent<HTMLFormElement> | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Note: Consent dialog will be shown when form is submitted if consent is missing

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check consent before proceeding
    const consent = localStorage.getItem("privacyConsent_father");
    if (!consent) {
      setPendingFormData(e);
      setFormSubmitted(true);
      setShowConsentDialog(true);
      return;
    }

    proceedWithRegistration(e);
  };

  const proceedWithRegistration = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isLogin) {
      localStorage.setItem("fatherName", form.fatherName);
      localStorage.setItem("fatherWifeName", form.wifeName);
    }
    navigate("/father");
  };

  const handleConsentAccept = () => {
    setShowConsentDialog(false);
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
    toast.error("Registration cancelled. Consent is required to proceed.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-sky-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body text-sm">Back</span>
        </button>
        <LanguageToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-hero border-blue-200">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full gradient-father flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl text-foreground">
              👨‍👩‍👧 {isLogin ? "Father / Family Login" : "Father / Family Registration"}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-body">
              {isLogin ? "Welcome back! Login to your account" : "Register to support your family"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName" className="font-heading font-semibold">Father's Name</Label>
                    <Input id="fatherName" placeholder="Enter your full name" value={form.fatherName} onChange={(e) => handleChange("fatherName", e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="wifeName" className="font-heading font-semibold">Wife's Name</Label>
                      <Input id="wifeName" placeholder="Wife's full name" value={form.wifeName} onChange={(e) => handleChange("wifeName", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifeAge" className="font-heading font-semibold">Wife's Age</Label>
                      <Input id="wifeAge" type="number" placeholder="Age" value={form.wifeAge} onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) {
                          handleChange("wifeAge", val);
                        }
                      }} required min={20} max={30} />
                      <p className="text-xs text-muted-foreground">Age must be between 20-30</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-heading font-semibold">Location</Label>
                    <Input id="location" placeholder="Village / District / Taluk" value={form.location} onChange={(e) => handleChange("location", e.target.value)} required />
                  </div>
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
              <Button type="submit" className="w-full gradient-father text-primary-foreground font-heading font-bold text-lg py-6 rounded-xl shadow-hero hover:scale-[1.02] transition-transform">
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
        userType="father"
      />
    </div>
  );
};

export default FatherRegister;
