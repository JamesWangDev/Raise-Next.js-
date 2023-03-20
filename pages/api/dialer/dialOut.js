import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { Authorization, TWILIO_API_URL } from "lib/twilio";

export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const conferenceSID = searchParams.get("conferenceSID");
    const numberToDial = searchParams.get("numberToDial");

    const response = await fetch(
        `${TWILIO_API_URL}/Conferences/${conferenceSID}/Participants.json`,
        {
            method: "POST",
            headers: new Headers({
                ...Authorization,
                "Content-Type": "application/x-www-form-urlencoded",
            }),

            body: new URLSearchParams({
                Label: "outboundCall",
                EarlyMedia: "True",
                Beep: "True",
                // statusCallback: 'https://example.com',
                // statusCallbackEvent: ['ringing'],
                // record: true,
                From: "+16672429611",
                To: "+1" + numberToDial,
            }).toString(),
        }
    );
    const responseJSON = await response.json();
    console.log({ responseJSON });
    return NextResponse.json(responseJSON);
}
