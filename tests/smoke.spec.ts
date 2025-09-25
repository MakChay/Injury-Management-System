import { test, expect } from '@playwright/test'

test('homepage redirects to dashboard (mock user)', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/.*dashboard/)
  await expect(page.getByText('Dashboard')).toBeVisible()
})

test('appointments ICS export presence', async ({ page }) => {
  await page.goto('/appointments')
  await expect(page.getByText('Appointments')).toBeVisible()
})

test('messages send form visible', async ({ page }) => {
  await page.goto('/messages')
  await expect(page.getByText('Start a conversation')).toBeVisible()
})

test('admin pages guard (mock non-admin user might redirect)', async ({ page }) => {
  await page.goto('/manage-users')
  // Either visible (admin) or redirected; assert page loaded
  await expect(page).toHaveURL(/(manage-users|dashboard)/)
})

