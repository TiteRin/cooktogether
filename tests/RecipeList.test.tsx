import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import RecipeList from '../src/features/RecipeList';

describe('RecipeList Component', () => {
  it('should render a list of recipes', () => {
    const recipes = [
      { name: 'Chili', path: 'chili.cook' },
      { name: 'Lasagne', path: 'plats/lasagne.cook' },
    ];

    render(<RecipeList recipes={recipes} />);

    expect(screen.getByText('Chili')).toBeInTheDocument();
    expect(screen.getByText('Lasagne')).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/recipes/chili');
    expect(links[1]).toHaveAttribute('href', '/recipes/plats/lasagne');
  });

  it('should show empty message if no recipes', () => {
    render(<RecipeList recipes={[]} />);
    expect(screen.getByText(/Aucune recette/i)).toBeInTheDocument();
  });
});
