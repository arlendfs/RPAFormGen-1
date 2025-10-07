import { RPAFormData } from '@/types/rpa';

const STORAGE_KEY = 'rpaFormData';

export function saveFormData(data: RPAFormData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

export function loadFormData(): RPAFormData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
}

export function clearFormData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
}

export function hasStoredData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
