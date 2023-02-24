// Description: Firebase initialization and functions
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";

// Other missing imports:

// Config variable for firebase initialization
const firebaseConfig = {
    apiKey: "AIzaSyBSG-ctw1FdJ0820-lhkFqv7ezWTKTkClg",
    authDomain: "appealapp.firebaseapp.com",
    databaseURL: "https://appealapp-default-rtdb.firebaseio.com",
    projectId: "appealapp",
    storageBucket: "appealapp.appspot.com",
    messagingSenderId: "430857266789",
    appId: "1:430857266789:web:0e40e176caaf7ec987488c",
};

// New v9 firebase syntax from here on out
const app = initializeApp(firebaseConfig);

// Initialize Cloud Functions through Firebase
const functions = getFunctions(app);

// Init firestore
const db = getFirestore(app);

// Numbers to dial
var numbersToDial = [];
// $("ol li").each((b, a) => numbersToDial.push($(a).text()));
console.log(numbersToDial);

function dial(number) {
    // Call the dial functions
    httpsCallable(
        functions,
        "dialOutAndPlaceInConference"
    )({ numberToDial: number }).then((result) => {
        // Read result of the Cloud Function.
        // var sanitizedMessage = result.data.text;
        console.log("firebase func dialOutAndPlaceInConference() returns:");
        console.log(result.data);
    });
    // dialerAdvance();
}

function hangup() {
    // Call the dial functions
    httpsCallable(functions, "hangup")().then((result) => {
        // Read result of the Cloud Function.
        // var sanitizedMessage = result.data.text;
        console.log("firebase func hangup() returns:");
        console.log(result.data);
    });
}

// Store a global variable for updates
var conferenceUpdates = [];

// Subscribe to firestore updates
// db.collection("conference-updates")
//     .orderBy("Timestamp", "desc")
//     .onSnapshot(handleConferenceUpdateSnapshot);
// Rewrite the previous 3 lines as firebase v9 syntax

// Handle the updates
function handleConferenceUpdateSnapshot(querySnapshot) {
    console.log("handleConferenceUpdateSnapshot()");
    conferenceUpdates = [];
    querySnapshot.forEach((doc) => {
        conferenceUpdates.push(doc.data());
    });
    console.log({ conferenceUpdates });
    // //console.log('conferenceUpdates', conferenceUpdates);
    // $("code").html("");
    // $("code").text(
    //     conferenceUpdates
    //         .map((a) => a.StatusCallbackEvent + " | " + new Date(a.Timestamp))
    //         .join("\n")
    // );

    // if (
    //     (conferenceUpdates[0].StatusCallbackEvent == "conference-end" ||
    //         conferenceUpdates[1].StatusCallbackEvent == "conference-end") &&
    //     conferenceUpdates[0].StatusCallbackEvent != "participant-join"
    // ) {
    //     console.log("not dialed in");
    //     $('button:contains("Dial")').prop("disabled", true);
    //     $('button:contains("Hangup")').prop("disabled", true);

    //     $("#havent-dialed-in").show();
    // } else {
    //     console.log("dialed in!");
    //     $('button:contains("Dial")').prop("disabled", false);
    //     //$('button:contains("Hangup")').prop('disabled', false); // Hangup needs to be enabled when a call is active
    //     $("#havent-dialed-in").hide();
    // }

    // // Enable hangup button when outbound call is active, disable dial button
    // if (
    //     conferenceUpdates[0].StatusCallbackEvent == "participant-join" &&
    //     conferenceUpdates[0].ParticipantLabel == "outboundCall"
    // ) {
    //     //dialerAdvance();
    // }

    // // Disable hangup button when outbound call ends, enable dial button
    // if (
    //     conferenceUpdates[0].StatusCallbackEvent == "participant-leave" &&
    //     conferenceUpdates[0].ParticipantLabel == "outboundCall"
    // ) {
    //     $('button:contains("Hangup")').prop("disabled", true);
    //     $('button:contains("Dial")').prop("disabled", false);
    // }
}

function dialerAdvance() {
    // Change button availability
    $('button:contains("Hangup")').prop("disabled", false);
    $('button:contains("Dial")').prop("disabled", true);

    // Move forward the dialer
    $("li.font-weight-bold + li").addClass("font-weight-bold");
    $("li.font-weight-bold").eq(0).removeClass("font-weight-bold");

    // Change dialer setting
    var nextNumberToCall = $("li.font-weight-bold").text();
    $("input.next-number").val(
        nextNumberToCall.includes("choose")
            ? "Write a number to call here"
            : nextNumberToCall
    );
    if (nextNumberToCall.includes("choose"))
        $("input.next-number").prop("disabled", false);
    //$('button:contains("Dial")').text('Dial ' + $('li.font-weight-bold').text());
}

// Export firebase and all the functions
export {
    app,
    functions,
    db,
    dial,
    hangup,
    dialerAdvance,
    query,
    orderBy,
    limit,
    collection,
    doc,
    onSnapshot,
    conferenceUpdates,
    numbersToDial,
    firebaseConfig,
    initializeApp,
    getFunctions,
    getFirestore,
    handleConferenceUpdateSnapshot,
};
