import * as fs from 'node:fs';
import { Recipe } from '@tmlmt/cooklang-parser';

export type RecipeType = Recipe;

export function loadRecipe(filePath: string): Recipe {
  if (!fs.existsSync(filePath)) {
    throw new Error('Recipe not found');
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  try {
    return new Recipe(content);
  }
  catch (e: any) {
    if (e.message === 'Scaling variables should be numbers') {
      const sanitized = content
        .replace(/^servings:\s*(.*)$/m, 'description: "Servings: $1" # sanitized')
        .replace(/^yield:\s*(.*)$/m, 'description: "Yield: $1" # sanitized')
        .replace(/^serves:\s*(.*)$/m, 'description: "Serves: $1" # sanitized');
      return new Recipe(sanitized);
    }
    console.error(`Error parsing recipe ${filePath}:`, e.message);
    throw e;
  }
}
