import Link from "next/link";
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

export default function Export() {
    return (
        <div className="mx-auto max-w-7xl px-2">
            <Breadcrumbs
                pages={[
                    {
                        name: "Export",
                        href: "/export",
                        current: true,
                    },
                ]}
            />
            <PageTitle
                title="Export"
                descriptor={
                    <>
                        Get bulk exports for NGP, email software, texting, etc.{" "}
                        <Link className="link" href="/help/export">
                            Learn more.
                        </Link>
                    </>
                }
            />
        </div>
    );
}
