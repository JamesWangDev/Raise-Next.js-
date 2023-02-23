import { Fragment, useState } from "react";
import Link from "next/link";

import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export default function Breadcrumbs({ pages = [] }) {
    return (
        <nav
            className="flex mb-4 inline-flex rounded text-sm"
            aria-label="Breadcrumb"
        >
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <div>
                        <Link
                            href="/"
                            className="text-gray-400 hover:text-gray-700"
                        >
                            Home
                        </Link>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name}>
                        <div className="flex items-center">
                            <ChevronRightIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-300"
                                aria-hidden="true"
                            />
                            <Link
                                href={page.href}
                                className="ml-4  text-gray-400 hover:text-gray-700"
                                aria-current={page.current ? "page" : undefined}
                            >
                                {page.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
