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
                    300: "#2d28ff",
                    400: "#2d28ff",
                    500: "#2d28ff",
                    600: "#2d28ff",
                    700: "#2d28ff",
                    800: "#2d28ff",
                },
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
