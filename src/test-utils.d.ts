import type { ReactElement } from 'react';
declare const customRender: (ui: ReactElement, options?: {}) => import("@testing-library/react").RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
export * from '@testing-library/react';
export { customRender as render };
