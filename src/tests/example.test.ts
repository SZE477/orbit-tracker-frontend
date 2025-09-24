import { describe, it, expect } from 'vitest';

// Example utility function
const add = (a: number, b: number) => a + b;

describe('example suite', () => {
  it('should pass', () => {
    expect(add(1, 1)).toBe(2);
  });
});