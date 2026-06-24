import { describe, it, expect, vi } from 'vitest';
import { findRecipes } from '../src/lib/recipeDiscovery';
import * as fs from 'node:fs';

vi.mock('node:fs', () => {
  return {
    readdirSync: vi.fn(),
  };
});

describe('recipeDiscovery', () => {
  describe('findRecipes', () => {
    it('should find all .cook files in the recipes directory', async () => {
      const mockFiles = [
        { name: 'chili.cook', isDirectory: () => false },
        { name: 'ignore-me.txt', isDirectory: () => false },
        { name: 'plats', isDirectory: () => true },
      ];
      
      const mockSubFiles = [
        { name: 'lasagne.cook', isDirectory: () => false },
      ];

      (fs.readdirSync as any).mockImplementation((dirPath: any) => {
        if (dirPath.toString().endsWith('recipes')) {
          return mockFiles;
        }
        if (dirPath.toString().endsWith('plats')) {
          return mockSubFiles;
        }
        return [];
      });

      const recipes = await findRecipes('recipes');

      expect(recipes).toEqual([
        { name: 'chili', path: 'chili.cook' },
        { name: 'lasagne', path: 'plats/lasagne.cook' },
      ]);
    });

    it('should return empty array if no .cook files found', async () => {
      (fs.readdirSync as any).mockReturnValue([]);
      const recipes = await findRecipes('recipes');
      expect(recipes).toEqual([]);
    });
  });
});
