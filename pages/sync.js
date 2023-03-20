import Link from "next/link";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

export default function Sync() {
    return (
        <div className="mx-auto max-w-7xl px-2">
            <Breadcrumbs
                pages={[
                    {
                        name: "Sync",
                        href: "/sync",
                        current: true,
                    },
                ]}
            />
            <PageTitle
                title="Sync Settings"
                descriptor={
                    <>
                        Configure automatic continuous imports from ActBlue.{" "}
                        <Link className="link" href="/help/sync">
                            Learn more.
                        </Link>
                    </>
                }
            />
        </div>
    );
}
