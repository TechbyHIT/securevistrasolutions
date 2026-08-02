import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});

test("hyderabad location page loads", async ({ page }) => {
  await page.goto("/locations/hyderabad/");
  await expect(page.locator("h1")).toContainText(/Hyderabad/i);
});

test("service page loads", async ({ page }) => {
  await page.goto("/services/invisible-grills/");
  await expect(page.locator("h1")).toContainText(/Invisible Grills/i);
});
