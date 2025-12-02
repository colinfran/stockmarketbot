import { test, expect } from "@playwright/test"

test.describe("Header component", () => {
  test("navigates to home page from header icon", async ({ page }) => {
    await page.goto("/portfolio")
    page.getByRole("img", { name: 'logo' }).click();
    await expect(page).toHaveURL("/")
  })
  test("navigates to home page from header text", async ({ page }) => {
    await page.goto("/portfolio")
    page.getByText("stockmarketbot").click();
    await expect(page).toHaveURL("/")
  })
  
  test("navigates to home page from navigation dropdown", async ({ page }) => {
    await page.goto("/porfolio")
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "Home" }).click()
    await expect(page).toHaveURL("/")
  })

  test("navigates to portfolio page from navigation dropdown", async ({ page }) => {
    await page.goto("/")
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "Portfolio" }).click()
    await expect(page).toHaveURL("/portfolio")
  })

  test("navigates to about page from navigation dropdown", async ({ page }) => {
    await page.goto("/")
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "About" }).click()
    await expect(page).toHaveURL("/about")
  })

  test("changes theme", async ({ page }) => {
    await page.goto("/")
    const html = page.locator("html");
    await expect(html).toHaveClass(/light/);
    await page.locator("header").getByRole("button").click()
    await page.getByRole("menuitem", { name: "Theme" }).click()
    await expect(html).toHaveClass(/dark/);
  })
})
