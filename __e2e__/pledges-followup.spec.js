import { test, expect } from "@playwright/test";
require("dotenv").config();
import { createClient } from "@supabase/supabase-js";
const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

test.describe("Pledge followup flow", () => {
    // ****************
    // Basics
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
    test.skip("Import pledges", async ({ page }) => {});
    test("People page displays correctly", async ({ page }) => {
        await page.goto("/people");
        await expect(page.getByRole("button", { name: "View Person" }).first()).toBeVisible();
        await page.getByRole("button", { name: "View Person" }).first().click();
        await page.waitForURL(/.*\/people\/[a-z0-9-]+/);
        // Get the last component (after the last slash) of the url
        const personId = page.url().split("/").pop();
        const { data: person } = await db
            .from("people")
            .select("*")
            .eq("id", personId)
            .limit(1)
            .single();
        await expect(page.locator("h1")).toContainText(person.first_name + " " + person.last_name);
    });
    test("Line-item FEC data appear accurately in profiles", async ({ page }) => {
        // Go to people search
        await page.goto("/people");
        // Add first name
        await page.getByRole("button", { name: "Add Filter Step" }).click();
        await page.getByTestId("operators").selectOption("=");
        await page.getByRole("textbox", { name: "Value" }).click();
        await page.getByRole("textbox", { name: "Value" }).fill("Eileen");
        // Check to see if any search was run
        await page.getByRole("cell", { name: "Eileen" }).click();
        // Last name
        await page.getByRole("button", { name: "Add Filter Step" }).click();
        await page.getByTestId("fields").nth(1).selectOption("last_name");
        await page.getByRole("textbox", { name: "Value" }).nth(1).click();
        await page.getByRole("textbox", { name: "Value" }).nth(1).fill("Farbman");
        // Check to see if any search was run
        await page.getByRole("cell", { name: "Farbman" }).click();
        // Go over to the persons page
        await page.getByRole("button", { name: "View Person" }).click();
        // Count up the donations
        await page.getByText("$500 to");
        await expect(page.getByText("$500 to")).toHaveCount(14);
        /*
            TODO: The imported donations don't match official records exactly
            Additionally, "Actblue" shows up as the committe recieving a lot of donations
            and we should replace it with the committe ID noted in the memo line of AB donations
        */
    });
    test("Imported donations appear accurately in profiles", async ({ page }) => {
        // Live db check
        let response = await db.from("people").select("*, donations (*)").limit(1).single();
        let id = response.data.id;
        let donations = response.data.donations;
        expect(id).toBeTruthy();
        expect(id).not.toHaveLength(0);
        expect(donations).not.toHaveLength(0);
        await page.goto(`/people/${id}`);

        await expect(page.locator(".DonationHistory li")).toHaveCount(donations.length);
        await checkDonationsArePresent(donations);

        // Mock data check
        // donations = {};
        // checkDonationsArePresent(donations);

        // Helper function
        async function checkDonationsArePresent(donations) {
            for (let donation of donations) {
                await expect(
                    page.getByText("$" + donation.amount.toString() + " - ")
                ).toBeVisible();
            }
        }
    });
    test.skip("Imported pledges appear accurately in profiles", async ({ page }) => {});
    test("Add, remove, and 'make primary' different phone numbers and emails", async ({ page }) => {
        // Importing phones and emails now has the right data structures and works
        // Primary is un-implemented
        // First, add, and remove, and make primary buttons
        // Add email and phone, note, and pledge, done

        // Go to a random person
        await page.goto("/people");
        await expect(page.getByRole("button", { name: "View Person" }).first()).toBeVisible();
        await page.getByRole("button", { name: "View Person" }).first().click();
        await page.waitForURL(/.*\/people\/[a-z0-9-]+/);

        const randomSeed = Math.random().toString().slice(0, 1);

        // Add an example phone and email, remove and restore them
        await page.getByRole("button", { name: "Add Phone" }).click();
        await page.locator('input[name="newPhoneNumber"]').fill(`555123456${randomSeed}`);
        await page.getByRole("button", { name: "Add Phone" }).click();
        await expect(page.locator('input[name="newPhoneNumber"]')).not.toBeVisible();
        await expect(page.getByText(`(555) 123-456${randomSeed}`)).toBeVisible();
        await page
            .getByRole("definition")
            .filter({ hasText: `(555) 123-456${randomSeed}x` })
            .first()
            .getByRole("button", { name: "x" })
            .click();
        await page.getByRole("button", { name: "Restore" }).click();

        // Email
        await page.getByRole("button", { name: "Add Email" }).click();
        await page.locator('input[name="newEmail"]').fill(`example${randomSeed}@example.com`);
        await page.getByRole("button", { name: "Add Email" }).click();
        await page.getByText(`example${randomSeed}@example.com`).click();
        await page
            .getByRole("definition")
            .filter({ hasText: `example${randomSeed}@example.comx` })
            .first()
            .getByRole("button", { name: "x" })
            .click();
        await page.getByRole("button", { name: "Restore" }).click();
        await page.getByText(`example${randomSeed}@example.com`).click();

        // Add an example tag and remove it
        await page.getByRole("button", { name: "Add Tag" }).click();
        await page.locator('input[name="newTag"]').fill(`exampleTag${randomSeed}`);
        await page.getByRole("button", { name: "Add Tag" }).click();
        await expect(page.getByText(`exampleTag${randomSeed}`)).toBeVisible();
        // TODO: remove the tag

        // TODO: Make primary
    });

    test.skip("Create a single-table list", async ({ page }) => {});
    test.skip("Create a multi-table list re: pledges, past donations, and FEC data", async ({
        page,
    }) => {});
    test.skip("Start a call session on multi-table list", async ({ page }) => {});
    test.skip("Dialing-in begins the list view", async ({ page }) => {});
    test.skip("Call three people in a row, add notes and pledges", async ({ page }) => {});
    test.skip("New notes and pledges are persisted", async ({ page }) => {
        // This should work
    });
    test.skip("Pledges page displays all pledges correctly", async ({ page }) => {
        // Yes but needs linking and customization, etc
    });
    test.skip("Contact History page displays all past call attempts correctly", async ({
        page,
    }) => {});

    // ****************
    // Jacobs additions
    test.skip("Edit bio, occupation, employer", async ({ page }) => {
        // Needs to be added
    });
    test.skip("Import with a tag column", async ({ page }) => {});
    test.skip("Tag entire import", async ({ page }) => {});
    test.skip("Start calling from a single person", async ({ page }) => {});

    // ****************
    // Security
    test.skip("Supabase: unauthorized users cannot access anything", async ({ page }) => {});
    test.skip("Supabase: users can only access their own organization", async ({ page }) => {});
    test.skip("API: doesn't allow unauthorized access", async ({ page }) => {});
    test.skip("API: Users can only access their own organization", async ({ page }) => {});
    test.skip("API: Users can only upload to their own organization", async ({ page }) => {});
});
