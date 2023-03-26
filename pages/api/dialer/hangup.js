import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { Authorization, TWILIO_API_URL } from "lib/twilio";

export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const participantCallSidOrLabel = searchParams.get("participant");
    const conferenceSID = searchParams.get("conferenceSID");

    const response = await fetch(
        `${TWILIO_API_URL}/Conferences/${conferenceSID}/Participants/${participantCallSidOrLabel}.json`,
        {
            method: "DELETE",
            headers: new Headers({
                ...Authorization,
                "Content-Type": "application/x-www-form-urlencoded",
            }),
        }
    );
    // Hangup returns 204, with no body
    const status = await response.status;
    return new NextResponse(null, {
        status,
    });
}
