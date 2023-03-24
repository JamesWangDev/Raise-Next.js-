import { useUser } from "@clerk/nextjs";
import Script from "next/script";

export default function ChatWidgetWrapper() {
    const { isLoaded, isSignedIn, user } = useUser();

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

    // Bundle size
    return (
        <>
            <Script id="papercups-data" strategy="lazyOnload">
                {`window.Papercups = {
  config: {
    token: "19650de6-84fa-4da9-a8b9-78ffcadab983",
    inbox: "1a5d07de-76b2-4430-a1c3-68507bb8b977",
    title: "Welcome to Raise More",
    subtitle: "Ask us anything in the chat window below 😊",
    primaryColor: "#388bff",
    greeting:"Hi there! Send us a message and we'll get back to you as soon as we can.",
    newMessagePlaceholder: "Start typing...",
    showAgentAvailability: false,
    agentAvailableText: "We're online right now!",
    agentUnavailableText: "We're away at the moment.",
    requireEmailUpfront: false,
    iconVariant: "outlined",
    baseUrl: "https://app.papercups.io"
    // Optionally include data about your customer here to identify them
    // customer: {
    //   name: __CUSTOMER__.name,
    //   email: __CUSTOMER__.email,
    //   external_id: __CUSTOMER__.id,
    //   metadata: {
    //     plan: "premium"
    //   }
    // }
  },
};`}
            </Script>
            <Script strategy="lazyOnload" src="https://app.papercups.io/widget.js" />
        </>
    );
    // return (
    //     <ChatWidget
    //         // `accountId` is used instead of `token` in older versions
    //         // of the @papercups-io/chat-widget package (before v1.2.x).
    //         // You can delete this line if you are on the latest version.
    //         // accountId="19650de6-84fa-4da9-a8b9-78ffcadab983"
    //         token="19650de6-84fa-4da9-a8b9-78ffcadab983"
    //         inbox="1a5d07de-76b2-4430-a1c3-68507bb8b977"
    //         title="Welcome to RaiseMore"
    //         subtitle="Ask us anything in the chat window below 😊"
    //         primaryColor="#388bff"
    //         greeting="Hi there! Send us a message and we'll get back to you as soon as we can."
    //         newMessagePlaceholder="Start typing..."
    //         showAgentAvailability={false}
    //         agentAvailableText="We're online right now!"
    //         agentUnavailableText="We're away at the moment."
    //         requireEmailUpfront={false}
    //         iconVariant="outlined"
    //         baseUrl="https://app.papercups.io"
    //         customer={customer}
    //     />
    // );
}
