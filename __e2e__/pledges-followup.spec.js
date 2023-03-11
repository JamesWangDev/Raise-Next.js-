import { test, expect } from "@playwright/test";
require("dotenv").config();
import { createClient } from "@supabase/supabase-js";
const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

test.describe("Pledge followup flow", () => {
    test("Import donations", async ({ page }) => {
        await page.goto("/import");
        await page.getByRole("radio", { name: "Donations" }).click();
        await page.getByRole("button", { name: "Next step" }).click();
        const fileChooserPromise = page.waitForEvent("filechooser");
        await page.getByText("Browse").click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles("__e2e__/mocks/ab-sample.csv");
        await page.waitForSelector("h2");
        await expect(page.getByText("File uploaded successfully")).toBeVisible();
        await page.getByRole("button", { name: "Upload another file" }).click();
        await expect(page.getByText("Are you importing donations/donors,")).toBeVisible();
    });
    test.skip("Import pledges", async ({ page }) => true);
    test("People page displays correctly", async ({ page }) => {
        await page.goto("/people");
        await expect(page.getByRole("button", { name: "View Person" }).first()).toBeVisible();
        await page.getByRole("button", { name: "View Person" }).first().click();
        await page.waitForURL(/.*\/people\/[a-z0-9-]+/);
        // Get the last component (after the last slash) of the url
        const personId = page.url().split("/").pop();
        const { data: person } = await db.from("people").select("*").eq("id", personId).single();
        await expect(page.locator("h1")).toHaveText(person.first_name + " " + person.last_name);
    });
    test.skip("Line-item FEC data appear accurately in profiles", async ({ page }) => true);
    test.skip("Imported donations appear accurately in profiles", async ({ page }) => true);
    test.skip("Imported pledges appear accurately in profiles", async ({ page }) => true);
    test.skip("Add, remove, and 'make primary' different phone numbers and emails", async ({
        page,
    }) => true);

    test.skip("Create a single-table list", async ({ page }) => true);
    test.skip("Create a multi-table list re: pledges, past donations, and FEC data", async ({
        page,
    }) => true);
    test.skip("Start a call session on multi-table list", async ({ page }) => true);
    test.skip("Dialing-in begins the list view", async ({ page }) => true);
    test.skip("Call three people in a row, add notes and pledges", async ({ page }) => true);
    test.skip("New notes and pledges are persisted", async ({ page }) => true);
    test.skip("Pledges page displays all pledges correctly", async ({ page }) => true);
    test.skip("Contact History page displays all past call attempts correctly", async ({ page }) =>
        true);

    // Editing fields?
    // Add notes to idnividual profiles - halfdone already
    // Add tags <--
    // Send me a file of what tags look like <---
    // Save and start together from 2 contacts
    // Bio field +/ cumulative note field
    test.skip("Import with a tag column", async ({ page }) => true);
    test.skip("Tag entire import", async ({ page }) => true);
});
