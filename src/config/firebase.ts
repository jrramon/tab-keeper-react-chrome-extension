// Firebase functionality has been removed
// This file contains stubs to prevent import errors

import { TabMasterContainer } from '../redux/slices/tabContainerDataStateSlice';

// Stub exports - these functions do nothing now
export const auth = null;
export const db = null;

export const observeAuthState = () => {
  // No-op: Firebase authentication removed
};

export const signInUserAnonymously = () => {
  return Promise.resolve(undefined);
};

export const fetchDataFromFirestore = async (): Promise<TabMasterContainer> => {
  throw new Error('Firebase functionality has been removed');
};
