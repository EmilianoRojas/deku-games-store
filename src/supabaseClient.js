import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxnjeffpiwrkypjywero.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bmplZmZwaXdya3lwanl3ZXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NzA2NzEsImV4cCI6MjA2MjE0NjY3MX0.AscVZtcStmgDbHLIaHi-JxqsS_qSIVmIIdPY4swMTlw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)