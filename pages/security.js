import { useSupabase } from "utils/supabaseHooks";

export default function test() {
    supabase
        // .from("people")
        .rpc("requesting_user_id")
        .then((result) => console.log(result));
    return <>Hello</>;
}
