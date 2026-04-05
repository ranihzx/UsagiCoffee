import { createClient } from '@supabase/supabase-js';


const supabaseUrl = "https://gtshtxainaadahuyiwzd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0c2h0eGFpbmFhZGFodXlpd3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1NjIsImV4cCI6MjA5MDk4MTU2Mn0.DenkSOeCz905kk5ZmZJJPWqhTJDyRIlOuCd-WYrmqPs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);