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
    // Save consent timestamp to localStorage
    const consentData = {
      timestamp: new Date().toISOString(),
      userType,
      accepted: true,
    };
    localStorage.setItem(`privacyConsent_${userType}`, JSON.stringify(consentData));
    onAccept();
  };

  const handleViewPolicy = () => {
    navigate("/privacy-policy");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-card-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Your Privacy & Safety Matter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
            <p className="text-sm font-heading font-semibold text-card-foreground mb-3">
              We respect your privacy.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Your health information will be securely stored.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Your data will only be visible to you and your assigned Anganwadi / Health Worker.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                Your information will NOT be shared, sold, or misused.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                All data is used only to improve maternal and child health care support.
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm font-heading font-semibold text-card-foreground">Important:</p>
            </div>
            <p className="text-sm text-muted-foreground ml-7">
              In case of emergency risk (such as danger signs), your assigned health worker may be notified to provide timely support.
            </p>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              You can withdraw consent or delete your account anytime.
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-semibold">
              By continuing, you agree to our Privacy & Data Protection Policy.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleViewPolicy}
            className="w-full sm:w-auto order-2 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View Full Privacy Policy
          </Button>
          <Button
            onClick={handleAccept}
            className={`w-full sm:w-auto order-1 sm:order-3 ${
              userType === "mother"
                ? "gradient-mother text-primary-foreground"
                : "gradient-father text-primary-foreground"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            I Agree & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyConsentDialog;

