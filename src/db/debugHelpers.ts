/**
 * Debug helpers for queue data
 */
import { clinipalDB } from './clinipal-db';

/**
 * Prints queue data to console for debugging
 */
export const debugQueueData = async (): Promise<void> => {
  try {
    const queueData = await clinipalDB.queue.toArray();
    
    console.group('Queue Data Debug');
    console.log(`Found ${queueData.length} queue items`);
    
    if (queueData.length > 0) {
      const sampleItem = queueData[0];
      console.log('Sample item:', sampleItem);
      
      // Check for snake_case fields
      console.log('Has snake_case fields:', {
        patient_id: sampleItem.patient_id !== undefined,
        patient_fullname: sampleItem.patient_fullname !== undefined,
        visit_reason: sampleItem.visit_reason !== undefined,
        assigned_doctor: sampleItem.assigned_doctor !== undefined,
        checked_in_at: sampleItem.checked_in_at !== undefined,
        qued_by: sampleItem.qued_by !== undefined
      });
      
      // Check for camelCase fields
      console.log('Has camelCase fields:', {
        // @ts-ignore
        patientId: sampleItem.patientId !== undefined,
        // @ts-ignore
        patientName: sampleItem.patientName !== undefined,
        // @ts-ignore
        visitReason: sampleItem.visitReason !== undefined,
        // @ts-ignore
        assignedDoctor: sampleItem.assignedDoctor !== undefined,
        // @ts-ignore
        checkedInAt: sampleItem.checkedInAt !== undefined,
        // @ts-ignore
        queuededBy: sampleItem.queuededBy !== undefined
      });
    }
    console.groupEnd();
  } catch (error) {
    console.error('Error debugging queue data:', error);
  }
};
