export default function PledgeHistory({ pledges }) {
    return (
        <div>
            <h2>Pledges</h2>
            <ul role="list" className="divide-y divide-gray-200">
                {pledges
                    ?.sort((a, b) => (new Date(a.created_at) < new Date(b.created_at) ? 1 : -1))
                    ?.map((pledge) => (
                        <li key={pledge.id} className="flex py-4 text-sm text-gray-600">
                            ${pledge.amount} -{" "}
                            {new Date(pledge.created_at).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </li>
                    ))}
            </ul>
            {!pledges?.length && <p className="text-sm">No pledges found.</p>}
        </div>
    );
}
