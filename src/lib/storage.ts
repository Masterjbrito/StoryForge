// ============================================================
// StoryForge - localStorage Persistence Layer
// ============================================================

const STORAGE_PREFIX = 'storyforge_';

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw, dateReviver) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(data));
  } catch (e) {
    console.warn(`[StoryForge] Failed to save "${key}" to localStorage`, e);
  }
}

export function removeFromStorage(key: string): void {
  localStorage.removeItem(getKey(key));
}

export function clearAllStorage(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}

// Reviver function to convert ISO date strings back to Date objects
function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string') {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (isoDateRegex.test(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }
  }
  return value;
}
