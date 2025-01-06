import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mood } from "@/types/database";

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodSelect: (mood: Mood) => void;
}

const moods: { type: Mood; icon: React.ReactNode; label: string }[] = [
  { type: "sad", icon: <Frown className="w-4 h-4" />, label: "Sad" },
  { type: "neutral", icon: <Meh className="w-4 h-4" />, label: "Neutral" },
  { type: "happy", icon: <Smile className="w-4 h-4" />, label: "Happy" },
];

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
}: MoodSelectorProps) {
  return (
    <div className="flex gap-2 items-center">
      {moods.map((mood) => (
        <Button
          key={mood.type}
          variant="ghost"
          size="sm"
          onClick={() => onMoodSelect(mood.type)}
          className={cn(
            "flex items-center gap-1 hover:bg-accent",
            selectedMood === mood.type && "bg-accent text-accent-foreground"
          )}
        >
          {mood.icon}
          <span className="sr-only">{mood.label}</span>
        </Button>
      ))}
    </div>
  );
}
