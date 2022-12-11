import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Fragment, useEffect, useState } from "react";

// Initialize the JS client
import supabase from "../utils/supabase";
console.log(supabase);

export default function SingleQueryView({ rows }) {
  return (
    <>
      {rows.map((row) => (
        <>
          <div>{JSON.stringify(row)}</div>
        </>
      ))}
    </>
  );
}

export const getStaticProps = async () => {
  const { data: rows, error } = await supabase.from("testTable").select();
  return { props: { rows } };
};
