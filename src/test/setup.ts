import '@testing-library/jest-dom'

const localStorageMock = {
  getItem: vi.fn().mockReturnValue(null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn()
