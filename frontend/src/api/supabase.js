import { createClient } from "@supabase/supabase-js";

// Read variables from Vite env, falling back to your CareerDesk project endpoints
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mqxjrffjwqvyihgotdse.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeGpyZmZqd3F2eWloZ290ZHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODY1MzUsImV4cCI6MjA5OTc2MjUzNX0.2SaeOl6y8FTTcNNdGpbnqmSxZaaj7otqrCSXE1WjPkg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
