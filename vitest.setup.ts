import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrollIntoView — stub it to prevent test crashes
window.HTMLElement.prototype.scrollIntoView = vi.fn();
