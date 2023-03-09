import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useState, useEffect } from "react";
import PageTitle from "components/PageTitle";
import Breadcrumbs from "components/Breadcrumbs";

export default function Reports() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs pages={[{ name: "Reports", href: "/reports" }]} />
                <PageTitle title="Reports" descriptor="View existing or generate new reports." />
            </div>
            <div className="mx-auto max-w-7xl px-2  ">Not implemented yet.</div>
        </div>
    );
}
