import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Sanity Check', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should render a react component', () => {
    render(React.createElement('div', {}, 'Hello Vitest'));
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument();
  });
});