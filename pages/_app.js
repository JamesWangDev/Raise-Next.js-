import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import "../styles/globals.css";
// import "@docsearch/css";

import Layout from "../components/Layout";
import { ClerkProvider } from "@clerk/nextjs";
import { IntercomProvider } from "../utils/IntercomProvider";

function App({ Component, pageProps }) {
    return (
        <ClerkProvider {...pageProps}>
            <IntercomProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </IntercomProvider>
        </ClerkProvider>
    );
}

export default App;
