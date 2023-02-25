import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import QueryBuilderProvider from "components/QueryBuilderProvider";
import { useState, useEffect } from "react";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

export default function Dashboard() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs
                    pages={[{ name: "Donations", href: "/donations" }]}
                />
                <PageTitle title="Donations" descriptor="All donations." />
            </div>
            <div className="mx-auto max-w-7xl px-2  ">
                <QueryBuilderProvider table="donations_for_user_display" />
            </div>
        </div>
    );
}
