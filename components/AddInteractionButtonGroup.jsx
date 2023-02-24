// A react component returning a taiwlind button group of add-interaction buttons, "add pledge", "add donation", "add note", etc.
export default function AddInteractionButtonGroup({ person, showAddModal }) {
    return (
        <div className="flex flex-row gap-2">
            <button
                type="button"
                className="button-sm"
                onClick={() => {
                    showAddModal("note");
                }}
            >
                New Note
            </button>
            <button
                type="button"
                className="button-sm"
                onClick={() => {
                    showAddModal("pledge");
                }}
            >
                New Pledge
            </button>
            <button
                type="button"
                className="button-sm"
                onClick={() => {
                    showAddModal("donation");
                }}
            >
                New Donation
            </button>
        </div>
    );
}
