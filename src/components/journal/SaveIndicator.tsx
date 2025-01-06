import React from "react";
import { Check, Loader2 } from "lucide-react";

interface SaveIndicatorProps {
  status?: "saving" | "saved" | "idle";
}

const SaveIndicator = ({ status = "idle" }: SaveIndicatorProps) => {
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-md px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground shadow-sm">
      {status === "saving" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>Saved</span>
        </>
      )}
    </div>
  );
};

export default SaveIndicator;
