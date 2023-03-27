import { createClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import useSWR from "swr";

export function createSupabaseClient(supabaseAccessToken, { serviceRole } = {}) {
    // Create a new Supabase client passing alnog the clerk.dev JWT as Authorization header
    if (serviceRole)
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

    console.log({ supabaseAccessToken });
    if (supabaseAccessToken) {
        const temp = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                global: {
                    headers: { Authorization: `Bearer ${supabaseAccessToken}` },
                },
                // // This is what the supabase documentation says to do but it just produces a websocket error:
                // realtime: {
                //     headers: {
                //         apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                //     },
                //     params: {
                //         accessToken: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                //     },
                // },
            }
        );
        temp.realtime.setAuth(supabaseAccessToken);
        return temp;
    } else
        return createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

/**
 * A hook that implements a SWR strategy to fetch data from a Supabase query any query can be passed
 * @param query a supabase client query function
 * @returns a swr hook object with the following properties:
 * - data: The data returned by the query
 * - error: The error returned by the query
 * - isValidating: If true, the query is still running
 */
export function useQuery(query) {
    const context = useContext(SupabaseContext);

    const fetcher = async () => {
        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return data;
    };

    const key =
        query?.method === "POST"
            ? query?.url?.href + JSON.stringify(query?.body)
            : query?.url?.href;

    return useSWR(() => key, fetcher);
}
