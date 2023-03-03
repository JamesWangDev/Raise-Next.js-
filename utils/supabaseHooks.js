import { createClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export function createSupabaseClient(supabaseAccessToken) {
    // // Get the clerk.dev JWT
    // const { getToken } = useAuth();
    // const supabaseAccessToken = await getToken({ template: "supabase" });

    // Create a new Supabase client passing alnog the clerk.dev JWT as Authorization header
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            global: {
                headers: { Authorization: `Bearer ${supabaseAccessToken}` },
            },
        }
    );
}

// context
export const SupabaseContext = createContext(undefined);
export const SupabaseProvider = SupabaseContext.Provider;
export const Consumer = SupabaseContext.Consumer;
SupabaseContext.displayName = "SupabaseContext";

// useClient
export function useSupabase() {
    const client = useContext(SupabaseContext);
    // if (client === undefined)
    //     throw Error("No client has been specified using Provider.");
    return client;
}
