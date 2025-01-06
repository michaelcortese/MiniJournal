-- Check for any triggers on the journal_entries table
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'journal_entries';

-- Check for any rows in the journal_entries table
SELECT * FROM journal_entries;

-- Check table definition including defaults
SELECT 
    column_name, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'journal_entries';

-- Check for any rules
SELECT * FROM pg_rules
WHERE tablename = 'journal_entries'; 