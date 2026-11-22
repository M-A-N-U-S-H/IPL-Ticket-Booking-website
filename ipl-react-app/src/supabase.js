import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kstvbfuxlzmneyvoodyw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdHZiZnV4bHptbmV5dm9vZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNjQzODIsImV4cCI6MjExMDk0MDM4Mn0.QxW_aKtP187I2y0jld3_KEfBALtK-hi0X7KmfmElBoQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
