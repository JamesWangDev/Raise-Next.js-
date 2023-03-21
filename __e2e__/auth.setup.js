// auth.setup.ts
import { test as setup, expect } from "@playwright/test";
require("dotenv").config();
const authFile = "__e2e__/.auth/user.json";

setup("Sign in for tests as Example User", async ({ page }) => {
    // If available, we set the target URL to a development/preview deployment URL
    // provided by the ENVIRONMENT_URL created by Vercel or locally by .env file.
    // Otherwise, we use the Production URL.
    const targetUrl = "http://localhost:3000/";

    // We visit the page. This waits for the "load" event by default.
    const response = await page.goto(targetUrl);

    // Test that the response did not fail
    expect(response.status()).toBeLessThan(400);

    // Wait for a heading
    await page.getByRole("link", { name: "Sign in" }).click();
    await page.getByLabel("Email address").click();
    await page.getByLabel("Email address").fill("example+clerk_test@example.com");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("Password", { exact: true }).fill("5e0eae55-3e95-4ffe-a029-294ef2b1a024");

    // This test was flakey, so added a promise-based wait for page navigation event
    const navigationPromise = page.waitForNavigation();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await navigationPromise;

    await page.context().storageState({ path: authFile });
});
