import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

function AnimatedDots() {
  return (
    <span className="inline-flex text-2xl leading-none text-primary font-bold">
      <span className="animate-[bounce_1.4s_infinite]">.</span>
      <span className="animate-[bounce_1.4s_infinite_0.2s]">.</span>
      <span className="animate-[bounce_1.4s_infinite_0.4s]">.</span>
    </span>
  );
}

export default function AuthCallbackTest() {
  const navigate = useNavigate();
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setShowCheckmark(true);
      // Simulate redirect delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 2000); // Show verifying state for 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            {showCheckmark ? (
              <Check className={cn(
                "w-8 h-8 text-primary transition-all duration-500",
                "opacity-100 scale-100"
              )} />
            ) : (
              <AnimatedDots />
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {showCheckmark ? "Email verified!" : "Verifying"}
          </h2>
          <p className="text-muted-foreground">
            {showCheckmark ? "Redirecting you to your journal..." : "Please wait while we verify your email"}
          </p>
        </div>
      </div>
    </div>
  );
} 