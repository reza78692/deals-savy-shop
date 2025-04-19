
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with real values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ucamuhgyhjclwmiwvrjv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYW11aGd5aGpjbHdtaXd2cmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjU3MTgsImV4cCI6MjA2MDA0MTcxOH0._be2KR6hei59m8ICJrAbVcU-mBHIWCbvSsDFuQ0xphs';

// Create a single Supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
