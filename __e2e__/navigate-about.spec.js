import { test, expect } from "@playwright/test";

test("Home page should render a header", async ({ page }) => {
    // If available, we set the target URL to a preview deployment URL provided by the ENVIRONMENT_URL created by Vercel.
    // Otherwise, we use the Production URL.
    const targetUrl = "/";

    // We visit the page. This waits for the "load" event by default.
    const response = await page.goto(targetUrl);

    // Test that the response did not fail
    expect(response.status()).toBeLessThan(400);

    // Wait for a heading
    await page.waitForSelector("h1");

    // Take a screenshot
    await page.screenshot({
        path: `__e2e__/results/${targetUrl}+${Math.random()}.png`,
    });
});
