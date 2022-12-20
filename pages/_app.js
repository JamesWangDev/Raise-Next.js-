import "../styles/globals.css";

import Layout from "../components/Layout";
import { ClerkProvider } from "@clerk/nextjs";

function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default App;
