import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { createSupabaseClient } from "utils/supabaseHooks";

export default async function webhookConferenceUpdate(request) {
    const json = await request.text();
    console.log(json);
    // const db = createSupabaseClient(null, { serviceRole: true });
    // db.from("conference_updates").insert({ body: request.body });
    // .select()
    // .then((response) => {
    //     console.log("Document written with ID: ", response);
    // })
    // .catch((error) => {
    //     console.error("Error adding document: ", error);
    // });

    return NextResponse.json({
        message: `Thanks, twilio.`,
    });
}
