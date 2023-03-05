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
        response({ data, error });
    };

    useEffect(() => {
        example();
    });

    return (
        <>
            {JSON.stringify(data || "nothing", 0, 02)}
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
