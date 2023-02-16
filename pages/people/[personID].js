import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import supabase from "../../utils/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CheckIcon,
  HandThumbUpIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

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
      <div>
        <h1>
          {person.first_name} {person.last_name}
        </h1>{" "}
        <h2>
          {person.occupation} | {person.employer} | {person.state}
        </h2>
      </div>
      <div className="mx-auto max-w-7xl px-2 grid grid-flow-col grid-cols-4 gap-x-12	bg-white border-t-2 -mx-6 px-6 py-6 mt-6">
        <div className="col-span-1">
          <PersonContactInfo person={person} />
        </div>
        <div className="col-span-2">
          <PersonContactHistory person={person} />
        </div>
        <div className="col-span-1">Last column</div>
      </div>
    </div>
  );
}

function PersonContactInfo({ person }) {
  return (
    <div>
      <h2>Contact Information</h2>
      <h3 className="border-t-2 pt-2">Phone Numbers</h3>
      {person.phone}
      <h3 className="border-t-2 pt-2">Emails</h3>
      {person.email}
      <h3 className="border-t-2 pt-2">Addresses</h3>
      {person.addr1}
      <br />
      {person.addr2}
      {person.addr2 ? <br /> : null}
      {person.city}, {person.state} {person.zip}
    </div>
  );
}

const timeline = [
  {
    id: 1,
    content: "Applied to",
    target: "Front End Developer",
    href: "#",
    date: "Sep 20",
    datetime: "2020-09-20",
    icon: UserIcon,
    iconBackground: "bg-gray-400",
  },
  {
    id: 2,
    content: "Advanced to phone screening by",
    target: "Bethany Blake",
    href: "#",
    date: "Sep 22",
    datetime: "2020-09-22",
    icon: HandThumbUpIcon,
    iconBackground: "bg-blue-500",
  },
  {
    id: 3,
    content: "Completed phone screening with",
    target: "Martha Gardner",
    href: "#",
    date: "Sep 28",
    datetime: "2020-09-28",
    icon: CheckIcon,
    iconBackground: "bg-green-500",
  },
  {
    id: 4,
    content: "Advanced to interview by",
    target: "Bethany Blake",
    href: "#",
    date: "Sep 30",
    datetime: "2020-09-30",
    icon: HandThumbUpIcon,
    iconBackground: "bg-blue-500",
  },
  {
    id: 5,
    content: "Completed interview with",
    target: "Katherine Snyder",
    href: "#",
    date: "Oct 4",
    datetime: "2020-10-04",
    icon: CheckIcon,
    iconBackground: "bg-green-500",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function PersonContactHistory() {
  return (
    <div className="flow-root">
      <h2>Interaction History</h2>
      <ul role="list" className="-mb-8 mt-6">
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      event.iconBackground,
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                    )}
                  >
                    <event.icon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.content}{" "}
                      <a
                        href={event.href}
                        className="font-medium text-gray-900"
                      >
                        {event.target}
                      </a>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
