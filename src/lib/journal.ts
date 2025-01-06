import { supabase } from './supabase';
import type { CreateJournalEntry, JournalEntry, UpdateJournalEntry } from '../types/database';
import { format } from 'date-fns';

const JOURNAL_TABLE = 'journal_entries';

export async function getJournalEntry(userId: string, date: Date): Promise<JournalEntry | null> {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from(JOURNAL_TABLE)
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', dateStr)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return null;
  }
}

type MonthEntry = Pick<JournalEntry, 'entry_date' | 'mood'>;

export async function getMonthEntries(userId: string, year: number, month: number): Promise<MonthEntry[]> {
  try {
    const monthStr = month.toString().padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    const endDate = month === 12 
      ? `${year + 1}-01-01`
      : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
    
    const { data, error } = await supabase
      .from(JOURNAL_TABLE)
      .select('entry_date, mood')
      .eq('user_id', userId)
      .gte('entry_date', startDate)
      .lt('entry_date', endDate);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching month entries:', error);
    return [];
  }
}

export async function createOrUpdateEntry(
  userId: string,
  entry: CreateJournalEntry | UpdateJournalEntry,
  onStart?: () => void,
  onSuccess?: () => void,
  onError?: () => void,
): Promise<void> {
  try {
    onStart?.();

    const { error } = await supabase
      .from(JOURNAL_TABLE)
      .upsert(
        {
          user_id: userId,
          content: entry.content,
          mood: entry.mood,
          entry_date: entry.entry_date,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id,entry_date'
        }
      );

    if (error) throw error;
    onSuccess?.();
  } catch (error) {
    console.error('Error saving journal entry:', error);
    onError?.();
  }
}

export async function updateEntry(
  userId: string,
  entryId: string,
  updates: UpdateJournalEntry,
  onSaveStart?: () => void,
  onSaveComplete?: () => void,
  onError?: (error: Error) => void
) {
  try {
    onSaveStart?.();
    const { error } = await supabase
      .from(JOURNAL_TABLE)
      .update(updates)
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) throw error;
    onSaveComplete?.();
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
} 