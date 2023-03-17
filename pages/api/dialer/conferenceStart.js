import { NextResponse } from "next/server";
export const config = { runtime: "edge" };

export default function webhookDialInConference(request) {
    console.log("hello serverside from twilio");
    const baseURL =
        process.env.ENVIRONMENT_URL.indexOf("localhost") !== -1
            ? "https://dev.raisemore.app"
            : process.env.ENVIRONMENT_URL;

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
             statusCallbackEvent='start end join leave mute hold modify'>My conference</Conference>
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
