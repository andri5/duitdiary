/**
 * Offline mutation queue — scaffold for P3 sync when connectivity returns.
 * Persists pending writes in SecureStore until flushed to API.
 */

import * as SecureStore from 'expo-secure-store';

const QUEUE_KEY = 'dd_offline_queue';

export type OfflineAction =
  | {
      id: string;
      type: 'CREATE_TRANSACTION';
      payload: Record<string, unknown>;
      createdAt: string;
    }
  | {
      id: string;
      type: 'UPDATE_TRANSACTION';
      payload: Record<string, unknown>;
      createdAt: string;
    };

async function readQueue(): Promise<OfflineAction[]> {
  try {
    const raw = await SecureStore.getItemAsync(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineAction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeQueue(items: OfflineAction[]): Promise<void> {
  await SecureStore.setItemAsync(QUEUE_KEY, JSON.stringify(items));
}

export async function enqueueOfflineAction(
  action: Omit<OfflineAction, 'id' | 'createdAt'>
): Promise<OfflineAction> {
  const queue = await readQueue();
  const entry: OfflineAction = {
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  } as OfflineAction;
  queue.push(entry);
  await writeQueue(queue);
  return entry;
}

export async function getOfflineQueue(): Promise<OfflineAction[]> {
  return readQueue();
}

export async function clearOfflineQueue(): Promise<void> {
  await SecureStore.deleteItemAsync(QUEUE_KEY);
}

/** Flush queue — wire to API services in a later P3 iteration. */
export async function flushOfflineQueue(): Promise<{ flushed: number; remaining: number }> {
  const queue = await readQueue();
  // Placeholder: real sync will POST queued mutations when online.
  return { flushed: 0, remaining: queue.length };
}
