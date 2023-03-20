import { NextResponse } from "next/server";
export const config = { runtime: "edge" };

export default function handler(req) {
    return NextResponse.json({
        name: `Hello world`,
    });
}
