const twilio = require("twilio");

export default async function hangup(data, context) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const conferences = await client.conferences.list({
        status: "in-progress",
        limit: 1,
    });

    if (conferences.length < 1) {
        return "Error: cannot hangup an outbound call before you call in to (667) 242-9611!";
    } else {
        const conferenceSID = conferences[0]["sid"];

        client
            .conferences(conferenceSID)
            .participants("outboundCall")
            .remove()
            .then((participant) => {
                return "successfully hung up";
            });
    }
}
