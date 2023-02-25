import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import supabase from "utils/supabase";
import { data } from "autoprefixer";
//import pagetitle and breadcrumbs
import Breadcrumbs from "components/Breadcrumbs";
import PageTitle from "components/PageTitle";

const server = {
    process: (
        fieldName,
        file,
        metadata,
        load,
        error,
        progress,
        abort,
        transfer,
        options
    ) => {
        //   progress(e.lengthComputable, e.loaded, e.total);
        console.log("start process", file);
        console.time("upload and process");

        // Create a root reference

        var filepath = `${Date.now()}.csv`;
        //var storageRef = firebase.storage().ref();
        //var uploadTask = storageRef.child(filepath).put(file);

        // Supabase upload!
        supabase.storage
            .from("imports")
            .upload(filepath, file, {
                cacheControl: "3600",
                upsert: false,
            })
            .then(({ data, error }) => {
                console.log(data, error);
                console.log("File available at", data.path);
                load("done");

                fetch(
                    "/api/loadDonationsCSV?fileName=" +
                        encodeURIComponent(data.path)
                )
                    .then((res) => res.text())
                    .then((data) => {
                        console.log(data);
                        console.timeEnd("upload and process");
                    });
            });

        // Should expose an abort method so the request can be cancelled
        return {
            abort: () => {
                // This function is entered if the user has tapped the cancel button
                request.abort();

                // Let FilePond know the request has been cancelled
                abort();
            },
        };
    },
};

const prospectsServer = {
    process: (
        fieldName,
        file,
        metadata,
        load,
        error,
        progress,
        abort,
        transfer,
        options
    ) => {
        //   progress(e.lengthComputable, e.loaded, e.total);
        console.log("start process", file);
        console.time("upload and process");

        // Create a root reference
        var filepath = `${Date.now()}.csv`;
        //var storageRef = firebase.storage().ref();
        //var uploadTask = storageRef.child(filepath).put(file);

        // Supabase upload!
        supabase.storage
            .from("imports")
            .upload(filepath, file, {
                cacheControl: "3600",
                upsert: false,
            })
            .then(({ data, error }) => {
                console.log(data, error);
                console.log("File available at", data.path);
                load("done");

                fetch(
                    "/api/loadProspectsCSV?fileName=" +
                        encodeURIComponent(data.path)
                )
                    .then((res) => res.text())
                    .then((data) => {
                        console.log(data);
                        console.timeEnd("upload and process");
                    });
            });

        // Should expose an abort method so the request can be cancelled
        return {
            abort: () => {
                // This function is entered if the user has tapped the cancel button
                request.abort();

                // Let FilePond know the request has been cancelled
                abort();
            },
        };
    },
};

export default function Import() {
    return (
        <>
            <div className="py-2 shadow-sm bg-white rounded-lg p-6 py-6 mx-12">
                <div className="mx-auto max-w-7xl px-2 ">
                    <Breadcrumbs
                        pages={[
                            {
                                name: "Import Donors",
                                href: "/import",
                                current: true,
                            },
                        ]}
                    />{" "}
                    <PageTitle
                        title="Import Donors"
                        descriptor="Import donors, donation history, prospects, and pledges."
                    />
                </div>
                <div className="mx-auto max-w-7xl px-2 ">
                    <h2>
                        Upload your Actblue alltime donations file to sync: (
                        <a
                            href="https://support.actblue.com/campaigns/the-dashboard/download-contribution-data/#downloads"
                            className="text-blue-700 underline"
                        >
                            how to
                        </a>
                        )
                    </h2>
                    <div className="md:grid md:grid-cols-2">
                        <div className="col-span-1">
                            <FilePond
                                allowMultiple={false}
                                allowRevert={false}
                                maxFiles={1}
                                server={server}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-4 py-2 shadow-sm bg-white rounded-lg p-6 py-6 mx-12">
                <div className="mx-auto max-w-7xl px-2 ">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Import Prospects
                    </h1>
                </div>
                <div className="mx-auto max-w-7xl px-2 ">
                    <h2>Upload a file for donor research:</h2>
                    <p>(required: first_name, last_name, and zip) </p>
                    <div className="md:grid md:grid-cols-2">
                        <div className="col-span-1">
                            <FilePond
                                allowMultiple={false}
                                allowRevert={false}
                                maxFiles={1}
                                server={prospectsServer}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
