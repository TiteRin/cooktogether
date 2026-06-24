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
      metadata: {
        title: 'Chili',
        description: 'Un bon chili chaud'
      },
      ingredients: [],
      cookware: [],
      timers: [],
      sections: [
        {
          name: '',
          content: [
            {
              type: 'step',
              items: [{ type: 'text', value: 'Mélanger les ingrédients.' }]
            }
          ]
        }
      ]
    } as any;

    render(<RecipeDetail recipe={recipe} />);

    expect(screen.getByText('Chili')).toBeInTheDocument();
    expect(screen.getByText('Un bon chili chaud')).toBeInTheDocument();
    expect(screen.getByText('Mélanger les ingrédients.')).toBeInTheDocument();
  });

  it('should render ingredients without quantities in text but with summary below', () => {
    const recipe = {
      metadata: { title: 'Test' },
      ingredients: [
        { 
          name: 'eau', 
          quantity: { type: 'fixed', value: { type: 'decimal', value: 100 } }, 
          unit: 'ml' 
        },
        { 
          name: 'beurre', 
          quantity: { type: 'fixed', value: { type: 'decimal', value: 50 } }, 
          unit: 'g', 
          preparation: 'coupé en dés' 
        }
      ],
      cookware: [],
      timers: [],
      sections: [
        {
          name: '',
          content: [
            {
              type: 'step',
              items: [
                { type: 'text', value: 'Placez l’ ' },
                { type: 'ingredient', index: 0, displayName: 'eau' },
                { type: 'text', value: ' et le ' },
                { type: 'ingredient', index: 1, displayName: 'beurre' },
                { type: 'text', value: ' dans une casserole.' }
              ]
            }
          ]
        }
      ]
    } as any;

    render(<RecipeDetail recipe={recipe} />);

    // Text should NOT contain quantities
    expect(screen.getByText(/Placez l’/)).toBeInTheDocument();
    expect(screen.getAllByText('eau', { selector: 'span' })[0]).toBeInTheDocument();
    expect(screen.queryByText(/eau \(100 ml\)/)).not.toBeInTheDocument();

    // Summary below should contain quantities
    expect(screen.getByText(/eau/i, { selector: '.italic' })).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/ml/)).toBeInTheDocument();
    
    expect(screen.getByText(/beurre/i, { selector: '.italic' })).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
    expect(screen.getByText(/g/)).toBeInTheDocument();
    expect(screen.getByText(/coupé en dés/)).toBeInTheDocument();
  });

  it('should handle range quantities correctly', () => {
    const recipe = {
      metadata: { title: 'Range Test' },
      ingredients: [
        { 
          name: 'eau', 
          quantity: { 
            type: 'range', 
            min: { type: 'decimal', value: 125 }, 
            max: { type: 'decimal', value: 150 } 
          }, 
          unit: 'ml' 
        }
      ],
      cookware: [],
      timers: [],
      sections: [
        {
          name: '',
          content: [
            {
              type: 'step',
              items: [
                { type: 'text', value: 'Ajouter l\'' },
                { type: 'ingredient', index: 0, displayName: 'eau' }
              ]
            }
          ]
        }
      ]
    } as any;

    render(<RecipeDetail recipe={recipe} />);

    expect(screen.getByText(/125-150/)).toBeInTheDocument();
    expect(screen.getByText(/ml/)).toBeInTheDocument();
  });

  it('should handle fraction quantities correctly', () => {
    const recipe = {
      metadata: { title: 'Fraction Test' },
      ingredients: [
        { 
          name: 'beurre', 
          quantity: { 
            type: 'fixed', 
            value: { type: 'fraction', num: 1, den: 2 } 
          }, 
          unit: 'tasse' 
        }
      ],
      cookware: [],
      timers: [],
      sections: [
        {
          name: '',
          content: [
            {
              type: 'step',
              items: [
                { type: 'ingredient', index: 0, displayName: 'beurre' }
              ]
            }
          ]
        }
      ]
    } as any;

    render(<RecipeDetail recipe={recipe} />);

    expect(screen.getByText(/1\/2/)).toBeInTheDocument();
    expect(screen.getByText(/tasse/)).toBeInTheDocument();
  });

  it('should render steps and allow toggling progress', () => {
    const recipe = {
      metadata: { title: 'Chili' },
      ingredients: [],
      cookware: [],
      timers: [],
      sections: [
        {
          name: '',
          content: [
            {
              type: 'step',
              items: [{ type: 'text', value: 'Hacher oignon' }]
            },
            {
              type: 'step',
              items: [{ type: 'text', value: 'Cuire viande' }]
            }
          ]
        }
      ]
    } as any;

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
      metadata: {},
      ingredients: [],
      cookware: [],
      timers: [],
      sections: []
    } as any;
    render(<RecipeDetail recipe={recipeNoName} />);
    expect(screen.getByText('Recette')).toBeInTheDocument();
  });
});
