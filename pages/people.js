import QueryBuilderProvider from "components/QueryBuilderProvider";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

export default function PeoplePage() {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-2 ">
                <Breadcrumbs pages={[{ name: "People", href: "/people", current: false }]} />
                <PageTitle title="People" descriptor="Donors and prospects." />
            </div>
            <div className="mx-auto max-w-7xl px-2  ">
                <QueryBuilderProvider table="people_for_user_display" />
            </div>
        </div>
    );
}
