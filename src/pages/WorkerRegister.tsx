import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApp } from "@/contexts/AppContext";
import LanguageToggle from "@/components/LanguageToggle";
import EmergencyButton from "@/components/EmergencyButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const WorkerRegister = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { registerHealthWorker, loginUser } = useApp();
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    workerId: "",
    anganwadiLocation: "",
    gmail: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser(form.gmail, form.password);
        localStorage.setItem("userRole", "worker");
        navigate("/worker");
      } else {
        await registerHealthWorker(form);
        localStorage.setItem("workerName", form.name);
        setIsLogin(true);
        toast.info("Registration successful! Please login.");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-background to-emerald-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body text-sm">Back</span>
        </button>
        <LanguageToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-hero border-teal-200">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full gradient-worker flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-heading text-2xl text-foreground">
              🏥 {isLogin ? "Health Worker Login" : "Health Worker Registration"}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-body">
              {isLogin ? "Welcome back! Login to your account" : "Register as Anganwadi / Health Worker"}
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
                  <div className="space-y-2">
                    <Label htmlFor="anganwadiLocation" className="font-heading font-semibold">Anganwadi Location</Label>
                    <Input id="anganwadiLocation" placeholder="Anganwadi center location" value={form.anganwadiLocation} onChange={(e) => handleChange("anganwadiLocation", e.target.value)} required />
                  </div>
                </>
              )}
              {isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="loginWorkerId" className="font-heading font-semibold">Worker ID Number</Label>
                  <Input id="loginWorkerId" placeholder="Enter your Worker ID" value={form.workerId} onChange={(e) => handleChange("workerId", e.target.value)} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="gmail" className="font-heading font-semibold">Gmail</Label>
                <Input id="gmail" type="email" placeholder="yourname@gmail.com" value={form.gmail} onChange={(e) => handleChange("gmail", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-heading font-semibold">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full gradient-worker text-primary-foreground font-heading font-bold text-lg py-6 rounded-xl shadow-hero hover:scale-[1.02] transition-transform">
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
    </div>
  );
};

export default WorkerRegister;
