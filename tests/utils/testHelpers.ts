import { Page } from '@playwright/test';

/**
 * Test helpers for handling ads, popups, and other UI interferences
 */
export class TestHelpers {
  /**
   * Set up ad blocking and request interception for a page
   */
  static async setupAdBlocking(page: Page) {
    // Block common ad networks and tracking domains
    const blockedDomains = [
      '**/googlesyndication/**',
      '**/googletagmanager/**',
      '**/google-analytics/**',
      '**/googleadservices/**',
      '**/doubleclick.net/**',
      '**/adsystem.com/**',
      '**/amazon-adsystem.com/**',
      '**/facebook.com/tr/**',
      '**/facebook.net/**',
      '**/twitter.com/i/adsct/**',
      '**/ads.yahoo.com/**',
      '**/bing.com/api/**',
      '**/outbrain.com/**',
      '**/taboola.com/**',
      '**/adsafeprotected.com/**',
      '**/moatads.com/**',
      '**/scorecardresearch.com/**',
      '**/quantserve.com/**',
      '**/*advertisement*/**',
      '**/*adsense*/**',
      '**/*adnxs*/**',
      '**/*ads*/**'
    ];

    // Intercept and block ad requests
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      const resourceType = route.request().resourceType();
      
      // Block known ad domains
      const shouldBlock = blockedDomains.some(domain => 
        url.match(domain.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'))
      );

      if (shouldBlock) {
        console.log(`Blocked ad request: ${url}`);
        await route.abort();
        return;
      }

      // Block suspicious resources based on URL patterns
      if (
        url.includes('advertisement') ||
        url.includes('ads.') ||
        url.includes('/ads/') ||
        url.includes('adsense') ||
        url.includes('adnxs') ||
        (resourceType === 'image' && (url.includes('ad') || url.includes('banner'))) ||
        (resourceType === 'script' && url.includes('ad'))
      ) {
        console.log(`Blocked suspicious ad request: ${url}`);
        await route.abort();
        return;
      }

      // Continue with the request
      await route.continue();
    });
  }

  /**
   * Wait for page to be stable and handle any popups
   */
  static async waitForStablePage(page: Page, timeout: number = 5000) {
    try {
      // Wait for network to be idle
      await page.waitForLoadState('networkidle', { timeout });
      
      // Wait a bit more for any delayed popups
      await page.waitForTimeout(1000);
      
      // Handle any remaining popups
      await this.handlePopups(page);
      
    } catch (error) {
      console.log('Page stability check completed with warnings');
    }
  }

  /**
   * Handle popups and overlays
   */
  static async handlePopups(page: Page) {
    const popupSelectors = [
      // Generic close buttons
      'button[aria-label*="close" i]',
      'button[title*="close" i]',
      'button:has-text("×")',
      'button:has-text("✕")',
      'button:has-text("Close")',
      '.close',
      '.close-btn',
      '.modal-close',
      '.popup-close',
      '.overlay-close',
      
      // Cookie consent
      'button:has-text("Accept")',
      'button:has-text("I Accept")',
      'button:has-text("Allow")',
      'button:has-text("OK")',
      '#cookie-accept',
      
      // Ad specific
      '.ad-close',
      '.advertisement-close',
      '[data-testid*="close"]',
      '[id*="close"]'
    ];

    for (const selector of popupSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 500 })) {
          await element.click({ timeout: 1000 });
          console.log(`Closed popup with selector: ${selector}`);
          await page.waitForTimeout(300);
        }
      } catch (error) {
        // Continue to next selector
      }
    }

    // Press Escape as final attempt
    try {
      await page.keyboard.press('Escape');
    } catch (error) {
      // Ignore
    }
  }
}