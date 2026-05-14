import { test, expect } from "@playwright/test";

test.describe("Public congresses page", () => {
  test("congresses page renders without error", async ({ page }) => {
    await page.goto("/congresses");
    await expect(page.getByTestId("congresses-page")).toBeVisible();
  });

  test("congresses page has a heading", async ({ page }) => {
    await page.goto("/congresses");
    await expect(page.getByRole("heading", { name: "Congresos" })).toBeVisible();
  });

  test("navbar is visible on congresses page", async ({ page }) => {
    await page.goto("/congresses");
    await expect(page.getByTestId("navbar")).toBeVisible();
  });
});
