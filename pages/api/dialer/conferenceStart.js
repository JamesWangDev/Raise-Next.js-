import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { createSupabaseClient } from "lib/supabaseHooks";
const supabaseServiceRole = createSupabaseClient(null, { serviceRole: true });

async function updateParticipantAndGetSessionID(caller, callSID) {
    // Get the most recent call session associated with the caller's number
    const { data, error } = await supabaseServiceRole
        .from("call_session_participants")
        .select()
        .eq("number_dialed_in_from", caller)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    console.log({ callSID });

    if (data?.call_session_id) {
        // Mark the caller as called-in
        const response = await supabaseServiceRole
            .from("call_session_participants")
            .update({ dialed_in: true, call_sid: callSID })
            // .eq("id", data.id);
            .eq("call_session_id", data?.call_session_id)
            .eq("number_dialed_in_from", caller);

        console.log({ response });
    }

    return data?.call_session_id;
}

export default async function webhookDialInConference(request) {
    console.log("webhookDialInConference()");
    const baseURL =
        process.env.ENVIRONMENT_URL.indexOf("localhost") !== -1
            ? "https://dev.raisemore.app"
            : process.env.ENVIRONMENT_URL;

    const { searchParams } = new URL(request.url);
    const caller = searchParams.get("Caller").replace(/^\+1/, "");
    const callSID = searchParams.get("CallSid");
    const callSessionID = await updateParticipantAndGetSessionID(caller, callSID);

    if (!callSessionID) {
        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
                <Response>
                    <Say>You're not assigned to a call session.</Say>  
                </Response>`,
            {
                status: 200,
                headers: {
                    "Content-Type": "text/xml",
                },
            }
        );
    } else {
        // Send back TwiML to welcome and start conference
        return new Response(
            `<?xml version="1.0" encoding="UTF-8"?>
                <Response>
                    <Say>Welcome to the dialer tool. Press dial on the app to make your first outbound call.</Say>  
                    <Dial>
                    <Conference 
                        startConferenceOnEnter='true' 
                        endConferenceOnExit='true' 
                        waitUrl=''
                        statusCallback='${baseURL}/api/dialer/conferenceUpdate'
                        statusCallbackEvent='start end join leave mute hold modify'>${callSessionID}</Conference>
                    </Dial>
                </Response>`,
            {
                status: 200,
                headers: {
                    "Content-Type": "text/xml",
                },
            }
        );
    }
}
