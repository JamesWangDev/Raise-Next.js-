import Link from "next/link";
import { useRouter } from "next/router";
import {
    useUser,
    UserButton,
    SignUp,
    CreateOrganization,
    OrganizationSwitcher,
    SignedOut,
} from "@clerk/nextjs";

import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
    Bars3BottomLeftIcon,
    BellIcon,
    HomeIcon,
    XMarkIcon,
    UsersIcon,
    FolderIcon,
    PhoneIcon,
    ClockIcon,
    HandRaisedIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    ChevronDoubleRightIcon,
    UserPlusIcon,
    Cog6ToothIcon,
    CloudArrowDownIcon,
    ArrowUpOnSquareStackIcon,
    LinkIcon,
    ArrowsRightLeftIcon,
    UserCircleIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

// import algoliasearch from "algoliasearch/lite";
// import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
// const searchClient = algoliasearch(
//   "latency",
//   process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
// );
import { DocSearch } from "@docsearch/react";
// Commented out for Jest testing
// import "@docsearch/css";

const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
    { name: "Create a List", href: "/people", icon: UsersIcon, current: false },
    {
        name: "Saved Lists",
        href: "/savedlists",
        icon: FolderIcon,
        current: false,
    },
    { name: "Make Calls", href: "/makecalls", icon: PhoneIcon, current: false },
    {
        name: "Interaction History",
        href: "/contacthistory",
        icon: ClockIcon,
        current: false,
    },
    { name: "Pledges", href: "/pledges", icon: HandRaisedIcon, current: false },
    {
        name: "Donations",
        href: "/donations",
        icon: CurrencyDollarIcon,
        current: false,
    },
    { name: "Reports", href: "/reports", icon: EnvelopeIcon, current: false },
    {
        name: "Import",
        href: "/import",
        icon: ArrowUpOnSquareStackIcon,
        current: false,
    },
    {
        name: "Export",
        href: "/export",
        icon: CloudArrowDownIcon,
        current: false,
    },
    {
        name: "Sync Settings",
        href: "/sync",
        icon: ArrowsRightLeftIcon,
        current: false,
    },
    {
        name: "Manage Organization",
        href: "/organization",
        icon: UserPlusIcon,
        current: false,
    },
    {
        name: "Login & Security",
        href: "/user",
        icon: UserCircleIcon,
        current: false,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const Brand = () => {
    return (
        <>
            <div className="flex flex-shrink-0 items-center px-4 brand">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                        clipRule="evenodd"
                    />
                </svg>

                <span>Raise More</span>
            </div>
        </>
    );
};

const Layout = ({ children }) => {
    // const { data: session } = useSession();
    const { isSignedIn, isLoading, user } = useUser();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Set the right page as active link using router
    const router = useRouter();
    navigation.forEach((page, i) => (navigation[i].current = false));
    let basePath = "/" + router.pathname.split("/")[1];

    let activeIndex =
        router.pathname == "/"
            ? 0
            : navigation.findIndex((element) => element.href == router.pathname);
    // If the page is not found, set the parent page as active
    if (activeIndex == -1)
        activeIndex = navigation.findIndex((element) => element.href == basePath);
    if (activeIndex in navigation) navigation[activeIndex].current = true;

    const hasOrg = user ? !!user.organizationMemberships.length : false;

    return (
        <>
            <Menu>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-200 pt-5 pb-4">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <Brand />
                                    <div className="mt-5 h-0 flex-1 overflow-y-auto">
                                        <nav className="space-y-1 px-2">
                                            {navigation.map((item, index) => (
                                                <Link
                                                    onClick={() => setSidebarOpen(false)}
                                                    key={index}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                        "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current
                                                                ? "text-gray-500"
                                                                : "text-gray-400 group-hover:text-gray-500",
                                                            "mr-4 flex-shrink-0 h-6 w-6"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                            <div className="w-14 flex-shrink-0" aria-hidden="true">
                                {/* Dummy element to force sidebar to shrink to fit close icon */}
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="pt-5 flex flex-grow flex-col overflow-y-auto border-r border-gray-200">
                        <Brand />

                        <div className="pt-5 flex flex-grow flex-col bg-gray-50">
                            <nav className="flex-1 space-y-1 px-2 pb-4">
                                {navigation.map((item, index) => (
                                    <div key={index}>
                                        <Link
                                            href={item.href}
                                            className={
                                                item.current ? "nav-item current" : "nav-item"
                                            }
                                        >
                                            <item.icon aria-hidden="true" />
                                            {item.name}
                                        </Link>
                                        {["Make Calls", "Donations", "Sync Settings"].includes(
                                            item.name
                                        ) ? (
                                            <div className="py-2">
                                                <div className="flex-grow border-t border-gray-200"></div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col md:pl-64">
                    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b">
                        <button
                            type="button"
                            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="flex flex-1 justify-between pr-4">
                            {isSignedIn ? (
                                <>
                                    <div className="flex flex-1">
                                        <form
                                            className="flex w-full md:ml-0"
                                            action="#"
                                            method="GET"
                                        >
                                            <div className="mr-5 relative pt-3 w-full text-gray-400 focus-within:text-gray-600">
                                                <DocSearch
                                                    appId={process.env.ALGOLIA_APPLICATION_ID}
                                                    indexName="RaiseMoreClientSearch"
                                                    apiKey={
                                                        process.env
                                                            .NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
                                                    }
                                                />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="ml-4 flex items-center md:ml-6 gap-5">
                                        <button
                                            type="button"
                                            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        {/* Profile dropdown */}

                                        {/* <Menu as="div" className="relative ml-3"> */}
                                        {/* <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>

                          <Image
                            src={user.image}
                            width="25"
                            height="25"
                            className="h-8 w-8 rounded-full inline align-text-top"
                          />
                        </Menu.Button>
                      </div> */}

                                        {/* <Menu.Button className="my-1 mx-2 group flex rounded-md bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        <span className="flex w-full items-center justify-between">
                          <span className="flex min-w-0 items-center justify-between space-x-3">
                            <Image
                              className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300"
                              height="30"
                              width="30"
                              src={user.image}
                              alt=""
                            />

                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-sm font-medium text-gray-900">
                                {user.name}
                              </span>
                              <span className="truncate text-sm text-gray-500">
                                Obama for Congress
                              </span>
                            </span>
                          </span>
                          <ChevronDownIcon
                            className="ml-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </span>
                      </Menu.Button> */}
                                        {/* <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-3 z-10 mt-2 w-100 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition> */}
                                        <OrganizationSwitcher
                                            hidePersonal={true}
                                            afterSwitchOrganizationUrl="/"
                                        />
                                        <UserButton />
                                        {/* </Menu> */}
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>

                    <main className="flex-1">
                        <div className="py-6">
                            {isSignedIn ? (
                                hasOrg ? (
                                    children
                                ) : (
                                    <>
                                        <div className="block min-h-full flex-col justify-center sm:px-6 lg:px-8">
                                            <div className="sm:mx-auto w-75">
                                                <CreateOrganization />
                                            </div>
                                        </div>
                                    </>
                                )
                            ) : (
                                ""
                            )}

                            <SignedOut>
                                <div className="flex min-h-full flex-col justify-center  sm:px-6 lg:px-8">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                        <SignUp
                                            appearance={{
                                                layout: {
                                                    // socialButtonsVariant:
                                                    // "blockButton",
                                                    // socialButtonsPlacement: "bottom",
                                                },
                                                variables: {
                                                    colorPrimary: "#2d28ff",
                                                },
                                            }}
                                            // signInUrl=
                                        />
                                    </div>
                                </div>
                            </SignedOut>
                        </div>
                    </main>
                </div>
            </Menu>
        </>
    );
};

export default Layout;
