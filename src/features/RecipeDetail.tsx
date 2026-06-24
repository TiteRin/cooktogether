import React from 'react';
import { useCookingProgress } from './useCookingProgress';
import type { RecipeType } from '../lib/recipeLoader';

interface Props {
  recipe: RecipeType;
  recipeId?: string;
}

export default function RecipeDetail({ recipe, recipeId }: Props) {
  const name = recipe.metadata.title || 'Recette';
  const description = recipe.metadata.description;
  
  // Extract all steps from all sections
  const allSteps = recipe.sections.flatMap(section => 
    section.content.filter(item => item.type === 'step')
  );

  const { progress, toggleStep } = useCookingProgress(allSteps.length, recipeId);

  const formatQuantity = (q: any): string => {
    if (!q) return '';
    if (q.type === 'fixed') {
      const val = q.value;
      if (val.type === 'text') return val.value;
      if (val.type === 'decimal') return val.value.toString();
      if (val.type === 'fraction') return `${val.num}/${val.den}`;
    }
    if (q.type === 'range') {
      const formatVal = (v: any) => v.type === 'decimal' ? v.value.toString() : `${v.num}/${v.den}`;
      return `${formatVal(q.min)}-${formatVal(q.max)}`;
    }
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}</h1>
        {description && <p className="text-xl text-gray-600 italic">{description}</p>}
        {allSteps.length > 0 && (
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
        {recipe.sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-8">
            {section.name && <h3 className="text-xl font-medium mb-3 text-gray-800">{section.name}</h3>}
            <ul className="space-y-4 list-none p-0">
              {section.content.map((item, iIndex) => {
                if (item.type === 'note') {
                  return (
                    <li key={iIndex} className="p-4 bg-yellow-50 border-l-4 border-yellow-400 italic text-gray-700">
                      {item.note}
                    </li>
                  );
                }

                // It's a step
                // Find global step index for progress tracking
                const globalStepIndex = allSteps.indexOf(item);

                return (
                  <li 
                    key={iIndex}
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      progress.completedSteps.includes(globalStepIndex) 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleStep(globalStepIndex)}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        checked={progress.completedSteps.includes(globalStepIndex)}
                        readOnly
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <span>
                          {item.items.map((part, pIndex) => {
                            if (part.type === 'text') return part.value;
                            if (part.type === 'ingredient') {
                              return (
                                <span key={pIndex} className="font-semibold text-orange-700">
                                  {part.displayName}
                                </span>
                              );
                            }
                            if (part.type === 'cookware') {
                              const cookware = recipe.cookware[part.index];
                              return <span key={pIndex} className="font-semibold text-blue-700">{cookware.name}</span>;
                            }
                            if (part.type === 'timer') {
                              const timer = recipe.timers[part.index];
                              return (
                                <span key={pIndex} className="font-semibold text-green-700">
                                  {timer.name || `${formatQuantity(timer.duration)} ${timer.unit}`}
                                </span>
                              );
                            }
                            return null;
                          })}
                        </span>
                        
                        {/* Ingredient list below the step text */}
                        {item.items.some(p => p.type === 'ingredient') && (
                          <div className="mt-2 text-sm text-gray-600 border-t border-gray-100 pt-1">
                            {item.items
                              .filter((p): p is any => p.type === 'ingredient')
                              .map((p, pIndex, array) => {
                                const ingredient = recipe.ingredients[p.index];
                                const hasQuantity = ingredient.quantity || ingredient.preparation;
                                return (
                                  <span key={pIndex}>
                                    <span className="italic">{ingredient.name}</span>
                                    {hasQuantity && ': '}
                                    {ingredient.quantity && formatQuantity(ingredient.quantity)}
                                    {ingredient.unit && ` ${ingredient.unit}`}
                                    {ingredient.preparation && ` (${ingredient.preparation})`}
                                    {pIndex < array.length - 1 ? ', ' : ''}
                                  </span>
                                );
                              })}
                          </div>
                        )}
                        {/* Timer list below the step text */}
                        {item.items.some(p => p.type === 'timer') && (
                          <div className="mt-1 text-sm text-gray-600">
                            {item.items
                              .filter((p): p is any => p.type === 'timer')
                              .map((p, pIndex, array) => {
                                const timer = recipe.timers[p.index];
                                return (
                                  <span key={pIndex}>
                                    <span className="italic">⏲️ {timer.name || 'Minuteur'}</span>: {formatQuantity(timer.duration)} {timer.unit}
                                    {pIndex < array.length - 1 ? ', ' : ''}
                                  </span>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {allSteps.length === 0 && (
          <p className="text-gray-500 italic">Aucune instruction disponible.</p>
        )}
      </section>
    </div>
  );
}
