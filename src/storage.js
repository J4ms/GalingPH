const STORAGE_EVENT = 'galingph-storage';

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

function dispatchStorageEvent(key, value, action) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }

  const event = new CustomEvent(STORAGE_EVENT, { detail: { key, value, action } });
  window.dispatchEvent(event);
}

function notifyListener(listener, event) {
  const detail = event?.detail;
  const incomingKey = detail?.key ?? event?.key;
  const incomingValue = detail?.value ?? event?.newValue;
  const action = detail?.action ?? (event?.newValue === null ? 'remove' : 'set');

  if (incomingKey === undefined) return;
  listener(incomingKey, incomingValue, action);
}

export function readStorage(key, fallback = null) {
  const storage = getStorage();
  if (!storage) return fallback;

  const raw = storage.getItem(key);
  if (raw === null || raw === undefined) return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export function writeStorage(key, value) {
  const storage = getStorage();
  if (!storage) return;

  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  storage.setItem(key, serialized);
  dispatchStorageEvent(key, serialized, 'set');
}

export function removeStorage(key) {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(key);
  dispatchStorageEvent(key, undefined, 'remove');
}

export function subscribeToStorage(listener) {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return () => {};
  }

  const handler = (event) => {
    notifyListener(listener, event);
  };

  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
