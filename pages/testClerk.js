import { useEffect, useState } from "react";
import { useSupabase } from "utils/supabaseHooks";
import { useAuth } from "@clerk/nextjs";

export default function testClerk() {
    const supabase = useSupabase();
    const [response, setResponse] = useState();

    const example = async () => {
        const { data, error } = await supabase
            .from("donations")
            .select("*")
            .limit(25);
        setResponse({ data, error });
    };

    useEffect(() => {
        example();
    }, []);

    return (
        <>
            {JSON.stringify(response || "nothing", 0, 2)}
            <button
                className="btn button btn-primary button-primary"
                onClick={() => {
                    example();
                }}
            >
                Refresh
            </button>
        </>
    );
}
