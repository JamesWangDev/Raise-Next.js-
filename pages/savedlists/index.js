import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SupabaseTable from "components/SupabaseTable";
import { useState, useEffect } from "react";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

export default function Dashboard() {
    return (
        <div>
            <div className="mx-auto max-w-7xl px-2">
                <Breadcrumbs pages={[{ name: "Lists", href: "/savedlists", current: true }]} />
                <PageTitle
                    title="📋&nbsp; Lists"
                    descriptor="Edit existing lists, or use one to launch a new call session."
                />
            </div>
            <div className="mx-auto max-w-7xl px-2">
                <SupabaseTable table="saved_lists" />
            </div>
        </div>
    );
}
