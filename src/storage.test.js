import test from 'node:test';
import assert from 'node:assert/strict';
import { readStorage, removeStorage, subscribeToStorage, writeStorage } from './storage.js';

function createMockStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
}

test('persists values and notifies subscribers', () => {
  const storage = createMockStorage();
  const listeners = new Map();
  global.window = {
    localStorage: storage,
    addEventListener: (event, handler) => {
      const handlers = listeners.get(event) || [];
      handlers.push(handler);
      listeners.set(event, handlers);
    },
    removeEventListener: (event, handler) => {
      const handlers = listeners.get(event) || [];
      const next = handlers.filter((candidate) => candidate !== handler);
      if (next.length) listeners.set(event, next);
      else listeners.delete(event);
    },
    dispatchEvent: (event) => {
      const handlers = listeners.get(event.type) || [];
      handlers.forEach((handler) => handler(event));
      return true;
    },
  };
  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  };

  let updates = [];
  const unsubscribe = subscribeToStorage((key, value, action) => {
    updates.push({ key, value, action });
  });

  writeStorage('demo', { ok: true });
  assert.deepEqual(readStorage('demo', null), { ok: true });

  removeStorage('demo');
  assert.equal(readStorage('demo', null), null);
  assert.deepEqual(updates, [
    { key: 'demo', value: JSON.stringify({ ok: true }), action: 'set' },
    { key: 'demo', value: undefined, action: 'remove' },
  ]);

  unsubscribe();
});

test('syncs through browser storage events', () => {
  const storage = createMockStorage();
  const listeners = new Map();
  global.window = {
    localStorage: storage,
    addEventListener: (event, handler) => {
      const handlers = listeners.get(event) || [];
      handlers.push(handler);
      listeners.set(event, handlers);
    },
    removeEventListener: (event, handler) => {
      const handlers = listeners.get(event) || [];
      const next = handlers.filter((candidate) => candidate !== handler);
      if (next.length) listeners.set(event, next);
      else listeners.delete(event);
    },
    dispatchEvent: (event) => {
      const handlers = listeners.get(event.type) || [];
      handlers.forEach((handler) => handler(event));
      return true;
    },
  };
  global.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  };

  let updates = [];
  const unsubscribe = subscribeToStorage((key, value, action) => {
    updates.push({ key, value, action });
  });

  const storageHandler = listeners.get('storage')?.[0];
  storageHandler({ type: 'storage', key: 'demo', newValue: JSON.stringify({ sync: true }) });
  assert.deepEqual(updates, [{ key: 'demo', value: JSON.stringify({ sync: true }), action: 'set' }]);

  unsubscribe();
});
