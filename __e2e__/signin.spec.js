import { test, expect } from "@playwright/test";

test.use({ actionTimeout: 20000 });

test("Home page renders a dashboard heading, i.e. we're signed in", async ({ page }) => {
    // Login is automatically run beforehand.
    // Go to homepage.
    const targetUrl = "/";
    await page.goto(targetUrl);

    // Playwright expect a heading to be rendered with the text "Dashboard"
    expect(await page.textContent("h1")).toContain("Dashboard");

    // Take a screenshot
    await page.screenshot({
        path: `__e2e__/results/${targetUrl}+${Math.random()}.png`,
    });
});
