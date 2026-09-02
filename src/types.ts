/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  category: 
    | 'Antibiotic' 
    | 'NSAID' 
    | 'Statin' 
    | 'ACE Inhibitor' 
    | 'Anti-Diabetic' 
    | 'Respiratory' 
    | 'Proton Pump Inhibitor' 
    | 'Neuropathic' 
    | 'Anticoagulant' 
    | 'Calcium Channel Blocker' 
    | 'Antihistamine' 
    | 'Oncology'
    | 'Cardiology / Antiarrhythmic'
    | 'Psychiatric / Antidepressant'
    | 'Emergency / Critical Care'
    | 'Immunosuppressant'
    | 'Corticosteroid'
    | 'Antiviral'
    | 'Antifungal'
    | 'Other';
  dosage: string;
  dosageSchedule: string;
  indications: string;
  contraindications: string;
  sideEffects: { name: string; percentage: number }[];
  efficacy: string;
  fullDescription: string;
  chemicalFormula?: string;
  molarMass?: string;
  iupacName?: string;
  mechanismOfAction?: string;
  targetReceptors?: string[];
  organDistribution?: {
    primaryTarget: string;
    metabolismOrgan: string;
    eliminationRoute: string;
  };
  pharmacology?: {
    metabolism: string;
    halfLife: string;
    clearance: string;
    peakPlasma?: string;
    bioavailability?: string;
  };
  visualPill: {
    shape: 'Round' | 'Oval' | 'Capsule' | 'Oblong';
    color: 'White' | 'Blue' | 'Pink' | 'Yellow' | 'Red' | 'White/Pink' | 'White/Blue' | 'Orange' | 'Purple' | 'Teal';
    imprint: string;
    score: 'Single' | 'None' | 'Cross';
    matchPct: number;
    svgColorPrimary: string;
    svgColorSecondary?: string;
  };
  safetyWarnings: string[];
  foodInteractions: string;
  renalDosing: string;
  pregnancyRisk: 'Safe' | 'Caution' | 'Contraindicated';
  blackBoxWarning?: string;
  atcCode?: string;
}

export interface DrugInteraction {
  drugAId: string;
  drugBId: string;
  drugAName: string;
  drugBName: string;
  severity: 'Severe' | 'Moderate' | 'Safe';
  title: string;
  mechanism: string;
  clinicalOverlay: string;
  reasoning: {
    pathway: string;
    physiological: string;
    monitoring: string;
  };
  clinicalAdvice: string;
}

export interface PatientParameters {
  ageGroup: 'Adult' | 'Pediatric' | 'Geriatric';
  renalFunction: 'Normal' | 'Impaired';
  isPregnant: boolean;
}

export interface DiagnosticDifferential {
  condition: string;
  details: string;
  typicalInterventions: string;
  urgency: string;
}

export interface DiagnosticResult {
  primaryHypothesis: string;
  empatheticNarrative: string;
  confidence: number;
  matches: DiagnosticDifferential[];
  disclaimer: string;
  warningSigns: string[];
  recDoctor: string;
  isDangerous: 'Dangerous' | 'Safe';
  isPlanAFallback?: boolean;
  timestamp?: string;
}

export interface CabinetItem {
  id: string;
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  nextDose: string;
  takenToday: boolean;
  historyDates: string[];
  prescribedBy?: string;
  startDate?: string;
}

export interface PatientAttachment {
  id: string;
  title: string;
  category: 'X-Ray' | 'MRI Scan' | 'CT Scan' | 'ECG Strip' | 'Pathology / Lab' | 'Derm Photo' | 'Clinical Document';
  date: string;
  fileUrl: string;
  findings: string;
  modality: string;
  urgency: 'Normal' | 'Abnormal' | 'Critical Flag';
  fileSize?: string;
}

export interface DoctorSoapNote {
  id: string;
  date: string;
  author: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export type PatientStatus = 'Pending' | 'Consulted' | 'Treated';
export type TriageUrgency = 'Critical' | 'Urgent' | 'Standard' | 'Follow-up';

export interface Patient {
  id: string;
  mrn: string; // e.g. "MRN-98402"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: 
    | 'Internal Medicine' 
    | 'Cardiology' 
    | 'Pulmonology' 
    | 'Emergency & Trauma' 
    | 'Oncology' 
    | 'Neurology' 
    | 'Pediatrics' 
    | 'Endocrinology'
    | 'Infectious Disease';
  roomBed: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  status: PatientStatus;
  triageLevel: TriageUrgency;
  admissionDate: string;
  chiefComplaint: string;
  symptoms: string[];
  allergies: string[];
  vitals: {
    heartRate: number; // bpm
    bloodPressure: string; // "120/80"
    respiratoryRate: number; // bpm
    temperature: number; // °F
    oxygenSat: number; // %
    gfr: number; // mL/min
  };
  attachments: PatientAttachment[];
  prescriptions: CabinetItem[];
  doctorNotes: DoctorSoapNote[];
  diagnosticHistory: DiagnosticResult[];
  lastUpdated: string;
  assignedDoctor: string;
  hospitalUnit: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  hospital: string;
  npiNumber: string;
  avatar?: string;
  activeHospitalWard?: string;
}

export interface ClinicalHistoryEntry {
  id: string;
  type: 'AI Diagnostic Scan' | 'Interaction Review' | 'Symptom Log' | 'Patient Triage' | 'Prescription Dispensed';
  date: string;
  title: string;
  resultSummary: string;
  severity?: 'Safe' | 'Moderate' | 'Severe';
  patientMrn?: string;
  details?: string;
}

export interface SavedAiScan {
  id: string;
  userId: string;
  timestamp: string;
  scanType: 'image' | 'symptoms' | 'pill_vision' | 'pathology';
  queryOrPillName: string;
  previewUrl?: string;
  matchedDrugName?: string;
  confidence: number;
  primaryHypothesis: string;
  empatheticNarrative: string;
  differentialMatches: DiagnosticDifferential[];
  isDangerous: 'Dangerous' | 'Safe';
  warningSigns: string[];
  recommendation: string;
  patientMrn?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  status: 'online' | 'offline';
  lastLogin: string;
  role?: 'Physician' | 'Clinical Director' | 'Nurse Practitioner' | 'Resident' | 'Pharmacist';
  doctorProfile?: DoctorProfile;
  cabinet: CabinetItem[]; // Legacy fallback
  patients?: Patient[];
  history: ClinicalHistoryEntry[];
  savedScans?: SavedAiScan[];
}

