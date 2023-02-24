import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import "styles/globals.css";
// import "@docsearch/css";

import Layout from "components/Layout";
import { ClerkProvider } from "@clerk/nextjs";
import { isLoaded, useUser, SignIn } from "@clerk/clerk-react";
// import { IntercomProvider } from "utils/IntercomProvider";
import { ChatWidget } from "@papercups-io/chat-widget";

function App({ Component, pageProps }) {
    return (
        <ClerkProvider {...pageProps}>
            {/* <IntercomProvider> */}
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <ChatWidgetWrapper />
            {/* </IntercomProvider> */}
        </ClerkProvider>
    );
}

function ChatWidgetWrapper() {
    const { isLoaded, isSignedIn, user } = useUser();

    let customer = null;
    if (isSignedIn)
        customer = {
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
            phone: user.primaryPhoneNumber.phoneNumber,
            external_id: user.id,
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
