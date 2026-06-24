import { describe, it, expect } from 'vitest';
import { findRecipes } from '../src/lib/recipeDiscovery';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { loadRecipe } from '../src/lib/recipeLoader';

describe('Accents and Spaces Support', () => {
  const testRecipesDir = path.resolve('./tests/fixtures/special-recipes');

  it('should find and load recipes with accents and spaces in path', async () => {
    // On crée temporairement des fichiers pour le test
    const subDir = path.join(testRecipesDir, 'Apéritifs');
    const recipePath = path.join(subDir, 'Gougères au miso.cook');
    
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
    fs.writeFileSync(recipePath, '---\ntitle: Gougères au miso\n---\nFaire chauffer l\'eau.');

    try {
      const recipes = await findRecipes(testRecipesDir);
      const found = recipes.find(r => r.name === 'Gougères au miso');
      
      expect(found).toBeDefined();
      expect(found?.path).toBe('Apéritifs/Gougères au miso.cook');

      // Vérifier le chargement
      const loaded = loadRecipe(path.join(testRecipesDir, found!.path));
      expect(loaded.metadata.title).toBe('Gougères au miso');
    } finally {
      // Nettoyage
      if (fs.existsSync(recipePath)) {
        fs.unlinkSync(recipePath);
      }
      if (fs.existsSync(subDir)) {
        fs.rmdirSync(subDir);
      }
    }
  });
});
