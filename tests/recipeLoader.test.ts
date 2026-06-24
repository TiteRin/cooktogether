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
    it('should load recipe content and return metadata', () => {
      const mockContent = '---\ntitle: Chili\ndescription: Un bon chili\n---\nPrendre de la viande.';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const recipe = loadRecipe('recipes/chili.cook');

      expect(recipe.metadata).toMatchObject({
        title: 'Chili',
        description: 'Un bon chili'
      });
      expect(recipe.sections[0].content[0]).toMatchObject({
        type: 'step',
        items: [{ type: 'text', value: 'Prendre de la viande.' }]
      });
    });

    it('should support YAML frontmatter (standard @tmlmt/cooklang-parser behavior)', () => {
      const mockContent = '---\nauthor: John Doe\ntitle: Cooklang Title\n---\nStep 1';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const recipe = loadRecipe('recipes/frontmatter.cook');

      expect(recipe.metadata).toMatchObject({
        title: 'Cooklang Title',
        author: 'John Doe'
      });
    });

    it('should throw error if file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(() => loadRecipe('recipes/missing.cook')).toThrow('Recipe not found');
    });

    it('should handle non-numeric servings by moving them to description', () => {
      const mockContent = '---\ntitle: Gougères\nservings: environ 25\n---\nStep 1';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const recipe = loadRecipe('recipes/gougeres.cook');

      expect(recipe.metadata).toMatchObject({
        title: 'Gougères',
        description: expect.stringContaining('Servings: environ 25')
      });
      expect(recipe.servings).toBeUndefined();
    });

    it('should handle recipes without metadata', () => {
      const mockContent = 'Juste du texte.';
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const recipe = loadRecipe('recipes/simple.cook');

      expect(recipe.metadata).toEqual({});
      expect(recipe.sections[0].content[0]).toMatchObject({
        type: 'step',
        items: [{ type: 'text', value: 'Juste du texte.' }]
      });
    });
  });
});
