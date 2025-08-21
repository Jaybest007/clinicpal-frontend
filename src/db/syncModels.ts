/**
 * Models for the offline sync system
 * These interfaces define the structure of data stored in the sync tables
 */

/**
 * Represents a pending API request in the outbox
 */
export interface SyncQueueItem {
  id?: number;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retries: number;
  endpoint: string;
  priority: number;
  entityType: string;
  entityId?: string;
  tempId?: string;
}

/**
 * Status of an entity's synchronization
 */
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'error';

/**
 * Log entry for sync operations
 */
export interface SyncLogItem {
  id?: number;
  operation: string;
  entityType: string;
  entityId: string;
  timestamp: number;
  status: SyncStatus;
  error?: string;
  details?: any;
}

/**
 * Represents the sync metadata added to entity objects
 */
export interface SyncMetadata {
  _syncStatus?: SyncStatus;
  _syncTimestamp?: number;
  _tempId?: string;
  _serverUpdatedAt?: string;
  _conflictResolved?: boolean;
}

/**
 * Queue-specific sync item for simpler implementation
 */
export interface QueueSyncItem {
  id: string; // Unique identifier for the sync item
  queueId: string; // ID of the queue item to sync
  action: 'add' | 'call' | 'seen' | 'remove'; // The action to perform
  data?: any; // Additional data needed for the action
  timestamp: number; // When the action was performed offline
  processed: boolean; // Whether this has been processed
  error?: string; // Error message if sync failed
}

/**
 * Entity types that can be synchronized
 */
export const SyncEntityType = {
  PATIENT: 'patient',
  NEXT_OF_KIN: 'nextOfKin',
  REPORT: 'report',
  APPOINTMENT: 'appointment',
  PHARMACY_ORDER: 'pharmacyOrder',
  LAB_ORDER: 'labOrder',
  ULTRASOUND_ORDER: 'ultrasoundOrder',
  XRAY_ORDER: 'xrayOrder',
  TRANSACTION: 'transaction',
  QUEUE: 'queue'
} as const;
