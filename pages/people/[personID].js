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
      <div className="mx-auto max-w-7xl px-2 columns-3">
        <div>
          <PersonContactInfo person={person} />
        </div>
        <div>
          <PersonContactHistory person={person} />
        </div>
      </div>
    </div>
  );
}

function PersonContactInfo({ person }) {
  return (
    <div>
      <h1>
        {person.first_name} {person.last_name}
      </h1>
      <h2>
        {person.occupation} | {person.employer} | {person.city}, {person.state}{" "}
        {person.zip}
      </h2>
      <h3 className="border-t-2 pt-2">Phone Numbers</h3>
      {person.phone}
      <h3 className="border-t-2 pt-2">Emails</h3>
      {person.email}
      <h3 className="border-t-2 pt-2">Addresses</h3>
      {person.addr1}
      <br />
      {person.addr2}
      <br />
      {person.city}, {person.state} {person.zip}
    </div>
  );
}

function PersonContactHistory({ person }) {
  return <>Contact history here</>;
}
