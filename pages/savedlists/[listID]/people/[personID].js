import PersonProfile from "components/PersonProfile";
import { useRouter } from "next/router";

export default function PersonPage() {
    const router = useRouter();
    const { personID, listID } = router.query;
    return (
        <>
            <PersonProfile personID={personID} listID={listID} />
        </>
    );
}
