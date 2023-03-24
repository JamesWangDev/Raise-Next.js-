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

    const callSessionID = bodyForInsert?.friendly_name;
    let { data } = await supabase.from("call_sessions").select().eq("id", callSessionID).single();
    const orgID = data?.organization_id;
    if (!orgID) {
        console.error("no corresponding session with an org id exists to this conference update");
    }

    let response = await supabase
        .from("conference_updates")
        .insert({
            ...bodyForInsert,
            organization_id: orgID,
        })
        .select()
        .single();
    if (response?.error) {
        console.error({
            message: "Error adding conference update",
            data,
            error,
        });
    }
    console.log("Conference update written to table");
    console.log({ data });

    const { participant_label, status_callback_event, call_sid } = bodyForInsert;
    const personID = participant_label?.includes("outboundCall")
        ? participant_label?.split("|")[1]
        : false;
    if (personID && status_callback_event === "participant-join") {
        console.log("start outgoing call");
        await supabase.from("interactions").insert({
            person_id: personID,
            contact_type: "call",
            call_sid,
            organization_id: orgID,
        });
    }

    if (personID && status_callback_event === "participant-leave") {
        console.log("end outgoing call");
        await supabase
            .from("interactions")
            .update({
                person_id: personID,
                contact_type: "call",
                call_sid,
                ended_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                organization_id: orgID,
            })
            .eq("call_sid", call_sid);
    }
    /*
// // bodyForInsert.callsid
// record the starttime for a new outgoing call interaction

// record the endtime for call

    */

    return NextResponse.json(response);
}
