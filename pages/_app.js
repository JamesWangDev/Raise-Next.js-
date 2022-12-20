import "../styles/globals.css";

import Layout from "../components/Layout";

//import { AppProps } from "next/app";
//import { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
import { ClerkProvider } from "@clerk/nextjs";

function App({ Component, pageProps: { session, ...pageProps } }) {
  // console.log("pageProps", Object.keys(pageProps));
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default App;
