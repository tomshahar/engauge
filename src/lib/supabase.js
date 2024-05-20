import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tclgpjamhiywfyikeysz.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbGdwamFtaGl5d2Z5aWtleXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxNjkzNTEsImV4cCI6MjAyOTc0NTM1MX0.eXPxArM8yzT5OtSrKDSr3YsVqVbFLVuvfVrtYG_T-4A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
