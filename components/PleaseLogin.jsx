import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
export default function Component() {
    return (
        <div className="container">
            <h1>Login</h1>
            Click to sign into your user account <br />
            <button
                type="button"
                className="btn btn-blue"
                onClick={() => signIn("google")}
            >
                <Image
                    src="/google.svg"
                    height="15"
                    width="15"
                    className="mr-2"
                />
                Sign in
            </button>
        </div>
    );
}
