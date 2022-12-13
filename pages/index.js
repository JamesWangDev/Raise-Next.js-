import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SupabaseTable from "../components/SupabaseTable";
import { useState, useEffect } from "react";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession, signIn, signOut } from "next-auth/react";

import PleaseLogin from "../components/PleaseLogin";

export default function Page() {
  const { data: session } = useSession();
  if (!session) return <PleaseLogin />;

  return (
    <div className="py-2">
      <div className="mx-auto max-w-7xl px-2 ">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mx-auto max-w-7xl px-2  ">Welcome to the app!</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}
