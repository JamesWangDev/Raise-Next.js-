import { useState, useEffect } from "react";
import { useSupabase } from "lib/supabaseHooks";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";
import CallingSessionsGrid from "components/CallingSessionsGrid";
import { useUser } from "@clerk/nextjs";
import { CurrencyDollarIcon, HandRaisedIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const stats = [
    {
        name: "Total Raised",
        previousStat: "---",
        change: "---",
        changeType: "increase",
        query: "total_sum_donations",
        icon: CurrencyDollarIcon,
        href: "/donations",
    },
    {
        name: "Unfufilled Pledges",
        previousStat: "---",
        change: "---",
        changeType: "increase",
        query: "total_sum_unfufilled_pledges",
        icon: HandRaisedIcon,
        href: "/pleges",
    },
    {
        name: "Phone Calls Made",
        previousStat: "---",
        change: "---",
        changeType: "increase",
        query: "total_number_of_calls",
        icon: PhoneIcon,
        href: "/contacthistory",
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function StatCard({ query, table, item }) {
    const [data, setData] = useState(null);
    const supabase = useSupabase();

    useEffect(() => {
        supabase
            .from(table)
            .select(query)
            .maybeSingle()
            .then(({ data, error }) => {
                if (error) console.error(error);
                setData(data);
            });
    }, [query, table, supabase]);

    item.stat = data ? (Object.keys(data) ? data[Object.keys(data)[0]] : 0) : 0;

    // Fix NaN
    if (isNaN(item.stat)) item.stat = 0;

    // Format certain metrics
    if (["pledge", "raise"].some((v) => item.name.toLowerCase().includes(v.toLowerCase())))
        item.stat = "$" + Number(item.stat).toLocaleString();

    return (
        <Link href={item?.href} key={item.id}>
            <div className="relative overflow-hidden rounded-lg bg-white px-4 pt-7 pb-0 shadow sm:px-6 rounded-lg shadow-md border hover:shadow-lg hover:cursor-pointer">
                <dt>
                    <div className="absolute rounded-md bg-blue-200 p-3">
                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                </dd>
            </div>
        </Link>
    );
}

export default function Home() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2">
                <Breadcrumbs pages={[{ name: "Dashboard", href: "/", current: false }]} />
                <PageTitle
                    title="👋&nbsp; Dashboard"
                    descriptor="Welcome to your fundraising home base!"
                />
            </div>
            <div className="mx-auto max-w-7xl px-2">
                <div>
                    <h3 className="mt-7">Metrics</h3>
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
                <div>
                    <h3>Join an active calling session:</h3>
                    <CallingSessionsGrid />
                </div>
            </div>
        </div>
    );
}
