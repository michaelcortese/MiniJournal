import React, { useState } from "react";
import DateNavigator from "./journal/DateNavigator";
import Editor from "./journal/Editor";
import SaveIndicator from "./journal/SaveIndicator";
import MoodSelector, { type Mood } from "./journal/MoodSelector";
import MoodCalendar from "./journal/MoodCalendar";

interface HomeProps {
  initialDate?: Date;
  initialContent?: string;
}

export default function Home({
  initialDate = new Date(),
  initialContent = "Welcome to your journal. Start writing your thoughts here...",
}: HomeProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<Mood>("neutral");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setSaveStatus("idle");
    setContent("Entry for " + date.toLocaleDateString());
    setMood("neutral");
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  };

  const handleMoodChange = (newMood: Mood) => {
    setMood(newMood);
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center">
      <DateNavigator
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <MoodCalendar
            moodEntries={{
              [currentDate.toISOString().split("T")[0]]: mood,
            }}
            onDayClick={handleDateChange}
          />
        </div>

        <div className="mb-6 flex justify-center">
          <MoodSelector selectedMood={mood} onMoodSelect={handleMoodChange} />
        </div>

        <Editor
          content={content}
          onContentChange={handleContentChange}
          className="min-h-[calc(100vh-200px)]"
        />
      </main>

      <SaveIndicator status={saveStatus} />
    </div>
  );
}
