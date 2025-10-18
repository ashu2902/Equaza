/**
 * Change Tracking Utilities
 * Pure utility functions for tracking data changes
 */

/**
 * Helper function to create change tracking object
 */
export function createChangeLog(
  oldData: Record<string, any>,
  newData: Record<string, any>
): Record<string, { old: any; new: any }> {
  const changes: Record<string, { old: any; new: any }> = {};

  // Check for changes in newData
  Object.keys(newData).forEach((key) => {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key],
      };
    }
  });

  // Check for removed fields
  Object.keys(oldData).forEach((key) => {
    if (!(key in newData)) {
      changes[key] = {
        old: oldData[key],
        new: undefined,
      };
    }
  });

  return changes;
}
