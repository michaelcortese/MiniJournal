import React, { useState, useEffect, useCallback } from "react";
import Editor from "./journal/Editor";
import SaveIndicator from "./journal/SaveIndicator";
import MoodSelector from "./journal/MoodSelector";
import MoodCalendar from "./journal/MoodCalendar";
import LoadingSkeleton from "./journal/LoadingSkeleton";
import { useAuth } from "@/lib/auth";
import { getJournalEntry, getMonthEntries, createOrUpdateEntry } from "@/lib/journal";
import type { Mood } from "@/types/database";
import { useDebounce } from "@/lib/utils";
import Header from "./Header";
import { isToday, format } from "date-fns";

export default function Home() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [monthEntries, setMonthEntries] = useState<Record<string, Mood>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  
  const debouncedContent = useDebounce(content, 1000);

  // Load month entries
  const loadMonthEntries = useCallback(async () => {
    if (!user) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    try {
      const entries = await getMonthEntries(user.id, year, month);
      const entriesMap = entries.reduce((acc, entry) => {
        acc[entry.entry_date] = entry.mood;
        return acc;
      }, {} as Record<string, Mood>);
      setMonthEntries(entriesMap);
    } catch (error) {
      console.error('Failed to load month entries:', error);
    }
  }, [currentDate, user]);

  // Load current entry
  const loadCurrentEntry = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setSaveStatus("idle");
      setHasUserEdited(false);

      // For future dates, reset content and mood
      if (currentDate > new Date()) {
        setContent("");
        setMood(null);
        setIsLoading(false);
        return;
      }

      const entry = await getJournalEntry(user.id, currentDate);
      
      // Reset state for new date
      setContent(entry?.content || "");
      setMood(entry?.mood || null);
      
    } catch (error) {
      console.error('Failed to load entry:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, user]);

  // Load data when date or user changes
  useEffect(() => {
    loadCurrentEntry();
    loadMonthEntries();
  }, [loadCurrentEntry, loadMonthEntries, currentDate]);

  // Save entry when content changes
  useEffect(() => {
    if (!user || !isToday(currentDate) || !hasUserEdited || !mood) return;

    const saveEntry = async () => {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const entry = {
        content: debouncedContent,
        mood,
        entry_date: dateStr,
      };

      try {
        setSaveStatus("saving");
        await createOrUpdateEntry(
          user.id,
          entry,
          undefined,
          () => setSaveStatus("saved"),
          () => setSaveStatus("idle")
        );
      } catch (error) {
        console.error('Failed to save entry:', error);
        setSaveStatus("idle");
      }
    };

    saveEntry();
  }, [debouncedContent, mood, user, currentDate, hasUserEdited]);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleContentChange = (newContent: string) => {
    if (!isToday(currentDate)) return;
    setContent(newContent);
    setHasUserEdited(true);
    setSaveStatus("saving");
  };

  const handleMoodChange = async (newMood: Mood) => {
    if (!isToday(currentDate) || !user) return;
    
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Optimistic update
    setMood(newMood);
    setHasUserEdited(true);
    setMonthEntries(prev => ({
      ...prev,
      [dateStr]: newMood
    }));
    
    try {
      setSaveStatus("saving");
      await createOrUpdateEntry(
        user.id,
        {
          content: content,
          mood: newMood,
          entry_date: dateStr,
        },
        undefined,
        () => setSaveStatus("saved"),
        () => setSaveStatus("idle")
      );
    } catch (error) {
      console.error('Failed to save mood:', error);
      setSaveStatus("idle");
      // Revert optimistic updates
      setMood(mood);
      setMonthEntries(prev => ({
        ...prev,
        [dateStr]: mood || 'neutral'
      }));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <Header currentDate={currentDate} onDateChange={handleDateChange} />
      
      <div className="flex-1 flex flex-col items-center">
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="mb-8">
                <MoodCalendar
                  moodEntries={monthEntries}
                  onDayClick={handleDateChange}
                  selectedDate={currentDate}
                />
              </div>

              <div className="mb-6 flex justify-center">
                <MoodSelector 
                  selectedMood={mood || undefined} 
                  onMoodSelect={handleMoodChange} 
                />
              </div>

              <Editor
                content={content}
                onContentChange={handleContentChange}
                className="min-h-[calc(100vh-200px)]"
                currentDate={currentDate}
              />
            </>
          )}
        </main>

        <SaveIndicator status={saveStatus} />
      </div>
    </div>
  );
}
