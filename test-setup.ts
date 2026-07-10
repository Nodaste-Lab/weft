import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length() {
    return Object.keys(this.store).length;
  }

  clear() {
    for (const key of Object.keys(this.store)) {
      delete this.store[key];
      delete (this as Record<string, unknown>)[key];
    }
  }

  getItem(key: string) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number) {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string) {
    delete this.store[key];
    delete (this as Record<string, unknown>)[key];
  }

  setItem(key: string, value: string) {
    const stringValue = String(value);
    this.store[key] = stringValue;
    (this as Record<string, unknown>)[key] = stringValue;
  }
}

function createMemoryStorage(): Storage {
  return new MemoryStorage();
}

function resetTestStorage() {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: createMemoryStorage(),
  });
}

beforeEach(() => {
  resetTestStorage();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  resetTestStorage();
});

/** jsdom does not implement ResizeObserver; some canvas / chart libs expect it. */
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
