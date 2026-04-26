import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mgocadhsvgsotrajzxbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nb2NhZGhzdmdzb3RyYWp6eGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxODc4NDAsImV4cCI6MjA5Mjc2Mzg0MH0.pcG4saDRvg9qMeJDZNbtssjet2cRTJHHa21qcVJPnx0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});