import { test, expect } from '@playwright/test';

test.describe('Accents and Spaces in URLs', () => {
  test('should navigate to a recipe with accents and spaces in its name and path', async ({ page }) => {
    await page.goto('/recipes');
    
    // On attend que la liste soit là
    const recipeLink = page.locator('text="Gougères au miso"');
    await expect(recipeLink).toBeVisible();
    
    // Cliquer sur le lien
    await recipeLink.click();
    
    // Vérifier l'URL (elle devrait être encodée)
    // Le chemin est "Apéritifs/Gougères au miso.cook" -> slug "Apéritifs/Gougères au miso"
    // Astro devrait normalement gérer ça, mais voyons ce qui se passe.
    // L'URL attendue dépend de la façon dont Astro génère le slug.
    
    await expect(page.locator('h1')).toContainText('Gougères au miso');
    await expect(page.locator('text=Faire chauffer l\'eau.')).toBeVisible();
  });
});
