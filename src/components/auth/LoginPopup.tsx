import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Mail, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface LoginPopupProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function LoginPopup({
  open = true,
  onOpenChange = () => {},
}: LoginPopupProps) {
  const { signIn, signUp, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { needsEmailVerification } = await signUp(email, password, name);
        if (needsEmailVerification) {
          setShowVerificationMessage(true);
          // Show checkmark after a brief delay
          setTimeout(() => setShowCheckmark(true), 500);
        }
      } else {
        await signIn(email, password);
      }
    } catch (e) {
      // Error is handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowVerificationMessage(false);
    setShowCheckmark(false);
    setIsSignUp(false);
    setEmail("");
    setPassword("");
    setName("");
  };

  if (showVerificationMessage) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Mail className={cn(
                "w-6 h-6 text-primary transition-opacity duration-200",
                showCheckmark ? "opacity-0" : "opacity-100"
              )} />
              <Check className={cn(
                "absolute w-6 h-6 text-primary transition-all duration-200",
                showCheckmark 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-50"
              )} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Check your email
              </h2>
              <p className="text-muted-foreground">
                We've sent you a verification link to {email}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              Back to sign in
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="flex items-center gap-2">
            <PenLine className="h-6 w-6" />
            <h2 className="text-2xl font-semibold tracking-tight">
              MiniJournal
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required={isSignUp}
                  minLength={2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setName("");
                }}
                className="text-primary hover:underline"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
