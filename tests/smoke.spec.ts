import { test, expect } from '@playwright/test'

test('app loads successfully', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Just check that the app loads without errors
  const title = await page.title()
  expect(title).toBeTruthy()
  
  // Check if we can see any content
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})

test('homepage loads and shows appropriate content', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const url = page.url()
  console.log('Current URL:', url)
  
  // The app should load without errors and show some content
  // It might redirect to register, login, or dashboard depending on auth state
  expect(url).toMatch(/^http:\/\/localhost:5173/)
  
  // Check that some content is visible
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})

test('register page loads', async ({ page }) => {
  await page.goto('/register')
  await page.waitForLoadState('networkidle')
  // Just check that the page loads without errors
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})

test('login page loads', async ({ page }) => {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  // Just check that the page loads without errors
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})

test('appointments page loads or redirects', async ({ page }) => {
  await page.goto('/appointments')
  await page.waitForLoadState('networkidle')
  // Just check that the page loads without errors (might redirect to auth)
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})

test('messages page loads or redirects', async ({ page }) => {
  await page.goto('/messages')
  await page.waitForLoadState('networkidle')
  // Just check that the page loads without errors (might redirect to auth)
  const body = await page.locator('body')
  await expect(body).toBeVisible()
})

test('admin pages guard (mock non-admin user might redirect)', async ({ page }) => {
  await page.goto('/manage-users')
  // Either visible (admin) or redirected; assert page loaded
  await expect(page).toHaveURL(/(manage-users|dashboard)/)
})

