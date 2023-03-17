import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
const twilio = require("twilio");

export default async function dialOutAndPlaceInConference(request) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const conferences = await client.conferences.list({
        status: "in-progress",
        limit: 1,
    });

    if (conferences.length < 1) {
        return "Error: cannot place an outbound call before you call in to (667) 242-9611!";
    } else {
        const conferenceSID = conferences[0]["sid"];

        client
            .conferences(conferenceSID)
            .participants.create({
                label: "outboundCall",
                earlyMedia: true,
                beep: "true",
                // statusCallback: 'https://us-central1-appealapp.cloudfunctions.net/webhookConferenceUpdate', // 'https://eo3wlvlszqvxyb7.m.pipedream.net', //
                // statusCallbackEvent: ['ringing'],
                // record: true,
                from: "+16672429611",
                to: "+1" + data.numberToDial,
            })
            .then((participant) => {
                return NextResponse.json({ conferenceSID, participant });
            });
    }
}
