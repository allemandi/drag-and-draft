import { test, expect } from '@playwright/test';

test('Help dialog opens and closes', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Drag & Draft');

  // Click help button in footer
  await page.getByLabel('Help').click();

  // Check if dialog is visible
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Help & Instructions' })).toBeVisible();

  // Close dialog - use the explicit "Close" button in the footer of the dialog
  // Use .first() because there might be a hidden close button (X icon) as well
  await page.getByRole('dialog').getByRole('button', { name: 'Close' }).first().click();
  await expect(page.getByRole('dialog')).not.toBeAttached();
});

test('Reset dialog opens and can be cancelled', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Drag & Draft');

  // Click reset button (might be in mobile header or desktop)
  const resetBtn = page.getByRole('button', { name: 'Reset' }).first();
  await resetBtn.click();

  // Check if dialog is visible
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/Reset everything\?/i)).toBeVisible();

  // Cancel
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('dialog')).not.toBeAttached();
});
