import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SpecificListPage() {
  const router = useRouter();
  const { personID } = router.query;
  const [person, setPerson] = useState({});

  useEffect(() => {
    supabase
      .from("people")
      .select()
      .eq("id", personID)
      .single()
      .then((result) => setPerson(result.data));
  }, [personID]);

  return (
    <div className="py-2">
      <div className="mx-auto max-w-7xl px-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Person view {personID}
        </h1>
      </div>
      <div className="mx-auto max-w-7xl px-2">
        <pre>{JSON.stringify(person, 0, 2)}</pre>
      </div>
    </div>
  );
}
