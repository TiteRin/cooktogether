import * as fs from 'node:fs';
import * as path from 'node:path';

export interface RecipeEntry {
  name: string;
  path: string;
}

export async function findRecipes(baseDir: string, currentDir: string = ''): Promise<RecipeEntry[]> {
  const fullPath = path.join(baseDir, currentDir);
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  let recipes: RecipeEntry[] = [];

  for (const entry of entries) {
    const entryRelativePath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      const subRecipes = await findRecipes(baseDir, entryRelativePath);
      recipes = [...recipes, ...subRecipes];
    } else if (entry.name.endsWith('.cook')) {
      recipes.push({
        name: entry.name.replace('.cook', ''),
        path: entryRelativePath,
      });
    }
  }

  return recipes;
}
