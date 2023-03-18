export const base64 = require("base-64");
export const Authorization = {
    Authorization: `Basic ${base64.encode(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    )}`,
};
export const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}`;
export const encodedBodyToJSON = (urlEncoded) =>
    Object.fromEntries(new URLSearchParams(urlEncoded));

export async function getConferences() {
    /*
    // const conferences = await client.conferences.list({
    //     status: "in-progress",
    //     limit: 1,
    // });
    //
    // curl -X GET "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Conferences.json?DateCreated%3E=2021-01-01&Status=in-progress&PageSize=20" \
    // -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
    */
    // Reformatted as edge-compatible HTTP:
    return (
        (await (
            await fetch(`${TWILIO_API_URL}/Conferences.json?Status=in-progress&PageSize=1`, {
                headers: new Headers({
                    ...Authorization,
                }),
            })
        ).json()?.conferences) || []
    );
}
