import { useState, useContext, useEffect } from "react";
import { CallSessionContext } from "pages/dialer/[callSessionID]";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function DispositionOptions({ disposition, setDisposition }) {
    const dispositions = [
        "Pledged!",
        "No pledge",
        "Not home",
        "Call back",
        "Wrong number / disconnected",
        "Left message",
        "Refused / remove",
        "Hostile",
    ];
    return (
        <div>
            <div className="hidden sm:block -mt-1">
                <nav className="" aria-label="Tabs">
                    <input type="hidden" value={disposition} />
                    {dispositions.map((thisDisposition) => (
                        <button
                            key={thisDisposition}
                            onClick={(event) => {
                                console.log({ event });
                                event.preventDefault();
                                setDisposition(event.target.textContent);
                            }}
                            className={classNames(
                                thisDisposition == disposition
                                    ? "bg-blue-400 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800",
                                "rounded-md px-3 py-2 font-medium mr-1 mb-1 text-xs"
                            )}
                        >
                            {thisDisposition}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default function AddInteractionCard({ person, appendInteraction }) {
    // const { user } = useUser();
    const [note, setNote] = useState("");
    const [prompt, setPrompt] = useState(false);
    const [pledge, setPledge] = useState(null);
    const [disposition, setDisposition] = useState();
    const { outbound, needsLogToAdvance } = useContext(CallSessionContext);

    const newNote = () => {
        appendInteraction({
            note,
            resulted_in_pledge: !!pledge,
            pledge,
            disposition,
        });
        setNote("");
        setPrompt(null);
        setPledge(null);
        setDisposition();
    };

    return (
        <div className="interaction-card">
            <div className="flex items-start space-x-4">
                {/* <div className="flex-shrink-0">
                    <img
                        className="inline-block h-10 w-10 rounded-full"
                        src={user.profileImageUrl}
                        alt=""
                    />
                </div> */}
                <div className="min-w-0 flex-1">
                    <form action="#" className="relative">
                        {(outbound || needsLogToAdvance) && (
                            <DispositionOptions
                                disposition={disposition}
                                setDisposition={setDisposition}
                            />
                        )}
                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                            <label htmlFor="note" className="sr-only">
                                Add your note
                            </label>
                            <textarea
                                rows={4}
                                name="note"
                                id="note"
                                className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                                placeholder="Add your note..."
                                onChange={(event) => {
                                    setNote(event.target.value);
                                }}
                                value={note}
                            />

                            {/* Spacer element to match the height of the toolbar */}
                            <div className="py-2" aria-hidden="true">
                                {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                <div className="py-px">
                                    <div className="h-9" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-between py-0 px-3 border-t">
                            <div className="placeholder-justify-the-rest-to-right"></div>
                            <div className="flex-shrink-0">
                                {/* <span className="text-sm">Add: </span> */}
                                {prompt && (
                                    <div className="inline-block mx-3">
                                        <label
                                            htmlFor="pledge"
                                            className="mx-3 inline-block text-sm font-normal leading-6 text-gray-900"
                                        >
                                            Pledge:
                                        </label>
                                        <div className="inline-block relative mt-2 rounded-md shadow-sm w-28">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="text"
                                                name="pledge"
                                                id="pledge"
                                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="0.00"
                                                aria-describedby="price-currency"
                                                onChange={(event) => {
                                                    setPledge(Number(event.target.value));
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {!prompt && (
                                    <button
                                        type="button"
                                        className="btn mx-2"
                                        onClick={() => {
                                            setPrompt(true);
                                        }}
                                    >
                                        Add Pledge
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={newNote}
                                    disabled={!disposition?.length && needsLogToAdvance}
                                >
                                    Save interaction
                                    {/* {prompt && " + Pledge"} */}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
