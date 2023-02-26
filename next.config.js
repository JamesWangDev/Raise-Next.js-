// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
        // removeConsole: {
        //     exclude: ["error"],
        // },
    },
    images: {
        // formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.vercel.com",
                port: "",
                pathname: "/image/upload/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "**",
            },
        ],
    },
};

module.exports = nextConfig;

module.exports = withSentryConfig(
    module.exports,
    { silent: true },
    { hideSourcemaps: true }
);
