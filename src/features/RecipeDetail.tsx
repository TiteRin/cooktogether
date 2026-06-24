import React from 'react';
import { useCookingProgress } from './useCookingProgress';

interface Recipe {
  content: string;
  metadata: Record<string, string>;
  instructions?: any[];
}

interface Props {
  recipe: Recipe;
  recipeId?: string;
}

export default function RecipeDetail({ recipe, recipeId }: Props) {
  const name = recipe.metadata.title || recipe.metadata.name || 'Recette';
  const description = recipe.metadata.description;
  const steps = recipe.instructions || [];

  const { progress, toggleStep } = useCookingProgress(steps.length, recipeId);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}</h1>
        {description && <p className="text-xl text-gray-600 italic">{description}</p>}
        {steps.length > 0 && (
          <div className="mt-4 bg-gray-200 rounded-full h-2.5 w-full">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress.percentage}%` }}
              role="progressbar"
              aria-valuenow={progress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
            <p className="text-sm text-gray-500 mt-1">{progress.percentage}% complété</p>
          </div>
        )}
      </header>
      
      <section className="prose lg:prose-xl">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        {steps.length > 0 ? (
          <ul className="space-y-4 list-none p-0">
            {steps.map((step, index) => (
              <li 
                key={index}
                className={`p-4 border rounded-md cursor-pointer transition-colors ${
                  progress.completedSteps.includes(index) 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={progress.completedSteps.includes(index)}
                    readOnly
                    className="mt-1"
                  />
                  <span>
                    {step.map((part: any, i: number) => {
                      if (part.type === 'text') return part.value;
                      if (part.type === 'ingredient' || part.type === 'cookware' || part.type === 'timer') {
                        return part.name;
                      }
                      return '';
                    }).join('')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-gray-800 bg-gray-50 p-4 rounded border">
            {recipe.content}
          </pre>
        )}
      </section>
    </div>
  );
}
