import { createClient } from "@supabase/supabase-js";

// TODO: replace fetcher with SWR implementation
// const options = {
//   global: {
//     fetch:
//   }
// };

export default createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // options
);
