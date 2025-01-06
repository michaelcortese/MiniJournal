export type Mood = 'happy' | 'neutral' | 'sad';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: Mood;
  created_at: string;
  updated_at: string;
  entry_date: string; // YYYY-MM-DD format
}

export type CreateJournalEntry = Omit<JournalEntry, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateJournalEntry = Partial<CreateJournalEntry>; 