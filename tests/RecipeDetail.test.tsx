import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import RecipeDetail from '../src/features/RecipeDetail';

describe('RecipeDetail Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render recipe content and metadata', () => {
    const recipe = {
      content: 'Mélanger les ingrédients.',
      metadata: {
        title: 'Chili',
        description: 'Un bon chili chaud'
      },
      ingredients: [],
      instructions: []
    };

    render(<RecipeDetail recipe={recipe} />);

    expect(screen.getByText('Chili')).toBeInTheDocument();
    expect(screen.getByText('Un bon chili chaud')).toBeInTheDocument();
    expect(screen.getByText('Mélanger les ingrédients.')).toBeInTheDocument();
  });

  it('should render steps and allow toggling progress', () => {
    const recipe = {
      content: '',
      metadata: { title: 'Chili' },
      ingredients: [],
      instructions: [
        [{ type: 'text', value: 'Hacher oignon' }],
        [{ type: 'text', value: 'Cuire viande' }]
      ]
    };

    render(<RecipeDetail recipe={recipe} recipeId="chili" />);

    const step1 = screen.getByText('Hacher oignon');
    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuenow', '0');

    fireEvent.click(step1);
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText('50% complété')).toBeInTheDocument();

    fireEvent.click(step1);
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('should use title from metadata if available, otherwise show "Recette"', () => {
    const recipeNoName = {
      content: 'Contenu',
      metadata: {},
      ingredients: [],
      instructions: []
    };
    render(<RecipeDetail recipe={recipeNoName} />);
    expect(screen.getByText('Recette')).toBeInTheDocument();
  });
});
