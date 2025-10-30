// Firebase functionality has been removed
// All data is now stored locally only

import {
  showToast,
} from '../../redux/slices/globalStateSlice';
import { TabMasterContainer } from '../../redux/slices/tabContainerDataStateSlice';
import { AppDispatch } from '../../redux/store';

// display a toast message
export const displayToast = (
  dispatch: AppDispatch,
  text: string,
  duration?: number,
  error?: any
) => {
  const displayText = error ? error.message || 'An error occurred.' : text;
  dispatch(
    showToast({
      toastText: displayText,
      duration: duration || 3000,
    })
  );
};

// Stub for backward compatibility - throws error if called
export async function loadFromFirestore(): Promise<TabMasterContainer | undefined> {
  console.warn('Firebase functionality has been removed - data is local only');
  return undefined;
}

// Stub for backward compatibility - does nothing
export async function saveToFirestore(): Promise<void> {
  console.warn('Firebase functionality has been removed - data is local only');
}
