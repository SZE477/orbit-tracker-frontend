import React from 'react';

/**
 * React Query Devtools component that only loads in development
 * This helps avoid bundle size issues and import errors in production
 */
export const QueryDevtools: React.FC = () => {
  // Only render devtools in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // For now, return null to avoid import issues
  // TODO: Fix devtools import when needed
  return null;
};
