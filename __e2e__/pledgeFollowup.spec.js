import { test, expect } from "@playwright/test";

test.describe("Pledge followup flow", () => {
    test("Import donations", async ({ page }) => {
        expect(true);

        const targetUrl = "/import";
        const response = await page.goto(targetUrl);
        expect(response.status()).toBeLessThan(400);
    });
    test("Import pledges", async ({ page }) => {
        expect(true);
    });
    test("People page displays correctly", async ({ page }) => {
        expect(true);
    });
    test("Line-item FEC data appear accurately in profiles", async ({ page }) => {
        expect(true);
    });
    test("Imported donations appear accurately in profiles", async ({ page }) => {
        expect(true);
    });
    test("Imported pledges appear accurately in profiles", async ({ page }) => {
        expect(true);
    });
    test("Add, remove, and 'make primary' different phone numbers and emails", async ({ page }) => {
        expect(true);
    });

    test("Create a single-table list", async ({ page }) => {
        expect(true);
    });
    test("Create a multi-table list re: pledges, past donations, and FEC data", async ({
        page,
    }) => {
        expect(true);
    });
    test("Start a call session on multi-table list", async ({ page }) => {
        expect(true);
    });
    test("Dialing in starts list view", async ({ page }) => {
        expect(true);
    });
    test("Call three people in a row, addd notes and pledges", async ({ page }) => {
        expect(true);
    });
    test("New notes and pledges are persisted", async ({ page }) => {
        expect(true);
    });
    test("Pledges page displays correctly", async ({ page }) => {
        expect(true);
    });
    test("Contact History page displays correctly", async ({ page }) => {
        expect(true);
    });
});
