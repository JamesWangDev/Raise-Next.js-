import { useState, useEffect } from "react";
import "styles/globals.css";
import Layout from "components/Layout";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import ChatWidgetWrapper from "components/ChatWidgetWrapper";
import { createSupabaseClient, SupabaseProvider } from "lib/supabaseHooks";
import { SWRConfig } from "swr";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// // For some reason, vercel analytics breask jest
// import { Analytics } from "@vercel/analytics/react";

function App({ Component, pageProps }) {
    return (
        <>
            <style jsx global>{`
                html,
                body,
                .MuiDataGrid-root,
                code {
                    font-family: ${inter.style.fontFamily} !important;
                }
            `}</style>
            <SWRConfig
                value={{
                    fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
                    keepPreviousData: true,
                }}
            >
                <ClerkProvider {...pageProps}>
                    <SupabaseWrapper>
                        <Component {...pageProps} />
                    </SupabaseWrapper>
                </ClerkProvider>
            </SWRConfig>
        </>
    );
}

function SupabaseWrapper({ children }) {
    const { mutate } = useSWRConfig();
    let [supabaseClient, setSupabaseClient] = useState(createSupabaseClient());
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
            setSupabaseClient(createSupabaseClient(supabaseAccessToken));

            // Invalidate all previous SWR cached calls
            mutate(
                (key) => true, // which cache keys are updated
                undefined, // update cache data to `undefined`
                { revalidate: false } // do not revalidate
            );
        };
        now();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, sessionId, orgId]);

    return (
        <SupabaseProvider value={supabaseClient}>
            <Layout>{children}</Layout>
            <ChatWidgetWrapper />
            {/* <Analytics /> */}
        </SupabaseProvider>
    );
}

export default App;
