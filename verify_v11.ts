
import { chromium, devices } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Desktop
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/desktop_v11.png' });

  // Mobile
  const mobileContext = await browser.newContext(devices['iPhone 12']);
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: '/home/jules/verification/mobile_v11.png' });

  await browser.close();
}

verify();
