import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

// import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useSession, signIn, signOut } from "next-auth/react";

import { getSupabase } from "../utils/supabase";

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className={styles.container}>
        Welcome, user!
        <br />
        {session.user.name}
        <br />
        {session.user.email}
        <br />
        {session.user.image}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      Click to sign into your user account <br />
      <button onClick={() => signIn("google")}>Sign in</button>
    </div>
  );
}
