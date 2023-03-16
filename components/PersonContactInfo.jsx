import { Tooltip } from "@mui/material";
import { useState } from "react";
import { EMAIL_VALIDATION_REGEX } from "utils/validation";

function phoneNumberDisplayFormatter(input) {
    if (typeof input === "undefined") return null;
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
    if (typeof input === "undefined") return null;
    // check if its a valid email. if so, return it...
    // if not, return the input and a warning badge (tailwind) next to it
    if (EMAIL_VALIDATION_REGEX.test(input)) {
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

export default function PersonContactInfo({
    person,
    addPhone,
    addEmail,
    deletePhone,
    deleteEmail,
    restorePhone,
    restoreEmail,
}) {
    let [newPhone, setNewPhone] = useState(null);
    let [newEmail, setNewEmail] = useState(null);
    return (
        <div>
            <h2>Contact Information</h2>
            <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone Numbers</dt>
                {person.phone_numbers?.map((phone_number) => (
                    <dd className="mt-1 text-sm text-gray-900" key={phone_number.id}>
                        <span className={phone_number.remove_date && "line-through"}>
                            {phoneNumberDisplayFormatter(phone_number.phone_number)}
                        </span>
                        {!phone_number.remove_date ? (
                            <button
                                type="button"
                                className="do-not-global-style text-red-600 px-1"
                                onClick={() => {
                                    deletePhone(phone_number.id);
                                }}
                            >
                                x
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="do-not-global-style text-green-700 px-1 text-xs underline"
                                onClick={() => {
                                    restorePhone(phone_number.id);
                                }}
                            >
                                Restore
                            </button>
                        )}
                    </dd>
                ))}
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (newPhone !== null) {
                            addPhone(newPhone);
                            setNewPhone(null);
                        } else setNewPhone("");
                    }}
                >
                    {newPhone !== null && (
                        <input
                            type="text"
                            name="newPhoneNumber"
                            className="mt-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            autoFocus
                            onChange={(event) => {
                                setNewPhone(event.target.value);
                            }}
                            value={newPhone}
                        />
                    )}
                    <button
                        className={"mt-2 button-xs" + (newPhone !== null ? " btn-primary" : "")}
                        type="submit"
                    >
                        Add Phone
                    </button>
                </form>
            </div>
            <div className="sm:col-span-1 mt-5">
                <dt className="text-sm font-medium text-gray-500">Emails</dt>
                {person.emails?.map((email) => (
                    <dd className="mt-1 text-sm text-gray-900" key={email.id}>
                        <span className={email.remove_date && "line-through"}>
                            {emailDisplayFormatter(email.email)}
                        </span>
                        {!email.remove_date ? (
                            <button
                                type="button"
                                className="do-not-global-style text-red-600 px-1"
                                onClick={() => {
                                    deleteEmail(email.id);
                                }}
                            >
                                x
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="do-not-global-style text-green-700 px-1 text-xs underline"
                                onClick={() => {
                                    restoreEmail(email.id);
                                }}
                            >
                                Restore
                            </button>
                        )}
                    </dd>
                ))}
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (newEmail !== null) {
                            if (newEmail !== "") addEmail(newEmail);
                            setNewEmail(null);
                        } else setNewEmail("");
                    }}
                >
                    {newEmail !== null && (
                        <input
                            type="email"
                            name="newEmail"
                            className="mt-2 block w-36 rounded-md border-0 py-1.5 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            autoFocus
                            onChange={(event) => {
                                setNewEmail(event.target.value);
                            }}
                            value={newEmail}
                        />
                    )}
                    <button
                        className={"mt-2 button-xs" + (newEmail !== null ? " btn-primary" : "")}
                        type="submit"
                    >
                        Add Email
                    </button>
                </form>
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
                {/* <button className="mt-2 button-xs" type="button">
                    Add Address
                </button> */}
            </div>
        </div>
    );
}
