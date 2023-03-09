import "@testing-library/jest-dom";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
jest.mock("next/router", () => require("next-router-mock"));

import App from "pages/_app";
import Home from "pages/index";

describe("Home", () => {
    it("renders a dashboard link", () => {
        render(<App Component={Home} />);

        const link = screen.getByRole("link", {
            name: /Dashboard/i,
        });

        expect(link).toBeInTheDocument();
    });
});
