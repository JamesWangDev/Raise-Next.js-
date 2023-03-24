import { useState } from "react";

import { Fragment } from "react";
import { Menu, Transition, Button } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useSupabase } from "lib/supabaseHooks";

export default function SaveList({ listName, saveList }) {
    const [listNameTemp, setListNameTemp] = useState(listName);
    var isSaved = !!listName;

    return (
        <Menu as="div" className="relative inline-block text-left mt-1 ">
            <div>
                <Menu.Button className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-1 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    {isSaved ? `Editing '${listName}'` : "Save List"}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <form
                        onSubmit={(event) => {
                            // listNameTemp
                            event.preventDefault();
                            saveList(typeof listNameTemp === "undefined" ? listName : listNameTemp);
                        }}
                    >
                        <div className="px-4 py-3">
                            <p className="text-sm form-label mb-2">List Name:</p>
                            <input
                                type="text"
                                className="form-input"
                                onKeyDown={(event) => {
                                    if (event.code == "Space") {
                                        event.stopPropagation();
                                    }
                                    if (event.code == "Enter") {
                                        event.target.form.requestSubmit();
                                    }
                                }}
                                onChange={(event) => {
                                    setListNameTemp(event.target.value);
                                }}
                                value={
                                    typeof listNameTemp === "undefined" ? listName : listNameTemp
                                }
                                autoFocus
                            />
                        </div>
                        <div className="pt-1">
                            <Menu.Item>
                                <input
                                    type="submit"
                                    value="Save"
                                    className="w-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 block px-4 py-2 text-sm text-left my-0"
                                />
                            </Menu.Item>
                        </div>
                    </form>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
