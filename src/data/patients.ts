/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    mrn: 'MRN-84920',
    name: 'Eleanor Vance',
    age: 68,
    gender: 'Female',
    department: 'Cardiology',
    roomBed: 'ICU-304B',
    bloodType: 'O+',
    status: 'Pending',
    triageLevel: 'Critical',
    admissionDate: '2026-09-01 06:45 AM',
    chiefComplaint: 'Acute chest tightness radiating to left scapula, diaphoresis, and dyspnea on minimal exertion.',
    symptoms: ['Chest Pain (Pressure)', 'Diaphoresis', 'Shortness of Breath', 'Palpitations', 'Bilateral Pedal Edema'],
    allergies: ['Penicillins (Anaphylaxis)', 'Codeine (Nausea)'],
    vitals: {
      heartRate: 114,
      bloodPressure: '168/98',
      respiratoryRate: 22,
      temperature: 98.6,
      oxygenSat: 92,
      gfr: 48
    },
    attachments: [
      {
        id: 'att-1',
        title: '12-Lead Electrocardiogram (ECG)',
        category: 'ECG Strip',
        date: '2026-09-01 07:10 AM',
        fileUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        findings: 'ST-segment depression in leads V4-V6 and II, III, aVF. T-wave inversions consistent with anterolateral myocardial ischemia.',
        modality: 'Philips PageWriter TC70',
        urgency: 'Critical Flag',
        fileSize: '2.4 MB'
      },
      {
        id: 'att-2',
        title: 'Bedside Chest Radiograph (AP View)',
        category: 'X-Ray',
        date: '2026-09-01 07:30 AM',
        fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        findings: 'Mild cardiomegaly with subtle cephalization of pulmonary vasculature indicative of early pulmonary venous congestion.',
        modality: 'Shimadzu MobileDaRt MX8',
        urgency: 'Abnormal',
        fileSize: '8.1 MB'
      },
      {
        id: 'att-3',
        title: 'Cardiac Biomarker & Troponin Panel',
        category: 'Pathology / Lab',
        date: '2026-09-01 07:45 AM',
        fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        findings: 'High-Sensitivity Troponin I: 340 ng/L (Ref < 14 ng/L). BNP: 780 pg/mL. Serum Creatinine: 1.4 mg/dL.',
        modality: 'Abbott ARCHITECT i2000SR',
        urgency: 'Critical Flag',
        fileSize: '540 KB'
      }
    ],
    prescriptions: [
      {
        id: 'rx-1',
        medicineId: 'atorvastatin',
        name: 'Atorvastatin Calcium',
        dosage: '80mg once daily',
        frequency: 'Daily (Bedtime)',
        instructions: 'High-intensity statin therapy for acute coronary plaque stabilization.',
        nextDose: '09:00 PM',
        takenToday: false,
        historyDates: ['2026-08-31'],
        prescribedBy: 'Dr. Marcus Vance, MD (Cardiology)'
      },
      {
        id: 'rx-2',
        medicineId: 'amiodarone',
        name: 'Amiodarone Hydrochloride',
        dosage: '200mg daily',
        frequency: 'Daily',
        instructions: 'Ventricular rate and rhythm stability post-ischemic event.',
        nextDose: '08:00 AM',
        takenToday: true,
        historyDates: ['2026-09-01'],
        prescribedBy: 'Dr. Marcus Vance, MD (Cardiology)'
      }
    ],
    doctorNotes: [
      {
        id: 'note-1',
        date: '2026-09-01 08:00 AM',
        author: 'Dr. Marcus Vance, MD (Attending Cardiologist)',
        subjective: '68yo female presents with 2-hour history of crushing substernal chest pressure. Nausea and diaphoresis reported. No prior history of stent placement.',
        objective: 'Vitals: BP 168/98, HR 114 (sinus tach), RR 22, SpO2 92% on RA. S1/S2 present, S4 gallop audible. ECG shows dynamic ST depression in anterolateral leads. Hs-Troponin I elevated at 340 ng/L.',
        assessment: 'Non-ST-Elevation Myocardial Infarction (NSTEMI) with GRACE Risk Score >140 (High Risk).',
        plan: '1. Initiate Dual Antiplatelet Therapy (DAPT) & Heparin infusion.\n2. High-dose Atorvastatin 80mg PO.\n3. Supplemental oxygen via nasal cannula 2L.\n4. Urgent coronary angiography booked for Cath Lab 2 at 10:30 AM.'
      }
    ],
    diagnosticHistory: [],
    lastUpdated: '2026-09-01 08:15 AM',
    assignedDoctor: 'Dr. Marcus Vance, MD',
    hospitalUnit: 'West Wing Cardiac ICU'
  },
  {
    id: 'pat-102',
    mrn: 'MRN-77312',
    name: 'David Chen',
    age: 54,
    gender: 'Male',
    department: 'Pulmonology',
    roomBed: 'Ward 4 - Bed 12',
    bloodType: 'A-',
    status: 'Consulted',
    triageLevel: 'Urgent',
    admissionDate: '2026-08-31 03:20 PM',
    chiefComplaint: 'Productive purulent cough with thick greenish sputum, persistent high-grade fevers (102.4°F), and right pleuritic chest pain.',
    symptoms: ['Productive Cough', 'High Fever', 'Pleuritic Chest Pain', 'Fatigue', 'Tachypnea'],
    allergies: ['Sulfa Drugs (Severe Rash)'],
    vitals: {
      heartRate: 98,
      bloodPressure: '124/76',
      respiratoryRate: 24,
      temperature: 101.8,
      oxygenSat: 94,
      gfr: 78
    },
    attachments: [
      {
        id: 'att-4',
        title: 'High-Resolution Chest CT Scan (Axial)',
        category: 'CT Scan',
        date: '2026-08-31 04:45 PM',
        fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        findings: 'Right middle lobe dense consolidation with surrounding air bronchograms and localized pleural effusion. No cavitary necrosis observed.',
        modality: 'GE Revolution CT 512-Slice',
        urgency: 'Critical Flag',
        fileSize: '42.5 MB'
      },
      {
        id: 'att-5',
        title: 'Sputum Gram Stain & Blood Culture',
        category: 'Pathology / Lab',
        date: '2026-09-01 06:00 AM',
        fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        findings: 'Gram-positive diplococci in pairs and short chains. Consistent with Streptococcus pneumoniae. Sensitive to Amoxicillin-Clavulanate and Vancomycin.',
        modality: 'BD BACTEC FX',
        urgency: 'Abnormal',
        fileSize: '1.2 MB'
      }
    ],
    prescriptions: [
      {
        id: 'rx-3',
        medicineId: 'amoxicillin',
        name: 'Amoxicillin Trihydrate',
        dosage: '875mg twice daily',
        frequency: '2x Daily (After meals)',
        instructions: 'Broad spectrum coverage for confirmed Community-Acquired Pneumonia.',
        nextDose: '12:00 PM',
        takenToday: true,
        historyDates: ['2026-08-31', '2026-09-01'],
        prescribedBy: 'Dr. Sarah Jenkins, MD (Pulmonology)'
      },
      {
        id: 'rx-4',
        medicineId: 'pantoprazole',
        name: 'Pantoprazole Sodium',
        dosage: '40mg once daily',
        frequency: 'Daily (Morning)',
        instructions: 'Gastroprotection during high antibiotic and anti-inflammatory load.',
        nextDose: '07:30 AM',
        takenToday: true,
        historyDates: ['2026-09-01'],
        prescribedBy: 'Dr. Sarah Jenkins, MD (Pulmonology)'
      }
    ],
    doctorNotes: [
      {
        id: 'note-2',
        date: '2026-09-01 07:00 AM',
        author: 'Dr. Sarah Jenkins, MD (Pulmonologist)',
        subjective: 'Patient reports mild improvement in rigors after 2nd antibiotic dose, though pleuritic pain persists on deep inspiration.',
        objective: 'Temperature down to 101.8°F. SpO2 94% on room air. Decreased breath sounds and bronchial breathing over right middle zone.',
        assessment: 'Community-Acquired Lobar Pneumonia (Right Middle Lobe) - Streptococcus pneumoniae confirmed.',
        plan: '1. Continue Amoxicillin 875mg BID for 7-day total course.\n2. Incentive spirometry q1h while awake.\n3. Repeat inflammatory markers (CRP/Procalcitonin) tomorrow morning.'
      }
    ],
    diagnosticHistory: [],
    lastUpdated: '2026-09-01 07:15 AM',
    assignedDoctor: 'Dr. Sarah Jenkins, MD',
    hospitalUnit: 'Respiratory Care Unit'
  },
  {
    id: 'pat-103',
    mrn: 'MRN-62184',
    name: 'Aisha Al-Mansoor',
    age: 42,
    gender: 'Female',
    department: 'Endocrinology',
    roomBed: 'Outpatient Clinic 108',
    bloodType: 'B+',
    status: 'Treated',
    triageLevel: 'Standard',
    admissionDate: '2026-08-28 10:00 AM',
    chiefComplaint: 'Post-prandial lethargy, polydipsia, and routine diabetic quarterly surveillance.',
    symptoms: ['Fatigue', 'Mild Polydipsia', 'Nocturia x1'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    vitals: {
      heartRate: 72,
      bloodPressure: '122/78',
      respiratoryRate: 16,
      temperature: 98.4,
      oxygenSat: 99,
      gfr: 96
    },
    attachments: [
      {
        id: 'att-6',
        title: 'Comprehensive Metabolic Panel & HbA1c Report',
        category: 'Pathology / Lab',
        date: '2026-08-28 09:30 AM',
        fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        findings: 'HbA1c: 6.8% (Target < 7.0%). Fasting Plasma Glucose: 118 mg/dL. eGFR >90 mL/min. Microalbumin/Creatinine ratio normal.',
        modality: 'Roche Cobas 8000',
        urgency: 'Normal',
        fileSize: '320 KB'
      }
    ],
    prescriptions: [
      {
        id: 'rx-5',
        medicineId: 'metformin',
        name: 'Metformin Hydrochloride',
        dosage: '1000mg twice daily',
        frequency: '2x Daily (With Meals)',
        instructions: 'Maintain optimal glycemic control with meals.',
        nextDose: '01:00 PM',
        takenToday: true,
        historyDates: ['2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01'],
        prescribedBy: 'Dr. Robert Sterling, MD (Endocrinology)'
      }
    ],
    doctorNotes: [
      {
        id: 'note-3',
        date: '2026-08-28 11:30 AM',
        author: 'Dr. Robert Sterling, MD (Endocrinologist)',
        subjective: 'Patient tolerating Metformin well without GI adverse effects. Following Mediterranean diabetic meal plan.',
        objective: 'HbA1c achieved target reduction at 6.8%. BP well controlled at 122/78. BMI 26.4.',
        assessment: 'Type 2 Diabetes Mellitus - Excellent Glycemic Control.',
        plan: '1. Maintain current Metformin 1000mg BID regimen.\n2. Recheck HbA1c and lipid panel in 6 months.\n3. Annual dilated retinal exam scheduled for November.'
      }
    ],
    diagnosticHistory: [],
    lastUpdated: '2026-08-28 11:45 AM',
    assignedDoctor: 'Dr. Robert Sterling, MD',
    hospitalUnit: 'Metabolic & Endocrine Institute'
  },
  {
    id: 'pat-104',
    mrn: 'MRN-90211',
    name: 'James Thornton',
    age: 76,
    gender: 'Male',
    department: 'Emergency & Trauma',
    roomBed: 'Trauma Bay 2',
    bloodType: 'AB+',
    status: 'Pending',
    triageLevel: 'Critical',
    admissionDate: '2026-09-01 08:10 AM',
    chiefComplaint: 'Acute septic shock secondary to urosepsis, refractory hypotension, altered mental status, and oliguria.',
    symptoms: ['Hypotension', 'Altered Mental Status', 'Oliguria', 'Fever (103.2°F)', 'Severe Flank Pain'],
    allergies: ['Cephalosporins (Urticaria)'],
    vitals: {
      heartRate: 128,
      bloodPressure: '78/44',
      respiratoryRate: 28,
      temperature: 103.2,
      oxygenSat: 89,
      gfr: 22
    },
    attachments: [
      {
        id: 'att-7',
        title: 'Contrast-Enhanced Abdominal & Pelvic CT',
        category: 'CT Scan',
        date: '2026-09-01 08:35 AM',
        fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
        findings: 'Severe right-sided hydronephrosis with 8mm obstructing proximal ureteral calculus. Perinephric fat stranding and acute pyelonephritis.',
        modality: 'Siemens SOMATOM Force',
        urgency: 'Critical Flag',
        fileSize: '58.0 MB'
      },
      {
        id: 'att-8',
        title: 'Arterial Blood Gas & Serum Lactate',
        category: 'Pathology / Lab',
        date: '2026-09-01 08:20 AM',
        fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        findings: 'pH: 7.22, pCO2: 28 mmHg, HCO3: 11 mEq/L, Serum Lactate: 4.8 mmol/L (Severe high-anion-gap metabolic acidosis).',
        modality: 'Radiometer ABL90 FLEX',
        urgency: 'Critical Flag',
        fileSize: '410 KB'
      }
    ],
    prescriptions: [
      {
        id: 'rx-6',
        medicineId: 'norepinephrine',
        name: 'Norepinephrine Bitartrate',
        dosage: '0.15 mcg/kg/min IV infusion',
        frequency: 'Continuous Infusion',
        instructions: 'Titrate to maintain Mean Arterial Pressure (MAP) >= 65 mmHg.',
        nextDose: 'Continuous',
        takenToday: true,
        historyDates: ['2026-09-01'],
        prescribedBy: 'Dr. Elena Rostova, MD (Critical Care)'
      },
      {
        id: 'rx-7',
        medicineId: 'vancomycin',
        name: 'Vancomycin Hydrochloride',
        dosage: '1.25g IV post-loading',
        frequency: 'Every 18 hours (Renal Adjusted)',
        instructions: 'Broad empiric Gram-positive coverage with therapeutic drug trough monitoring.',
        nextDose: '02:00 PM',
        takenToday: true,
        historyDates: ['2026-09-01'],
        prescribedBy: 'Dr. Elena Rostova, MD (Critical Care)'
      }
    ],
    doctorNotes: [
      {
        id: 'note-4',
        date: '2026-09-01 08:45 AM',
        author: 'Dr. Elena Rostova, MD (Trauma & Critical Care)',
        subjective: '76yo male brought by EMS with Glasgow Coma Scale 11 (E3V3M5), unmeasurable BP initially at home. History of recurrent nephrolithiasis.',
        objective: 'MAP 55 mmHg despite 30 mL/kg crystalloid bolus. Lactate 4.8 mmol/L. CT confirms infected obstructing right ureteral calculus.',
        assessment: 'Obstructive Urosepsis with Septic Shock and Stage 3 Acute Kidney Injury.',
        plan: '1. Central venous line and arterial line placement.\n2. Norepinephrine infusion titrated to MAP >= 65.\n3. Urgent Urology consult for emergency retrograde ureteral stenting / nephrostomy tube decompression.\n4. Broad-spectrum antimicrobial coverage.'
      }
    ],
    diagnosticHistory: [],
    lastUpdated: '2026-09-01 08:50 AM',
    assignedDoctor: 'Dr. Elena Rostova, MD',
    hospitalUnit: 'Emergency Resuscitation Unit'
  },
  {
    id: 'pat-105',
    mrn: 'MRN-55419',
    name: 'Carlos Mendoza',
    age: 36,
    gender: 'Male',
    department: 'Infectious Disease',
    roomBed: 'Ward 2 - Bed 08',
    bloodType: 'O-',
    status: 'Consulted',
    triageLevel: 'Urgent',
    admissionDate: '2026-08-30 02:15 PM',
    chiefComplaint: 'Rapidly spreading erythematous, warm, exquisitely tender plaque over right lower extremity with ascending lymphangitic streaking.',
    symptoms: ['Right Leg Erythema', 'Localized Heat & Swelling', 'Fever (101.4°F)', 'Chills', 'Lymphadenopathy'],
    allergies: ['Aspirin (Bronchospasm)'],
    vitals: {
      heartRate: 88,
      bloodPressure: '128/82',
      respiratoryRate: 18,
      temperature: 100.4,
      oxygenSat: 98,
      gfr: 102
    },
    attachments: [
      {
        id: 'att-9',
        title: 'Right Lower Extremity Clinical Derm Photo',
        category: 'Derm Photo',
        date: '2026-08-30 02:45 PM',
        fileUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        findings: 'Sharply demarcated erythema extending from right ankle to mid-calf. Leading edge marked with surgical pen. No fluctuance or crepitus on palpation.',
        modality: 'DermLite Lumio Clinical Cam',
        urgency: 'Abnormal',
        fileSize: '3.8 MB'
      },
      {
        id: 'att-10',
        title: 'Venous Duplex Ultrasound (Right Leg)',
        category: 'Pathology / Lab',
        date: '2026-08-30 04:00 PM',
        fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        findings: 'Negative for Deep Vein Thrombosis (DVT). Normal compressibility and phasic flow across femoral and popliteal veins. Marked subcutaneous soft tissue edema.',
        modality: 'Philips EPIQ 7G Ultrasound',
        urgency: 'Normal',
        fileSize: '4.5 MB'
      }
    ],
    prescriptions: [
      {
        id: 'rx-8',
        medicineId: 'amoxicillin',
        name: 'Amoxicillin Trihydrate',
        dosage: '875mg twice daily',
        frequency: '2x Daily',
        instructions: 'Primary oral antimicrobial for non-purulent cellulitis.',
        nextDose: '08:00 PM',
        takenToday: true,
        historyDates: ['2026-08-30', '2026-08-31', '2026-09-01'],
        prescribedBy: 'Dr. Tariq Haddad, MD (Infectious Disease)'
      }
    ],
    doctorNotes: [
      {
        id: 'note-5',
        date: '2026-08-31 09:15 AM',
        author: 'Dr. Tariq Haddad, MD (Infectious Disease Specialist)',
        subjective: 'Patient reports pain has decreased from 8/10 to 4/10. Erythema is receding within the surgical ink boundary.',
        objective: 'Afebrile at 98.8°F. Leg circumference reduced by 1.5 cm at calf level. No bullae or necrotic skin breakdown.',
        assessment: 'Acute Non-Purulent Cellulitis (Right Lower Leg) - Responding to targeted therapy.',
        plan: '1. Continue PO Amoxicillin to complete 10 days total.\n2. Keep leg elevated above heart level when recumbent.\n3. Discharge planning for outpatient follow-up in 72 hours.'
      }
    ],
    diagnosticHistory: [],
    lastUpdated: '2026-08-31 09:30 AM',
    assignedDoctor: 'Dr. Tariq Haddad, MD',
    hospitalUnit: 'Inpatient Medicine Ward'
  }
];
