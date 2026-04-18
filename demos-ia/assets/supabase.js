/**
 * ClaveAI — Cliente Supabase compartido para todos los demos
 */
const CLAVEAI_DB_URL = 'https://sohzlixsrpcnlnxmlizb.supabase.co';
const CLAVEAI_DB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaHpsaXhzcnBjbmxueG1saXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDgzMzIsImV4cCI6MjA5MjEyNDMzMn0.Y5YtIXs7WgqtStmWDDcL5MpyExxKFMcIux6fIYP0bTo';
const db = window.supabase.createClient(CLAVEAI_DB_URL, CLAVEAI_DB_KEY);
