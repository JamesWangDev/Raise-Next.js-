import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import supabase from "../utils/supabase";
import { data } from "autoprefixer";

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

        fetch("/api/loadDonationsCSV?fileName=" + encodeURIComponent(data.path))
          .then((res) => res.text())
          .then((data) => {
            console.log(data);
            console.timeEnd("upload and process");
          });
      });

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     console.log(
    //       "Upload is " +
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100 +
    //         "% done"
    //     );

    //     progress(true, snapshot.bytesTransferred, snapshot.totalBytes);

    //     console.log("Upload state change to", snapshot.state);
    //   },
    //   (error) => {
    //     // Handle unsuccessful uploads
    //     console.error(error);
    //   },
    //   () => {
    //     // Handle successful uploads on complete
    //     // var filepath = uploadTask.snapshot.ref.toString();
    //     console.log("File available at", filepath);
    //     handleDonationsCSVImport(filepath).then((result) =>
    //       console.log(result)
    //     );
    //     load("done");
    //   }
    // );

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
    <div className="py-2 shadow-sm bg-white rounded-lg p-6 py-6 mx-12">
      <div className="mx-auto max-w-7xl px-2 ">
        <h1 className="text-2xl font-semibold text-gray-900">Import</h1>
      </div>
      <div className="mx-auto max-w-7xl px-2  ">
        <h2>Upload your Actblue alltime donations file to sync:</h2>
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
  );
}
