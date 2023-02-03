import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import SupabaseTable from "../components/SupabaseTable";

import {
  useAuth,
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
  SignIn,
  SignUp,
} from "@clerk/nextjs";

import PleaseLogin from "../components/PleaseLogin";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  HandRaisedIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const stats = [
  {
    name: "Total Raised",
    previousStat: "---",
    change: "---",
    changeType: "increase",
    query: "total_sum_donations",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Unfufilled Pledges",
    previousStat: "---",
    change: "---",
    changeType: "increase",
    query: "total_sum_unfufilled_pledges",
    icon: HandRaisedIcon,
  },
  {
    name: "Phone Calls Made",
    previousStat: "---",
    change: "---",
    changeType: "increase",
    query: "total_number_of_calls",
    icon: PhoneIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function StatCard({ query, table, key, item }) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);

    supabase
      .from(table)
      .select(query)
      .single()
      .then((data) => {
        setData(data.data);
        setLoading(false);
      });
  }, []);

  item.stat = data ? (Object.keys(data) ? data[Object.keys(data)[0]] : 0) : 0;

  // Fix NaN
  if (isNaN(item.stat)) item.stat = 0;

  // Format certain metrics
  if (
    ["pledge", "raise"].some((v) =>
      item.name.toLowerCase().includes(v.toLowerCase())
    )
  )
    item.stat = "$" + Number(item.stat).toLocaleString();

  return (
    <div
      key={item.id}
      className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 pb-0 shadow-sm sm:px-6 sm:pt-6 ring-1 ring-black ring-opacity-5"
    >
      <dt>
        <div className="absolute rounded-md bg-gray-400 p-3">
          <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">
          {item.name}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
        {/* <p
          className={classNames(
            item.changeType === "increase" ? "text-green-600" : "text-red-600",
            "ml-2 flex items-baseline text-sm font-semibold"
          )}
        >
          {item.changeType === "increase" ? (
            <ArrowUpIcon
              className="h-5 w-5 flex-shrink-0 self-center text-green-500"
              aria-hidden="true"
            />
          ) : (
            <ArrowDownIcon
              className="h-5 w-5 flex-shrink-0 self-center text-red-500"
              aria-hidden="true"
            />
          )}

          <span className="sr-only">
            {item.changeType === "increase" ? "Increased" : "Decreased"} by{" "}
          </span>
          {item.change}
        </p> */}
        {/* <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-gray-600 hover:text-gray-500"
            >
              View all<span className="sr-only"> {item.name} stats</span>
            </a>
          </div>
        </div> */}
      </dd>
    </div>
  );
}

export function HomepageCards() {
  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">All Time</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item, i) => (
          <StatCard
            key={i}
            item={item}
            query={item.query}
            table="dashboard_by_account"
          />
        ))}
      </dl>
    </div>
  );
}

export default function Page() {
  const { isSignedIn, isLoading, user } = useUser();

  return (
    <div className="py-2">
      <div className="mx-auto max-w-7xl px-2 ">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="mx-auto max-w-7xl px-2  ">
        <HomepageCards />
      </div>
    </div>
  );
}
