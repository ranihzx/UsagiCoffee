import { createClient } from '@supabase/supabase-js';


const supabaseUrl = "https://txygeusmlfgftsqpcfnj.supabase.co";
const supabaseAnonKey = "sb_publishable_dBUUX27Ti5jfea1-xcNBCQ_S6vvrnhq";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);