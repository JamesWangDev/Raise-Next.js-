export default function FECHistoryList({ FECHistory }) {
    // return <pre>{JSON.stringify(FECHistory, 0, 2)}</pre>;
    return (
        <>
            <h2 className="mt-7">Past donations to other political committees</h2>
            {FECHistory?.map((donation) => (
                <div className="">
                    Donated ${donation.transaction_amt} to {donation.cmte_id} on{" "}
                    {donation.transaction_dt}
                </div>
            ))}
            {!FECHistory?.length && <div>None</div>}
        </>
    );
}
