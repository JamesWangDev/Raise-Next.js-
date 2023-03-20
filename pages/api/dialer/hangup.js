import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { Authorization, TWILIO_API_URL } from "lib/twilio";

export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const participantCallSidOrLabel = searchParams.get("participant");
    const conferenceSID = searchParams.get("conferenceSID");

    const response = await fetch(
        `${TWILIO_API_URL}/Conferences/${conferenceSID}/Participants/${
            participantCallSidOrLabel || "outboundCall"
        }.json`,
        {
            method: "DELETE",
            headers: new Headers({
                ...Authorization,
                "Content-Type": "application/x-www-form-urlencoded",
            }),
        }
    );
    const responseJSON = await response.json();
    console.log({ responseJSON });
    return NextResponse.json(responseJSON);
}
