import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, AlertTriangle, FileText } from "lucide-react";

interface PrivacyConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
  userType: "mother" | "father";
}

const PrivacyConsentDialog = ({ open, onAccept, onCancel, userType }: PrivacyConsentDialogProps) => {
  const navigate = useNavigate();

  const handleAccept = () => {
    const consentData = {
      timestamp: new Date().toISOString(),
      userType,
      accepted: true,
    };
    sessionStorage.setItem(`privacyConsent_${userType}_session`, "true");
    onAccept();
  };

  const handleViewPolicy = () => {
    navigate("/privacy-policy");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-primary/20 shadow-hero">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            JananiSetu – Data Protection & Privacy Notice
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <p className="text-lg font-heading font-bold text-card-foreground">
              Your data is secure with JananiSetu.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are committed to protecting your personal and medical information with the highest level of confidentiality.
            </p>
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-4">
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">Your data will NOT be shared with unauthorized users.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">Your information is visible only to you and your assigned health worker.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">We do NOT sell, misuse, or distribute your data.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">All login sessions are secured using encrypted authentication.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground font-medium">Your medical history remains confidential and protected.</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <p className="text-xs text-muted-foreground text-center font-medium italic">
              By continuing, you confirm that you understand and agree to our data protection policy.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="w-full sm:w-auto order-2 sm:order-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl py-6"
          >
            ❌ Cancel
          </Button>
          <Button
            onClick={handleAccept}
            className={`w-full sm:flex-1 order-1 sm:order-2 font-heading font-bold text-lg py-6 rounded-xl shadow-hero hover:scale-[1.02] transition-transform ${userType === "mother"
              ? "gradient-mother text-primary-foreground"
              : "gradient-father text-primary-foreground"
              }`}
          >
            ✅ I Agree & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyConsentDialog;

