from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:3002/admin/login")
    page.locator('#login_email').fill('admin@example.com')
    page.locator('#login_password').fill('password')
    page.get_by_role('button', name='Sign in').click()

    # Wait for navigation to the dashboard
    page.wait_for_url("http://localhost:3002/admin/dashboard")
    print(page.content())

    # Navigate to dermatologists page
    page.get_by_role("link", name="Dermatologists").click()

    # Wait for the table to load
    expect(page.get_by_role("table")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/dermatologists_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)