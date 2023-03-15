export default function DonationHistory({ donations }) {
    return (
        <div>
            <h2 className="mt-7">Donation History</h2>
            <ul role="list" className="divide-y divide-gray-200">
                {donations
                    ?.sort((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? 1 : -1))
                    ?.map((donation) => (
                        <li key={donation.id} className="flex py-4 text-sm text-gray-600">
                            ${donation.amount} - {donation.date.split(" ")[0]}
                        </li>
                    ))}
            </ul>
            {!donations?.length && <p className="text-sm">No donations found.</p>}
            {/* Add donation button */}
        </div>
    );
}
