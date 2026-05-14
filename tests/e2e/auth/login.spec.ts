import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("login-page")).toBeVisible();
  });

  test("login page has correct heading", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Iniciar sesion" })).toBeVisible();
  });
});
