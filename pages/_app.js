import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// for some reason vercel analytics breask jest
// import { Analytics } from "@vercel/analytics/react";

import "styles/globals.css";

import Layout from "components/Layout";
import { ClerkProvider } from "@clerk/nextjs";
import { isLoaded, useUser, SignIn, useOrganization } from "@clerk/nextjs";
import { ChatWidget } from "@papercups-io/chat-widget";

import { createSupabaseClient, SupabaseProvider } from "utils/supabaseHooks";
import { useAuth } from "@clerk/nextjs";

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
                template: "supabase",
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
    // if (!supabaseClient) return <></>;
    return (
        <SupabaseProvider value={supabaseClient}>
            <Layout>{supabaseClient ? children : null}</Layout>
            <ChatWidgetWrapper />
            {/* <Analytics /> */}
        </SupabaseProvider>
    );
}

function ChatWidgetWrapper() {
    const { isLoaded, isSignedIn, user } = useUser();
    // useorg
    const { organization } = useOrganization();

    let customer = null;
    if (isSignedIn)
        customer = {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
            // phone: user.primaryPhoneNumber.phoneNumber, // No longer provided by
            external_id: user?.id,
            metadata: {},
        };

    // console.log({ user });

    return (
        <ChatWidget
            // `accountId` is used instead of `token` in older versions
            // of the @papercups-io/chat-widget package (before v1.2.x).
            // You can delete this line if you are on the latest version.
            // accountId="19650de6-84fa-4da9-a8b9-78ffcadab983"
            token="19650de6-84fa-4da9-a8b9-78ffcadab983"
            inbox="1a5d07de-76b2-4430-a1c3-68507bb8b977"
            title="Welcome to RaiseMore"
            subtitle="Ask us anything in the chat window below 😊"
            primaryColor="#2d28ff"
            greeting="Hi there! Send us a message and we'll get back to you as soon as we can."
            newMessagePlaceholder="Start typing..."
            showAgentAvailability={false}
            agentAvailableText="We're online right now!"
            agentUnavailableText="We're away at the moment."
            requireEmailUpfront={false}
            iconVariant="outlined"
            baseUrl="https://app.papercups.io"
            customer={customer}
        />
    );
}

export default App;
