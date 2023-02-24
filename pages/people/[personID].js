import PersonProfile from "components/PersonProfile";
import { useRouter } from "next/router";

export default function PersonPage() {
    const router = useRouter();
    const { personID } = router.query;
    return (
        <>
            <PersonProfile personID={personID} />
        </>
    );
}
