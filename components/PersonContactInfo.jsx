import { Tooltip } from "@mui/material";

function phoneNumberDisplayFormatter(input) {
    let number = input.toString().replaceAll(/[^0-9]/g, "");
    if (number?.length < 1) return null;
    if (number?.length === 10) {
        return (
            "(" +
            number.substring(0, 3) +
            ") " +
            number.substring(3, 6) +
            "-" +
            number.substring(6, 10)
        );
    }
    // return with a red badge and mui tooltip
    return (
        <Tooltip title="Invalid phone number" arrow>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {input}
            </span>
        </Tooltip>
    );
}

function emailDisplayFormatter(input) {
    // check if its a valid email
    // if so, return it
    // if not, return the input and a warning badge (tailwind) next to it
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]+$/g;
    if (regex.test(input)) {
        return input;
    }
    return (
        <Tooltip title="Invalid email" arrow>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {input}
            </span>
        </Tooltip>
    );
}

export default function PersonContactInfo({ person }) {
    return (
        <div>
            <h2>Contact Information</h2>
            <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone Numbers</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {phoneNumberDisplayFormatter(person.phone)}
                </dd>
                <button className="mt-2 button-xs" type="button">
                    Add Phone
                </button>
            </div>
            <div className="sm:col-span-1 mt-5">
                <dt className="text-sm font-medium text-gray-500">Emails</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {emailDisplayFormatter(person.email)}
                </dd>
                <button className="mt-2 button-xs" type="button">
                    Add Email
                </button>
            </div>
            <div className="sm:col-span-1 mt-5">
                <dt className="text-sm font-medium text-gray-500">Addresses</dt>
                <dd className="mt-1 text-sm text-gray-900">
                    {person.addr1}
                    <br />
                    {person.addr2}
                    {person.addr2 ? <br /> : null}
                    {person.city}, {person.state} {person.zip}
                </dd>
                <button className="mt-2 button-xs" type="button">
                    Add Address
                </button>
            </div>
        </div>
    );
}
