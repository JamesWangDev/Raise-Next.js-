import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SupabaseTable from "../components/SupabaseTable";
import QueryBuilderProvider from "../components/QueryBuilderProvider";
import { useState, useEffect } from "react";
import Orizzonte, {
  Choices,
  Dropdown,
  FullText,
  Group,
  Select,
  Toggle,
} from "orizzonte";

export default function Dashboard() {
  return (
    <div className="py-2">
      <div className="mx-auto max-w-7xl px-2 ">
        <h1 className="text-2xl font-semibold text-gray-900">Donations</h1>
      </div>
      <div className="mx-auto max-w-7xl px-2  ">
        <QueryBuilderProvider table="donations_for_user_display" />
      </div>
    </div>
  );
}
