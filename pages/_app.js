import { useState, useEffect } from "react";
import "styles/globals.css";
import Layout from "components/Layout";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import ChatWidgetWrapper from "components/ChatWidgetWrapper";
import { createSupabaseClient, SupabaseProvider } from "utils/supabaseHooks";

// for some reason vercel analytics breask jest
// import { Analytics } from "@vercel/analytics/react";

function App({ Component, pageProps }) {
    return (
        <ClerkProvider {...pageProps}>
            <SupabaseWrapper>
                <Component {...pageProps} />
            </SupabaseWrapper>
        </ClerkProvider>
    );
}

function SupabaseWrapper({ children }) {
    let [supabaseClient, setSupabaseClient] = useState();
    const { getToken, userId, sessionId, orgId } = useAuth();
    useEffect(() => {
        let now = async () => {
            // Get the clerk.dev JWT
            const supabaseAccessToken = await getToken({
                template:
                    process.env.NEXT_PUBLIC_ENVIRONMENT != "development"
                        ? "supabase"
                        : "supabase-local-development",
            });
            // Create and set the client
            let client = createSupabaseClient(supabaseAccessToken);
            setSupabaseClient(client);
            const { data, error } = await client
                .from("donations")
                .select("*")
                .limit(25);
            console.log({ data, error });
        };
        now();
    }, [userId, sessionId, orgId]);

    return (
        <SupabaseProvider value={supabaseClient}>
            <Layout>{supabaseClient ? children : null}</Layout>
            <ChatWidgetWrapper />
            {/* <Analytics /> */}
        </SupabaseProvider>
    );
}

export default App;
