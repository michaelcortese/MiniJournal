import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, eachDayOfInterval, subDays, startOfWeek } from "date-fns";
import type { Mood } from "./MoodSelector";

interface MoodCalendarProps {
  moodEntries?: Record<string, Mood>;
  onDayClick?: (date: Date) => void;
  className?: string;
}

const moodColors: Record<Mood, string> = {
  loved: "bg-pink-500",
  happy: "bg-green-500",
  neutral: "bg-yellow-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
};

export default function MoodCalendar({
  moodEntries = {},
  onDayClick = () => {},
  className,
}: MoodCalendarProps) {
  // Generate last 365 days
  const days = eachDayOfInterval({
    start: subDays(new Date(), 364),
    end: new Date(),
  });

  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className={cn("p-4", className)}>
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const mood = moodEntries[dateKey];

              return (
                <TooltipProvider key={dateKey}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onDayClick(day)}
                        className={cn(
                          "w-3 h-3 rounded-sm transition-colors",
                          mood
                            ? moodColors[mood]
                            : "bg-muted hover:bg-muted-foreground/20",
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{format(day, "MMM d, yyyy")}</p>
                      {mood && <p>Mood: {mood}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
