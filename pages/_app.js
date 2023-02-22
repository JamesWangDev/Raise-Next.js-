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
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ClerkProvider>
    );
}

export default App;
