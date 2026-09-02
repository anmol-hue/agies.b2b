/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { UserAccount, SavedAiScan } from '../types';
import { INITIAL_PATIENTS } from '../data/patients';

// Supabase Environment Configurations
const metaEnv = (import.meta as any).env || {};
const rawUrl = (metaEnv.VITE_SUPABASE_URL as string | undefined)?.trim();
const rawKey = (metaEnv.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const SUPABASE_URL = rawUrl || 'https://tpis-clinical.supabase.co';
export const SUPABASE_ANON_KEY = rawKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.tpis-demo-anon-key';

export const isSupabaseConfigured = Boolean(
  rawUrl && rawKey && !rawUrl.includes('your-project') && rawKey.length > 20
);

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

const STORAGE_KEY = 'tpis_agies_user_session';

// Helper to create a clean new clinical account
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

// Sync user profile and clinical work to Supabase
export async function syncUserToSupabase(account: UserAccount): Promise<void> {
  saveLocalAccount(account);
  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
        doctor_profile: account.doctorProfile,
        cabinet: account.cabinet,
        patients: account.patients,
        history: account.history,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase profile sync notice (table may need creation):', error.message);
    }
  } catch (err) {
    console.warn('Supabase sync error, local copy maintained:', err);
  }
}

export async function fetchUserFromSupabase(uid: string): Promise<UserAccount | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      status: 'online',
      lastLogin: new Date().toISOString(),
      role: data.role || 'Physician',
      doctorProfile: data.doctor_profile,
      patients: data.patients || INITIAL_PATIENTS,
      cabinet: data.cabinet || [],
      history: data.history || [],
      savedScans: []
    };
  } catch (err) {
    console.warn('Failed to load user profile from Supabase:', err);
    return null;
  }
}

// AI Diagnostic Scan Storage in Supabase
export async function saveAiScanToSupabase(scan: SavedAiScan): Promise<void> {
  // Always update local cache
  const local = loadLocalAccount();
  if (local) {
    const existingScans = local.savedScans || [];
    local.savedScans = [scan, ...existingScans.filter(s => s.id !== scan.id)];
    saveLocalAccount(local);
  }

  if (!isSupabaseConfigured) return;

  try {
    const { error } = await supabase
      .from('scans')
      .upsert({
        id: scan.id,
        user_id: scan.userId,
        timestamp: scan.timestamp,
        scan_type: scan.scanType,
        query_or_pill_name: scan.queryOrPillName,
        preview_url: scan.previewUrl,
        matched_drug_name: scan.matchedDrugName,
        confidence: scan.confidence,
        primary_hypothesis: scan.primaryHypothesis,
        empathetic_narrative: scan.empatheticNarrative,
        differential_matches: scan.differentialMatches,
        is_dangerous: scan.isDangerous,
        warning_signs: scan.warningSigns,
        recommendation: scan.recommendation,
        patient_mrn: scan.patientMrn,
        created_at: scan.timestamp
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase scan insert notice:', error.message);
    }
  } catch (err) {
    console.warn('Failed to save AI scan to Supabase:', err);
  }
}

export async function fetchUserScansFromSupabase(userId: string): Promise<SavedAiScan[]> {
  if (!isSupabaseConfigured) {
    const local = loadLocalAccount();
    return local?.savedScans || [];
  }

  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error || !data || data.length === 0) {
      const local = loadLocalAccount();
      return local?.savedScans || [];
    }

    return data.map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      timestamp: d.timestamp,
      scanType: d.scan_type || 'symptoms',
      queryOrPillName: d.query_or_pill_name || 'AI Diagnostic Panel',
      previewUrl: d.preview_url,
      matchedDrugName: d.matched_drug_name,
      confidence: d.confidence || 90,
      primaryHypothesis: d.primary_hypothesis || 'Clinical Differential Analysis',
      empatheticNarrative: d.empathetic_narrative || '',
      differentialMatches: d.differential_matches || [],
      isDangerous: d.is_dangerous || 'Safe',
      warningSigns: d.warning_signs || [],
      recommendation: d.recommendation || 'Consult Attending Physician',
      patientMrn: d.patient_mrn
    }));
  } catch (err) {
    console.warn('Failed to fetch scans from Supabase, using local:', err);
    const local = loadLocalAccount();
    return local?.savedScans || [];
  }
}

export async function deleteScanFromSupabase(scanId: string): Promise<void> {
  const local = loadLocalAccount();
  if (local && local.savedScans) {
    local.savedScans = local.savedScans.filter(s => s.id !== scanId);
    saveLocalAccount(local);
  }

  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('scans').delete().eq('id', scanId);
  } catch (err) {
    console.warn('Failed to delete scan from Supabase:', err);
  }
}

export async function logOutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase sign out error:', err);
  }
  saveLocalAccount(null);
}
