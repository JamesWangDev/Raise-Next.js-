import QueryBuilderProvider from "components/QueryBuilderProvider";
import { useRouter } from "next/router";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";
import { useSupabase, useQuery } from "lib/supabaseHooks";

export default function SpecificListPage() {
    const { listID } = useRouter().query;
    const { data: list, mutate: mutateList } = useQuery(
        useSupabase().from("saved_lists").select().eq("id", listID).single()
    );

    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs
                    pages={[
                        { name: "Saved Lists", href: "/savedlists", current: false },
                        {
                            name: list?.name || "listname",
                            href: "/savedlists/" + listID,
                            current: true,
                        },
                    ]}
                />
                <PageTitle title={`List "${list?.name}"`} descriptor="You're editing this query." />
            </div>
            <div className="mx-auto max-w-7xl px-2  ">
                <QueryBuilderProvider
                    table="people_for_user_display"
                    listID={listID}
                    forceListUpdate={mutateList}
                />
            </div>
        </div>
    );
}
