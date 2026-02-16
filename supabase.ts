import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://plykrntpuquolzvrauqa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2hMyeBbzTMTQmAcraNlEUw_HToky5Tf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);