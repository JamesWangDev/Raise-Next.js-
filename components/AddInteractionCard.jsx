import { useState } from "react";
import { useUser } from "@clerk/nextjs";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function DispositionOptions() {
    const [currentDisposition, setCurrentDisposition] = useState();
    const dispositions = [
        "Pledged!",
        "Did not pledge",
        "Not home / no answer",
        "Please call me back",
        "Wrong number",
        "Left message",
        "Refused / remove",
        "Hostile",
    ];
    return (
        <div>
            <div className="hidden sm:block">
                <nav className="" aria-label="Tabs">
                    {dispositions.map((disposition) => (
                        <button
                            key={disposition}
                            onClick={(event) => {
                                console.log({ event });
                                event.preventDefault();
                                setCurrentDisposition(event.target.textContent);
                            }}
                            className={classNames(
                                disposition == currentDisposition
                                    ? "bg-blue-400 text-white text-gray-800"
                                    : "bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:text-gray-800",
                                "rounded-md px-3 py-2 text-sm font-medium mr-1 mb-1"
                            )}
                        >
                            {disposition}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default function AddInteractionCard({ person, appendInteraction }) {
    const { user } = useUser();
    const [note, setNote] = useState("");
    const [prompt, setPrompt] = useState(false);
    const [pledge, setPledge] = useState(null);

    const newNote = () => {
        appendInteraction({
            note,
            resulted_in_pledge: !!pledge,
            pledge,
        });
        setNote("");
        setPrompt(null);
        setPledge(null);
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
                        <DispositionOptions />
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
                                <button type="button" className="btn btn-primary" onClick={newNote}>
                                    Add Note{prompt && " + Pledge"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
