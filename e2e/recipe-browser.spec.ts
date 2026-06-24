import { test, expect } from '@playwright/test';

test.describe('Recipe Browser', () => {
  test('should list recipes and allow navigation to details', async ({ page }) => {
    await page.goto('/');
    
    // Check home page
    await expect(page.locator('h1')).toContainText('CookTogether');
    
    // Click on browse button
    await page.click('text=Parcourir les recettes');
    
    // Check recipe list
    await expect(page).toHaveURL('/recipes');
    await expect(page.locator('h1')).toContainText('Mes Recettes');
    await expect(page.locator('text=Chili con Carne')).toBeVisible();
    await expect(page.locator('text=Lasagnes')).toBeVisible();
    
    // Navigate to Chili
    await page.click('text=Chili con Carne');
    
    // Check detail page
    await expect(page).toHaveURL('/recipes/chili');
    await expect(page.locator('h1')).toContainText('Chili con Carne');
    await expect(page.locator('text=Un classique épicé.')).toBeVisible();
    await expect(page.locator('text=Hacher l\'#oignon.')).toBeVisible();
    
    // Go back
    await page.click('text=Retour aux recettes');
    await expect(page).toHaveURL('/recipes');
  });
});
