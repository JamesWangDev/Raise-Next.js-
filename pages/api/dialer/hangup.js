import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { getConferences } from "lib/twilio";

export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const participantCallSidOrLabel = searchParams.get("participant");
    const conferences = getConferences();

    if (conferences.length < 1) {
        return "Error: cannot hangup an outbound call before you call in to (667) 242-9611!";
    } else {
        const conferenceSID = conferences[0]["sid"];

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
        const responseJSON = await response.json();
        console.log({ responseJSON });
        return NextResponse.json(responseJSON);
    }
}
