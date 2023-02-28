import { Fragment, useState } from "react";
import {
    FaceFrownIcon,
    FaceSmileIcon,
    FireIcon,
    HandThumbUpIcon,
    HeartIcon,
    PaperClipIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

import { useUser } from "@clerk/nextjs";

export default function ({ person, showAddModal }) {
    // get user from clerk
    const { isSignedIn, isLoading, user } = useUser();

    return (
        <div className="interaction-card">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <img
                        className="inline-block h-10 w-10 rounded-full"
                        src={user.profileImageUrl}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <form action="#" className="relative">
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
                                defaultValue={""}
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
                                <PlusIcon
                                    className="h-5 w-5 text-gray-500 -ml-1 inline-block mr-3"
                                    aria-hidden="true"
                                />
                                <button type="submit" className="btn">
                                    Pledge
                                </button>
                                <button type="submit" className="btn mx-2">
                                    Donation
                                </button>
                                <button
                                    type="submit"
                                    className="btn button-primary btn-primary"
                                >
                                    Note
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
