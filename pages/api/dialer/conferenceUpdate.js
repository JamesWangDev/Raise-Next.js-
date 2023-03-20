import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { createSupabaseClient } from "lib/supabaseHooks";
import { snakeCaseKeys } from "lib/cases";
import { encodedBodyToJSON } from "lib/twilio";

export default async function handler(request) {
    const body = encodedBodyToJSON(await request.text());
    const bodyForInsert = snakeCaseKeys(body);
    bodyForInsert.created_at = bodyForInsert.timestamp;
    delete bodyForInsert.timestamp;

    const supabase = createSupabaseClient(null, { serviceRole: true });
    supabase
        .from("conference_updates")
        .insert(bodyForInsert)
        .select()
        .single()
        .then((response) => {
            console.log("Conference update written to table: ", response);
            return NextResponse.json(response);
        })
        .catch((erroredResponse) => {
            console.error({
                message: "Error adding conference update",
                erroredResponse,
                bodyForInsert,
            });
        });
}
