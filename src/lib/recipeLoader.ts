import * as fs from 'node:fs';
import { Recipe as CooklangRecipe } from 'cooklang-parser';
import yaml from 'js-yaml';

export interface Recipe {
  content: string;
  metadata: Record<string, string>;
  ingredients: any[];
  instructions: any[];
}

export async function loadRecipe(filePath: string): Promise<Recipe> {
  if (!fs.existsSync(filePath)) {
    throw new Error('Recipe not found');
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  let metadata: Record<string, string> = {};
  let cooklangContent = content;

  // Extract YAML frontmatter
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = content.match(frontmatterRegex);
  if (match) {
    try {
      const yamlContent = match[1];
      metadata = yaml.load(yamlContent) as Record<string, string>;
      cooklangContent = content.slice(match[0].length);
    } catch (e) {
      console.error('Failed to parse YAML frontmatter', e);
    }
  }

  const parsed = CooklangRecipe(cooklangContent);

  return {
    content,
    metadata: { ...parsed.metadata, ...metadata },
    ingredients: parsed.ingredients,
    instructions: (parsed as any).steps,
  };
}
