import { createClient } from '@supabase/supabase-js'

const url = 'https://uxkjvbjlsbgmbalokisf.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4a2p2Ympsc2JnbWJhbG9raXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MDU3NjMsImV4cCI6MjA0OTA4MTc2M30.eOtAl-n3qNSLR0BQNKhr8jiE5qXResibjKVut0fpEHQ'

export const sb = createClient(url, key)
