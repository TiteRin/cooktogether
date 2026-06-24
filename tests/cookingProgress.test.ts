import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCookingProgress } from '../src/features/useCookingProgress';

describe('useCookingProgress', () => {
  it('should initialize with all steps uncompleted', () => {
    const totalSteps = 3;
    const { result } = renderHook(() => useCookingProgress(totalSteps));

    expect(result.current.progress.completedSteps).toEqual([]);
    expect(result.current.progress.percentage).toBe(0);
  });

  it('should mark a step as completed', () => {
    const totalSteps = 3;
    const { result } = renderHook(() => useCookingProgress(totalSteps));

    act(() => {
      result.current.toggleStep(0);
    });

    expect(result.current.progress.completedSteps).toContain(0);
    expect(result.current.progress.percentage).toBe(Math.round((1 / 3) * 100));
  });

  it('should toggle a step (revert)', () => {
    const totalSteps = 3;
    const { result } = renderHook(() => useCookingProgress(totalSteps));

    act(() => {
      result.current.toggleStep(0);
    });
    act(() => {
      result.current.toggleStep(0);
    });

    expect(result.current.progress.completedSteps).not.toContain(0);
    expect(result.current.progress.percentage).toBe(0);
  });

  it('should persist progress in localStorage', () => {
    const totalSteps = 3;
    const recipeId = 'test-recipe';
    
    const { result, unmount } = renderHook(() => useCookingProgress(totalSteps, recipeId));

    act(() => {
      result.current.toggleStep(1);
    });

    expect(result.current.progress.completedSteps).toContain(1);
    
    // Unmount and remount to simulate page refresh
    unmount();
    
    const { result: newResult } = renderHook(() => useCookingProgress(totalSteps, recipeId));
    expect(newResult.current.progress.completedSteps).toContain(1);
    expect(newResult.current.progress.percentage).toBe(33);
  });

  it('should keep progress isolated per recipe', () => {
    const totalSteps = 3;
    
    const { result: recipe1 } = renderHook(() => useCookingProgress(totalSteps, 'recipe-1'));
    act(() => {
      recipe1.current.toggleStep(0);
    });

    const { result: recipe2 } = renderHook(() => useCookingProgress(totalSteps, 'recipe-2'));
    expect(recipe2.current.progress.completedSteps).toEqual([]);
    expect(recipe2.current.progress.percentage).toBe(0);
  });
});
