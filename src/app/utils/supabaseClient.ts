// src/app/utils/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// Deine Daten hier einfügen:
const supabaseUrl = 'https://paephvndcacfhsoqvppl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZXBodm5kY2FjZmhzb3F2cHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NTI2NjMsImV4cCI6MjA2MzUyODY2M30.uMhENej5gqcoXLdU6ztzUVjhvzGGejSAaOfBi-yRcH4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
