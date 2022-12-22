import { useState, useEffect } from "react";

import { Fragment } from "react";
import { Menu, Transition, Button } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import supabase from "../utils/supabase";

export default function SaveList({ formattedQuery }) {
  const [listNameTemp, setListNameTemp] = useState("");
  const [savedListName, setSavedListName] = useState(false);

  const saveList = async (event) => {
    // listNameTemp
    event.preventDefault();
    console.log(event, listNameTemp);
    setSavedListName(listNameTemp);
    const listObject = {
      name: savedListName,
      query: formattedQuery,
    };
    supabase.from("saved_list").upsert(listObject);
  };

  var isSaved = !!savedListName;

  return (
    <Menu as="div" className="relative inline-block text-left mt-1 ml-3">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          {isSaved ? `Editing '${savedListName}'` : "Save List"}
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
          <form onSubmit={saveList}>
            <div className="px-4 py-3">
              <p className="text-sm form-label mb-2">List Name:</p>
              <input
                type="text"
                className="form-input"
                onChange={(event) => {
                  setListNameTemp(event.target.value);
                }}
                value={listNameTemp}
                onSubmit={saveList}
              />
            </div>
            <div className="pt-1">
              <Menu.Item>
                <input
                  type="submit"
                  value="Save"
                  className="block w-full hover:bg-gray-100 hover:text-gray-900 text-gray-700 block px-4 py-2 text-sm text-left my-0"
                />
              </Menu.Item>
            </div>
          </form>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
