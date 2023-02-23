// A react component returning a taiwlind button group of add-interaction buttons, "add pledge", "add donation", "add note", etc.
export default function AddInteractionButtonGroup({ person }) {
    return (
        <div className="flex flex-row gap-1">
            <button
                type="button"
                className="button-sm"
                onClick={() => {
                    console.log("add note");
                }}
            >
                New Note
            </button>
            <button
                type="button"
                className="button-sm"
                onClick={() => {
                    console.log("add pledge");
                }}
            >
                New Pledge
            </button>
            <button
                type="button"
                className="button-sm"
                onClick={() => {
                    console.log("add donation");
                }}
            >
                New Donation
            </button>
        </div>
    );
}
