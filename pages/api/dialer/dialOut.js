import { NextResponse } from "next/server";
export const config = { runtime: "edge" };
import { getConferences, Authorization, TWILIO_API_URL } from "lib/twilio";

export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const numberToDial = searchParams.get("numberToDial");

    const conferences = getConferences();

    if (conferences.length < 1) {
        return "Error: cannot place an outbound call before you call in to (667) 242-9611!";
    } else {
        const conferenceSID = conferences[0]["sid"];
        console.log(`Ongoing conference SID: ${conferenceSID}`);

        /*
        // client
        //     .conferences(conferenceSID)
        // .participants.create({
        //     label: "outboundCall",
        //     earlyMedia: true,
        //     beep: "true",
        //     // statusCallback: 'https://us-central1-appealapp.cloudfunctions.net/webhookConferenceUpdate', // 'https://eo3wlvlszqvxyb7.m.pipedream.net', //
        //     // statusCallbackEvent: ['ringing'],
        //     // record: true,
        //     from: "+16672429611",
        //     to: "+1" + data.numberToDial,
        // })
        //     .then((participant) => {
        //         return NextResponse.json({ conferenceSID, participant });
        //     });
        // /////
        // curl -X POST "${TWILIO_API_URL}/Conferences/${conferenceSID}/Participants.json" \
        // --data-urlencode "Label=customer" \
        // --data-urlencode "EarlyMedia=True" \
        // --data-urlencode "Beep=onEnter" \
        // --data-urlencode "StatusCallback=https://myapp.com/events" \
        // --data-urlencode "StatusCallbackEvent=ringing" \
        // --data-urlencode "Record=True" \
        // --data-urlencode "From=+15017122661" \
        // --data-urlencode "To=+15558675310" \
        // -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
        // //////
        */
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
                    // statusCallback: 'https://us-central1-appealapp.cloudfunctions.net/webhookConferenceUpdate', // 'https://eo3wlvlszqvxyb7.m.pipedream.net', //
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
}
