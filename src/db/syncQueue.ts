/**
 * Sync Queue Manager
 * 
 * Manages the queue of pending sync operations.
 */

import { clinipalDB } from './clinipal-db';


/**
 * Add an operation to the sync queue for later processing when online
 */
export function addToSyncQueue(options: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  endpoint: string;
  entityType: string;
  entityId?: string;
  tempId?: string;
  priority?: number;
}) {
  try {
    const syncItem = {
      ...options,
      headers: { 'Content-Type': 'application/json' },
      timestamp: Date.now(),
      retries: 0,
      priority: options.priority || 1
    };
    
    const id = clinipalDB.syncQueue.add(syncItem);
    
    console.log(`Added to sync queue: ${options.method} ${options.url}`);
    return id;
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    throw error;
  }
}
