import { NextResponse } from "next/server";
export const config = { runtime: "edge" };

export default function handler(req) {
    return NextResponse.json({
        "process.env.ENVIRONMENT_URL": process.env.ENVIRONMENT_URL,
        reqdoturl: req?.url,
    });
}
