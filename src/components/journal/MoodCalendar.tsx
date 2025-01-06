import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  format, 
  eachDayOfInterval, 
  subDays,
  isToday, 
  isSameDay,
  startOfDay,
  getDay,
  startOfWeek,
  addWeeks,
  isSameMonth,
  endOfWeek,
  addDays,
  subYears,
  isLeapYear,
  parseISO,
} from "date-fns";
import type { Mood } from "@/types/database";

interface MoodCalendarProps {
  moodEntries?: Record<string, Mood>;
  onDayClick?: (date: Date) => void;
  className?: string;
  selectedDate?: Date;
}

const moodColors: Record<Mood, string> = {
  happy: "bg-green-500 hover:bg-green-600",
  neutral: "bg-gray-400 hover:bg-gray-500",
  sad: "bg-blue-500 hover:bg-blue-600",
};

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

export default function MoodCalendar({
  moodEntries = {},
  onDayClick = () => {},
  className,
  selectedDate = new Date(),
}: MoodCalendarProps) {
  // Calculate the date range
  const today = startOfDay(new Date()); // Jan 6, 2025 (Monday)
  const startDate = parseISO('2024-01-07'); // Jan 7, 2024 (Sunday)
  
  // Since we know Jan 7, 2024 was a Sunday (getDay() = 0)
  // and Jan 6, 2025 is a Monday (getDay() = 1)
  // we can calculate the weeks between them
  const weeks: Date[][] = [];
  let currentDate = startDate;
  let currentWeek: Date[] = [];
  
  while (currentDate <= today) {
    const dayOfWeek = getDay(currentDate);
    if (dayOfWeek === 0 && currentWeek.length > 0) { // Sunday starts new week
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Calculate month labels
  const monthLabels: { label: string; startColumn: number }[] = [];
  let lastMonth: string | null = null;

  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = week[0];
    const month = format(firstDayOfWeek, "MMM");
    
    // If this is a new month, add it to labels
    if (!lastMonth || month !== lastMonth) {
      monthLabels.push({
        label: month,
        startColumn: weekIndex,
      });
      lastMonth = month;
    }
  });

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold">Mood History</h2>
      
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] pr-2 pt-6 text-xs text-muted-foreground">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className="h-[13px] leading-[13px]">{day}</div>
          ))}
        </div>

        <div className="flex flex-col flex-1">
          {/* Month labels */}
          <div className="relative h-6">
            {monthLabels.map(({ label, startColumn }, i) => (
              <div
                key={label + i}
                className="absolute text-sm text-muted-foreground whitespace-nowrap"
                style={{ 
                  left: `${startColumn * (15)}px`,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week[dayIndex];
                  if (!day || day < startDate || day > today) {
                    return <div key={dayIndex} className="w-[13px] h-[13px]" />;
                  }

                  const dateKey = format(day, "yyyy-MM-dd");
                  const mood = moodEntries[dateKey];
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <TooltipProvider key={dateKey}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onDayClick(day)}
                            className={cn(
                              "w-[13px] h-[13px] rounded-sm transition-colors relative",
                              mood ? moodColors[mood] : "bg-gray-200 hover:bg-gray-300",
                              isSelected && "ring-1 ring-primary ring-offset-1",
                              !isToday(day) && "cursor-pointer"
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{format(day, "MMM d, yyyy")}</p>
                          {mood && <p>Mood: {mood}</p>}
                          {isToday(day) && <p>Today</p>}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
