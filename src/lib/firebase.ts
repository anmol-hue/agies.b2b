/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { UserAccount, CabinetItem, ClinicalHistoryEntry, Patient, SavedAiScan } from '../types';
import { INITIAL_PATIENTS } from '../data/patients';

const firebaseConfig = {
  projectId: "resonant-gravity-56vd8",
  appId: "1:731869313117:web:1db19c462f8a1e4ef5b5b4",
  apiKey: "AIzaSyC4lCkWhyVmXiYYNZfAhAW92Bzz7ATrheI",
  authDomain: "resonant-gravity-56vd8.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-tpisagies-c0faa7b6-1a65-4b04-be17-0f234e7ae734",
  storageBucket: "resonant-gravity-56vd8.firebasestorage.app",
  messagingSenderId: "731869313117",
  measurementId: ""
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

const STORAGE_KEY = 'tpis_agies_user_session';

// Helper to create a clean new clinical account for authenticated users
export function createFreshUserAccount(uid: string, email: string, displayName?: string | null): UserAccount {
  const cleanName = displayName?.trim() || email.split('@')[0] || 'Clinician';
  const formattedName = cleanName.startsWith('Dr.') ? cleanName : `Dr. ${cleanName}`;
  
  return {
    id: uid,
    email: email,
    name: formattedName,
    status: 'online',
    lastLogin: new Date().toISOString(),
    role: 'Physician',
    doctorProfile: {
      id: `doc-${uid.slice(0, 8)}`,
      name: formattedName.includes('MD') ? formattedName : `${formattedName}, MD`,
      title: 'Attending Physician & Clinical Specialist',
      specialty: 'Clinical Medicine & Pharmacotherapy',
      department: 'General Inpatient & Diagnostics',
      hospital: 'University Medical Center',
      npiNumber: `NPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      activeHospitalWard: 'Central Ward 3'
    },
    patients: INITIAL_PATIENTS,
    cabinet: [],
    history: [],
    savedScans: []
  };
}

// Local storage management helpers
export function loadLocalAccount(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If it's a legacy mock or demo account, wipe it clean
      if (!parsed.id || parsed.id.startsWith('doc-guest') || parsed.id.startsWith('demo-') || parsed.id.startsWith('guest')) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read localStorage user session', err);
  }
  return null;
}

export function saveLocalAccount(account: UserAccount | null) {
  try {
    if (account) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Could not write localStorage user session', err);
  }
}

// Sync user profile and clinical work to Firestore
export async function syncUserToFirestore(account: UserAccount) {
  saveLocalAccount(account);
  try {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        id: account.id,
        name: account.name,
        email: account.email,
        status: account.status || 'online',
        lastLogin: new Date().toISOString(),
        role: account.role || 'Physician',
        doctorProfile: account.doctorProfile || null,
        cabinet: account.cabinet || [],
        patients: account.patients || INITIAL_PATIENTS,
        history: account.history || []
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore sync failed, local copy maintained:', err);
  }
}

export async function fetchUserFromFirestore(uid: string): Promise<UserAccount | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
  } catch (err) {
    console.warn('Failed to load user from firestore:', err);
  }
  return null;
}

// AI Diagnostic Scan Storage in Firestore
export async function saveAiScanToFirestore(scan: SavedAiScan): Promise<void> {
  try {
    if (!auth.currentUser) {
      // If offline or local, save in local history
      return;
    }
    const scanRef = doc(db, 'scans', scan.id);
    await setDoc(scanRef, scan);
  } catch (err) {
    console.warn('Failed to save AI scan to Firestore:', err);
  }
}

export async function fetchUserScansFromFirestore(userId: string): Promise<SavedAiScan[]> {
  try {
    const scansCol = collection(db, 'scans');
    const q = query(scansCol, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const results: SavedAiScan[] = [];
    snap.forEach((d) => {
      results.push(d.data() as SavedAiScan);
    });
    return results;
  } catch (err) {
    console.warn('Failed to fetch scans query, attempting fallback:', err);
    try {
      // Fallback without composite index requirement
      const scansCol = collection(db, 'scans');
      const q = query(scansCol, where('userId', '==', userId));
      const snap = await getDocs(q);
      const results: SavedAiScan[] = [];
      snap.forEach((d) => {
        results.push(d.data() as SavedAiScan);
      });
      return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (fallbackErr) {
      console.warn('Fallback scan query failed:', fallbackErr);
      return [];
    }
  }
}

export async function deleteScanFromFirestore(scanId: string): Promise<void> {
  try {
    const scanRef = doc(db, 'scans', scanId);
    await deleteDoc(scanRef);
  } catch (err) {
    console.warn('Failed to delete scan:', err);
  }
}

export async function logOutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (err) {
    console.warn('Firebase sign out error:', err);
  }
  saveLocalAccount(null);
}
