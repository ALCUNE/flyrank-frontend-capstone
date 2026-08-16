import { test, expect } from '@playwright/test';

/**
 * FE-09 – Playwright E2E suite for the /chat page.
 *
 * Requires the Next.js dev server to be running on http://localhost:3000.
 * The playwright.config.ts webServer block starts it automatically.
 */

test.describe('Chat page', () => {
  test('navigates to /chat and renders the core layout', async ({ page }) => {
    await page.goto('/chat');

    await expect(page.getByRole('heading', { name: 'Streaming AI Chat' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /message/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('Send button is disabled when the textarea is empty', async ({ page }) => {
    await page.goto('/chat');

    await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  test('Send button becomes enabled once the user types a prompt', async ({ page }) => {
    await page.goto('/chat');

    await page.getByRole('textbox', { name: /message/i }).fill('Hello AI, how are you?');

    await expect(page.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  test('shows the empty-state prompt chips before any message is sent', async ({ page }) => {
    await page.goto('/chat');

    // Suggested prompts are visible in the empty-state onboarding card
    await expect(page.getByText('Run SEO Audit for flyrank.ai')).toBeVisible();
  });

  test('submitted message appears in the conversation log', async ({ page }) => {
    await page.goto('/chat');

    const textarea = page.getByRole('textbox', { name: /message/i });
    await textarea.fill('Can you help me with SEO?');
    await page.getByRole('button', { name: 'Send' }).click();

    // The user bubble must appear in the chat log
    await expect(page.getByText('Can you help me with SEO?')).toBeVisible();
  });

  test('Back to Home link navigates to the root page', async ({ page }) => {
    await page.goto('/chat');

    const backLink = page.getByRole('link', { name: 'Back to Home' });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL('/');
  });
});
