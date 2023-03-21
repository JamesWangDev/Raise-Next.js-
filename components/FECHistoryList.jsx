import { titleCase } from "lib/cases";

export default function FECHistoryList({ FECHistory }) {
    // return <pre>{JSON.stringify(FECHistory, 0, 2)}</pre>;
    // Not sure why we're getting duplicate sub_id but we're gonna dedupe
    let hash = [];
    let dedupedFECHistory = [
        ...new Map(FECHistory?.map((donation) => [donation.sub_id, donation])).values(),
    ];
    return (
        <>
            <h2 className="mt-7">Past donations to other political committees</h2>
            {dedupedFECHistory?.map((donation) => (
                <div key={donation?.sub_id} className="text-xs">
                    ${donation.transaction_amt} to{" "}
                    {donation?.cmte_nm ? titleCase(donation?.cmte_nm) : donation.cmte_id},{" "}
                    {donation.transaction_dt}
                </div>
            ))}
            {!dedupedFECHistory?.length && <div>None</div>}
        </>
    );
}
