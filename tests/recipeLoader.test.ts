import { describe, it, expect, vi } from 'vitest';
import { loadRecipe } from '../src/lib/recipeLoader';
import * as fs from 'node:fs';

vi.mock('node:fs', () => {
  return {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  };
});

describe('recipeLoader', () => {
  describe('loadRecipe', () => {
    it('should load recipe content and return metadata', async () => {
      const mockContent = '>> title: Chili\n>> description: Un bon chili\nPrendre de la viande.';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const recipe = await loadRecipe('recipes/chili.cook');

      expect(recipe.metadata).toEqual({
        title: 'Chili',
        description: 'Un bon chili'
      });
      expect(recipe.content).toBe(mockContent);
    });

    it('should throw error if file does not exist', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await expect(loadRecipe('recipes/missing.cook')).rejects.toThrow('Recipe not found');
    });

    it('should handle recipes without metadata', async () => {
      const mockContent = 'Juste du texte.';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const recipe = await loadRecipe('recipes/simple.cook');

      expect(recipe.metadata).toEqual({});
      expect(recipe.content).toBe(mockContent);
    });
  });
});
