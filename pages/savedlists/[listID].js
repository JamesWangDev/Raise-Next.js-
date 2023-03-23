import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import QueryBuilderProvider from "components/QueryBuilderProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";
import { useSupabase } from "lib/supabaseHooks";

export default function SpecificListPage() {
    const supabase = useSupabase();

    const router = useRouter();
    const { listID } = router.query;

    const [list, setList] = useState();
    useEffect(() => {
        supabase
            .from("saved_lists")
            .select()
            .eq("id", listID)
            .maybeSingle()
            .then(({ data, error }) => {
                setList(data);
            });
    }, [supabase]);

    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs
                    pages={[
                        { name: "Lists", href: "/savedlists", current: false },
                        {
                            name: listID,
                            href: "/savedlists/" + listID,
                            current: true,
                        },
                    ]}
                />
                <PageTitle title={"List " + list.name} descriptor="You're editing this query." />
            </div>
            <div className="mx-auto max-w-7xl px-2  ">
                <QueryBuilderProvider table="people_for_user_display" listID={listID} />
            </div>
        </div>
    );
}
