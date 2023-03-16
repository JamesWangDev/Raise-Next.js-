// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        // color: { "bg-gray-100": "#ebedf0" },
        extend: {
            fontSize: { "2xl": "1.4rem" },
            colors: {
                indigo: {
                    300: "#388bff",
                    400: "#388bff",
                    500: "#388bff",
                    600: "#388bff",
                    700: "#388bff",
                    800: "#388bff",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
