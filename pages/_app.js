import { useState, useEffect, useCallback } from "react";
import "styles/globals.css";
import "styles/docsearch.css";
import "styles/dark.css";
import Layout from "components/Layout";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import ChatWidgetWrapper from "components/ChatWidgetWrapper";
import { createSupabaseClient, SupabaseProvider } from "lib/supabaseHooks";

// pages/_app.js
import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });

// for some reason vercel analytics breask jest
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
            <ClerkProvider {...pageProps}>
                <SupabaseWrapper>
                    <Component {...pageProps} />
                </SupabaseWrapper>
            </ClerkProvider>
        </>
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
            setSupabaseClient(createSupabaseClient(supabaseAccessToken));
        };
        now();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
