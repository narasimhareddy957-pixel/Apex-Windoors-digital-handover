import { HandoverRecord } from '../types/handover';
import { SAMPLE_RECORDS } from './sampleData';

const STORAGE_KEY = 'apex_windoors_handover_records_v1';
const CURRENT_ACTIVE_KEY = 'apex_windoors_current_active_id';

export function loadStoredRecords(): HandoverRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_RECORDS));
      return SAMPLE_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_RECORDS;
  } catch (err) {
    console.error('Error loading stored handover records:', err);
    return SAMPLE_RECORDS;
  }
}

export function saveStoredRecords(records: HandoverRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving handover records to localStorage:', err);
  }
}

export function getActiveRecordId(): string {
  try {
    return localStorage.getItem(CURRENT_ACTIVE_KEY) || SAMPLE_RECORDS[0].id;
  } catch {
    return SAMPLE_RECORDS[0].id;
  }
}

export function setActiveRecordId(id: string): void {
  try {
    localStorage.setItem(CURRENT_ACTIVE_KEY, id);
  } catch (err) {
    console.error('Error saving active record id:', err);
  }
}

export function exportRecordsAsJSON(records: HandoverRecord[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `apex_windoors_handovers_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
