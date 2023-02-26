import "@testing-library/jest-dom";

import { useRouter } from "next/router";
import { render, screen, fireEvent } from "@testing-library/react";
import mockRouter from "next-router-mock";
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
