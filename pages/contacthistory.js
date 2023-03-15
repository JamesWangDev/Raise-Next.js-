import SupabaseTable from "components/SupabaseTable";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

export default function Dashboard() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs
                    pages={[
                        {
                            name: "Contact History",
                            href: "/contacthistory",
                            current: true,
                        },
                    ]}
                />
                <PageTitle
                    title="Contact History"
                    descriptor="All interactions with donors and prospects."
                />
            </div>
            <div className="mx-auto max-w-7xl px-2  ">
                <SupabaseTable table="interactions" />
            </div>
        </div>
    );
}
