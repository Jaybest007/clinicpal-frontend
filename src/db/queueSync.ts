import { clinipalDB } from './clinipal-db';
import { API_BASE_URL, API_ENDPOINTS, createApiRequest } from '../context/DashboardContext/services/api';
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Synchronize queue actions performed offline
 * This function should be called when the app comes back online
 */
export const syncQueueActions = async (token: string) => {
  if (!token) return { success: false, message: 'No authentication token' };
  
  try {
    // Get all pending queue sync items
    const pendingItems = await clinipalDB.queueSync
      .filter(item => !item.processed)
      .toArray();
    
    if (!pendingItems.length) {
      return { success: true, message: 'No pending queue actions to sync' };
    }
    
    console.log(`Syncing ${pendingItems.length} pending queue actions`);
    
    // Process each pending item
    const results = await Promise.allSettled(
      pendingItems.map(async (item) => {
        try {
          // Different handling based on action type
          switch (item.action) {
            case 'add': {
              // Get the queue item data
              const queueItem = await clinipalDB.queue.get(item.queueId);
              if (!queueItem) {
                throw new Error(`Queue item ${item.queueId} not found`);
              }
              
              // Send to server
              const response = await axios.post(
                `${API_BASE_URL}${API_ENDPOINTS.QUE_ACTIONS}`,
                {
                  patient_id: queueItem.patient_id,
                  action: 'add',
                  performed_by: queueItem.qued_by,
                  patient_fullname: queueItem.patient_fullname,
                  visit_reason: queueItem.visit_reason,
                  assigned_doctor: queueItem.assigned_doctor
                },
                createApiRequest(token)
              );
              
              // Update the local queue item with the server ID
              if (response.data.queue_id) {
                // If this is a temporary ID (negative number), replace it with the server ID
                if (queueItem.id.startsWith('-')) {
                  // Create a new item with the server ID
                  const serverItem = {
                    ...queueItem,
                    id: response.data.queue_id.toString(),
                    _syncStatus: 'synced',
                    _syncTimestamp: Date.now()
                  };
                  
                  // Add the new item with server ID
                  await clinipalDB.queue.add(serverItem);
                  
                  // Delete the temporary item
                  await clinipalDB.queue.delete(queueItem.id);
                } else {
                  // Just update the sync status
                  await clinipalDB.queue.update(queueItem.id, {
                    _syncStatus: 'synced',
                    _syncTimestamp: Date.now()
                  });
                }
              }
              
              break;
            }
            
            case 'call':
            case 'seen':
            case 'remove': {
              // Send to server
              await axios.patch(
                `${API_BASE_URL}${API_ENDPOINTS.QUE_ACTIONS}/${item.queueId}/${item.action}`,
                {},
                createApiRequest(token)
              );
              
              // Update local item sync status
              await clinipalDB.queue.update(item.queueId, {
                _syncStatus: 'synced',
                _syncTimestamp: Date.now()
              });
              
              break;
            }
            
            default:
              throw new Error(`Unknown queue action: ${item.action}`);
          }
          
          // Mark sync item as processed
          await clinipalDB.queueSync.update(item.id, {
            processed: true
          });
          
          return { success: true, item };
        } catch (error) {
          console.error(`Error syncing queue action ${item.id}:`, error);
          
          // Mark the item with error
          await clinipalDB.queueSync.update(item.id, {
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          
          return { success: false, item, error };
        }
      })
    );
    
    // Count successes and failures
    const succeeded = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - succeeded;
    
    if (failed > 0) {
      toast.warning(`Synced ${succeeded} queue actions, ${failed} failed`);
    } else if (succeeded > 0) {
      toast.success(`Successfully synced ${succeeded} queue actions`);
    }
    
    return {
      success: true,
      syncedCount: succeeded,
      failedCount: failed,
      total: results.length
    };
  } catch (error) {
    console.error('Error in queue sync process:', error);
    toast.error('Failed to sync queue actions');
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
};

/**
 * Setup listener to automatically sync when app comes online
 * Call this during app initialization
 */
export const setupAutoSync = (getToken: () => string | null) => {
  const handleOnline = async () => {
    const token = getToken();
    if (token) {
      toast.info('Synchronizing offline changes...');
      await syncQueueActions(token);
    }
  };
  
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
  };
};
