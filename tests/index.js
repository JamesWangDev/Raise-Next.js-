import { useRouter } from "next/router";
import { render, screen, fireEvent } from "@testing-library/react";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

import App from "pages/_app";

describe("Home", () => {
    it("renders a dashboard link", () => {
        render(<App />);

        // const heading = screen.getByRole("heading", {
        //     name: /Create your account/i,
        // });

        // expect(heading).toBeInTheDocument();

        const link = screen.getByRole("link", {
            name: /Dashboard/i,
        });

        expect(link).toBeInTheDocument();
    });
});
