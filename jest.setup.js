// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// hide error messages about act() being unsupported in production build
const ignoredErrors = [
    /act\(\.\.\.\) is not supported in production builds of React/,
];

const consoleError = global.console.error;
global.console.error = (...args) => {
    if (ignoredErrors.some((el) => el.test(args[0]))) {
        return console.log(...args);
    }
    return consoleError(...args);
};
