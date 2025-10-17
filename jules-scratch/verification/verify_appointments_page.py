from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Wait for server to start
    time.sleep(5)

    # Login
    page.goto("http://localhost:4173/admin/login")
    page.get_by_label("Email Address").fill("admin@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Sign in").click()

    # Wait for navigation to dashboard
    expect(page).to_have_url("http://localhost:4173/admin/dashboard")

    # Navigate to appointments page
    page.get_by_role("link", name="Appointments").click()

    # Wait for the appointments page to load
    expect(page).to_have_url("http://localhost:4173/admin/appointments")
    expect(page.get_by_text("Appointments")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/appointments_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)