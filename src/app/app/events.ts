// "The library changed" (a recording saved or edited here): Shell reads the
// account's recordings again.

const listeners = new Set<() => void>();

export function notifyLibraryChanged() {
  listeners.forEach(l => l());
}

export function onLibraryChanged(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
