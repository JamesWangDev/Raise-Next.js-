import { Fragment, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { FaceFrownIcon, GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { Combobox, Dialog, Transition } from "@headlessui/react";

export default function Search() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <SearchModal setOpen={setOpen} open={open} />
            <div className="flex  -mt-0.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-12">
                    <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400  -mt-1"
                        aria-hidden="true"
                    />
                </div>
                <input
                    type="text"
                    id="search-bar"
                    placeholder="Search..."
                    className="rounded-full ring-0 ring-gray-300 hover:ring-indigo-600 border-0 w-full px-8 mx-6 bg-gray-100 pl-14 mr-0 shadow"
                    onMouseDown={() => {
                        setOpen(true);
                    }}
                />
            </div>
        </>
    );
}

const items = [
    { id: 1, name: "Workflow Inc.", category: "Clients", url: "#" },
    // More items...
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function SearchModal({ setOpen, open }) {
    const [query, setQuery] = useState("");

    const filteredItems =
        query === ""
            ? []
            : items.filter((item) => {
                  return item.name.toLowerCase().includes(query.toLowerCase());
              });

    const groups = filteredItems.reduce((groups, item) => {
        return { ...groups, [item.category]: [...(groups[item.category] || []), item] };
    }, {});

    return (
        <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery("")} appear>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-70 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                            <Combobox onChange={(item) => (window.location = item.url)}>
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>

                                {query === "" && (
                                    <div className="border-t border-gray-100 py-14 px-6 text-center text sm:px-14">
                                        <GlobeAmericasIcon
                                            className="mx-auto h-12 w-12 text-gray-300"
                                            aria-hidden="true"
                                        />
                                        <p className="mt-1 font-semibold text-gray-700">
                                            Quick search
                                        </p>
                                        <p className="mt-1 text-gray-400">
                                            all donors, lists, notes, pledges, etc...
                                        </p>
                                    </div>
                                )}

                                {filteredItems.length > 0 && (
                                    <Combobox.Options
                                        static
                                        className="max-h-80 scroll-pt-11 scroll-pb-2 space-y-2 overflow-y-auto pb-2"
                                    >
                                        {Object.entries(groups).map(([category, items]) => (
                                            <li key={category}>
                                                <h2 className="bg-gray-100 py-2.5 px-4 text-xs font-semibold text-gray-900">
                                                    {category}
                                                </h2>
                                                <ul className="mt-2 text-sm text-gray-800">
                                                    {items.map((item) => (
                                                        <Combobox.Option
                                                            key={item.id}
                                                            value={item}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    "cursor-default select-none px-4 py-2",
                                                                    active &&
                                                                        "bg-indigo-600 text-white"
                                                                )
                                                            }
                                                        >
                                                            {item.name}
                                                        </Combobox.Option>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </Combobox.Options>
                                )}

                                {query !== "" && filteredItems.length === 0 && (
                                    <div className="border-t border-gray-100 py-14 px-6 text-center text-sm sm:px-14">
                                        <FaceFrownIcon
                                            className="mx-auto h-6 w-6 text-gray-400"
                                            aria-hidden="true"
                                        />
                                        <p className="mt-4 font-semibold text-gray-900">
                                            No results found
                                        </p>
                                        <p className="mt-2 text-gray-500">
                                            We couldn’t find anything with that term. Please try
                                            again.
                                        </p>
                                    </div>
                                )}
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
