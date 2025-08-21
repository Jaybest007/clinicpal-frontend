/**
 * Data migration script to update legacy queue items to use new field naming
 */
import { clinipalDB } from './clinipal-db';

export const migrateQueueData = async (): Promise<void> => {
  try {
    console.log("Starting queue data migration...");
    
    // Get all queue items
    const queueItems = await clinipalDB.queue.toArray();
    
    if (queueItems.length === 0) {
      console.log("No queue items to migrate");
      return;
    }
    
    console.log(`Found ${queueItems.length} queue items to check for migration`);
    
    // Track migrations
    let migratedCount = 0;
    
    // Process each item
    for (const item of queueItems) {
      let needsUpdate = false;
      const updates: any = {};
      
      // Check for legacy fields and prepare updates
      // @ts-ignore - Check for old property names
      if (item.patientId !== undefined && item.patient_id === undefined) {
        // @ts-ignore
        updates.patient_id = item.patientId;
        needsUpdate = true;
      }
      
      // @ts-ignore
      if (item.patientName !== undefined && item.patient_fullname === undefined) {
        // @ts-ignore
        updates.patient_fullname = item.patientName;
        needsUpdate = true;
      }
      
      // @ts-ignore
      if (item.visitReason !== undefined && item.visit_reason === undefined) {
        // @ts-ignore
        updates.visit_reason = item.visitReason;
        needsUpdate = true;
      }
      
      // @ts-ignore
      if (item.assignedDoctor !== undefined && item.assigned_doctor === undefined) {
        // @ts-ignore
        updates.assigned_doctor = item.assignedDoctor;
        needsUpdate = true;
      }
      
      // @ts-ignore
      if (item.checkedInAt !== undefined && item.checked_in_at === undefined) {
        // @ts-ignore
        updates.checked_in_at = item.checkedInAt;
        needsUpdate = true;
      }
      
      // @ts-ignore
      if (item.queuededBy !== undefined && item.qued_by === undefined) {
        // @ts-ignore
        updates.qued_by = item.queuededBy;
        needsUpdate = true;
      }
      
      // Update if needed
      if (needsUpdate) {
        await clinipalDB.queue.update(item.id, updates);
        migratedCount++;
      }
    }
    
    console.log(`Migration complete. Updated ${migratedCount} queue items.`);
  } catch (error) {
    console.error("Error migrating queue data:", error);
  }
};
