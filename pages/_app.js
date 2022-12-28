import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import "../styles/globals.css";
// import "@docsearch/css";

import Layout from "../components/Layout";
import { ClerkProvider } from "@clerk/nextjs";

function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <link
          rel="preload"
          href="/api/rq?start=0&query=select%20*%20from%20people_for_user_display%20where%20(1%20=%201)%20limit%2025"
          as="fetch"
          crossorigin="anonymous"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}

export default App;
