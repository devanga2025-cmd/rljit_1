import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle2, AlertTriangle, Lock, Eye, Users, FileX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import EmergencyButton from "@/components/EmergencyButton";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body text-sm">Back</span>
        </button>
        <LanguageToggle />
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <Card className="shadow-card">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-heading text-3xl text-foreground">
              Privacy & Data Protection Policy
            </CardTitle>
            <p className="text-sm text-muted-foreground font-body">
              Care4Mom & Baby Platform
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Introduction */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3">
                Introduction
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                At Care4Mom & Baby, we are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our platform.
              </p>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                What Information We Collect
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Personal identification information (name, age, location, contact details)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Health information (pregnancy details, medical records, ANC visits, weight, blood pressure, hemoglobin levels)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Family information (spouse details, emergency contacts, family members)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Usage data (app interactions, notifications, visit logs)
                </li>
              </ul>
            </section>

            {/* How We Use Your Data */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                How We Use Your Information
              </h2>
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 space-y-2">
                <p className="text-sm font-heading font-semibold text-card-foreground mb-2">We use your data to:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Provide personalized maternal and child health care support</li>
                  <li>• Track your pregnancy progress and health metrics</li>
                  <li>• Send important reminders and notifications</li>
                  <li>• Connect you with your assigned Anganwadi / Health Worker</li>
                  <li>• Improve our services and platform functionality</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Who Can Access Your Data
              </h2>
              <div className="space-y-3">
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <p className="text-sm font-heading font-semibold text-card-foreground mb-2">✅ You have full access to:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• All your personal health information</li>
                    <li>• Your pregnancy dashboard and progress</li>
                    <li>• Your family support features</li>
                  </ul>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-sm font-heading font-semibold text-card-foreground mb-2">👨‍⚕️ Your assigned Anganwadi / Health Worker can access:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Your health records for providing care</li>
                    <li>• Your risk status and danger signs</li>
                    <li>• Visit logs and follow-up information</li>
                  </ul>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-heading font-semibold text-card-foreground">Emergency Situations:</p>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    In case of emergency risk (danger signs, critical health conditions), your health worker may be automatically notified to provide timely support. This is done to ensure your safety and well-being.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Data Security & Protection
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Your data is securely stored and encrypted
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  We do NOT sell, rent, or share your data with third parties
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Access is restricted to authorized personnel only
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  Regular security audits and updates are performed
                </li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3 flex items-center gap-2">
                <FileX className="w-5 h-5 text-primary" />
                Your Rights
              </h2>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-sm font-heading font-semibold text-card-foreground mb-2">You have the right to:</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Access your personal data at any time</li>
                  <li>• Request corrections to your information</li>
                  <li>• Withdraw your consent at any time</li>
                  <li>• Request deletion of your account and data</li>
                  <li>• File a complaint if you have concerns</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-heading font-bold text-xl text-card-foreground mb-3">
                Contact Us
              </h2>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact your assigned Anganwadi / Health Worker or reach out to our support team.
              </p>
            </section>

            {/* Last Updated */}
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Last Updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <EmergencyButton />
    </div>
  );
};

export default PrivacyPolicy;



