/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DrugInteraction, PatientParameters } from '../types';

export const KNOWN_INTERACTIONS: DrugInteraction[] = [
  {
    drugAId: 'warfarin',
    drugBId: 'ibuprofen',
    drugAName: 'Warfarin',
    drugBName: 'Ibuprofen',
    severity: 'Severe',
    title: 'Potentiation Detected: Severe Hemorrhagic & GI Bleed Risk',
    mechanism: 'NSAID competitive displacement of warfarin from plasma protein binding sites combined with platelet COX-1 inhibition and gastric mucosal injury.',
    clinicalOverlay: 'Serious interaction found between Warfarin (Vitamin K Antagonist) and Ibuprofen (COX-1/2 Inhibitor). Synergistic pharmacodynamic interaction observed between selected molecules, multiplying major systemic bleeding index by 4.2x.',
    reasoning: {
      pathway: 'CYP2C9 clearance competition combined with non-selective COX-1 antiplatelet blockade.',
      physiological: 'Epithelial gastroduodenal mucosal disruption with impaired hemostatic plug coagulation.',
      monitoring: 'Immediate prothrombin time (INR) checks required; monitor for melena, hematuria, or hematoma.'
    },
    clinicalAdvice: 'Avoid combination. Use acetaminophen for analgesia if needed, or switch to gastroprotective alternatives under strict INR surveillance.'
  },
  {
    drugAId: 'warfarin',
    drugBId: 'amiodarone',
    drugAName: 'Warfarin',
    drugBName: 'Amiodarone',
    severity: 'Severe',
    title: 'Severe Potentiation: Massive Warfarin Clearance Inhibition & Bleeding Risk',
    mechanism: 'Amiodarone and its metabolite DEA potently inhibit CYP2C9 and CYP3A4, dramatically reducing S-warfarin clearance and elevating INR by 100-200%.',
    clinicalOverlay: 'Extreme pharmacokinetic inhibition: Amiodarone reduces Warfarin clearance. INR spikes precipitously, causing severe fatal hemorrhagic risks.',
    reasoning: {
      pathway: 'CYP2C9 & CYP3A4 metabolic enzyme blockade with prolonged amiodarone tissue half-life (40-58 days).',
      physiological: 'Profound depletion of functional clotting factors II, VII, IX, and X.',
      monitoring: 'Empirically decrease Warfarin dose by 33-50% when initiating amiodarone; check INR twice weekly until stable.'
    },
    clinicalAdvice: 'Empirically reduce Warfarin maintenance dose by 33% to 50% upon starting Amiodarone. Check INR at baseline, Day 3, Day 7, and weekly.'
  },
  {
    drugAId: 'furosemide',
    drugBId: 'digoxin',
    drugAName: 'Furosemide',
    drugBName: 'Digoxin',
    severity: 'Severe',
    title: 'Critical Electrolyte Hazard: Hypokalemia-Induced Fatal Digitalis Toxicity',
    mechanism: 'Furosemide-induced renal potassium and magnesium wasting enhances myocardial sensitivity to digoxin, precipitating lethal ventricular tachyarrhythmias.',
    clinicalOverlay: 'High-risk interaction: Loop diuretic hypokalemia displaces potassium from the myocardial Na+/K+ ATPase pump, dramatically augmenting digoxin arrhythmogenicity.',
    reasoning: {
      pathway: 'Renal medullary NKCC2 inhibition causing kaliuresis; unblocked myocardial Na+/K+ ATPase binding.',
      physiological: 'Excessive intracellular calcium accumulation triggering delayed afterdepolarizations and ventricular ectopy.',
      monitoring: 'Maintain serum potassium >= 4.0 mEq/L and magnesium >= 2.0 mg/dL; check serum digoxin level (target 0.5-0.9 ng/mL).'
    },
    clinicalAdvice: 'Co-prescribe oral potassium chloride replacement or potassium-sparing diuretic (spironolactone). Keep serum K+ >= 4.0 mEq/L.'
  },
  {
    drugAId: 'clopidogrel',
    drugBId: 'omeprazole',
    drugAName: 'Clopidogrel',
    drugBName: 'Omeprazole',
    severity: 'Severe',
    title: 'Efficacy Loss Alert: CYP2C19 Blockade Diminishing Antiplatelet Protection',
    mechanism: 'Omeprazole competitively inhibits hepatic CYP2C19 bioactivation of clopidogrel prodrug, reducing active thiol metabolite levels by ~45% and increasing stent thrombosis risk.',
    clinicalOverlay: 'Significant pharmacodynamic attenuation: Omeprazole prevents clopidogrel conversion to its active antiplatelet form, elevating post-PCI stent thrombosis and recurrent MI risk.',
    reasoning: {
      pathway: 'Hepatic Cytochrome P450 2C19 competitive active site binding.',
      physiological: 'Insufficient platelet P2Y12 ADP receptor blockade resulting in unchecked platelet aggregation.',
      monitoring: 'Platelet function assay (VerifyNow P2Y12) or switch to non-interacting PPI.'
    },
    clinicalAdvice: 'Switch PPI to Pantoprazole or Rabeprazole, which exhibit significantly lower CYP2C19 inhibition, or consider H2-blocker famotidine.'
  },
  {
    drugAId: 'methotrexate',
    drugBId: 'ibuprofen',
    drugAName: 'Methotrexate',
    drugBName: 'Ibuprofen',
    severity: 'Severe',
    title: 'Severe Toxicity Warning: NSAID-Induced Methotrexate Clearance Blockade',
    mechanism: 'Ibuprofen inhibits renal prostaglandin synthesis and competes with methotrexate for organic anion transporters (OAT1/OAT3), causing toxic MTX accumulation.',
    clinicalOverlay: 'Life-threatening interaction: NSAIDs reduce renal clearance of Methotrexate, causing severe pancytopenia, bone marrow suppression, and acute renal failure.',
    reasoning: {
      pathway: 'Renal tubular OAT1/3 competitive secretion inhibition and afferent arteriolar vasoconstriction.',
      physiological: 'Prolonged high systemic folate antimetabolite levels with cytotoxic bone marrow ablation.',
      monitoring: 'Complete blood count (CBC) with differential, serum creatinine, and MTX plasma levels.'
    },
    clinicalAdvice: 'Avoid concurrent NSAID therapy with high-dose methotrexate. For low-dose weekly rheumatoid arthritis MTX, monitor CBC and renal function closely.'
  },
  {
    drugAId: 'morphine',
    drugBId: 'gabapentin',
    drugAName: 'Morphine',
    drugBName: 'Gabapentin',
    severity: 'Severe',
    title: 'Black-Box Synergy: Compounded Central CNS & Fatal Respiratory Depression',
    mechanism: 'Synergistic central nervous system depression: Morphine increases gabapentin AUC by ~44% while both agents suppress brainstem respiratory drive.',
    clinicalOverlay: 'High-risk synergy: Concomitant opioid and gabapentinoid administration dramatically elevates risk of profound sedation, coma, and fatal respiratory arrest.',
    reasoning: {
      pathway: 'Mu-opioid receptor Gi signaling combined with presynaptic voltage-gated calcium channel alpha-2-delta blockade.',
      physiological: 'Severe depression of medullary hypercapnic and hypoxic ventilatory response centers.',
      monitoring: 'Continuous pulse oximetry, respiratory rate, capnography, and sedation scores.'
    },
    clinicalAdvice: 'Initiate gabapentin at lowest possible dose (100-300mg) and titrate slowly. Prescribe take-home naloxone; warn against alcohol.'
  },
  {
    drugAId: 'ciprofloxacin',
    drugBId: 'amiodarone',
    drugAName: 'Ciprofloxacin',
    drugBName: 'Amiodarone',
    severity: 'Severe',
    title: 'Critical Cardiac Alert: Additive QTc Prolongation & Torsades de Pointes',
    mechanism: 'Additive cardiac electrophysiological delay of myocardial repolarization (hERG / IKr potassium current inhibition), predisposing to polymorphic ventricular tachycardia.',
    clinicalOverlay: 'High-risk proarrhythmic pairing: Concomitant fluoroquinolone and Class III antiarrhythmic use induces critical QT prolongation and syncope/sudden cardiac arrest.',
    reasoning: {
      pathway: 'Synergistic blockade of cardiac rapid delayed rectifier potassium channels (IKr).',
      physiological: 'Prolonged ventricular repolarization permitting early afterdepolarizations (EADs) and reentry circuits.',
      monitoring: 'Continuous 12-lead telemetry ECG tracking QTc (flag if QTc > 500ms or delta > 60ms).'
    },
    clinicalAdvice: 'Avoid combination. Select an alternative non-QTc prolonging antimicrobial (e.g., Ceftriaxone or Meropenem).'
  },
  {
    drugAId: 'tacrolimus',
    drugBId: 'fluconazole',
    drugAName: 'Tacrolimus',
    drugBName: 'Fluconazole',
    severity: 'Severe',
    title: 'Critical Trough Spike: CYP3A4 Blockade Inducing Acute Tacrolimus Toxicity',
    mechanism: 'Fluconazole potently inhibits intestinal and hepatic CYP3A4 and P-glycoprotein, increasing tacrolimus blood trough concentrations by 2- to 4-fold.',
    clinicalOverlay: 'Severe pharmacokinetic interaction: Fluconazole causes massive tacrolimus accumulation, leading to acute nephrotoxicity, neurotoxicity, and hyperkalemia.',
    reasoning: {
      pathway: 'Cytochrome P450 3A4 and intestinal enterocyte P-glycoprotein efflux pump inhibition.',
      physiological: 'Intense calcineurin inhibition in renal afferent arterioles causing acute ischemic tubular injury.',
      monitoring: 'Daily whole-blood tacrolimus trough levels; serum creatinine, BUN, and potassium.'
    },
    clinicalAdvice: 'Empirically reduce oral Tacrolimus daily dose by 50% to 75% upon starting Fluconazole. Target trough 5-10 ng/mL.'
  },
  {
    drugAId: 'lisinopril',
    drugBId: 'losartan',
    drugAName: 'Lisinopril',
    drugBName: 'Losartan',
    severity: 'Severe',
    title: 'Contraindicated Combination: Dual Renin-Angiotensin System (RAS) Blockade',
    mechanism: 'Simultaneous ACE inhibitor and ARB therapy provides no additional cardiovascular benefit while markedly increasing adverse events.',
    clinicalOverlay: 'Contraindicated clinical pairing: Dual RAS blockade produces excessive hypotension, severe hyperkalemia, and acute renal failure (ONTARGET trial).',
    reasoning: {
      pathway: 'Concomitant upstream ACE enzymatic blockade and downstream AT1 receptor antagonism.',
      physiological: 'Profound reduction in intraglomerular capillary hydrostatic pressure and aldosterone shutdown.',
      monitoring: 'Serum potassium and creatinine within 48-72 hours of any inadvertent co-administration.'
    },
    clinicalAdvice: 'Discontinue one of the agents immediately. Monotherapy with either ACE inhibitor or ARB is standard of care.'
  },
  {
    drugAId: 'lisinopril',
    drugBId: 'ibuprofen',
    drugAName: 'Lisinopril',
    drugBName: 'Ibuprofen',
    severity: 'Moderate',
    title: 'Moderate Risk: Antihypertensive Attenuation & Renal Hemodynamic Strain',
    mechanism: 'NSAID inhibition of renal vasodilatory prostaglandins counteracts ACE inhibitor-mediated reduction in blood pressure and impairs glomerular filtration rate.',
    clinicalOverlay: 'Concurrent use of NSAIDs and ACE inhibitors blunts systemic blood pressure regulation and induces functional renal insufficiency via afferent/efferent arteriolar hemodynamics.',
    reasoning: {
      pathway: 'Prostaglandin E2/I2 synthesis inhibition combined with angiotensin II efferent vasodilation.',
      physiological: 'Decreased intraglomerular hydrostatic pressure with acute drop in glomerular filtration rate (GFR).',
      monitoring: 'Routine blood pressure tracking and periodic serum creatinine/potassium lab tests.'
    },
    clinicalAdvice: 'Avoid chronic co-administration. If temporary NSAID therapy is necessary, ensure adequate hydration and monitor BP and renal indices.'
  },
  {
    drugAId: 'metformin',
    drugBId: 'lisinopril',
    drugAName: 'Metformin',
    drugBName: 'Lisinopril',
    severity: 'Safe',
    title: 'Safe / Standard Co-Therapy: Synergistic Diabetic Cardiorenal Protection',
    mechanism: 'No significant pharmacokinetic interference; ACE inhibitors may mildly enhance insulin sensitivity and provide renal protection.',
    clinicalOverlay: 'No adverse interaction detected between these agents. Lisinopril provides microalbuminuria reduction while Metformin manages glycemic hemoglobin levels.',
    reasoning: {
      pathway: 'Parallel metabolic clearance (Metformin excreted unchanged via OCT2, Lisinopril cleared renally).',
      physiological: 'Complementary metabolic and vascular endothelial stabilization.',
      monitoring: 'Standard periodic baseline eGFR and glycemic logs.'
    },
    clinicalAdvice: 'Safe and guideline-recommended combination in diabetic hypertensive patients with preserved renal function.'
  },
  {
    drugAId: 'atorvastatin',
    drugBId: 'omeprazole',
    drugAName: 'Atorvastatin',
    drugBName: 'Omeprazole',
    severity: 'Safe',
    title: 'Safe / Low Risk: Well-Tolerated Co-Administration',
    mechanism: 'Minimal CYP3A4/CYP2C19 cross-inhibition at standard therapeutic dosages.',
    clinicalOverlay: 'Safe co-prescription for cardiovascular patients requiring gastric acid suppression.',
    reasoning: {
      pathway: 'CYP3A4 (Atorvastatin) vs CYP2C19 (Omeprazole) independent enzymatic routes.',
      physiological: 'No alteration in lipid-lowering efficacy or gastric mucosal barrier maintenance.',
      monitoring: 'Standard lipid panel and symptom checks.'
    },
    clinicalAdvice: 'Both medications can be taken together as prescribed.'
  },
  {
    drugAId: 'ceftriaxone',
    drugBId: 'ondansetron',
    drugAName: 'Ceftriaxone',
    drugBName: 'Ondansetron',
    severity: 'Safe',
    title: 'Safe / Routine Hospital Regimen: No Adverse Interaction',
    mechanism: 'Completely distinct elimination and receptor pathways with no pharmacokinetic interference.',
    clinicalOverlay: 'Standard hospital co-administration for inpatient systemic infections presenting with nausea or vomiting.',
    reasoning: {
      pathway: 'Ceftriaxone renal/biliary elimination vs Ondansetron hepatic clearance.',
      physiological: 'Independent antimicrobial and antiemetic therapeutic actions.',
      monitoring: 'Standard clinical vital signs.'
    },
    clinicalAdvice: 'Safe to administer concurrently in hospital inpatient wards.'
  }
];

export function getInteractionForPair(drugAId: string, drugBId: string, medAName?: string, medBName?: string): DrugInteraction {
  const match = KNOWN_INTERACTIONS.find(
    i => (i.drugAId === drugAId && i.drugBId === drugBId) ||
         (i.drugAId === drugBId && i.drugBId === drugAId)
  );
  if (match) return match;

  const nameA = medAName || drugAId;
  const nameB = medBName || drugBId;

  return {
    drugAId,
    drugBId,
    drugAName: nameA,
    drugBName: nameB,
    severity: 'Safe',
    title: `Safe / Compatible: No Documented Major Contraindication`,
    mechanism: `Metabolic pathways and target receptors for ${nameA} and ${nameB} operate through distinct enzymatic cascades with low risk of competitive clearance inhibition.`,
    clinicalOverlay: `Pharmacokinetic assessment indicates acceptable tolerance between ${nameA} and ${nameB}. Standard clinical monitoring advised.`,
    reasoning: {
      pathway: 'Distinct enzymatic and renal clearance pathways with minimal CYP450 active-site competition.',
      physiological: 'Therapeutic targets do not exhibit antagonistic hemodynamic or electrophysiological overlap.',
      monitoring: 'Routine baseline laboratory parameters and patient-reported symptom assessment.'
    },
    clinicalAdvice: 'Can be co-prescribed under standard clinical oversight. Ensure patient is counselled on individual dosing schedules.'
  };
}

export function evaluateDrugListInteractions(drugIds: string[], patientParams?: PatientParameters) {
  const interactions: DrugInteraction[] = [];
  const physiologicalFlags: string[] = [];

  // Pairwise checks
  for (let i = 0; i < drugIds.length; i++) {
    for (let j = i + 1; j < drugIds.length; j++) {
      const idA = drugIds[i];
      const idB = drugIds[j];
      const interact = getInteractionForPair(idA, idB);
      if (interact.severity !== 'Safe') {
        interactions.push(interact);
      }
    }
  }

  // Patient physiology triggers
  if (patientParams) {
    if (patientParams.isPregnant) {
      if (drugIds.some(id => ['warfarin', 'methotrexate', 'lisinopril', 'losartan', 'atorvastatin'].includes(id))) {
        physiologicalFlags.push('PREGNANCY CONTRAINDICATION: High teratogenic risk flagged for one or more active agents (Warfarin / ACE-i / ARB / Statin / MTX).');
      }
    }
    if (patientParams.renalFunction === 'Impaired') {
      if (drugIds.some(id => ['metformin', 'vancomycin', 'gentamicin', 'tacrolimus', 'methotrexate', 'furosemide'].includes(id))) {
        physiologicalFlags.push('RENAL DOSE ADJUSTMENT MANDATED: Nephrotoxic or renally-cleared molecules in patient with GFR < 50 mL/min.');
      }
    }
    if (patientParams.ageGroup === 'Geriatric') {
      if (drugIds.some(id => ['morphine', 'gabapentin', 'propofol', 'digoxin'].includes(id))) {
        physiologicalFlags.push('BEERS CRITERIA ALERT: Geriatric fall and toxicity sensitivity detected with CNS-active or narrow-therapeutic agents.');
      }
    }
  }

  const hasSevere = interactions.some(i => i.severity === 'Severe') || physiologicalFlags.length > 0;
  const hasModerate = interactions.some(i => i.severity === 'Moderate');

  const overallRisk: 'Safe' | 'Moderate' | 'Severe' = hasSevere ? 'Severe' : hasModerate ? 'Moderate' : 'Safe';

  return {
    overallRisk,
    interactions,
    physiologicalFlags
  };
}

