import "../styles/globals.css";
import Layout from "../components/Layout";

//import { AppProps } from "next/app";
//import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />{" "}
      </Layout>
    </SessionProvider>
  );
}

export default App;
