import { test, expect } from '@playwright/test';

test.describe('Cooking Mode', () => {
  test('should track and persist cooking progress', async ({ page }) => {
    // Naviguer vers une recette
    await page.goto('/recipes/chili');
    
    // Vérifier que la barre de progression est à 0%
    await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '0');
    
    // Cocher la première étape
    await page.click('text=Hacher l\'#oignon.');
    
    // Vérifier que la barre de progression a augmenté
    // Chili a 2 étapes : Hacher l'oignon, Faire revenir la viande
    await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '50');
    await expect(page.locator('text=50% complété')).toBeVisible();
    
    // Rafraîchir la page
    await page.reload();
    
    // Vérifier que le progrès est maintenu
    await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '50');
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
    
    // Cocher la deuxième étape
    await page.click('text=Faire revenir la viande');
    await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '100');
    
    // Décocher la première étape
    await page.click('text=Hacher l\'#oignon.');
    await expect(page.locator('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '50');
  });
});
