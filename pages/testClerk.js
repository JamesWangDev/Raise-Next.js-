import { useEffect, useState } from "react";
import { useSupabase } from "utils/supabaseHooks";
import { useAuth } from "@clerk/nextjs";

export default function testClerk() {
    const supabase = useSupabase();
    const [response, setResponse] = useState();

    useEffect(() => {
        const example = async () => {
            const { data, error } = await supabase
                .from("donations")
                .select("*")
                .limit(25);
            response({ data, error });
        };
        example();
    });

    return <>{JSON.stringify(data || "nothing", 0, 02)}</>;
}
