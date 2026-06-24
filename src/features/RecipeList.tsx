import React from 'react';

interface RecipeEntry {
  name: string;
  path: string;
}

interface Props {
  recipes: RecipeEntry[];
}

export default function RecipeList({ recipes }: Props) {
  if (recipes.length === 0) {
    return <p>Aucune recette trouvée.</p>;
  }

  return (
    <ul className="grid gap-4">
      {recipes.map((recipe) => {
        const recipeSlug = encodeURI(recipe.path.replace('.cook', ''));
        return (
          <li key={recipe.path} className="border p-4 rounded shadow hover:bg-gray-50">
            <a href={`/recipes/${recipeSlug}`} className="text-xl font-bold text-blue-600">
              {recipe.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
