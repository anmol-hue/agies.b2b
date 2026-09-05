/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Medicine } from '../types';

export const MEDICINES: Medicine[] = [
  {
    id: 'amoxicillin',
    name: 'Amoxicillin Trihydrate',
    genericName: 'Amoxicillin',
    brandNames: ['Amoxil', 'Trimox', 'Moxatag'],
    category: 'Antibiotic',
    dosage: '500mg - 875mg twice daily',
    dosageSchedule: 'Standard clinical course duration: 7 to 10 days for systemic bacterial clearance.',
    indications: 'Bacterial Otitis Media, Respiratory tract infections, Streptococcal pharyngitis, skin and soft tissue infections.',
    contraindications: 'Hypersensitivity to Beta-lactams, severe penicillin allergies, infectious mononucleosis.',
    sideEffects: [
      { name: 'Diarrhea', percentage: 10 },
      { name: 'Rash', percentage: 6 },
      { name: 'Nausea', percentage: 12 },
      { name: 'Headache', percentage: 4 }
    ],
    efficacy: 'Bactericidal clinical resolution for susceptible otitis media, sinusitis, and respiratory infections (FDA/CLSI)',
    fullDescription: 'Broad-spectrum penicillin antibiotic engineered for clinical respiratory and systemic indications. Inhibits bacterial cell wall synthesis during active multiplication by binding to penicillin-binding proteins (PBPs).',
    chemicalFormula: 'C16H19N3O5S',
    molarMass: '365.40 g/mol',
    iupacName: '(2S,5R,6R)-6-[[(2R)-2-amino-2-(4-hydroxyphenyl)acetyl]amino]-3,3-dimethyl-7-oxo-4-thia-1-azabicyclo[3.2.0]heptane-2-carboxylic acid',
    mechanismOfAction: 'Inhibits cross-linking of peptidoglycan chains in bacterial cell wall by acetylating transpeptidase enzymes.',
    targetReceptors: ['Penicillin-Binding Protein 1A (PBP-1A)', 'PBP-2', 'Transpeptidase active site'],
    organDistribution: {
      primaryTarget: 'Extracellular respiratory & systemic bacterial sites',
      metabolismOrgan: 'Liver (minor hepatic hydrolysis ~10%)',
      eliminationRoute: 'Kidneys (60-80% active unchanged excretion)'
    },
    pharmacology: {
      metabolism: 'Hepatic ~10%',
      halfLife: '1.0 - 1.5 hours',
      clearance: 'Renal (60-80% unchanged in urine)',
      peakPlasma: '1 - 2 hours post-dose',
      bioavailability: '74 - 92%'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'White/Pink',
      imprint: 'AMOX 500',
      score: 'None',
      matchPct: 98.4,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#f43f5e'
    },
    safetyWarnings: [
      'Discontinue immediately if skin rash, urticaria, or facial angioedema appear',
      'Finish full therapeutic course even if symptoms resolve quickly to avoid resistance',
      'May decrease oral contraceptive efficacy'
    ],
    foodInteractions: 'Can be taken with or without food. Taking with meals minimizes gastrointestinal distress.',
    renalDosing: 'GFR 10-30 mL/min: 250-500mg q12h. GFR <10 mL/min: 250-500mg q24h.',
    pregnancyRisk: 'Safe',
    atcCode: 'J01CA04'
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    brandNames: ['Advil', 'Motrin', 'Nurofen'],
    category: 'NSAID',
    dosage: '200mg - 400mg every 4-6 hours (Max 1200mg OTC / 2400mg Rx)',
    dosageSchedule: 'Take as needed for pain or fever. Limit consecutive use to under 10 days unless clinically monitored.',
    indications: 'Systemic pain, inflammatory reactions, rheumatoid arthritis, osteoarthritis, primary dysmenorrhea, antipyretic fever reduction.',
    contraindications: 'Active peptic ulcer, third trimester pregnancy, severe renal impairment, CABG peri-operative pain.',
    sideEffects: [
      { name: 'Nausea', percentage: 10 },
      { name: 'Dyspepsia', percentage: 7 },
      { name: 'Headache', percentage: 5 },
      { name: 'Dizziness', percentage: 3 }
    ],
    efficacy: 'Significant reduction in inflammatory pain score and thermal fever curves (FDA Monograph)',
    fullDescription: 'Non-steroidal anti-inflammatory drug (NSAID) with analgesic, antipyretic, and anti-inflammatory properties via non-selective COX-1/COX-2 inhibition.',
    chemicalFormula: 'C13H18O2',
    molarMass: '206.28 g/mol',
    iupacName: '(2RS)-2-[4-(2-methylpropyl)phenyl]propanoic acid',
    mechanismOfAction: 'Reversibly inhibits cyclooxygenase-1 and 2 enzymes, halting downstream synthesis of inflammatory prostaglandins and thromboxanes.',
    targetReceptors: ['Cyclooxygenase-1 (COX-1)', 'Cyclooxygenase-2 (COX-2)'],
    organDistribution: {
      primaryTarget: 'Synovial fluid, peripheral inflammatory foci, hypothalamic thermoregulatory center',
      metabolismOrgan: 'Liver (CYP2C9 / CYP2C8 oxidation to hydroxy and carboxy metabolites)',
      eliminationRoute: 'Kidneys (90% inactive metabolites in urine)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP2C9',
      halfLife: '1.8 - 2.0 hours',
      clearance: 'Renal (90% inactive metabolites)',
      peakPlasma: '1 - 2 hours (oral)',
      bioavailability: '80 - 100%'
    },
    visualPill: {
      shape: 'Round',
      color: 'Orange',
      imprint: 'IBU 200',
      score: 'None',
      matchPct: 96.2,
      svgColorPrimary: '#f97316'
    },
    safetyWarnings: [
      'Increases risk of gastrointestinal ulceration, perforation, and bleeding',
      'May elevate cardiovascular thrombotic event risks (MI, stroke)',
      'Avoid combining with other NSAIDs or anticoagulants without strict monitoring'
    ],
    foodInteractions: 'Administer with food or milk to decrease gastrointestinal mucosal irritation.',
    renalDosing: 'Avoid if eGFR <30 mL/min due to acute prostaglandin-mediated renal vasoconstriction.',
    pregnancyRisk: 'Contraindicated',
    blackBoxWarning: 'Cardiovascular thrombotic risk & Gastrointestinal bleeding/perforation',
    atcCode: 'M01AE01'
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin Calcium',
    genericName: 'Atorvastatin',
    brandNames: ['Lipitor', 'Torvast', 'Atorva'],
    category: 'Statin',
    dosage: '10mg - 80mg once daily',
    dosageSchedule: 'Standard daily administration: Take once daily in the evening or at consistent time with or without meals.',
    indications: 'Hypercholesterolemia, primary prevention of cardiovascular events, dyslipidemia, atherosclerotic cardiovascular disease (ASCVD).',
    contraindications: 'Active liver disease, unexplained persistent elevations of hepatic transaminases, pregnancy and lactation.',
    sideEffects: [
      { name: 'Myalgia / Muscle Pain', percentage: 8 },
      { name: 'Diarrhea', percentage: 5 },
      { name: 'Arthralgia', percentage: 4 },
      { name: 'Nasopharyngitis', percentage: 4 }
    ],
    efficacy: '40-60% LDL-C reduction across clinical trials',
    fullDescription: 'Potent synthetic HMG-CoA reductase competitive inhibitor. Halts rate-limiting de novo hepatic cholesterol synthesis and upregulates hepatic LDL surface receptors.',
    chemicalFormula: 'C33H35FN2O5',
    molarMass: '558.64 g/mol',
    iupacName: '(3R,5R)-7-[2-(4-fluorophenyl)-3-phenyl-4-(phenylcarbamoyl)-5-propan-2-ylpyrrol-1-yl]-3,5-dihydroxyheptanoic acid',
    mechanismOfAction: 'Competitively inhibits 3-hydroxy-3-methylglutaryl-coenzyme A (HMG-CoA) reductase, increasing clearance of circulating LDL particles.',
    targetReceptors: ['HMG-CoA Reductase catalytic domain', 'Hepatic LDL Receptors (upregulated)'],
    organDistribution: {
      primaryTarget: 'Hepatic parenchyma hepatocytes & vascular endothelium',
      metabolismOrgan: 'Liver (predominantly via Cytochrome P450 CYP3A4)',
      eliminationRoute: 'Biliary / Fecal (>98% eliminated in feces, <2% urinary)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4 substrate',
      halfLife: '14 hours (active metabolites 20-30 hours)',
      clearance: 'Biliary / Fecal (>98%)',
      peakPlasma: '1 - 2 hours',
      bioavailability: '14% (extensive first-pass hepatic extraction)'
    },
    visualPill: {
      shape: 'Oval',
      color: 'White',
      imprint: 'ATV 20',
      score: 'None',
      matchPct: 99.1,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Report unexplained muscle tenderness, weakness, or dark tea-colored urine immediately (Rhabdomyolysis)',
      'Avoid consuming large quantities of grapefruit juice (>1 quart/day) due to CYP3A4 inhibition',
      'Check baseline and symptomatic liver function tests (LFTs)'
    ],
    foodInteractions: 'Avoid grapefruit juice which significantly raises systemic statin plasma concentrations.',
    renalDosing: 'No dosage adjustments required for renal impairment.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'C10AA05'
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril Dihydrate',
    genericName: 'Lisinopril',
    brandNames: ['Prinivil', 'Zestril', 'Qbrelis'],
    category: 'ACE Inhibitor',
    dosage: '10mg - 40mg once daily',
    dosageSchedule: 'Daily dosing in morning. Titrate upward every 1-2 weeks based on clinical blood pressure targets.',
    indications: 'Essential hypertension, heart failure with reduced ejection fraction (HFrEF), post-myocardial infarction mortality reduction.',
    contraindications: 'History of ACE inhibitor-induced angioedema, bilateral renal artery stenosis, pregnancy (fetal toxicity).',
    sideEffects: [
      { name: 'Dry Persistent Cough', percentage: 12 },
      { name: 'Dizziness / Orthostasis', percentage: 6 },
      { name: 'Hyperkalemia', percentage: 4 },
      { name: 'Headache', percentage: 5 }
    ],
    efficacy: 'Significant reduction in systemic vascular resistance and cardiovascular mortality',
    fullDescription: 'Long-acting, non-sulfhydryl Angiotensin-Converting Enzyme (ACE) inhibitor that blocks conversion of Angiotensin I to the potent vasoconstrictor Angiotensin II.',
    chemicalFormula: 'C21H31N3O5',
    molarMass: '405.49 g/mol',
    iupacName: '(2S)-1-[(2S)-6-amino-2-[[(1S)-1-carboxy-3-phenylpropyl]amino]hexanoyl]pyrrolidine-2-carboxylic acid',
    mechanismOfAction: 'Inhibits ACE enzyme, decreasing circulating Angiotensin II, attenuating aldosterone secretion, and preventing bradykinin degradation.',
    targetReceptors: ['Angiotensin Converting Enzyme (ACE) catalytic zinc cleft'],
    organDistribution: {
      primaryTarget: 'Vascular endothelium, juxtaglomerular renal apparatus, myocardial tissue',
      metabolismOrgan: 'Not metabolized (excreted completely unchanged)',
      eliminationRoute: 'Kidneys (90-95% excreted unchanged by glomerular filtration)'
    },
    pharmacology: {
      metabolism: 'None (not metabolized)',
      halfLife: '12 hours',
      clearance: 'Renal (90-95% unchanged in urine)',
      peakPlasma: '6 - 8 hours',
      bioavailability: '25% (oral)'
    },
    visualPill: {
      shape: 'Round',
      color: 'Pink',
      imprint: 'LIS 10',
      score: 'Single',
      matchPct: 97.3,
      svgColorPrimary: '#f43f5e'
    },
    safetyWarnings: [
      'Stop immediately and seek emergency medical care if facial swelling, lips, tongue or throat swelling occurs (Angioedema)',
      'Monitor serum potassium and creatinine before and within 2 weeks of initiation',
      'Avoid high-potassium salt substitutes without physician consultation'
    ],
    foodInteractions: 'Can be taken without regard to meals.',
    renalDosing: 'GFR 10-30 mL/min: Initial dose 5mg/day. GFR <10 mL/min: Initial dose 2.5mg/day.',
    pregnancyRisk: 'Contraindicated',
    blackBoxWarning: 'Fetal Toxicity: Discontinue as soon as pregnancy is detected.',
    atcCode: 'C09AA03'
  },
  {
    id: 'metformin',
    name: 'Metformin Hydrochloride',
    genericName: 'Metformin',
    brandNames: ['Glucophage', 'Fortamet', 'Riomet'],
    category: 'Anti-Diabetic',
    dosage: '500mg - 1000mg twice daily with meals (Max 2550mg/day)',
    dosageSchedule: 'Take with morning and evening meals to minimize gastrointestinal discomfort.',
    indications: 'Type 2 Diabetes Mellitus glycemic control, prediabetes, Polycystic Ovary Syndrome (PCOS) off-label.',
    contraindications: 'Severe renal dysfunction (eGFR <30 mL/min), acute metabolic acidosis, shock, severe hypoxia.',
    sideEffects: [
      { name: 'Diarrhea / Loose Stools', percentage: 25 },
      { name: 'Nausea / Vomiting', percentage: 15 },
      { name: 'Abdominal Flatulence', percentage: 12 },
      { name: 'Metallic Taste', percentage: 3 }
    ],
    efficacy: '1.0-1.5% reduction in baseline HbA1c without hypoglycemia risk',
    fullDescription: 'First-line oral biguanide antihyperglycemic agent that suppresses hepatic gluconeogenesis, reduces intestinal glucose absorption, and boosts peripheral insulin sensitivity.',
    chemicalFormula: 'C4H11N5',
    molarMass: '129.16 g/mol',
    iupacName: '1-carbamimidamido-N,N-dimethylmethanimidamide',
    mechanismOfAction: 'Activates AMP-activated protein kinase (AMPK) in hepatocytes, blocking transcription of gluconeogenic genes and mitochondrial respiration.',
    targetReceptors: ['Mitochondrial Complex I', 'AMP-Activated Protein Kinase (AMPK)'],
    organDistribution: {
      primaryTarget: 'Hepatic parenchyma, skeletal muscle beds, intestinal enterocytes',
      metabolismOrgan: 'Negligible hepatic metabolism',
      eliminationRoute: 'Kidneys (tubular secretion via OCT2/MATE transporters)'
    },
    pharmacology: {
      metabolism: 'Not metabolized by liver',
      halfLife: '6.2 hours (plasma)',
      clearance: 'Renal (tubular secretion via OCT2 transporters)',
      peakPlasma: '2.5 hours',
      bioavailability: '50 - 60%'
    },
    visualPill: {
      shape: 'Oblong',
      color: 'White',
      imprint: 'MET 500',
      score: 'Single',
      matchPct: 98.0,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Risk of rare but fatal Lactic Acidosis in severe dehydration, renal failure, or sepsis',
      'Hold 48 hours prior to and after iodinated radiocontrast procedures in patients with eGFR 30-60',
      'Long-term use may cause Vitamin B12 deficiency; monitor annual CBC and B12 levels'
    ],
    foodInteractions: 'Always take with food to minimize nausea and diarrhea.',
    renalDosing: 'eGFR 45-59: Max 1000mg/day. eGFR 30-44: Max 500mg/day. eGFR <30: Contraindicated.',
    pregnancyRisk: 'Safe',
    blackBoxWarning: 'Lactic Acidosis: Risk increases with renal impairment, sepsis, and alcohol intoxication.',
    atcCode: 'A10BA02'
  },
  {
    id: 'salbutamol',
    name: 'Salbutamol Sulfate (Albuterol)',
    genericName: 'Albuterol',
    brandNames: ['Ventolin', 'ProAir', 'Proventil'],
    category: 'Respiratory',
    dosage: '90mcg - 180mcg (1-2 puffs) every 4-6 hours PRN',
    dosageSchedule: 'Inhale 1-2 puffs 15-30 minutes before exercise or as needed for acute bronchospasm relief.',
    indications: 'Acute bronchospasm, asthma exacerbation, chronic obstructive pulmonary disease (COPD), exercise-induced bronchoconstriction.',
    contraindications: 'Hypersensitivity to albuterol or inhaled formulation propellant.',
    sideEffects: [
      { name: 'Tremor / Jitteriness', percentage: 14 },
      { name: 'Tachycardia / Palpitations', percentage: 10 },
      { name: 'Nervousness', percentage: 8 },
      { name: 'Throat Irritation', percentage: 5 }
    ],
    efficacy: 'Rapid bronchodilation within 5 minutes lasting 4-6 hours',
    fullDescription: 'Short-acting selective Beta-2 adrenergic receptor agonist (SABA) that stimulates adenylyl cyclase, elevating intracellular cAMP and relaxing bronchial smooth muscle.',
    chemicalFormula: 'C13H21NO3',
    molarMass: '239.31 g/mol',
    iupacName: '4-[2-(tert-butylamino)-1-hydroxyethyl]-2-(hydroxymethyl)phenol',
    mechanismOfAction: 'Selectively binds Beta-2 adrenergic receptors on bronchial smooth muscle, activating Gs protein and adenylyl cyclase.',
    targetReceptors: ['Beta-2 Adrenergic Receptors (airway smooth muscle)'],
    organDistribution: {
      primaryTarget: 'Bronchial and bronchiolar smooth muscle airway trees',
      metabolismOrgan: 'Liver & gastrointestinal tract (sulfotransferase conjugations)',
      eliminationRoute: 'Kidneys (80% metabolites and parent drug)'
    },
    pharmacology: {
      metabolism: 'Hepatic to inactive sulfate conjugate',
      halfLife: '3.8 - 5.0 hours',
      clearance: 'Renal (80-100% in urine within 72h)',
      peakPlasma: '0.5 - 2.0 hours (systemic absorption from lungs/GI)',
      bioavailability: 'Systemic absorption ~50%'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Blue',
      imprint: 'VENT 100',
      score: 'None',
      matchPct: 95.8,
      svgColorPrimary: '#0284c7'
    },
    safetyWarnings: [
      'Excessive use (>2 canisters/month) indicates poorly controlled asthma requiring inhaled corticosteroid adjustment',
      'High doses may induce transient hypokalemia and cardiac arrhythmias in susceptible individuals',
      'Prime inhaler if unused for >2 weeks or dropped'
    ],
    foodInteractions: 'No significant food interactions.',
    renalDosing: 'No adjustment required for intermittent inhaled therapy.',
    pregnancyRisk: 'Safe',
    atcCode: 'R03AC02'
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole Magnesium',
    genericName: 'Omeprazole',
    brandNames: ['Prilosec', 'Losec', 'Omesec'],
    category: 'Proton Pump Inhibitor',
    dosage: '20mg - 40mg once daily in morning',
    dosageSchedule: 'Take 30-60 minutes before breakfast on an empty stomach for maximum parietal cell inhibition.',
    indications: 'Gastroesophageal Reflux Disease (GERD), erosive esophagitis, duodenal/gastric ulcers, Zollinger-Ellison syndrome, H. pylori eradication.',
    contraindications: 'Known hypersensitivity to substituted benzimidazoles, concurrent rilpivirine use.',
    sideEffects: [
      { name: 'Headache', percentage: 7 },
      { name: 'Abdominal Pain', percentage: 5 },
      { name: 'Diarrhea', percentage: 4 },
      { name: 'Nausea', percentage: 3 }
    ],
    efficacy: '>90% gastric acid suppression and mucosal healing',
    fullDescription: 'Substituted benzimidazole proton pump inhibitor (PPI) that irreversibly inhibits the gastric parietal cell H+/K+ ATPase enzyme system.',
    chemicalFormula: 'C17H19N3O3S',
    molarMass: '345.42 g/mol',
    iupacName: '6-methoxy-2-[(4-methoxy-3,5-dimethylpyridin-2-yl)methylsulfinyl]-1H-benzimidazole',
    mechanismOfAction: 'Protonated in acidic secretory canaliculi of parietal cells to active sulfenamide, forming covalent disulfide bonds with H+/K+ ATPase pump.',
    targetReceptors: ['Gastric Parietal Cell H+/K+ ATPase Enzyme System'],
    organDistribution: {
      primaryTarget: 'Gastric fundic mucosa parietal cell canaliculi',
      metabolismOrgan: 'Liver (extensively by CYP2C19 and CYP3A4)',
      eliminationRoute: 'Kidneys (77% as urinary metabolites), feces (16-19%)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP2C19 (major) and CYP3A4',
      halfLife: '0.5 - 1.0 hour (biological antisecretory duration >24h)',
      clearance: 'Renal metabolites (77%), Fecal (16-19%)',
      peakPlasma: '0.5 - 3.5 hours',
      bioavailability: '30 - 40% (increases to 60% on repeat dosing)'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Purple',
      imprint: 'PRIL 20',
      score: 'None',
      matchPct: 97.8,
      svgColorPrimary: '#7c3aed'
    },
    safetyWarnings: [
      'Chronic use (>1 year) linked to hypomagnesemia, vitamin B12 malabsorption, and increased fracture risk',
      'Increases risk of Clostridioides difficile-associated diarrhea',
      'Inhibits CYP2C19, significantly reducing antiplatelet activation of clopidogrel'
    ],
    foodInteractions: 'Must be taken 30-60 minutes before meals for optimal antisecretory efficacy.',
    renalDosing: 'No dose adjustment required.',
    pregnancyRisk: 'Safe',
    atcCode: 'A02BC01'
  },
  {
    id: 'gabapentin',
    name: 'Gabapentin',
    genericName: 'Gabapentin',
    brandNames: ['Neurontin', 'Gralise', 'Horizant'],
    category: 'Neuropathic',
    dosage: '300mg - 1200mg three times daily (Max 3600mg/day)',
    dosageSchedule: 'Titrate starting at 300mg bedtime on Day 1, 300mg BID on Day 2, 300mg TID on Day 3.',
    indications: 'Postherpetic neuralgia, diabetic peripheral neuropathy, focal onset seizures (adjunctive), restless legs syndrome.',
    contraindications: 'Hypersensitivity to gabapentin.',
    sideEffects: [
      { name: 'Somnolence / Drowsiness', percentage: 21 },
      { name: 'Dizziness / Ataxia', percentage: 18 },
      { name: 'Peripheral Edema', percentage: 8 },
      { name: 'Fatigue', percentage: 11 }
    ],
    efficacy: 'Significant reduction in mean pain intensity and seizure frequency',
    fullDescription: 'Structural analog of GABA that binds with high affinity to the alpha-2-delta subunit of voltage-gated calcium channels in presynaptic CNS neurons, decreasing excitatory neurotransmitter release.',
    chemicalFormula: 'C9H17NO2',
    molarMass: '171.24 g/mol',
    iupacName: '2-[1-(aminomethyl)cyclohexyl]acetic acid',
    mechanismOfAction: 'Modulates presynaptic voltage-gated calcium influx via alpha-2-delta-1 subunit, suppressing glutamate, substance P, and norepinephrine release.',
    targetReceptors: ['Voltage-Gated Calcium Channel Alpha-2-Delta-1 Subunit'],
    organDistribution: {
      primaryTarget: 'Central and peripheral presynaptic nervous system terminals',
      metabolismOrgan: 'Not metabolized in humans',
      eliminationRoute: 'Kidneys (90-95% excreted unchanged in urine)'
    },
    pharmacology: {
      metabolism: 'None (not metabolized)',
      halfLife: '5.0 - 7.0 hours',
      clearance: 'Renal (90-95% unchanged in urine)',
      peakPlasma: '2 - 3 hours',
      bioavailability: '60% at 300mg dose, decreases to ~35% at higher doses due to saturable L-amino acid transport'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Yellow',
      imprint: 'GAB 300',
      score: 'None',
      matchPct: 98.9,
      svgColorPrimary: '#eab308'
    },
    safetyWarnings: [
      'Do not abruptly discontinue; taper over at least 1 week to avoid withdrawal seizures or rebound neuralgia',
      'Synergistic CNS and fatal respiratory depression when combined with opioid analgesics',
      'Dose must be strictly reduced in renal insufficiency'
    ],
    foodInteractions: 'Can be taken with or without food. Avoid alcohol due to extreme sedation.',
    renalDosing: 'CrCl 30-59: 200-700mg BID. CrCl 15-29: 200-700mg once daily. CrCl <15: 100-300mg once daily.',
    pregnancyRisk: 'Caution',
    atcCode: 'N02BF01'
  },
  {
    id: 'warfarin',
    name: 'Warfarin Sodium',
    genericName: 'Warfarin',
    brandNames: ['Coumadin', 'Jantoven', 'Marevan'],
    category: 'Anticoagulant',
    dosage: '2mg - 10mg once daily (Titrated to target INR 2.0 - 3.0)',
    dosageSchedule: 'Take once daily at the same time in evening. Adjust dose based on regular prothrombin time (PT/INR) laboratory assays.',
    indications: 'Prophylaxis and treatment of venous thromboembolism (DVT/PE), thromboembolic complications associated with atrial fibrillation and mechanical heart valve replacement.',
    contraindications: 'Active major hemorrhage, pregnancy, hemorrhagic tendencies, recent eye/brain/spinal cord surgery, malignant hypertension.',
    sideEffects: [
      { name: 'Major / Minor Bleeding', percentage: 15 },
      { name: 'Ecchymosis / Bruising', percentage: 22 },
      { name: 'Hematuria', percentage: 4 },
      { name: 'Skin Necrosis (Rare)', percentage: 0.1 }
    ],
    efficacy: '64% stroke risk reduction in non-valvular atrial fibrillation',
    fullDescription: 'Vitamin K antagonist oral anticoagulant that inhibits the vitamin K epoxide reductase (VKORC1) complex, depleting functional coagulation factors II, VII, IX, and X.',
    chemicalFormula: 'C19H16O4',
    molarMass: '308.33 g/mol',
    iupacName: '4-hydroxy-3-(3-oxo-1-phenylbutyl)chromen-2-one',
    mechanismOfAction: 'Inhibits Vitamin K Epoxide Reductase Complex 1 (VKORC1), blocking gamma-carboxylation of glutamic acid residues in clotting factors II, VII, IX, X and proteins C/S.',
    targetReceptors: ['Vitamin K Epoxide Reductase Complex 1 (VKORC1)'],
    organDistribution: {
      primaryTarget: 'Hepatic microsomal coagulation factor synthesizing apparatus & circulating plasma proteins (99% bound)',
      metabolismOrgan: 'Liver (S-enantiomer via CYP2C9; R-enantiomer via CYP3A4, CYP1A2)',
      eliminationRoute: 'Renal (92% inactive metabolites)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP2C9 (S-warfarin, 5x more potent) & CYP3A4 (R-warfarin)',
      halfLife: '20 - 60 hours (mean 40 hours)',
      clearance: 'Renal (92% as metabolites)',
      peakPlasma: '2 - 4 hours (pharmacodynamic effect peaks 72-96h)',
      bioavailability: '99%'
    },
    visualPill: {
      shape: 'Round',
      color: 'Pink',
      imprint: 'WAR 5',
      score: 'Single',
      matchPct: 99.5,
      svgColorPrimary: '#f43f5e'
    },
    safetyWarnings: [
      'High risk of fatal bleeding. Strict compliance and routine INR monitoring mandatory',
      'Extensive dietary and drug interactions. Maintain consistent daily intake of Vitamin K-rich green vegetables',
      'Antidote: Vitamin K1 (Phytonadione), 4-factor Prothrombin Complex Concentrate (4F-PCC)'
    ],
    foodInteractions: 'Keep dietary Vitamin K (spinach, kale, broccoli) strictly consistent. Avoid cranberry juice and alcohol.',
    renalDosing: 'No initial adjustment required; monitor INR more frequently.',
    pregnancyRisk: 'Contraindicated',
    blackBoxWarning: 'Major or Fatal Bleeding: Regular monitoring of INR required.',
    atcCode: 'B01AA03'
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine Besylate',
    genericName: 'Amlodipine',
    brandNames: ['Norvasc', 'Istin', 'Amlor'],
    category: 'Calcium Channel Blocker',
    dosage: '2.5mg - 10mg once daily',
    dosageSchedule: 'Take once daily at any time with or without meals. Max 10mg daily.',
    indications: 'Essential hypertension, chronic stable angina pectoris, vasospastic (Prinzmetal) angina, coronary artery disease.',
    contraindications: 'Severe hypotension, cardiogenic shock, severe aortic stenosis.',
    sideEffects: [
      { name: 'Peripheral Ankle Edema', percentage: 11 },
      { name: 'Dizziness', percentage: 4 },
      { name: 'Flushing', percentage: 3 },
      { name: 'Palpitations', percentage: 2 }
    ],
    efficacy: 'Potent 24-hour peripheral vasodilation and afterload reduction',
    fullDescription: 'Long-acting dihydropyridine calcium channel blocker that inhibits transmembrane influx of extracellular calcium ions into vascular smooth muscle and cardiac myocytes.',
    chemicalFormula: 'C20H25ClN2O5',
    molarMass: '408.88 g/mol',
    iupacName: '3-O-ethyl 5-O-methyl 2-(2-aminoethoxymethyl)-4-(2-chlorophenyl)-6-methyl-1,4-dihydropyridine-3,5-dicarboxylate',
    mechanismOfAction: 'Selectively blocks L-type voltage-sensitive calcium channels in arterial smooth muscle, inducing sustained peripheral and coronary vasodilation.',
    targetReceptors: ['L-Type Voltage-Gated Calcium Channels (Cav1.2)'],
    organDistribution: {
      primaryTarget: 'Peripheral arterial vascular smooth muscle and coronary vasculature',
      metabolismOrgan: 'Liver (slowly and extensively via CYP3A4)',
      eliminationRoute: 'Kidneys (60% metabolites), feces (20-25%)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4 substrate (extensively converted to inactive pyridine metabolites)',
      halfLife: '30 - 50 hours (prolonged duration allows once-daily dosing)',
      clearance: 'Renal (60% metabolites), Fecal (20-25%)',
      peakPlasma: '6 - 12 hours',
      bioavailability: '64 - 90%'
    },
    visualPill: {
      shape: 'Round',
      color: 'White',
      imprint: 'AML 5',
      score: 'Single',
      matchPct: 98.2,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Monitor for progressive dependent peripheral edema in lower extremities',
      'Titrate cautiously in elderly patients or severe hepatic impairment',
      'Mild inhibitor of CYP3A4; interacts with simvastatin (cap at 20mg)'
    ],
    foodInteractions: 'Unaffected by food. Grapefruit juice may mildly increase exposure.',
    renalDosing: 'No dose adjustment required in renal dysfunction.',
    pregnancyRisk: 'Caution',
    atcCode: 'C08CA01'
  },
  {
    id: 'apixaban',
    name: 'Apixaban',
    genericName: 'Apixaban',
    brandNames: ['Eliquis'],
    category: 'Anticoagulant',
    dosage: '5mg twice daily (or 2.5mg BID if meeting dose reduction criteria)',
    dosageSchedule: 'Take consistently every 12 hours with or without meals.',
    indications: 'Non-valvular atrial fibrillation stroke prevention, treatment & prophylaxis of DVT and Pulmonary Embolism, post-operative thromboprophylaxis.',
    contraindications: 'Active pathological bleeding, severe hypersensitivity, clinically significant liver disease associated with coagulopathy.',
    sideEffects: [
      { name: 'Gingival / Epistaxis Bleeding', percentage: 8 },
      { name: 'Bruising / Hematoma', percentage: 12 },
      { name: 'Major Hemorrhage', percentage: 2.1 },
      { name: 'Nausea', percentage: 3 }
    ],
    efficacy: 'Superior to Warfarin in stroke prevention and lower major bleeding risk (ARISTOTLE trial)',
    fullDescription: 'Direct-acting oral anticoagulant (DOAC) that reversibly and selectively inhibits free and clot-bound coagulation Factor Xa with high potency.',
    chemicalFormula: 'C25H25N5O4',
    molarMass: '459.50 g/mol',
    iupacName: '1-(4-methoxyphenyl)-7-oxo-6-[4-(2-oxopiperidin-1-yl)phenyl]-4,5-dihydropyrazolo[3,4-c]pyridine-3-carboxamide',
    mechanismOfAction: 'Directly and selectively binds to the catalytic site of Factor Xa, preventing prothrombinase complex activation and thrombin generation.',
    targetReceptors: ['Coagulation Factor Xa catalytic pocket'],
    organDistribution: {
      primaryTarget: 'Circulating plasma coagulation cascade & clot-bound factor Xa',
      metabolismOrgan: 'Liver (CYP3A4/3A5 and sulfotransferase ~25%)',
      eliminationRoute: 'Renal (27%), Biliary / Fecal (56%)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4/3A5 (~25%), substrate for P-gp and BCRP',
      halfLife: '12 hours (repeated dosing)',
      clearance: 'Renal (27%), Biliary/Fecal (56%)',
      peakPlasma: '3 - 4 hours',
      bioavailability: '~50%'
    },
    visualPill: {
      shape: 'Oval',
      color: 'Yellow',
      imprint: 'ELI 5',
      score: 'None',
      matchPct: 99.4,
      svgColorPrimary: '#eab308'
    },
    safetyWarnings: [
      'Premature discontinuation increases the risk of thrombotic events and stroke',
      'Epidural or spinal hematomas may occur during neuraxial anesthesia or spinal puncture',
      'Antidote: Andexanet alfa (recombinant modified human factor Xa decoy)'
    ],
    foodInteractions: 'Can be taken without food.',
    renalDosing: 'Reduce to 2.5mg BID if patient has at least 2 of: Age >=80, Weight <=60kg, or Serum Creatinine >=1.5 mg/dL.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Premature discontinuation increases thrombotic risk. Neuraxial spinal hematoma risk.',
    atcCode: 'B01AF02'
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone Hydrochloride',
    genericName: 'Amiodarone',
    brandNames: ['Cordarone', 'Pacerone', 'Nexterone'],
    category: 'Cardiology / Antiarrhythmic',
    dosage: '200mg - 400mg daily (Post-loading regimen)',
    dosageSchedule: 'Hospital loading dose 800-1600mg/day in divided doses for 1-3 weeks, followed by 200mg daily maintenance.',
    indications: 'Recurrent ventricular fibrillation (VF), hemodynamically unstable ventricular tachycardia (VT), refractory atrial fibrillation rhythm control.',
    contraindications: 'Severe sinus-node dysfunction, second- or third-degree AV block without pacemaker, cardiogenic shock, iodine hypersensitivity.',
    sideEffects: [
      { name: 'Pulmonary Toxicity / Fibrosis', percentage: 5 },
      { name: 'Corneal Microdeposits', percentage: 90 },
      { name: 'Thyroid Dysfunction (Hypo/Hyper)', percentage: 10 },
      { name: 'Elevated Hepatic Transaminases', percentage: 15 },
      { name: 'Photosensitivity / Blue Skin Discoloration', percentage: 8 }
    ],
    efficacy: 'Gold standard for maintaining sinus rhythm in refractory life-threatening arrhythmias',
    fullDescription: 'Vaughan Williams Class III broad-spectrum antiarrhythmic agent that prolongs myocardial action potential duration and refractory period, with non-competitive alpha/beta adrenergic and calcium/sodium channel blocking properties.',
    chemicalFormula: 'C25H29I2NO3',
    molarMass: '645.31 g/mol',
    iupacName: '(2-butyl-1-benzofuran-3-yl)-[4-[2-(diethylamino)ethoxy]-3,5-diiodophenyl]methanone',
    mechanismOfAction: 'Blocks potassium channels (IKr), delaying repolarization; also exhibits Class I sodium blockade, Class II antiadrenergic, and Class IV calcium channel blockade.',
    targetReceptors: ['Cardiac Voltage-Gated Potassium Channels (hERG / IKr)', 'Sodium & Calcium Channels', 'Beta Adrenergic Receptors'],
    organDistribution: {
      primaryTarget: 'Myocardial conductive Purkinje fibers and atrial/ventricular muscle beds',
      metabolismOrgan: 'Liver (extensively by CYP3A4 and CYP2C8 to desethylamiodarone)',
      eliminationRoute: 'Biliary / Hepatic (negligible renal elimination)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4 and CYP2C8 to active metabolite N-desethylamiodarone (DEA)',
      halfLife: '40 - 58 days (Extremely lipophilic tissue accumulation)',
      clearance: 'Hepatic/Biliary excretion (negligible renal elimination)',
      peakPlasma: '3 - 7 hours (oral)',
      bioavailability: '35 - 65%'
    },
    visualPill: {
      shape: 'Round',
      color: 'White',
      imprint: 'PAC 200',
      score: 'Single',
      matchPct: 98.7,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Potentially fatal pulmonary fibrosis and ARDS. Perform baseline and regular pulmonary function tests & CXR',
      'High iodine content (37% by weight) frequently induces hyperthyroidism or hypothyroidism',
      'Potent CYP3A4, CYP2C9, and P-glycoprotein inhibitor; doubles Warfarin INR and Digoxin serum levels'
    ],
    foodInteractions: 'Avoid grapefruit juice. Take with food to reduce GI upset.',
    renalDosing: 'No dosage adjustments required in renal failure.',
    pregnancyRisk: 'Contraindicated',
    blackBoxWarning: 'Potentially fatal pulmonary toxicity, hepatotoxicity, and exacerbation of arrhythmias.',
    atcCode: 'C01BD01'
  },
  {
    id: 'furosemide',
    name: 'Furosemide',
    genericName: 'Furosemide',
    brandNames: ['Lasix', 'Fumide'],
    category: 'Cardiology / Antiarrhythmic',
    dosage: '20mg - 80mg once or twice daily (Max 600mg in severe fluid overload)',
    dosageSchedule: 'Take morning or early afternoon to prevent nocturia and sleep interruption.',
    indications: 'Acute pulmonary edema, chronic heart failure volume overload, hepatic cirrhosis ascites, renal disease edema, hypertensive crisis.',
    contraindications: 'Anuria, severe sodium and volume depletion, hepatic coma, hypersensitivity to sulfonamides.',
    sideEffects: [
      { name: 'Hypokalemia / Electrolyte Depletion', percentage: 22 },
      { name: 'Hypotension / Orthostasis', percentage: 14 },
      { name: 'Hyperuricemia / Gout Flares', percentage: 8 },
      { name: 'Ototoxicity (High IV doses)', percentage: 2 }
    ],
    efficacy: 'Rapid and potent diuresis within 30-60 minutes oral, 5 minutes IV',
    fullDescription: 'High-ceiling sulfonamide loop diuretic that reversibly inhibits the Na+/K+/2Cl- cotransporter in the thick ascending limb of the loop of Henle, promoting massive excretion of sodium, chloride, potassium, and water.',
    chemicalFormula: 'C12H11ClN2O5S',
    molarMass: '330.74 g/mol',
    iupacName: '4-chloro-2-(furan-2-ylmethylamino)-5-sulfamoylbenzoic acid',
    mechanismOfAction: 'Inhibits the apical Na+/K+/2Cl- symporter in the thick ascending limb of the loop of Henle, eliminating the medullary osmotic gradient.',
    targetReceptors: ['Renal NKCC2 (Na-K-2Cl Cotransporter)'],
    organDistribution: {
      primaryTarget: 'Renal medullary thick ascending limb of Henle',
      metabolismOrgan: 'Liver (minimal glucuronidation ~10%)',
      eliminationRoute: 'Kidneys (65-80% active unchanged secretion via organic acid transporters)'
    },
    pharmacology: {
      metabolism: 'Hepatic glucuronidation (~10%)',
      halfLife: '0.5 - 2.0 hours (prolonged in renal/hepatic failure)',
      clearance: 'Renal (65-80% unchanged via proximal tubule secretion)',
      peakPlasma: '1 - 1.5 hours (oral), 15 mins (IV)',
      bioavailability: '50 - 70%'
    },
    visualPill: {
      shape: 'Round',
      color: 'White',
      imprint: 'LAS 40',
      score: 'Cross',
      matchPct: 98.3,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Profound diuresis can cause severe dehydration, hypovolemia, and circulatory collapse',
      'Monitor serum potassium, magnesium, sodium, and creatinine frequently',
      'Risk of irreversible ototoxicity when co-administered with aminoglycoside antibiotics or rapid IV push'
    ],
    foodInteractions: 'Food decreases bioavailability by ~30% but may reduce GI irritation; take consistently.',
    renalDosing: 'Higher doses required in low GFR to ensure adequate delivery to tubular lumen.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Potent diuretic that can lead to profound diuresis with water and electrolyte depletion.',
    atcCode: 'C03CA01'
  },
  {
    id: 'sertraline',
    name: 'Sertraline Hydrochloride',
    genericName: 'Sertraline',
    brandNames: ['Zoloft', 'Lustral', 'Tresleen'],
    category: 'Psychiatric / Antidepressant',
    dosage: '50mg - 200mg once daily',
    dosageSchedule: 'Administer once daily in the morning or evening. Titrate upward by 25-50mg weekly.',
    indications: 'Major Depressive Disorder (MDD), Obsessive-Compulsive Disorder (OCD), Panic Disorder, PTSD, Social Anxiety Disorder, PMDD.',
    contraindications: 'Concomitant use of Monoamine Oxidase Inhibitors (MAOIs), pimozide, or disulfiram (liquid concentrate containing alcohol).',
    sideEffects: [
      { name: 'Nausea', percentage: 26 },
      { name: 'Insomnia / Somnolence', percentage: 18 },
      { name: 'Sexual Dysfunction / Decreased Libido', percentage: 14 },
      { name: 'Diarrhea', percentage: 20 },
      { name: 'Dry Mouth', percentage: 14 }
    ],
    efficacy: 'Significant response rate and long-term relapse prevention in mood and anxiety disorders',
    fullDescription: 'Selective Serotonin Reuptake Inhibitor (SSRI) that potently and selectively blocks the presynaptic serotonin transporter (SERT), augmenting serotonergic neurotransmission in the CNS.',
    chemicalFormula: 'C17H17Cl2N',
    molarMass: '306.23 g/mol',
    iupacName: '(1S,4S)-4-(3,4-dichlorophenyl)-N-methyl-1,2,3,4-tetrahydronaphthalen-1-amine',
    mechanismOfAction: 'Selectively binds and blocks the presynaptic Serotonin Transporter (SERT), inhibiting 5-HT reuptake; mild affinity for dopamine transporter (DAT).',
    targetReceptors: ['Serotonin Transporter (SERT)', 'Dopamine Transporter (DAT, weak)'],
    organDistribution: {
      primaryTarget: 'Central nervous system serotonergic neuronal synapses & limbic system',
      metabolismOrgan: 'Liver (extensively via CYP2B6, CYP2C19, CYP2C9, CYP3A4 to N-desmethylsertraline)',
      eliminationRoute: 'Renal (40-45% metabolites) and Fecal (40-45%)'
    },
    pharmacology: {
      metabolism: 'Hepatic (CYP2B6, CYP2C19, CYP3A4) to weakly active N-desmethylsertraline',
      halfLife: '26 hours (active metabolite 62-104 hours)',
      clearance: 'Equal renal and fecal excretion as inactive metabolites',
      peakPlasma: '4.5 - 8.4 hours',
      bioavailability: 'Extensive first-pass hepatic metabolism'
    },
    visualPill: {
      shape: 'Oval',
      color: 'Blue',
      imprint: 'ZOL 50',
      score: 'Single',
      matchPct: 97.9,
      svgColorPrimary: '#0284c7'
    },
    safetyWarnings: [
      'Black Box Warning: Increased risk of suicidal ideation in children, adolescents, and young adults under 24',
      'Life-threatening Serotonin Syndrome risk if combined with MAOIs, linezolid, triptans, or high-dose tramadol',
      'Do not stop abruptly; taper slowly to prevent discontinuation syndrome (dizziness, electric shock sensations)'
    ],
    foodInteractions: 'Food increases peak concentration (Cmax) by ~25%; take with breakfast or dinner consistently.',
    renalDosing: 'No dose adjustment required.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Suicidality in children, adolescents, and young adults during initial weeks of therapy.',
    atcCode: 'N06AB06'
  },
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin Hydrochloride',
    genericName: 'Ciprofloxacin',
    brandNames: ['Cipro', 'Ciprobay', 'Ciproxin'],
    category: 'Antibiotic',
    dosage: '250mg - 750mg twice daily PO or 400mg q8-12h IV',
    dosageSchedule: 'Administer every 12 hours on an empty stomach or with meals (avoid co-ingestion with dairy or antacids).',
    indications: 'Complicated urinary tract infections (pyelonephritis), bacterial prostatitis, infectious diarrhea, intra-abdominal infections, anthrax post-exposure prophylaxis.',
    contraindications: 'Concurrent administration with tizanidine, hypersensitivity to quinolones.',
    sideEffects: [
      { name: 'Nausea / GI Distress', percentage: 9 },
      { name: 'Tendinitis / Tendon Rupture', percentage: 1.2 },
      { name: 'QTc Interval Prolongation', percentage: 2.5 },
      { name: 'CNS Excitation / Dizziness', percentage: 4 },
      { name: 'Photosensitivity', percentage: 3 }
    ],
    efficacy: 'High systemic tissue penetration and rapid bactericidal action against Gram-negative bacilli',
    fullDescription: 'Second-generation synthetic fluoroquinolone antimicrobial that inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, preventing bacterial DNA replication and repair.',
    chemicalFormula: 'C17H18FN3O3',
    molarMass: '331.34 g/mol',
    iupacName: '1-cyclopropyl-6-fluoro-4-oxo-7-piperazin-1-ylquinoline-3-carboxylic acid',
    mechanismOfAction: 'Bactericidal inhibition of bacterial DNA Gyrase (GyrA subunit) and Topoisomerase IV, inducing double-stranded DNA breaks and cell death.',
    targetReceptors: ['Bacterial DNA Gyrase (Topoisomerase II)', 'Bacterial Topoisomerase IV'],
    organDistribution: {
      primaryTarget: 'Renal parenchyma, urinary tract, prostate, intra-abdominal tissues, bone',
      metabolismOrgan: 'Liver (minor CYP1A2 inhibition ~15%)',
      eliminationRoute: 'Kidneys (40-50% active unchanged excretion in urine), biliary (20-35%)'
    },
    pharmacology: {
      metabolism: 'Hepatic ~15% (potent CYP1A2 inhibitor)',
      halfLife: '4.0 hours (prolonged in severe renal impairment to 8h)',
      clearance: 'Renal (40-50% unchanged), Fecal (20-35%)',
      peakPlasma: '1 - 2 hours',
      bioavailability: '70 - 80%'
    },
    visualPill: {
      shape: 'Oblong',
      color: 'White',
      imprint: 'CIP 500',
      score: 'None',
      matchPct: 98.6,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Black Box Warning: Increased risk of tendinitis and tendon rupture (especially Achilles tendon), peripheral neuropathy, and CNS toxicities',
      'May exacerbate muscle weakness in patients with myasthenia gravis',
      'Chelates with multivalent cations (calcium, magnesium, iron, aluminum); space by at least 2 hours'
    ],
    foodInteractions: 'Avoid dairy products or calcium-fortified juices alone; separate from antacids and iron supplements by 2h before / 6h after.',
    renalDosing: 'CrCl 30-50: 250-500mg q12h. CrCl <30: 250-500mg q18-24h.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Tendinitis and Tendon Rupture, Peripheral Neuropathy, CNS Effects, and Myasthenia Gravis Exacerbation.',
    atcCode: 'J01MA02'
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel Bisulfate',
    genericName: 'Clopidogrel',
    brandNames: ['Plavix', 'Iscover', 'Clopilet'],
    category: 'Anticoagulant',
    dosage: '75mg once daily (Post-acute coronary syndrome loading dose 300-600mg)',
    dosageSchedule: 'Take once daily with or without food. Dual antiplatelet therapy (DAPT) with aspirin commonly prescribed for 1-12 months post-stent.',
    indications: 'Acute Coronary Syndrome (STEMI/NSTEMI), recent myocardial infarction, recent ischemic stroke, established peripheral arterial disease (PAD).',
    contraindications: 'Active pathological bleeding (peptic ulcer or intracranial hemorrhage), severe hepatic disease.',
    sideEffects: [
      { name: 'Bleeding / Purpura', percentage: 9.3 },
      { name: 'Hematoma / Epistaxis', percentage: 6 },
      { name: 'Pruritus / Rash', percentage: 4 },
      { name: 'Thrombotic Thrombocytopenic Purpura (TTP, rare)', percentage: 0.01 }
    ],
    efficacy: 'Significant reduction in combined endpoint of ischemic stroke, MI, or vascular death (CAPRIE trial)',
    fullDescription: 'Thienopyridine prodrug that requires two-step hepatic CYP2C19 activation to generate an active thiol metabolite, which irreversibly inhibits the platelet P2Y12 ADP receptor.',
    chemicalFormula: 'C16H16ClNO2S',
    molarMass: '321.82 g/mol',
    iupacName: 'methyl (2S)-2-(2-chlorophenyl)-2-(6,7-dihydro-4H-thieno[3,2-c]pyridin-5-yl)acetate',
    mechanismOfAction: 'Active metabolite irreversibly modifies platelet P2Y12 adenosine diphosphate (ADP) receptor, preventing ADP-mediated activation of the GPIIb/IIIa complex.',
    targetReceptors: ['Platelet Purinergic P2Y12 ADP Receptors'],
    organDistribution: {
      primaryTarget: 'Circulating platelets throughout the vascular tree (lifespan 7-10 days)',
      metabolismOrgan: 'Liver (extensive 2-step CYP2C19, CYP3A4, CYP1A2, CYP2B6 biotransformation)',
      eliminationRoute: 'Renal (50%) and Fecal (46%)'
    },
    pharmacology: {
      metabolism: 'Prodrug: 85% inactivated by esterases; 15% converted by CYP2C19/CYP3A4 to active thiol metabolite',
      halfLife: 'Parent drug: 6 hours; Active metabolite: ~30 minutes (platelet inhibition irreversible for platelet lifespan ~7-10 days)',
      clearance: 'Renal (50%), Fecal (46%)',
      peakPlasma: '0.5 - 1.0 hour (platelet inhibition reaches steady state 3-7 days)',
      bioavailability: '50%'
    },
    visualPill: {
      shape: 'Round',
      color: 'Pink',
      imprint: 'PLX 75',
      score: 'None',
      matchPct: 99.0,
      svgColorPrimary: '#f43f5e'
    },
    safetyWarnings: [
      'Black Box Warning: Diminished antiplatelet effect in CYP2C19 poor metabolizers (consider CYP2C19 genotype testing)',
      'Avoid concurrent omeprazole or esomeprazole which significantly inhibit CYP2C19 bioactivation (use pantoprazole instead)',
      'Discontinue 5-7 days prior to elective surgery to restore hemostasis'
    ],
    foodInteractions: 'Can be taken without regard to meals.',
    renalDosing: 'No dose adjustment required.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Diminished antiplatelet effect in patients with CYP2C19 poor metabolizer alleles.',
    atcCode: 'B01AC04'
  },
  {
    id: 'meropenem',
    name: 'Meropenem Trihydrate',
    genericName: 'Meropenem',
    brandNames: ['Merrem', 'Meronem'],
    category: 'Emergency / Critical Care',
    dosage: '500mg - 2000mg IV every 8 hours as extended infusion',
    dosageSchedule: 'Administered as IV push over 3-5 mins or extended IV infusion over 3 hours for optimized pharmacokinetic time above MIC.',
    indications: 'Severe intra-abdominal infections, complicated skin/soft tissue infections, bacterial meningitis, hospital-acquired pneumonia, neutropenic fever, multidrug-resistant sepsis.',
    contraindications: 'Severe anaphylactic hypersensitivity to carbapenems, penicillins, or other beta-lactam antibiotics.',
    sideEffects: [
      { name: 'Diarrhea', percentage: 7 },
      { name: 'Nausea / Vomiting', percentage: 4 },
      { name: 'Headache', percentage: 3 },
      { name: 'Seizure activity (<0.5% in non-CNS infections, higher in meningitis)', percentage: 0.7 }
    ],
    efficacy: 'Ultra-broad spectrum coverage against Gram-positive, Gram-negative, ESBL-producing, and anaerobic pathogens',
    fullDescription: 'Synthetic carbapenem antibacterial engineered for high stability against renal dehydropeptidase-I (DHP-I) without requiring cilastatin, penetrating the blood-brain barrier for critical care and meningitis therapy.',
    chemicalFormula: 'C17H25N3O5S',
    molarMass: '383.46 g/mol',
    iupacName: '(4R,5S,6S)-3-[(3S,5S)-5-(dimethylcarbamoyl)pyrrolidin-3-yl]sulfanyl-6-[(1R)-1-hydroxyethyl]-4-methyl-7-oxo-1-azabicyclo[3.2.0]hept-2-ene-2-carboxylic acid',
    mechanismOfAction: 'Inhibits bacterial cell wall synthesis by penetrating outer membrane of Gram-negative bacteria and binding with high affinity to Penicillin-Binding Proteins (PBPs 2, 3, and 4).',
    targetReceptors: ['Bacterial PBPs (PBP-2, PBP-3, PBP-4)'],
    organDistribution: {
      primaryTarget: 'Systemic bloodstream, cerebrospinal fluid (meningeal inflammation), peritoneal cavity, lung parenchyma',
      metabolismOrgan: 'Minor hepatic hydrolysis to inactive open-ring metabolite ICI-213,689',
      eliminationRoute: 'Kidneys (70% active unchanged excretion via glomerular filtration and tubular secretion)'
    },
    pharmacology: {
      metabolism: 'Minor hepatic hydrolysis (~25%) to inactive open beta-lactam form',
      halfLife: '1.0 hour in normal renal function (extended to 6-8h in end-stage renal disease)',
      clearance: 'Renal (70% unchanged in urine)',
      peakPlasma: 'End of IV infusion',
      bioavailability: '100% (IV formulation only)'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'White/Blue',
      imprint: 'MER 1G',
      score: 'None',
      matchPct: 99.2,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#0284c7'
    },
    safetyWarnings: [
      'Significantly decreases serum valproic acid concentrations (down by 60-90% within 24h), precipitating refractory seizures',
      'Extended 3-hour infusions maximize pharmacodynamic fT>MIC in septic shock',
      'Dose must be aggressively adjusted in renal impairment to prevent neurotoxicity'
    ],
    foodInteractions: 'IV formulation only.',
    renalDosing: 'CrCl 26-50: 1g q12h. CrCl 10-25: 500mg q12h. CrCl <10: 500mg q24h.',
    pregnancyRisk: 'Safe',
    atcCode: 'J01DH02'
  },
  {
    id: 'morphine',
    name: 'Morphine Sulfate',
    genericName: 'Morphine',
    brandNames: ['MS Contin', 'Kadian', 'Oramorph', 'Statex'],
    category: 'Emergency / Critical Care',
    dosage: '2mg - 10mg IV q2-4h or 15mg - 60mg oral q8-12h extended release',
    dosageSchedule: 'Individualized dosing titrated to patient pain score and respiratory rate. Ensure bowel regimen is co-prescribed.',
    indications: 'Severe acute and chronic pain, acute myocardial infarction ischemic chest pain, acute pulmonary edema dyspnea, oncologic pain.',
    contraindications: 'Severe respiratory depression, acute or severe bronchial asthma in unmonitored settings, paralytic ileus, known morphine hypersensitivity.',
    sideEffects: [
      { name: 'Constipation (Nearly universal without laxatives)', percentage: 40 },
      { name: 'Sedation / Somnolence', percentage: 28 },
      { name: 'Nausea / Vomiting', percentage: 22 },
      { name: 'Respiratory Depression', percentage: 4 },
      { name: 'Pruritus / Histamine Release', percentage: 12 }
    ],
    efficacy: 'Benchmark pure opioid agonist providing profound analgesia and hemodynamic preload reduction',
    fullDescription: 'Naturally occurring phenanthrene alkaloid opioid agonist with predominant selectivity for central and peripheral Mu-opioid receptors, modulating nociceptive ascending pathways.',
    chemicalFormula: 'C17H19NO3',
    molarMass: '285.34 g/mol',
    iupacName: '(4R,4aR,7S,7aR,12bS)-3-methyl-2,4,4a,7,7a,13-hexahydro-1H-4,12-methano[1]benzofuro[3,2-e]isoquinoline-7,9-diol',
    mechanismOfAction: 'Mu-opioid receptor agonist that activates Gi/o proteins, opening potassium channels and inhibiting voltage-gated calcium channels to halt substance P release in dorsal horn.',
    targetReceptors: ['Mu-Opioid Receptors (MOR)', 'Kappa-Opioid Receptors (KOR, minor)'],
    organDistribution: {
      primaryTarget: 'Thalamus, periaqueductal gray, spinal cord substantia gelatinosa, and GI enteric myenteric plexus',
      metabolismOrgan: 'Liver (glucuronidation to Morphine-3-glucuronide [neurotoxic] and Morphine-6-glucuronide [potent active analgesic])',
      eliminationRoute: 'Kidneys (90% as glucuronide metabolites)'
    },
    pharmacology: {
      metabolism: 'Hepatic UGT2B7 glucuronidation to M3G (60%, inactive/neurotoxic) and M6G (10%, potent analgesic)',
      halfLife: '2.0 - 4.0 hours',
      clearance: 'Renal (90% metabolites, accumulation in renal failure causes fatal toxicity)',
      peakPlasma: '20 mins (IV), 60 mins (oral immediate release)',
      bioavailability: '20 - 40% (extensive first-pass hepatic extraction)'
    },
    visualPill: {
      shape: 'Round',
      color: 'Purple',
      imprint: 'M 30',
      score: 'None',
      matchPct: 98.5,
      svgColorPrimary: '#7c3aed'
    },
    safetyWarnings: [
      'Black Box Warning: High risk of addiction, abuse, misuse, and life-threatening respiratory depression',
      'Extreme caution in renal impairment due to accumulation of active metabolite Morphine-6-Glucuronide (M6G)',
      'Antidote: Naloxone IV/IM/IN (titrated to restore ventilation without precipitating acute withdrawal)'
    ],
    foodInteractions: 'Oral CR formulations must be swallowed whole; crushing causes fatal dose-dumping.',
    renalDosing: 'CrCl 10-50: Administer 75% of normal dose. CrCl <10: Administer 50% of dose or switch to fentanyl/hydromorphone.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Addiction, Abuse, and Misuse; Life-Threatening Respiratory Depression; Accidental Ingestion.',
    atcCode: 'N02AA01'
  },
  {
    id: 'propofol',
    name: 'Propofol',
    genericName: 'Propofol',
    brandNames: ['Diprivan', 'Fresofol', 'Propoven'],
    category: 'Emergency / Critical Care',
    dosage: '5 - 50 mcg/kg/min continuous IV infusion (ICU sedation) or 1.5 - 2.5 mg/kg IV bolus (Induction)',
    dosageSchedule: 'Strictly administered via dedicated central or peripheral IV line with dedicated infusion pump and airway equipment ready.',
    indications: 'Induction and maintenance of general anesthesia, sedation for mechanically ventilated ICU adult patients, procedural sedation.',
    contraindications: 'Hypersensitivity to propofol, egg lecithin, or soybean oil emulsion components.',
    sideEffects: [
      { name: 'Hypotension / Systemic Vasodilation', percentage: 26 },
      { name: 'Respiratory Depression / Apnea', percentage: 35 },
      { name: 'Injection Site Burning / Pain', percentage: 40 },
      { name: 'Propofol Infusion Syndrome (PRIS, rare but fatal)', percentage: 0.1 },
      { name: 'Hypertriglyceridemia', percentage: 10 }
    ],
    efficacy: 'Ultra-rapid loss of consciousness within 40 seconds and smooth, predictable emergence',
    fullDescription: 'Short-acting intravenous hypnotic agent that enhances GABA-mediated inhibitory neurotransmission at GABAA receptors and blocks NMDA glutamate channels.',
    chemicalFormula: 'C12H18O',
    molarMass: '178.27 g/mol',
    iupacName: '2,6-di(propan-2-yl)phenol',
    mechanismOfAction: 'Positive allosteric modulator of GABAA receptors, prolonging chloride channel opening and hyperpolarizing postsynaptic neuronal membranes.',
    targetReceptors: ['GABAA Receptors (Beta Subunit)'],
    organDistribution: {
      primaryTarget: 'Cerebral cortex, reticular activating system, CNS neuronal networks',
      metabolismOrgan: 'Liver (rapid conjugation to glucuronides and sulfates) & extrahepatic clearance (lungs ~30%)',
      eliminationRoute: 'Kidneys (88% as inactive metabolites)'
    },
    pharmacology: {
      metabolism: 'Rapid hepatic glucuronidation (CYP2B6/CYP2C9) and significant extrahepatic pulmonary clearance',
      halfLife: 'Initial distribution half-life 2 - 8 mins; terminal elimination half-life 4 - 23 hours',
      clearance: 'Total body clearance 1.5 - 2.2 L/min (exceeds hepatic blood flow)',
      peakPlasma: 'Instantaneous IV delivery (onset 30-40 seconds)',
      bioavailability: '100% IV'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'White',
      imprint: 'PROP 1%',
      score: 'None',
      matchPct: 99.1,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Propofol Infusion Syndrome (PRIS): Metabolic acidosis, hyperkalemia, rhabdomyolysis, hepatomegaly, and refractory cardiac collapse (limit infusion <4-5 mg/kg/h and duration <48h)',
      'Strict aseptic handling: Lipid vehicle supports rapid microbial growth; discard opened bottles/tubing after 12 hours',
      'Always have bag-valve-mask and endotracheal intubation equipment immediately at bedside'
    ],
    foodInteractions: 'IV formulation only. Counts toward daily lipid caloric intake (1.1 kcal/mL).',
    renalDosing: 'No dosage adjustments required.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Administer only by persons trained in administration of general anesthesia with airway equipment ready.',
    atcCode: 'N01AX10'
  },
  {
    id: 'norepinephrine',
    name: 'Norepinephrine Bitartrate',
    genericName: 'Norepinephrine',
    brandNames: ['Levophed', 'Noradrenaline'],
    category: 'Emergency / Critical Care',
    dosage: '0.02 - 3.0 mcg/kg/min continuous IV infusion (Target MAP >= 65 mmHg)',
    dosageSchedule: 'Titrate rapidly every 2-5 minutes via central venous catheter guided by invasive arterial blood pressure monitoring.',
    indications: 'First-line vasopressor for septic shock resuscitation, cardiogenic shock (with inotropes), neurogenic shock, profound hypotension.',
    contraindications: 'Hypovolemia prior to adequate volume resuscitation, mesenteric or peripheral vascular thrombosis (except as life-saving measure).',
    sideEffects: [
      { name: 'Peripheral Extremity Ischemia / Gangrene', percentage: 4 },
      { name: 'Arrhythmias / Tachycardia', percentage: 8 },
      { name: 'Reflex Bradycardia', percentage: 3 },
      { name: 'Extravasation Tissue Necrosis', percentage: 1.5 }
    ],
    efficacy: 'Cornerstone first-choice vasopressor in Surviving Sepsis Campaign clinical guidelines',
    fullDescription: 'Endogenous catecholamine with potent alpha-1 adrenergic vasoconstriction and modest beta-1 inotropic cardiac stimulation, dramatically increasing systemic vascular resistance and mean arterial pressure without excessive heart rate acceleration.',
    chemicalFormula: 'C8H11NO3',
    molarMass: '169.18 g/mol',
    iupacName: '4-[(1R)-2-amino-1-hydroxyethyl]benzene-1,2-diol',
    mechanismOfAction: 'Potent agonist at Alpha-1 and Alpha-2 adrenergic receptors causing intense arterial and venous vasoconstriction; modest Beta-1 agonist inotropic action.',
    targetReceptors: ['Alpha-1 Adrenergic Receptors (vascular smooth muscle)', 'Beta-1 Adrenergic Receptors (myocardium)'],
    organDistribution: {
      primaryTarget: 'Systemic peripheral arterial and venous resistance vascular beds',
      metabolismOrgan: 'Liver, kidneys, and vascular endothelial cells (MAO and COMT enzymes)',
      eliminationRoute: 'Kidneys (as normetanephrine and VMA metabolites)'
    },
    pharmacology: {
      metabolism: 'Rapid cellular uptake and enzymatic degradation by Monoamine Oxidase (MAO) and Catechol-O-Methyltransferase (COMT)',
      halfLife: '1.0 - 2.0 minutes (requires continuous intravenous infusion)',
      clearance: 'Total body enzymatic clearance',
      peakPlasma: 'Instantaneous IV hemodynamic onset (1-2 minutes)',
      bioavailability: '100% IV'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Teal',
      imprint: 'NE 4MG',
      score: 'None',
      matchPct: 99.3,
      svgColorPrimary: '#0d9488'
    },
    safetyWarnings: [
      'Extravasation Hazard: Severe localized vasoconstriction can cause ischemic necrosis. Infiltrate phentolamine 5-10mg in saline immediately if extravasation occurs',
      'Always administer through a Central Venous Catheter (CVC) whenever possible',
      'Ensure intravascular volume repletion before and during infusion to prevent organ hypoperfusion'
    ],
    foodInteractions: 'IV formulation only.',
    renalDosing: 'No renal adjustment; restores renal perfusion pressure in shock.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Extravasation site necrosis. Infiltrate phentolamine immediately.',
    atcCode: 'C01CA03'
  },
  {
    id: 'epinephrine',
    name: 'Epinephrine (Adrenaline)',
    genericName: 'Epinephrine',
    brandNames: ['EpiPen', 'Adrenaclick', 'Auvi-Q', 'Adrenalin'],
    category: 'Emergency / Critical Care',
    dosage: '0.3mg - 0.5mg IM (Anaphylaxis) or 1mg IV q3-5 mins (ACLS Cardiac Arrest)',
    dosageSchedule: 'Intramuscular injection into anterolateral thigh immediately upon signs of anaphylaxis; repeat in 5-15 mins if refractory.',
    indications: 'Severe anaphylaxis, ACLS cardiac arrest (VF, pVT, Asystole, PEA), severe acute croup (nebulized), refractory asthma exacerbation, septic shock inotrope.',
    contraindications: 'No absolute contraindications in life-threatening anaphylaxis or cardiac arrest emergencies.',
    sideEffects: [
      { name: 'Palpitations / Tachycardia', percentage: 35 },
      { name: 'Tremor / Shaking', percentage: 30 },
      { name: 'Anxiety / Restlessness', percentage: 25 },
      { name: 'Hypertension', percentage: 18 },
      { name: 'Ventricular Arrhythmias (High IV doses)', percentage: 3 }
    ],
    efficacy: 'Life-saving first-line intervention for anaphylactic shock and advanced cardiac life support',
    fullDescription: 'Direct-acting sympathetic catecholamine agonist stimulating Alpha-1, Alpha-2, Beta-1, and Beta-2 adrenergic receptors, reversing bronchospasm, mucosal angioedema, and circulatory collapse.',
    chemicalFormula: 'C9H13NO3',
    molarMass: '183.20 g/mol',
    iupacName: '4-[(1R)-1-hydroxy-2-(methylamino)ethyl]benzene-1,2-diol',
    mechanismOfAction: 'Agonist at Beta-2 (bronchodilation, mast cell stabilization), Beta-1 (cardiac output/inotropy), and Alpha-1 (vasoconstriction, mucosal decongestion).',
    targetReceptors: ['Beta-2 Adrenergic (bronchial)', 'Beta-1 Adrenergic (cardiac)', 'Alpha-1 Adrenergic (vascular)'],
    organDistribution: {
      primaryTarget: 'Bronchial tree, cardiac conduction and myocardium, systemic vasculature, mast cells',
      metabolismOrgan: 'Liver & adrenergic nerve terminals (MAO and COMT)',
      eliminationRoute: 'Kidneys (metabolites metanephrine and VMA)'
    },
    pharmacology: {
      metabolism: 'Rapidly inactivated by COMT and MAO in liver and other tissues',
      halfLife: '2.0 - 3.0 minutes',
      clearance: 'Enzymatic and renal metabolites',
      peakPlasma: '3 - 8 minutes (IM thigh injection), Instantaneous (IV)',
      bioavailability: 'High systemic absorption via vastus lateralis IM'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Yellow',
      imprint: 'EPI 0.3',
      score: 'None',
      matchPct: 99.6,
      svgColorPrimary: '#eab308'
    },
    safetyWarnings: [
      'Inject into the anterolateral aspect of the middle third of the thigh (Vastus Lateralis); do NOT inject into buttock or intravenously for anaphylaxis',
      'Do not delay administration in suspected anaphylaxis; delays directly correlate with fatal outcomes',
      'Patients on Beta-blockers may exhibit refractory anaphylaxis or severe unopposed alpha-vasoconstriction (use Glucagon as rescue)'
    ],
    foodInteractions: 'No food interactions.',
    renalDosing: 'No adjustments needed.',
    pregnancyRisk: 'Safe',
    atcCode: 'C01CA24'
  },
  {
    id: 'insulin_glargine',
    name: 'Insulin Glargine',
    genericName: 'Insulin Glargine',
    brandNames: ['Lantus', 'Basaglar', 'Toujeo', 'Semglee'],
    category: 'Anti-Diabetic',
    dosage: '10 - 40 units SubQ once daily at consistent time',
    dosageSchedule: 'Inject subcutaneously once daily at the same time every day into abdomen, thigh, or upper arm.',
    indications: 'Type 1 Diabetes Mellitus (in combination with rapid-acting prandial insulin), Type 2 Diabetes Mellitus baseline glycemic control.',
    contraindications: 'During episodes of acute hypoglycemia, hypersensitivity to insulin glargine or formulation excipients.',
    sideEffects: [
      { name: 'Hypoglycemia', percentage: 25 },
      { name: 'Injection Site Lipodystrophy', percentage: 6 },
      { name: 'Weight Gain', percentage: 8 },
      { name: 'Peripheral Edema', percentage: 3 }
    ],
    efficacy: 'Consistent, peakless 24-hour basal glycemic regulation with low nocturnal hypoglycemia risk',
    fullDescription: 'Recombinant human insulin analog engineered with a modified amino acid sequence (GlyA21, ArgB31, ArgB32) that creates microprecipitates in subcutaneous tissue, slowly releasing monomeric insulin over 24 hours without a pronounced peak.',
    chemicalFormula: 'C267H404N72O78S6',
    molarMass: '6063 g/mol',
    iupacName: 'Recombinant Human Insulin Analog (21A-Gly-30Ba-L-Arg-30Bb-L-Arg-human insulin)',
    mechanismOfAction: 'Binds to the alpha subunit of the insulin receptor, activating tyrosine kinase on the beta subunit and triggering GLUT4 transporter translocation to cell membranes.',
    targetReceptors: ['Insulin Receptors (Tyrosine Kinase Domain)'],
    organDistribution: {
      primaryTarget: 'Skeletal muscle myocytes, adipose adipocytes, and hepatic parenchymal cells',
      metabolismOrgan: 'Subcutaneous depot degradation to active M1 (21A-Gly-insulin) and M2 metabolites; liver and kidney insulinase degradation',
      eliminationRoute: 'Renal (enzymatic catabolism)'
    },
    pharmacology: {
      metabolism: 'Subcutaneously cleaved at the C-terminus of the B-chain to form active metabolites M1 and M2',
      halfLife: 'Terminal half-life 12 - 24 hours (peakless absorption profile)',
      clearance: 'Hepatic and renal enzymatic degradation',
      peakPlasma: 'No pronounced peak (flat concentration curve over 24h)',
      bioavailability: 'Slow and sustained release from subcutaneous depot'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Blue',
      imprint: 'GLAR 100U',
      score: 'None',
      matchPct: 99.0,
      svgColorPrimary: '#0284c7'
    },
    safetyWarnings: [
      'Do NOT mix or dilute with any other insulin or solution; the acidic pH (pH 4.0) will cause immediate precipitation',
      'Rotate subcutaneous injection sites to prevent lipohypertrophy and erratic absorption',
      'Never administer intravenously or in an insulin infusion pump'
    ],
    foodInteractions: 'Meals should be coordinated with rapid-acting insulins; glargine provides background basal coverage.',
    renalDosing: 'Insulin requirements decrease in renal impairment due to reduced renal insulin clearance; monitor glucose frequently.',
    pregnancyRisk: 'Safe',
    atcCode: 'A10AE04'
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone Sodium',
    genericName: 'Ceftriaxone',
    brandNames: ['Rocephin', 'Ceftrex'],
    category: 'Antibiotic',
    dosage: '1g - 2g IV/IM once daily (2g q12h for bacterial meningitis)',
    dosageSchedule: 'Administered once daily or divided q12h as slow IV infusion over 30 mins or deep IM injection with 1% lidocaine.',
    indications: 'Community-Acquired Pneumonia, Bacterial Meningitis, Pyelonephritis, Gonococcal infections, Intra-abdominal sepsis, Lyme disease neuroborreliosis.',
    contraindications: 'Hyperbilirubinemic neonates, concomitant IV calcium-containing solutions (e.g. Ringer Lactate) in neonates <=28 days due to fatal calcium-ceftriaxone crystal precipitation.',
    sideEffects: [
      { name: 'Diarrhea / Loose Stools', percentage: 6 },
      { name: 'Biliary Sludging / Pseudolithiasis', percentage: 3 },
      { name: 'Eosinophilia / Thrombocytosis', percentage: 4 },
      { name: 'Local Injection Site Pain', percentage: 5 }
    ],
    efficacy: 'High cerebrospinal fluid penetration and extended half-life enabling convenient once-daily hospital dosing',
    fullDescription: 'Third-generation broad-spectrum cephalosporin antibiotic that inhibits bacterial cell wall synthesis with exceptional stability against beta-lactamases and high blood-brain barrier penetration.',
    chemicalFormula: 'C18H18N8O7S3',
    molarMass: '554.58 g/mol',
    iupacName: '(6R,7R)-7-[[(2Z)-2-(2-amino-1,3-thiazol-4-yl)-2-methoxyiminoacetyl]amino]-3-[(2-methyl-5,6-dioxo-1H-1,2,4-triazin-3-yl)sulfanylmethyl]-8-oxo-5-thia-1-azabicyclo[4.2.0]oct-2-ene-2-carboxylic acid',
    mechanismOfAction: 'Inhibits bacterial cell wall synthesis by binding to one or more Penicillin-Binding Proteins (PBPs), causing cell wall lysis and bactericidal death.',
    targetReceptors: ['Bacterial Penicillin-Binding Proteins (PBP-2, PBP-3)'],
    organDistribution: {
      primaryTarget: 'Cerebrospinal fluid, lung parenchyma, pleural fluid, bone, and biliary tract',
      metabolismOrgan: 'Not metabolized; dual biliary and renal excretion',
      eliminationRoute: 'Dual elimination: Kidneys (33-67% active unchanged) and Biliary/Fecal (remaining percentage)'
    },
    pharmacology: {
      metabolism: 'None (inactive in bile to inactive metabolites by microflora)',
      halfLife: '5.8 - 8.7 hours (allows once-daily administration)',
      clearance: 'Dual elimination: Renal (33-67%) and Biliary (remaining)',
      peakPlasma: 'End of IV infusion, 2-3 hours post-IM injection',
      bioavailability: '100% IV/IM'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'White/Pink',
      imprint: 'CEF 1G',
      score: 'None',
      matchPct: 98.8,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#f43f5e'
    },
    safetyWarnings: [
      'Fatal calcium-ceftriaxone precipitate formation if mixed with calcium-containing IV fluids (e.g., Ringer Lactate)',
      'Biliary sludging (biliary pseudolithiasis) is typically reversible upon discontinuation',
      'No dosage adjustment required in isolated renal or hepatic failure due to dual clearance pathways'
    ],
    foodInteractions: 'IV/IM formulation only.',
    renalDosing: 'No dose adjustment required unless combined severe hepatic and renal failure (max 2g/day).',
    pregnancyRisk: 'Safe',
    atcCode: 'J01DD04'
  },
  {
    id: 'losartan',
    name: 'Losartan Potassium',
    genericName: 'Losartan',
    brandNames: ['Cozaar', 'Losar'],
    category: 'ACE Inhibitor',
    dosage: '25mg - 100mg once daily',
    dosageSchedule: 'Take once daily in the morning with or without food.',
    indications: 'Essential hypertension, diabetic nephropathy in Type 2 Diabetes with proteinuria, stroke risk reduction in hypertensive patients with left ventricular hypertrophy.',
    contraindications: 'Concomitant use with aliskiren in patients with diabetes, severe hepatic impairment, pregnancy.',
    sideEffects: [
      { name: 'Dizziness', percentage: 4 },
      { name: 'Hyperkalemia', percentage: 3.5 },
      { name: 'Upper Respiratory Congestion', percentage: 3 },
      { name: 'Fatigue', percentage: 2 }
    ],
    efficacy: 'Potent 24-hour blood pressure control and cardiorenal preservation without inducing bradykinin dry cough',
    fullDescription: 'Potent, highly selective non-peptide Angiotensin II Receptor Blocker (ARB) that displaces angiotensin II from the AT1 receptor subtype, blunting vasoconstriction and aldosterone release.',
    chemicalFormula: 'C22H23ClN6O',
    molarMass: '422.91 g/mol',
    iupacName: '[2-butyl-5-chloro-3-[[4-[2-(2H-tetrazol-5-yl)phenyl]phenyl]methyl]imidazol-4-yl]methanol',
    mechanismOfAction: 'Selectively and competitively blocks the Angiotensin II Type 1 (AT1) receptor in vascular smooth muscle and adrenal cortex; active EXP3174 metabolite is 10-40x more potent.',
    targetReceptors: ['Angiotensin II Type 1 (AT1) Receptors'],
    organDistribution: {
      primaryTarget: 'Vascular smooth muscle beds, adrenal cortex, renal glomerular arterioles',
      metabolismOrgan: 'Liver (CYP2C9 and CYP3A4 to active carboxylic acid metabolite EXP3174)',
      eliminationRoute: 'Biliary / Fecal (60%) and Renal (35%)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP2C9 and CYP3A4 to active carboxylic acid metabolite EXP-3174 (10-40x more potent than parent drug)',
      halfLife: 'Losartan: 2 hours; Active metabolite EXP-3174: 6 - 9 hours',
      clearance: 'Biliary (60%), Renal (35%)',
      peakPlasma: '1 hour (losartan), 3-4 hours (active metabolite)',
      bioavailability: '33%'
    },
    visualPill: {
      shape: 'Oval',
      color: 'White',
      imprint: 'LOS 50',
      score: 'None',
      matchPct: 98.1,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Black Box Warning: Fetal Toxicity. Discontinue immediately when pregnancy is confirmed',
      'Dual blockade of the renin-angiotensin system with ACE inhibitors or aliskiren is contraindicated due to severe hypotension, hyperkalemia, and acute renal failure',
      'Monitor serum potassium and renal function in diabetic or heart failure patients'
    ],
    foodInteractions: 'Can be taken with or without food.',
    renalDosing: 'No initial dose adjustment required in renal impairment.',
    pregnancyRisk: 'Contraindicated',
    blackBoxWarning: 'Fetal Toxicity: Drugs acting on RAAS cause injury and death to developing fetus.',
    atcCode: 'C09CA01'
  },
  {
    id: 'ondansetron',
    name: 'Ondansetron Hydrochloride',
    genericName: 'Ondansetron',
    brandNames: ['Zofran', 'Emeset', 'Zuplenz'],
    category: 'Emergency / Critical Care',
    dosage: '4mg - 8mg PO/IV every 8 hours PRN (Max 16mg single IV dose)',
    dosageSchedule: 'Administer 30 mins prior to chemotherapy/surgery or as needed for acute nausea and vomiting.',
    indications: 'Chemotherapy-Induced Nausea and Vomiting (CINV), Radiation-Induced Nausea and Vomiting (RINV), Post-Operative Nausea and Vomiting (PONV), acute gastroenteritis vomiting.',
    contraindications: 'Concomitant use of apomorphine (profound hypotension and loss of consciousness), congenital long QT syndrome.',
    sideEffects: [
      { name: 'Headache', percentage: 11 },
      { name: 'Constipation', percentage: 9 },
      { name: 'QTc Interval Prolongation', percentage: 3.5 },
      { name: 'Fatigue / Drowsiness', percentage: 7 }
    ],
    efficacy: 'Gold standard 5-HT3 receptor antiemetic with superior efficacy and tolerability over dopamine antagonists',
    fullDescription: 'Selective serotonin 5-HT3 receptor antagonist that blocks serotonin receptors both peripherally on vagal nerve terminals in the gastrointestinal tract and centrally in the chemoreceptor trigger zone (CTZ).',
    chemicalFormula: 'C18H19N3O',
    molarMass: '293.36 g/mol',
    iupacName: '(3R)-9-methyl-3-[(2-methylimidazol-1-yl)methyl]-2,3-dihydro-1H-carbazol-4-one',
    mechanismOfAction: 'Competitively antagonizes serotonin 5-HT3 receptors on vagal afferents in the gut and centrally in the solitary tract nucleus / area postrema CTZ.',
    targetReceptors: ['Serotonin 5-HT3 Receptors (peripheral vagal & central CTZ)'],
    organDistribution: {
      primaryTarget: 'Gastrointestinal vagal afferent nerve endings and brainstem Chemoreceptor Trigger Zone (CTZ)',
      metabolismOrgan: 'Liver (extensively by CYP3A4, CYP1A2, and CYP2D6)',
      eliminationRoute: 'Renal (5% unchanged in urine, remainder as inactive hepatic metabolites)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4, CYP1A2, CYP2D6',
      halfLife: '3.5 - 5.5 hours (extended to 12-20h in severe hepatic disease)',
      clearance: 'Renal (5% unchanged, rest as metabolites)',
      peakPlasma: '1.5 - 2.0 hours (oral), 10-15 mins (IV)',
      bioavailability: '60%'
    },
    visualPill: {
      shape: 'Round',
      color: 'White',
      imprint: 'ZOF 8',
      score: 'None',
      matchPct: 98.4,
      svgColorPrimary: '#f8fafc'
    },
    safetyWarnings: [
      'Dose-dependent QTc prolongation and risk of Torsades de Pointes; avoid single IV doses >16mg',
      'Caution in patients with underlying cardiac arrhythmias, hypokalemia, or hypomagnesemia',
      'Rare Serotonin Syndrome risk when combined with SSRIs, SNRIs, or other serotonergic medications'
    ],
    foodInteractions: 'Can be taken with or without food. Oral disintegrating tablet (ODT) placed on tongue.',
    renalDosing: 'No dosage adjustments required in renal impairment.',
    pregnancyRisk: 'Safe',
    atcCode: 'A04AA01'
  },
  {
    id: 'pantoprazole',
    name: 'Pantoprazole Sodium',
    genericName: 'Pantoprazole',
    brandNames: ['Protonix', 'Pantoloc', 'Controloc'],
    category: 'Proton Pump Inhibitor',
    dosage: '40mg once daily PO or 80mg IV bolus followed by 8mg/hr infusion (Upper GI Bleed)',
    dosageSchedule: 'Take 30-60 minutes before morning meal. In acute peptic ulcer bleeding, continuous IV infusion for 72 hours.',
    indications: 'Gastroesophageal Reflux Disease (GERD), acute upper gastrointestinal bleeding, peptic ulcer prophylaxis in ICU stress ulceration, Zollinger-Ellison syndrome.',
    contraindications: 'Hypersensitivity to substituted benzimidazoles.',
    sideEffects: [
      { name: 'Headache', percentage: 5 },
      { name: 'Diarrhea', percentage: 4 },
      { name: 'Abdominal Pain', percentage: 3 },
      { name: 'Hypomagnesemia (Long term)', percentage: 2 }
    ],
    efficacy: 'Potent and predictable acid suppression with minimal drug interactions compared to omeprazole',
    fullDescription: 'Substituted benzimidazole proton pump inhibitor (PPI) that irreversibly inhibits gastric parietal cell H+/K+ ATPase, exhibiting the lowest CYP2C19 interaction potential among all PPIs.',
    chemicalFormula: 'C16H15F2N3O4S',
    molarMass: '383.37 g/mol',
    iupacName: '6-(difluoromethoxy)-2-[(3,4-dimethoxypyridin-2-yl)methylsulfinyl]-1H-benzimidazole',
    mechanismOfAction: 'Accumulates in the acidic canaliculi of gastric parietal cells, converting to active sulfenamide and covalently binding to cysteine-819 of H+/K+ ATPase.',
    targetReceptors: ['Gastric H+/K+ ATPase Proton Pump (Cysteine-819 bond)'],
    organDistribution: {
      primaryTarget: 'Gastric parietal cell secretory canaliculi',
      metabolismOrgan: 'Liver (predominantly via CYP2C19 demethylation and sulfotransferase)',
      eliminationRoute: 'Renal (71% metabolites) and Fecal (18%)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP2C19 and sulfotransferase (minimal CYP3A4 interaction)',
      halfLife: '1.0 hour (clinical antisecretory duration >24 hours due to covalent bond)',
      clearance: 'Renal (71% metabolites), Fecal (18%)',
      peakPlasma: '2.5 hours (oral tablet)',
      bioavailability: '77%'
    },
    visualPill: {
      shape: 'Oval',
      color: 'Yellow',
      imprint: 'PAN 40',
      score: 'None',
      matchPct: 98.9,
      svgColorPrimary: '#eab308'
    },
    safetyWarnings: [
      'Preferred PPI in patients taking clopidogrel due to significantly lower CYP2C19 inhibitory interference',
      'Long-term use (>1 year) increases risk of hip/spine fractures, C. diff diarrhea, and Vitamin B12 deficiency',
      'Tablets must be swallowed whole without chewing or crushing'
    ],
    foodInteractions: 'Administer 30 minutes before breakfast for optimal daytime acid suppression.',
    renalDosing: 'No dosage adjustments required in renal failure.',
    pregnancyRisk: 'Safe',
    atcCode: 'A02BC02'
  },
  {
    id: 'tacrolimus',
    name: 'Tacrolimus',
    genericName: 'Tacrolimus',
    brandNames: ['Prograf', 'Advagraf', 'Envarsus XR'],
    category: 'Immunosuppressant',
    dosage: '0.05 - 0.15 mg/kg/day in two divided doses (Target trough 5 - 15 ng/mL)',
    dosageSchedule: 'Strict 12-hour dosing interval on an empty stomach. Trough levels drawn 30 mins before morning dose.',
    indications: 'Prophylaxis of organ rejection in solid organ transplantation (kidney, liver, heart, lung), refractory severe atopic dermatitis (topical), lupus nephritis.',
    contraindications: 'Hypersensitivity to tacrolimus or polyoxyl 60 hydrogenated castor oil.',
    sideEffects: [
      { name: 'Nephrotoxicity / Elevated Creatinine', percentage: 38 },
      { name: 'Tremors / Neurotoxicity', percentage: 45 },
      { name: 'New-Onset Diabetes After Transplant (NODAT)', percentage: 22 },
      { name: 'Hypertension', percentage: 40 },
      { name: 'Hyperkalemia / Hypomagnesemia', percentage: 20 }
    ],
    efficacy: 'Primary cornerstone immunosuppressant in modern solid organ transplantation with superior allograft survival',
    fullDescription: 'Macrolide calcineurin inhibitor that complexes with immunophilin FKBP-12 to inhibit calcineurin phosphatase, preventing dephosphorylation of NF-AT and transcription of IL-2 in T-lymphocytes.',
    chemicalFormula: 'C44H69NO12',
    molarMass: '804.02 g/mol',
    iupacName: '(1R,9S,12S,13R,14S,17R,18E,21S,23S,24R,25S,27R)-1,14-dihydroxy-12-[(1E)-1-[(1R,3R,4R)-4-hydroxy-3-methoxycyclohexyl]prop-1-en-2-yl]-23,25-dimethoxy-13,19,21,27-tetramethyl-17-prop-2-enyl-11,28-dioxa-4-azatricyclo[22.3.1.0^{4,9}]octacos-18-ene-2,3,10,16-tetrone',
    mechanismOfAction: 'Binds to intracellular immunophilin FKBP-12; the resulting complex inhibits calcineurin, blocking nuclear translocation of NF-AT and IL-2 cytokine gene transcription in helper T-cells.',
    targetReceptors: ['FKBP-12 Immunophilin & Calcineurin Phosphatase Complex'],
    organDistribution: {
      primaryTarget: 'Helper T-lymphocytes, lymphoid tissue, circulating mononuclear cells',
      metabolismOrgan: 'Liver (extensively by CYP3A4/5) and intestinal wall enterocytes',
      eliminationRoute: 'Biliary / Fecal (95%), Renal (<2%)'
    },
    pharmacology: {
      metabolism: 'Extensive intestinal and hepatic CYP3A4/3A5 and P-glycoprotein substrate',
      halfLife: '12 hours (wide inter-individual range 8-40 hours)',
      clearance: 'Fecal/Biliary (95%), Renal (<2%)',
      peakPlasma: '1 - 2 hours',
      bioavailability: '17 - 22% (poor and variable oral bioavailability)'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'White/Pink',
      imprint: 'FK 1MG',
      score: 'None',
      matchPct: 99.7,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#f43f5e'
    },
    safetyWarnings: [
      'Black Box Warning: Increased susceptibility to opportunistic infections and lymphoma/malignancies',
      'Narrow therapeutic index: Strict whole-blood trough monitoring mandatory to avoid nephrotoxicity and neurotoxicity',
      'Massive drug interactions with CYP3A4/P-gp inhibitors (e.g., fluconazole, macrolides) or inducers (e.g., rifampin, St. John’s wort)'
    ],
    foodInteractions: 'Take consistently on an empty stomach (1 hour before or 2 hours after meals). Never consume grapefruit juice.',
    renalDosing: 'Use lowest possible dose in renal impairment; monitor renal function closely.',
    pregnancyRisk: 'Caution',
    blackBoxWarning: 'Increased risk of serious infections and malignancies. Only physicians experienced in immunosuppression should prescribe.',
    atcCode: 'L04AD02'
  },
  {
    id: 'fluconazole',
    name: 'Fluconazole',
    genericName: 'Fluconazole',
    brandNames: ['Diflucan', 'Forcan', 'Flucos'],
    category: 'Antifungal',
    dosage: '150mg single oral dose (Vaginal Candidiasis) or 200mg - 800mg daily (Systemic Infections)',
    dosageSchedule: 'Administer once daily at any time with or without meals.',
    indications: 'Cryptococcal meningitis, invasive candidiasis, mucosal candidiasis (oropharyngeal/esophageal), prophylactic antifungal in bone marrow transplantation.',
    contraindications: 'Concomitant administration with terfenadine, astemizole, pimozide, or quinidine due to QT prolongation hazard.',
    sideEffects: [
      { name: 'Headache', percentage: 13 },
      { name: 'Nausea / Abdominal Pain', percentage: 7 },
      { name: 'Elevated Hepatic Transaminases (ALT/AST)', percentage: 5 },
      { name: 'Rash', percentage: 2 }
    ],
    efficacy: 'Outstanding oral bioavailability and broad cerebrospinal fluid penetration for fungal infections',
    fullDescription: 'First-generation synthetic bistriazole antifungal agent that selectively inhibits fungal cytochrome P450 lanosterol 14-alpha-demethylase, disrupting fungal ergosterol membrane synthesis.',
    chemicalFormula: 'C13H12F2N6O',
    molarMass: '306.27 g/mol',
    iupacName: '2-(2,4-difluorophenyl)-1,3-bis(1,2,4-triazol-1-yl)propan-2-ol',
    mechanismOfAction: 'Inhibits fungal lanosterol 14-alpha-demethylase, halting conversion of lanosterol to ergosterol and accumulating toxic methylated sterols that lyse fungal cell membranes.',
    targetReceptors: ['Fungal Lanosterol 14-Alpha-Demethylase (CYP51)'],
    organDistribution: {
      primaryTarget: 'Fungal cell membranes throughout body fluids, CSF (70-90% of plasma), saliva, skin',
      metabolismOrgan: 'Minor hepatic metabolism (~11%)',
      eliminationRoute: 'Kidneys (80% unchanged drug excreted in urine)'
    },
    pharmacology: {
      metabolism: 'Minimal hepatic metabolism (~11%); potent inhibitor of human CYP2C9, CYP2C19, and moderate inhibitor of CYP3A4',
      halfLife: '30 hours (prolonged duration supports once-daily and weekly dosing)',
      clearance: 'Renal (80% unchanged in urine)',
      peakPlasma: '1 - 2 hours',
      bioavailability: '>90% (oral absorption equal to IV bioavailability)'
    },
    visualPill: {
      shape: 'Oval',
      color: 'Pink',
      imprint: 'FLU 150',
      score: 'None',
      matchPct: 98.6,
      svgColorPrimary: '#f43f5e'
    },
    safetyWarnings: [
      'Potent CYP2C9 and moderate CYP3A4 inhibitor: Doubles Warfarin INR, increases statin and calcineurin inhibitor blood levels dramatically',
      'Rare cases of severe hepatotoxicity; monitor baseline and follow-up liver function tests',
      'Risk of QT prolongation and ventricular arrhythmias in patients with underlying cardiac risk factors'
    ],
    foodInteractions: 'Can be taken with or without food.',
    renalDosing: 'CrCl 21-50: Administer 50% of recommended dose. Hemodialysis: 100% dose after each dialysis session.',
    pregnancyRisk: 'Caution',
    atcCode: 'J02AC01'
  },
  {
    id: 'digoxin',
    name: 'Digoxin',
    genericName: 'Digoxin',
    brandNames: ['Lanoxin', 'Digox', 'Lanoxicaps'],
    category: 'Cardiology / Antiarrhythmic',
    dosage: '0.125mg - 0.25mg once daily (Target serum concentration 0.5 - 0.9 ng/mL)',
    dosageSchedule: 'Take once daily at the same time. Check serum trough levels at least 6-8 hours post-dose.',
    indications: 'Rate control in chronic atrial fibrillation, symptom improvement and hospital admission reduction in heart failure with reduced ejection fraction (HFrEF).',
    contraindications: 'Ventricular fibrillation, myocarditis, Wolff-Parkinson-White syndrome with atrial fibrillation, second- or third-degree heart block.',
    sideEffects: [
      { name: 'Nausea / Vomiting / Anorexia', percentage: 10 },
      { name: 'Yellow-Green Halos in Vision (Xanthopsia)', percentage: 3 },
      { name: 'Bradycardia / AV Conduction Block', percentage: 6 },
      { name: 'Ventricular Arrhythmias / Ectopy', percentage: 4 },
      { name: 'Confusion / Dizziness', percentage: 5 }
    ],
    efficacy: 'Increases cardiac contractility (positive inotropy) and slows AV nodal conduction (negative dromotropy)',
    fullDescription: 'Purified cardiac glycoside extracted from Digitalis purpurea that reversibly inhibits the myocardial sarcolemmal Na+/K+ ATPase pump, increasing intracellular calcium availability for actin-myosin cross-bridging.',
    chemicalFormula: 'C41H64O14',
    molarMass: '780.94 g/mol',
    iupacName: '4-[(3S,5R,8R,9S,10S,12R,13S,14S,17R)-3-[(2R,4S,5S,6R)-5-[(2S,4S,5S,6R)-5-[(2S,4S,5S,6R)-4,5-dihydroxy-6-methyloxan-2-yl]oxy-4-hydroxy-6-methyloxan-2-yl]oxy-4-hydroxy-6-methyloxan-2-yl]oxy-12,14-dihydroxy-10,13-dimethyl-1,2,3,4,5,6,7,8,9,11,12,15,16,17-tetradecahydrocyclopenta[a]phenanthren-17-yl]-5H-furan-2-one',
    mechanismOfAction: 'Inhibits sarcolemmal Na+/K+ ATPase pump, elevating intracellular sodium, slowing Na+/Ca2+ exchanger (NCX), and driving calcium influx into sarcoplasmic reticulum.',
    targetReceptors: ['Cardiac Sarcolemmal Na+/K+ ATPase Enzyme'],
    organDistribution: {
      primaryTarget: 'Myocardial working myocytes and Atrioventricular (AV) nodal conduction tissue',
      metabolismOrgan: 'Liver (minor metabolism ~16%) and gut microflora (Eubacterium lentum)',
      eliminationRoute: 'Kidneys (50-70% excreted unchanged via glomerular filtration and P-glycoprotein)'
    },
    pharmacology: {
      metabolism: 'Minor hepatic (~16%), P-glycoprotein substrate',
      halfLife: '36 - 48 hours (extended to 3 - 5 days in renal failure)',
      clearance: 'Renal (50-70% unchanged)',
      peakPlasma: '1 - 3 hours (pharmacodynamic peak 6-8 hours)',
      bioavailability: '60 - 80% (tablets)'
    },
    visualPill: {
      shape: 'Round',
      color: 'Yellow',
      imprint: 'DIG 125',
      score: 'None',
      matchPct: 99.2,
      svgColorPrimary: '#eab308'
    },
    safetyWarnings: [
      'Very narrow therapeutic index (0.5 - 0.9 ng/mL for heart failure); toxicity occurs >2.0 ng/mL',
      'Hypokalemia, hypomagnesemia, and hypercalcemia markedly potentiate digitalis arrhythmias and fatal toxicity',
      'Antidote: Digoxin Immune Fab (DigiFab / Digibind fragments)'
    ],
    foodInteractions: 'High-fiber meals delay absorption; space administration from bran/fiber meals.',
    renalDosing: 'CrCl 30-50: 0.125mg daily or q48h. CrCl <30: 0.0625mg daily or q48h. Strict therapeutic drug monitoring required.',
    pregnancyRisk: 'Safe',
    blackBoxWarning: 'Treatment of Heart Failure and Atrial Fibrillation. Narrow therapeutic range.',
    atcCode: 'C01AA05'
  },
  {
    id: 'methotrexate',
    name: 'Methotrexate Sodium',
    genericName: 'Methotrexate',
    brandNames: ['Trexall', 'Otrexup', 'Rasuvo', 'Rheumatrex'],
    category: 'Oncology',
    dosage: '7.5mg - 25mg ONCE WEEKLY (Rheumatology) or High-Dose IV (Oncology)',
    dosageSchedule: 'CRITICAL: Take ONCE WEEKLY on the same designated day for arthritis/psoriasis (NEVER daily). Co-prescribe Folic Acid 1-5mg/day on non-MTX days.',
    indications: 'Severe Rheumatoid Arthritis, Psoriasis, Psoriatic Arthritis, Acute Lymphoblastic Leukemia (ALL), Osteosarcoma, Choriocarcinoma.',
    contraindications: 'Pregnancy and lactation, alcoholism or chronic liver disease, preexisting blood dyscrasias (bone marrow hypoplasia, leukopenia, thrombocytopenia).',
    sideEffects: [
      { name: 'Bone Marrow Suppression / Cytopenias', percentage: 12 },
      { name: 'Hepatotoxicity / Elevated LFTs', percentage: 15 },
      { name: 'Ulcerative Stomatitis / Mucositis', percentage: 10 },
      { name: 'Nausea / Abdominal Distress', percentage: 18 },
      { name: 'Pneumonitis / Pulmonary Fibrosis', percentage: 3 }
    ],
    efficacy: 'Anchor disease-modifying antirheumatic drug (DMARD) with proven radiographic joint preservation',
    fullDescription: 'Folate antimetabolite that competitively inhibits dihydrofolate reductase (DHFR), blocking the synthesis of tetrahydrofolate cofactors necessary for de novo purine and thymidylate biosynthesis in actively proliferating cells.',
    chemicalFormula: 'C20H22N8O5',
    molarMass: '454.44 g/mol',
    iupacName: '(2S)-2-[[4-[(2,4-diaminopteridin-6-yl)methyl-methylamino]benzoyl]amino]pentanedioic acid',
    mechanismOfAction: 'Inhibits Dihydrofolate Reductase (DHFR) and AICAR transformylase, depleting folate pools, stopping DNA replication, and elevating anti-inflammatory extracellular adenosine.',
    targetReceptors: ['Dihydrofolate Reductase (DHFR)', 'AICAR Transformylase'],
    organDistribution: {
      primaryTarget: 'Rapidly dividing synovial inflammatory cells, bone marrow, malignant hematopoietic cells',
      metabolismOrgan: 'Liver and intracellular polyglutamylation (retains active drug inside cells for weeks)',
      eliminationRoute: 'Kidneys (80-90% unchanged via glomerular filtration and active tubular secretion)'
    },
    pharmacology: {
      metabolism: 'Hepatic and intracellular conversion to active polyglutamates',
      halfLife: '3.0 - 10 hours (tissue active polyglutamates persist for weeks)',
      clearance: 'Renal (80-90% unchanged in urine)',
      peakPlasma: '1 - 2 hours (oral)',
      bioavailability: '60% at low doses (decreases at high doses)'
    },
    visualPill: {
      shape: 'Round',
      color: 'Yellow',
      imprint: 'MTX 2.5',
      score: 'Single',
      matchPct: 98.5,
      svgColorPrimary: '#eab308'
    },
    safetyWarnings: [
      'Black Box Warning: Fatal dosing errors! For autoimmune disease, dose must be taken ONCE WEEKLY, never daily',
      'Strictly contraindicated in pregnancy (fetal death and congenital abnormalities; Category X)',
      'Avoid combining with NSAIDs, aspirin, or penicillin which block tubular secretion, causing fatal bone marrow suppression',
      'Rescue Antidote (High-Dose Oncology): Leucovorin (Folinic Acid) / Glucarpidase'
    ],
    foodInteractions: 'Avoid alcohol strictly due to compounded hepatotoxicity. Folic acid supplementation mitigates mucosal and GI toxicity.',
    renalDosing: 'CrCl 10-50: Reduce dose by 50%. CrCl <10: Avoid use.',
    pregnancyRisk: 'Contraindicated',
    blackBoxWarning: 'Appropriate Use: ONCE WEEKLY dosing for non-oncologic indications. Bone marrow suppression, Hepatotoxicity, Renal toxicity, Pregnancy contraindication.',
    atcCode: 'L01BA01'
  },
  {
    id: 'dexamethasone',
    name: 'Dexamethasone Sodium Phosphate',
    genericName: 'Dexamethasone',
    brandNames: ['Decadron', 'DexPak', 'Ozurdex'],
    category: 'Corticosteroid',
    dosage: '4mg - 20mg once daily PO or IV',
    dosageSchedule: 'Administer once daily in the morning with breakfast to align with circadian cortisol rhythms and avoid insomnia.',
    indications: 'Cerebral edema / brain tumors, severe acute respiratory distress / COVID-19 hypoxia, chemotherapy-induced nausea prophylaxis, allergic anaphylaxis, adrenal crisis.',
    contraindications: 'Systemic fungal infections, hypersensitivity to corticosteroids, live virus vaccine administration.',
    sideEffects: [
      { name: 'Hyperglycemia', percentage: 32 },
      { name: 'Insomnia / Euphoria / Mood Changes', percentage: 25 },
      { name: 'Dyspepsia / Peptic Ulceration', percentage: 8 },
      { name: 'Fluid Retention / Edema', percentage: 12 },
      { name: 'Increased Infection Susceptibility', percentage: 15 }
    ],
    efficacy: 'Significant mortality reduction in hypoxic ARDS / severe respiratory inflammation (RECOVERY trial)',
    fullDescription: 'Long-acting synthetic fluorinated glucocorticoid with 25-30x the anti-inflammatory potency of hydrocortisone and negligible mineralocorticoid (salt-retaining) effect.',
    chemicalFormula: 'C22H29FO5',
    molarMass: '392.46 g/mol',
    iupacName: '(1S,2R,3aS,3bS,9aS,9bR,10S,11aS)-9-fluoro-1,10-dihydroxy-1-(2-hydroxyacetyl)-2,9a,11a-trimethyl-1,2,3,3a,3b,4,5,9b,10,11-decahydrocyclopenta[a]phenanthren-7-one',
    mechanismOfAction: 'Diffuses across cell membranes and binds glucocorticoid receptors (GR), translocating to nucleus to transrepress NF-kappaB and downregulate inflammatory cytokines.',
    targetReceptors: ['Nuclear Glucocorticoid Receptor (GR)'],
    organDistribution: {
      primaryTarget: 'Systemic inflammatory cells, central nervous system (crosses blood-brain barrier for cerebral edema), pulmonary tree',
      metabolismOrgan: 'Liver (CYP3A4 substrate to 6-hydroxy-dexamethasone)',
      eliminationRoute: 'Kidneys (65% metabolites)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4 substrate',
      halfLife: '3.0 - 4.5 hours (Biological tissue half-life 36 - 54 hours)',
      clearance: 'Renal (65% metabolites)',
      peakPlasma: '1 - 2 hours (oral), 10-30 mins (IV)',
      bioavailability: '80 - 90%'
    },
    visualPill: {
      shape: 'Round',
      color: 'Teal',
      imprint: 'DEX 4',
      score: 'Single',
      matchPct: 98.1,
      svgColorPrimary: '#0d9488'
    },
    safetyWarnings: [
      'Frequent blood glucose checks required in diabetic and non-diabetic in-patients',
      'Prolonged therapy (>2 weeks) requires steroid taper to prevent secondary adrenal insufficiency',
      'Co-prescribe PPI gastroprotection in high-risk patients'
    ],
    foodInteractions: 'Take with food to minimize dyspepsia. Limit sodium intake if edema develops.',
    renalDosing: 'No dose adjustments necessary.',
    pregnancyRisk: 'Caution',
    atcCode: 'H02AB02'
  },
  {
    id: 'vancomycin',
    name: 'Vancomycin Hydrochloride',
    genericName: 'Vancomycin',
    brandNames: ['Vancocin', 'Firvanq'],
    category: 'Antibiotic',
    dosage: '15 - 20 mg/kg IV q8-12h (Target AUC/MIC 400-600) or 125mg PO QID for C. diff',
    dosageSchedule: 'Administered via slow IV infusion over at least 60-120 minutes with therapeutic drug monitoring (TDM).',
    indications: 'Methicillin-Resistant Staphylococcus Aureus (MRSA) sepsis/pneumonia, infective endocarditis, Clostridioides difficile colitis (oral formulation only).',
    contraindications: 'Known hypersensitivity to vancomycin.',
    sideEffects: [
      { name: 'Nephrotoxicity / Acute Kidney Injury', percentage: 14 },
      { name: 'Red Man Infusion Syndrome', percentage: 18 },
      { name: 'Ototoxicity (Tinnitus/Hearing Loss)', percentage: 3 },
      { name: 'Neutropenia (Prolonged therapy)', percentage: 4 }
    ],
    efficacy: 'Cornerstone antimicrobial for multidrug-resistant Gram-positive pathogens',
    fullDescription: 'Glycopeptide antibiotic that inhibits bacterial cell wall biosynthesis by binding with high affinity to D-alanyl-D-alanine termini of cell wall peptidoglycan precursors.',
    chemicalFormula: 'C66H75Cl2N9O24',
    molarMass: '1449.3 g/mol',
    iupacName: '(1S,2R,18R,19R,22S,25R,28R,40S)-22-(2-amino-2-oxoethyl)-5,15-dichloro-2,18,32,35,37-pentahydroxy-19-[[(2R,3R,4S,5S,6R)-3-[[(2S,4S,5S,6S)-4-amino-5-hydroxy-4,6-dimethyloxan-2-yl]oxy]-4,5-dihydroxy-6-(hydroxymethyl)oxan-2-yl]oxy]-26,31,44-trioxo-47-oxa-7,10,13,20,27,30,43-heptazatetracyclo[39.3.2.2^{14,17}.1^{8,12}.1^{23,26}]nonatetraconta-5,8,10,12(48),14,16,32,34,36(49)-nonaene-28-carboxylic acid',
    mechanismOfAction: 'Forms high-affinity hydrogen bonds with D-alanyl-D-alanine termini of cell wall precursors, sterically blocking transpeptidation and transglycosylation in peptidoglycan synthesis.',
    targetReceptors: ['Bacterial Peptidoglycan D-Alanyl-D-Alanine termini'],
    organDistribution: {
      primaryTarget: 'Extracellular bloodstream, heart valves, skin/soft tissues, bones, joint fluid',
      metabolismOrgan: 'Negligible hepatic metabolism',
      eliminationRoute: 'Kidneys (80-90% unchanged via glomerular filtration)'
    },
    pharmacology: {
      metabolism: 'Negligible metabolism',
      halfLife: '4 - 6 hours in normal renal function (up to 7 days in anuria)',
      clearance: 'Renal (80-90% unchanged via glomerular filtration)',
      peakPlasma: 'End of IV infusion (target AUC/MIC 400-600; trough 15-20 mcg/mL for severe MRSA)',
      bioavailability: '<5% oral (stays in bowel lumen for C. diff)'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'White/Blue',
      imprint: 'VANCO 125',
      score: 'None',
      matchPct: 98.7,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#0284c7'
    },
    safetyWarnings: [
      'Infuse slowly (<10mg/min or 1g over 60 mins) to prevent histamine-mediated Red Man syndrome',
      'Routine serum AUC / trough monitoring mandatory to prevent acute nephrotoxicity',
      'Oral capsules do not treat systemic bloodstream infections (only lumen C. diff)'
    ],
    foodInteractions: 'Oral formulation unaffected by meals.',
    renalDosing: 'Strict AUC-guided dosing or trough-based interval extension (q24h, q48h, or post-dialysis).',
    pregnancyRisk: 'Caution',
    atcCode: 'J01XA01'
  },
  {
    id: 'empagliflozin',
    name: 'Empagliflozin',
    genericName: 'Empagliflozin',
    brandNames: ['Jardiance'],
    category: 'Cardiovascular',
    dosage: '10mg - 25mg orally once daily in the morning',
    dosageSchedule: 'Take once daily with or without food. Ensure adequate daytime hydration.',
    indications: 'Type 2 Diabetes Mellitus glycemic management, reduction of cardiovascular death in adults with T2DM and established CVD, Heart Failure with preserved (HFpEF) and reduced ejection fraction (HFrEF), Chronic Kidney Disease progression delay.',
    contraindications: 'Severe hypersensitivity to empagliflozin, patients on dialysis, acute metabolic ketoacidosis.',
    sideEffects: [
      { name: 'Mycotic Genital Infections / Vulvovaginal Candidiasis', percentage: 7 },
      { name: 'Urinary Tract Infections (UTI)', percentage: 8 },
      { name: 'Volume Depletion / Orthostatic Hypotension', percentage: 4 },
      { name: 'Euglycemic Diabetic Ketoacidosis (euDKA)', percentage: 0.3 }
    ],
    efficacy: '38% relative risk reduction in cardiovascular death in the EMPA-REG OUTCOME trial; 25% risk reduction in HF hospitalization in EMPEROR-Preserved.',
    fullDescription: 'Potent and selective sodium-glucose co-transporter 2 (SGLT2) inhibitor that reduces renal reabsorption of filtered glucose and lowers the renal threshold for glucose, promoting glycosuria, osmotic diuresis, and myocardial sodium-hydrogen exchanger inhibition.',
    chemicalFormula: 'C23H27ClO7',
    molarMass: '450.91 g/mol',
    iupacName: '(2S,3R,4R,5S,6R)-2-[4-chloro-3-[[4-[(3S)-oxolan-3-yl]oxyphenyl]methyl]phenyl]-6-(hydroxymethyl)oxane-3,4,5-triol',
    mechanismOfAction: 'Inhibits SGLT2 in the proximal renal tubules, decreasing renal reabsorption of glucose and sodium, thereby inducing glycosuria, natriuresis, lowering intraglomerular pressure, and improving cardiac energetics.',
    targetReceptors: ['Sodium-Glucose Co-transporter 2 (SGLT2)', 'Myocardial NHE-1 (indirect)'],
    organDistribution: {
      primaryTarget: 'Proximal convoluted tubules of renal nephrons',
      metabolismOrgan: 'Liver (UGT2B7, UGT1A3, UGT1A8, UGT1A9 glucuronidation)',
      eliminationRoute: 'Feces (41%) and urine (54% mostly unchanged drug and glucuronides)'
    },
    pharmacology: {
      metabolism: 'Extensive glucuronidation via UGT enzymes without major CYP involvement',
      halfLife: '12.4 hours',
      clearance: 'Renal and fecal excretion',
      peakPlasma: '1.5 hours post oral administration',
      bioavailability: '60 - 75%'
    },
    visualPill: {
      shape: 'Round',
      color: 'Yellow',
      imprint: 'S 10',
      score: 'None',
      matchPct: 99.1,
      svgColorPrimary: '#fef08a',
      svgColorSecondary: '#eab308'
    },
    safetyWarnings: [
      'Assess volume status and correct hypovolemia prior to initiating therapy',
      'Temporarily withhold at least 3 days prior to major surgery to reduce euglycemic ketoacidosis risk',
      'Monitor for necrotizing fasciitis of the perineum (Fournier gangrene)'
    ],
    foodInteractions: 'Administer with or without food. Maintain balanced dietary water intake.',
    renalDosing: 'eGFR 30-60 mL/min: No dose reduction needed. eGFR 20-30 mL/min: 10mg once daily. eGFR <20 mL/min: Not recommended to initiate, but may continue for CV/kidney benefit.',
    pregnancyRisk: 'Caution',
    atcCode: 'A10BK03'
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    genericName: 'Semaglutide',
    brandNames: ['Ozempic', 'Wegovy', 'Rybelsus'],
    category: 'Endocrine',
    dosage: '0.25mg up to 2.4mg subcutaneous injection once weekly (or 3-14mg oral daily)',
    dosageSchedule: 'Initiate at 0.25mg SQ weekly for 4 weeks, escalate to 0.5mg weekly; further titrate by monthly steps to target glycemic or cardiometabolic maintenance dose.',
    indications: 'Type 2 diabetes glycemic control, reduction of major adverse cardiovascular events (MACE) in adults with T2DM and established CVD, chronic weight management in obesity with comorbidities.',
    contraindications: 'Personal or family history of medullary thyroid carcinoma (MTC), multiple endocrine neoplasia syndrome type 2 (MEN 2), severe pancreatitis history.',
    sideEffects: [
      { name: 'Nausea and Vomiting', percentage: 20 },
      { name: 'Diarrhea', percentage: 14 },
      { name: 'Abdominal Pain / Dyspepsia', percentage: 10 },
      { name: 'Constipation', percentage: 9 }
    ],
    efficacy: 'Significant HbA1c reduction (~1.5-2.0%) and up to 15-20% body weight reduction with 26% reduction in cardiovascular death/stroke/MI.',
    fullDescription: 'Long-acting glucagon-like peptide-1 (GLP-1) receptor agonist with 94% amino acid homology to native human GLP-1. Engineered with a C18 di-acid chain that binds albumin, extending half-life to enable weekly dosing.',
    chemicalFormula: 'C187H291N45O59',
    molarMass: '4113.58 g/mol',
    iupacName: 'N6,26-{18-[N-(17-carboxyheptadecanoyl)-L-gamma-glutamyl]-10-oxo-3,6,12,15-tetraoxa-9,18-diazaoctadecanoyl}-[Aib8,Arg34]GLP-1(7-37)',
    mechanismOfAction: 'Selective GLP-1 receptor agonist; enhances glucose-dependent insulin secretion, suppresses inappropriate glucagon secretion, slows gastric emptying, and centrally decreases appetite.',
    targetReceptors: ['Pancreatic Beta-cell GLP-1 Receptors', 'Hypothalamic POMC/CART Appetite Neurons'],
    organDistribution: {
      primaryTarget: 'Pancreatic endocrine islets, central nervous system satiety centers, vascular endothelium',
      metabolismOrgan: 'Extensively cleaved by proteolytic enzymes with fatty acid beta-oxidation',
      eliminationRoute: 'Urine (3%) and feces (3% unchanged parent peptide; remainder as fragments)'
    },
    pharmacology: {
      metabolism: 'Proteolytic cleavage and fatty acid beta-oxidation',
      halfLife: '168 hours (approximately 1 week)',
      clearance: 'Systemic degradation over 5 weeks post cessation',
      peakPlasma: '1 - 3 days post subcutaneous injection',
      bioavailability: '89% subcutaneous (0.4-1.0% oral formulation Rybelsus)'
    },
    visualPill: {
      shape: 'Oblong',
      color: 'Teal',
      imprint: 'OZEMPIC 1MG',
      score: 'None',
      matchPct: 99.4,
      svgColorPrimary: '#0d9488',
      svgColorSecondary: '#0284c7'
    },
    safetyWarnings: [
      'Black Box Warning: Thyroid C-cell tumors in rodent studies; contraindicated in patients with history of MTC or MEN-2',
      'Monitor for signs of acute pancreatitis (persistent severe abdominal pain radiating to back)',
      'Assess for rapid worsening of diabetic retinopathy upon rapid HbA1c lowering'
    ],
    foodInteractions: 'Subcutaneous injections administered independent of meals. Oral Rybelsus MUST be taken upon waking with ≤4 oz plain water and nothing else for 30 minutes.',
    renalDosing: 'No dose adjustment required across mild, moderate, or severe renal impairment; monitor renal function when initiating or escalating dose due to dehydration risk.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'A10BJ06'
  },
  {
    id: 'entresto',
    name: 'Sacubitril / Valsartan',
    genericName: 'Sacubitril and Valsartan',
    brandNames: ['Entresto'],
    category: 'Cardiovascular',
    dosage: '24/26mg to 97/103mg (target 200mg total) twice daily',
    dosageSchedule: 'Double dose every 2 to 4 weeks as tolerated to the target maintenance dose of 97/103mg PO twice daily.',
    indications: 'Heart failure with reduced ejection fraction (HFrEF, NYHA Class II-IV) to reduce the risk of cardiovascular death and hospitalization, heart failure with mildly reduced or preserved ejection fraction.',
    contraindications: 'Hypersensitivity to any component, history of angioedema related to prior ACE inhibitor or ARB therapy, concomitant ACE inhibitor use (must observe 36-hour washout period), concomitant aliskiren in diabetes.',
    sideEffects: [
      { name: 'Symptomatic Hypotension', percentage: 18 },
      { name: 'Hyperkalemia (Serum K > 5.4 mEq/L)', percentage: 12 },
      { name: 'Renal Function Deterioration (Elevated Serum Cr)', percentage: 9 },
      { name: 'Angioedema', percentage: 0.5 }
    ],
    efficacy: 'PARADIGM-HF trial demonstrated a 20% relative reduction in cardiovascular death or HF hospitalization compared to enalapril.',
    fullDescription: 'First-in-class Angiotensin Receptor-Neprilysin Inhibitor (ARNI). Sacubitril is a prodrug metabolized to sacubitrilat (LBQ657), which inhibits neprilysin, while valsartan selectively blocks the angiotensin II AT1 receptor.',
    chemicalFormula: 'C48H55N6Na3O8 * 2.5 H2O',
    molarMass: '957.99 g/mol',
    iupacName: 'trisodium;3-[[(1S,3R)-1-[(4-phenylphenyl)methyl]-3-(ethoxycarbonyl)propyl]amino]-4-oxobutanoate; (2S)-3-methyl-2-[pentanoyl-[[4-[2-(2H-tetrazol-5-yl)phenyl]phenyl]methyl]amino]butanoate',
    mechanismOfAction: 'Sacubitrilat inhibits neutral endopeptidase (neprilysin), preventing degradation of natriuretic peptides (ANP, BNP, CNP, bradykinin); Valsartan blocks angiotensin II AT1 receptors, preventing vasoconstriction and aldosterone release.',
    targetReceptors: ['Neutral Endopeptidase (Neprilysin)', 'Angiotensin II Type 1 Receptor (AT1)'],
    organDistribution: {
      primaryTarget: 'Myocardium, renal glomeruli, systemic vascular smooth muscle',
      metabolismOrgan: 'Sacubitril undergoes rapid enzymatic esterase cleavage to sacubitrilat; Valsartan undergoes minimal hepatic metabolism (~20%)',
      eliminationRoute: 'Sacubitrilat: urine 52-68%, feces 37-45%; Valsartan: feces 86%, urine 13%'
    },
    pharmacology: {
      metabolism: 'Sacubitril converted by esterases to active sacubitrilat; valsartan minimally metabolized',
      halfLife: 'Sacubitril: 1.4 hours; Sacubitrilat: 11.5 hours; Valsartan: 9.9 hours',
      clearance: 'Dual renal and biliary excretion',
      peakPlasma: 'Sacubitril 0.5h, Sacubitrilat 2h, Valsartan 1.5h',
      bioavailability: 'Sacubitril ≥60%, Valsartan ~23%'
    },
    visualPill: {
      shape: 'Oval',
      color: 'Violet',
      imprint: 'NVR L1',
      score: 'None',
      matchPct: 98.8,
      svgColorPrimary: '#cbd5e1',
      svgColorSecondary: '#a855f7'
    },
    safetyWarnings: [
      'Black Box Warning: Fetal toxicity; discontinue immediately when pregnancy is detected',
      'Strict 36-hour washout period required when switching between ACE inhibitors and Entresto to avoid life-threatening angioedema',
      'Monitor baseline serum potassium and creatinine regularly during initiation and dose titration'
    ],
    foodInteractions: 'Administer with or without food. Avoid potassium-containing salt substitutes.',
    renalDosing: 'eGFR < 30 mL/min: Reduce starting dose to 24/26mg PO twice daily; titrate cautiously.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'C09DX04'
  },
  {
    id: 'rivaroxaban',
    name: 'Rivaroxaban',
    genericName: 'Rivaroxaban',
    brandNames: ['Xarelto'],
    category: 'Anticoagulant',
    dosage: '10mg - 20mg orally once daily (or 15mg twice daily in initial acute VTE)',
    dosageSchedule: '15mg twice daily with food for first 21 days for acute DVT/PE, then 20mg once daily with evening meal for maintenance.',
    indications: 'Non-valvular atrial fibrillation stroke prevention, treatment and secondary prophylaxis of deep vein thrombosis (DVT) and pulmonary embolism (PE), venous thromboembolism prophylaxis post major orthopedic surgery.',
    contraindications: 'Active pathological bleeding, severe hypersensitivity reaction to rivaroxaban, moderate-to-severe hepatic impairment associated with coagulopathy.',
    sideEffects: [
      { name: 'Major Bleeding (Gastrointestinal / Intracranial)', percentage: 3.5 },
      { name: 'Epistaxis / Gingival Bleeding', percentage: 8 },
      { name: 'Hematoma / Ecchymosis', percentage: 6 },
      { name: 'Anemia', percentage: 5 }
    ],
    efficacy: 'Non-inferior to dose-adjusted warfarin in ROCKET-AF for stroke prevention with significant 33% reduction in intracranial hemorrhage.',
    fullDescription: 'Direct Oral Anticoagulant (DOAC) that acts as a highly selective direct Factor Xa inhibitor, terminating the intrinsic and extrinsic pathways of the coagulation cascade.',
    chemicalFormula: 'C19H18ClN3O5S',
    molarMass: '435.88 g/mol',
    iupacName: '5-chloro-N-[[(5S)-2-oxo-3-[4-(3-oxomorpholin-4-yl)phenyl]-1,3-oxazolidin-5-yl]methyl]thiophene-2-carboxamide',
    mechanismOfAction: 'Direct, selective, reversible inhibitor of both free and clot-bound Factor Xa and prothrombinase activity, interrupting thrombin generation without requiring antithrombin III.',
    targetReceptors: ['Activated Coagulation Factor X (Factor Xa)'],
    organDistribution: {
      primaryTarget: 'Systemic vascular circulation and thrombus interfaces',
      metabolismOrgan: 'Liver (CYP3A4/3A5 and CYP2J2 oxidation ~66%)',
      eliminationRoute: 'Renal (36% unchanged drug; total renal 66%) and fecal (28%)'
    },
    pharmacology: {
      metabolism: 'Hepatic ~66% via CYP3A4 and CYP-independent hydrolysis',
      halfLife: '5 - 9 hours in healthy young adults; 11 - 13 hours in elderly patients',
      clearance: 'Renal and hepatobiliary',
      peakPlasma: '2 - 4 hours post-dose',
      bioavailability: '66% fasting (approaches 100% when taken with food for 15mg/20mg tablets)'
    },
    visualPill: {
      shape: 'Triangle',
      color: 'Red',
      imprint: '20 / X',
      score: 'None',
      matchPct: 98.9,
      svgColorPrimary: '#f87171',
      svgColorSecondary: '#dc2626'
    },
    safetyWarnings: [
      'Black Box Warning: Premature discontinuation increases the risk of thrombotic events',
      'Black Box Warning: Epidural or spinal hematomas may occur in patients receiving neuraxial anesthesia or spinal puncture',
      'Tablets of 15mg and 20mg MUST be taken with food to ensure adequate gastrointestinal absorption'
    ],
    foodInteractions: '15mg and 20mg doses must be taken with meals; food substantially increases bioavailability from 66% to ~100%.',
    renalDosing: 'CrCl 15-50 mL/min: Reduce AF dose to 15mg once daily with food. CrCl <15 mL/min: Avoid use.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'B01AF01'
  },
  {
    id: 'paxlovid',
    name: 'Nirmatrelvir / Ritonavir (Paxlovid)',
    genericName: 'Nirmatrelvir and Ritonavir',
    brandNames: ['Paxlovid'],
    category: 'Antiviral',
    dosage: '300mg nirmatrelvir (two 150mg tablets) with 100mg ritonavir (one tablet) twice daily for 5 days',
    dosageSchedule: 'Must be initiated as soon as possible after COVID-19 diagnosis and within 5 days of symptom onset.',
    indications: 'Treatment of mild-to-moderate COVID-19 in adults at high risk for progression to severe disease, hospitalization, or death.',
    contraindications: 'Severe renal impairment (eGFR <30 mL/min), severe hepatic impairment (Child-Pugh Class C), concomitant drugs highly dependent on CYP3A for clearance where elevated concentrations cause serious or life-threatening reactions.',
    sideEffects: [
      { name: 'Dysgeusia (Metallic / Bitter Taste)', percentage: 6 },
      { name: 'Diarrhea', percentage: 3.5 },
      { name: 'Headache', percentage: 2 },
      { name: 'Hypertension', percentage: 1.5 }
    ],
    efficacy: 'EPIC-HR trial showed 89% relative risk reduction in COVID-19-related hospitalization or death compared to placebo in non-hospitalized high-risk patients.',
    fullDescription: 'Co-packaged oral antiviral consisting of nirmatrelvir, a SARS-CoV-2 main protease (Mpro / 3CLpro) inhibitor, and ritonavir, a potent pharmacokinetic CYP3A booster that sustains therapeutic nirmatrelvir plasma concentrations.',
    chemicalFormula: 'Nirmatrelvir: C23H32F3N5O4; Ritonavir: C37H48N6O5S2',
    molarMass: 'Nirmatrelvir: 499.53 g/mol; Ritonavir: 720.95 g/mol',
    iupacName: '(1R,2S,5S)-N-[(1S)-1-cyano-2-[(3S)-2-oxopyrrolidin-3-yl]ethyl]-3-[(2S)-3,3-dimethyl-2-(2,2,2-trifluoroacetamido)butanoyl]-6,6-dimethyl-3-azabicyclo[3.1.0]hexane-2-carboxamide',
    mechanismOfAction: 'Nirmatrelvir binds reversibly to the catalytic Cys145 residue of SARS-CoV-2 main protease (Mpro/3CLpro), blocking viral polyprotein cleavage; Ritonavir irreversibly inhibits CYP3A4 to prevent nirmatrelvir degradation.',
    targetReceptors: ['SARS-CoV-2 Main Protease (3CLpro / Mpro)', 'Human Hepatic Cytochrome P450 3A4 (inhibition)'],
    organDistribution: {
      primaryTarget: 'Respiratory epithelium, pharyngeal tissues, systemic viral replication sites',
      metabolismOrgan: 'Nirmatrelvir: predominantly metabolised by CYP3A4 (blocked by ritonavir); Ritonavir: hepatic CYP3A4/CYP2D6',
      eliminationRoute: 'Nirmatrelvir: renal (49.6%) and feces (35.3%); Ritonavir: feces (86.4%) and urine (11.3%)'
    },
    pharmacology: {
      metabolism: 'Hepatic CYP3A4 mediated (substantially blunted by concurrent ritonavir)',
      halfLife: 'Nirmatrelvir: 6.05 hours with ritonavir; Ritonavir: 6.1 hours',
      clearance: 'Combined renal and fecal clearance',
      peakPlasma: 'Nirmatrelvir: 3.0 hours post-dose; Ritonavir: 3.98 hours',
      bioavailability: 'Significantly enhanced by ritonavir boosting'
    },
    visualPill: {
      shape: 'Oval',
      color: 'Pink',
      imprint: '3CL / R9',
      score: 'None',
      matchPct: 99.2,
      svgColorPrimary: '#f472b6',
      svgColorSecondary: '#f8fafc'
    },
    safetyWarnings: [
      'Severe Drug-Drug Interactions: Ritonavir is an ultra-potent CYP3A inhibitor; comprehensively review patient medication list before prescribing',
      'Hepatotoxicity: Hepatic transaminase elevations, hepatitis, and jaundice have occurred with ritonavir',
      'Risk of HIV-1 protease inhibitor resistance in patients with uncontrolled or undiagnosed HIV-1 infection'
    ],
    foodInteractions: 'Administer with or without food. Swallow tablets whole; do not chew, break, or crush.',
    renalDosing: 'eGFR 30-59 mL/min: Reduce nirmatrelvir dose to 150mg (one tablet) with ritonavir 100mg (one tablet) twice daily for 5 days. eGFR <30 mL/min: Contraindicated.',
    pregnancyRisk: 'Caution',
    atcCode: 'J05AE30'
  },
  {
    id: 'pembrolizumab',
    name: 'Pembrolizumab',
    genericName: 'Pembrolizumab',
    brandNames: ['Keytruda'],
    category: 'Oncology',
    dosage: '200mg IV every 3 weeks or 400mg IV every 6 weeks',
    dosageSchedule: 'Administer as an intravenous infusion over 30 minutes via a dedicated line with a sterile, non-pyrogenic, low-protein-binding 0.2 to 5 micron inline filter.',
    indications: 'Metastatic melanoma, non-small cell lung cancer (NSCLC), head and neck squamous cell carcinoma, classical Hodgkin lymphoma, urothelial carcinoma, microsatellite instability-high (MSI-H) or mismatch repair deficient (dMMR) solid tumors.',
    contraindications: 'Severe hypersensitivity to pembrolizumab or its excipients.',
    sideEffects: [
      { name: 'Immune-Mediated Pneumonitis', percentage: 4 },
      { name: 'Immune-Mediated Colitis / Diarrhea', percentage: 11 },
      { name: 'Immune-Mediated Endocrinopathies (Hypo/Hyperthyroidism, Hypophysitis)', percentage: 14 },
      { name: 'Immune-Mediated Hepatitis (Elevated AST/ALT)', percentage: 3.5 }
    ],
    efficacy: 'Paradigm-shifting immunotherapy yielding durable complete responses and superior progression-free survival in KEYNOTE clinical trials across multiple oncologic indications.',
    fullDescription: 'Humanized monoclonal IgG4-kappa isotype antibody directed against the Programmed Death-1 (PD-1) receptor. Disables the tumor immune evasion checkpoint, restoring cytotoxic T-lymphocyte antitumor immunity.',
    chemicalFormula: 'C6504H10004N1716O2036S46 (approximate intact antibody)',
    molarMass: '149 kDa (149,000 g/mol)',
    iupacName: 'Immunoglobulin G4, anti-(human programmed cell death protein 1) (human-mouse monoclonal heavy chain), disulfide with human-mouse monoclonal light chain, dimer',
    mechanismOfAction: 'Binds with high affinity to the PD-1 receptor on T cells, blocking interaction with its ligands PD-L1 and PD-L2 on tumor cells, releasing PD-1 pathway-mediated inhibition of the immune response.',
    targetReceptors: ['Programmed Cell Death Protein 1 (PD-1 / CD279)'],
    organDistribution: {
      primaryTarget: 'Intratumoral immune microenvironment, lymphoid organs, systemic T-cell pool',
      metabolismOrgan: 'Catabolized through non-specific protein degradation pathways into small peptides and amino acids',
      eliminationRoute: 'Non-specific pinocytosis and reticuloendothelial degradation'
    },
    pharmacology: {
      metabolism: 'Non-saturable non-specific proteolytic catabolism',
      halfLife: '22 days (terminal elimination half-life)',
      clearance: '0.2 L/day systemic clearance',
      peakPlasma: 'Achieved immediately at end of 30-minute IV infusion',
      bioavailability: '100% IV'
    },
    visualPill: {
      shape: 'Oblong',
      color: 'Clear',
      imprint: 'KEYTRUDA 100MG',
      score: 'None',
      matchPct: 99.5,
      svgColorPrimary: '#38bdf8',
      svgColorSecondary: '#6366f1'
    },
    safetyWarnings: [
      'Severe Immune-Mediated Adverse Reactions (imARs) can involve any organ system and may be fatal',
      'Early identification and prompt administration of systemic corticosteroids (e.g. 1-2 mg/kg/day prednisone equivalent) are essential',
      'Infusion-related reactions: Interrupt or slow rate of infusion for mild-moderate reactions; permanently discontinue for Grade 3 or 4'
    ],
    foodInteractions: 'IV administration; unaffected by dietary food intake.',
    renalDosing: 'No dose adjustment required for mild to moderate renal impairment; limited data in severe impairment.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'L01FF02'
  },
  {
    id: 'levothyroxine',
    name: 'Levothyroxine Sodium',
    genericName: 'Levothyroxine',
    brandNames: ['Synthroid', 'Levoxyl', 'Tirosint'],
    category: 'Endocrine',
    dosage: '25mcg - 200mcg orally once daily in the morning',
    dosageSchedule: 'Must be taken on an empty stomach with a full glass of water, at least 30-60 minutes before breakfast or caffeine intake.',
    indications: 'Primary, secondary, and tertiary hypothyroidism, pituitary TSH suppression in thyroid cancer management, nontoxic goiter.',
    contraindications: 'Uncorrected subclinical or overt thyrotoxicosis, uncorrected adrenal insufficiency, acute myocardial infarction.',
    sideEffects: [
      { name: 'Palpitations / Tachycardia (Overtreatment)', percentage: 6 },
      { name: 'Insomnia and Restlessness', percentage: 4 },
      { name: 'Weight Loss and Heat Intolerance', percentage: 5 },
      { name: 'Accelerated Bone Mineral Loss (Long-term oversuppression)', percentage: 2 }
    ],
    efficacy: 'Gold standard synthetic thyroid hormone restoring serum TSH and free T4 euthyroid reference ranges in >95% of patients.',
    fullDescription: 'Synthetic crystalline levo-isomer of thyroxine (T4) identical to the endogenous hormone produced by the human thyroid gland. Converted peripherally by deiodinases into the biologically active triiodothyronine (T3).',
    chemicalFormula: 'C15H10I4NNaO4',
    molarMass: '798.85 g/mol',
    iupacName: 'sodium;4-(4-hydroxy-3,5-diiodophenoxy)-3,5-diiodophenylalanine',
    mechanismOfAction: 'Binds to nuclear thyroid hormone receptors (TR-alpha and TR-beta) after peripheral monodeiodination to T3, regulating gene transcription responsible for metabolic rate, cardiac inotropy, and thermogenesis.',
    targetReceptors: ['Nuclear Thyroid Hormone Receptors (TR-alpha, TR-beta)'],
    organDistribution: {
      primaryTarget: 'Cardiovascular system, skeletal muscle, liver, central nervous system',
      metabolismOrgan: 'Liver (5-prime-monodeiodination to active T3 and inactive reverse T3; glucuronidation and sulfation)',
      eliminationRoute: 'Kidneys (~80%) and feces (~20%)'
    },
    pharmacology: {
      metabolism: 'Hepatic monodeiodination to active T3',
      halfLife: '6 - 7 days in euthyroid patients (9-10 days in hypothyroid; 3-4 days in hyperthyroid)',
      clearance: 'Biliary and urinary clearance of iodinated metabolites',
      peakPlasma: '2 - 4 hours post oral dose',
      bioavailability: '64 - 80% when fasting (decreases markedly with food, iron, calcium)'
    },
    visualPill: {
      shape: 'Round',
      color: 'Violet',
      imprint: 'SYNTHROID 100',
      score: 'Scored',
      matchPct: 99.0,
      svgColorPrimary: '#ddd6fe',
      svgColorSecondary: '#8b5cf6'
    },
    safetyWarnings: [
      'Black Box Warning: Not for use in the treatment of obesity or weight loss; supratherapeutic doses can produce lethal toxicity',
      'In elderly patients or patients with cardiovascular disease, initiate at lower doses (e.g. 12.5-25 mcg/day) to avoid cardiac decompensation',
      'Separate administration by at least 4 hours from calcium supplements, iron, sucralfate, or antacids'
    ],
    foodInteractions: 'Coffee, dietary fiber, calcium, and soybean flour significantly impair absorption; strictly take on an empty stomach.',
    renalDosing: 'No dose adjustment required for renal impairment.',
    pregnancyRisk: 'Safe',
    atcCode: 'H03AA01'
  },
  {
    id: 'spironolactone',
    name: 'Spironolactone',
    genericName: 'Spironolactone',
    brandNames: ['Aldactone', 'CaroSpir'],
    category: 'Cardiovascular',
    dosage: '25mg - 100mg orally once or twice daily',
    dosageSchedule: 'Take once daily in the morning with food to minimize nocturnal diuresis and enhance oral absorption.',
    indications: 'Heart failure with reduced ejection fraction (HFrEF NYHA II-IV), primary hyperaldosteronism, resistant hypertension, cirrhosis with ascites and edema.',
    contraindications: 'Severe renal impairment (eGFR <30 mL/min), hyperkalemia (serum K >5.0 mEq/L), Addison disease, concomitant eplerenone or potassium supplements.',
    sideEffects: [
      { name: 'Hyperkalemia', percentage: 10 },
      { name: 'Gynecomastia / Breast Tenderness (Male)', percentage: 9 },
      { name: 'Menstrual Irregularities', percentage: 4 },
      { name: 'Dizziness and Hypotension', percentage: 5 }
    ],
    efficacy: 'RALES trial showed a 30% relative reduction in all-cause mortality in severe heart failure when added to standard therapy.',
    fullDescription: 'Potent mineralocorticoid receptor antagonist (potassium-sparing diuretic) that competitively inhibits aldosterone binding in the distal convoluted tubule and collecting duct.',
    chemicalFormula: 'C24H32O4S',
    molarMass: '416.57 g/mol',
    iupacName: '7alpha-acetylthio-3-oxospiro[androst-4-ene-17,5-oxolane]-2-one',
    mechanismOfAction: 'Competitive antagonist of cytoplasmic aldosterone receptors in the late distal tubule and collecting ducts, increasing NaCl and water excretion while retaining potassium and hydrogen ions.',
    targetReceptors: ['Cytoplasmic Mineralocorticoid (Aldosterone) Receptors', 'Androgen Receptors (partial antagonist)'],
    organDistribution: {
      primaryTarget: 'Distal convoluted tubules and cortical collecting ducts of renal nephrons',
      metabolismOrgan: 'Liver (rapid and extensive hepatic conversion to active canrenone and 7alpha-thiomethylspironolactone)',
      eliminationRoute: 'Urine (mostly as metabolites) and bile/feces'
    },
    pharmacology: {
      metabolism: 'Rapid and extensive conversion to active canrenone',
      halfLife: 'Spironolactone: 1.4 hours; Active metabolite canrenone: 16.5 hours',
      clearance: 'Combined urinary and biliary',
      peakPlasma: '2.6 to 4.3 hours',
      bioavailability: '60 - 90% (food significantly increases absorption)'
    },
    visualPill: {
      shape: 'Round',
      color: 'Yellow',
      imprint: 'ALDACTONE 25',
      score: 'Scored',
      matchPct: 98.6,
      svgColorPrimary: '#fef9c3',
      svgColorSecondary: '#ca8a04'
    },
    safetyWarnings: [
      'Monitor serum potassium and creatinine within 1 week of initiation or dose escalation, then periodically',
      'Discontinue or down-titrate if serum potassium exceeds 5.5 mEq/L',
      'Avoid high-potassium foods and salt substitutes containing potassium chloride'
    ],
    foodInteractions: 'Taking with food markedly improves bioavailability and decreases gastric upset.',
    renalDosing: 'eGFR 30-50 mL/min: Reduce dose to 12.5-25mg every other day or 25mg daily. eGFR <30 mL/min: Contraindicated.',
    pregnancyRisk: 'Caution',
    atcCode: 'C03DA01'
  },
  {
    id: 'doxycycline',
    name: 'Doxycycline Hyclate',
    genericName: 'Doxycycline',
    brandNames: ['Vibramycin', 'Doryx', 'Monodox'],
    category: 'Antibiotic',
    dosage: '100mg orally or IV every 12 hours on day 1, then 100mg once or twice daily',
    dosageSchedule: 'Must be taken with a full 8 oz glass of water; patient must remain upright for at least 30 minutes to prevent pill-induced erosive esophagitis.',
    indications: 'Community-acquired atypical pneumonia (Mycoplasma, Chlamydia, Legionella), tick-borne rickettsial diseases (Lyme disease, Rocky Mountain spotted fever), MRSA skin infections, malaria prophylaxis, severe acne vulgaris.',
    contraindications: 'Hypersensitivity to tetracyclines, pregnancy (second and third trimesters), children under 8 years of age (except for life-threatening rickettsial infections).',
    sideEffects: [
      { name: 'Pill-Induced Esophagitis / Esophageal Ulceration', percentage: 4 },
      { name: 'Photosensitivity / Exaggerated Sunburn', percentage: 9 },
      { name: 'Nausea and Vomiting', percentage: 12 },
      { name: 'Tooth Discoloration in pediatric development', percentage: 2 }
    ],
    efficacy: 'Highly effective broad-spectrum oral antimicrobial with superior tissue penetration and excellent bioavailability.',
    fullDescription: 'Broad-spectrum synthetic tetracycline antibiotic that binds reversibly to the 30S bacterial ribosomal subunit, preventing protein synthesis in Gram-positive, Gram-negative, and atypical pathogens.',
    chemicalFormula: 'C22H24N2O8',
    molarMass: '444.43 g/mol',
    iupacName: '(4S,4aR,5S,5aR,6R,12aS)-4-(dimethylamino)-3,5,10,12,12a-pentahydroxy-6-methyl-1,11-dioxo-1,4,4a,5,5a,6,11,12a-octahydrotetracene-2-carboxamide',
    mechanismOfAction: 'Reversibly binds to the 30S ribosomal subunit, preventing access of aminoacyl-tRNA to the ribosomal acceptor (A) site, arresting protein translation.',
    targetReceptors: ['Bacterial 30S Ribosomal Subunit (A-site)'],
    organDistribution: {
      primaryTarget: 'Lungs, bronchial secretions, skin, prostate, eye, intracellular pathogen niches',
      metabolismOrgan: 'Partially metabolized in the liver; largely non-renal elimination via intestinal chelation',
      eliminationRoute: 'Biliary and fecal excretion (~50%) and urine (~30-40%)'
    },
    pharmacology: {
      metabolism: 'Partially metabolized by liver; safe in renal insufficiency due to intestinal elimination',
      halfLife: '18 - 22 hours',
      clearance: 'Hepato-intestinal and renal',
      peakPlasma: '1.5 - 4 hours',
      bioavailability: '90 - 100% oral absorption'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Blue',
      imprint: 'VIBRA 100',
      score: 'None',
      matchPct: 98.7,
      svgColorPrimary: '#bae6fd',
      svgColorSecondary: '#0284c7'
    },
    safetyWarnings: [
      'Take with copious fluid and remain upright for ≥30 minutes to prevent caustic esophageal ulcers',
      'Advise patient to wear sunscreen and avoid ultraviolet light due to photosensitivity',
      'Can bind polyvalent cations (aluminum, calcium, magnesium, iron); separate intake by 2-3 hours'
    ],
    foodInteractions: 'Can be taken with food or milk if gastric irritation occurs without substantially impeding clinical bioavailability (unlike older tetracyclines).',
    renalDosing: 'No dosage adjustments required in renal dysfunction; preferred tetracycline in kidney disease.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'J01AA02'
  },
  {
    id: 'duloxetine',
    name: 'Duloxetine Hydrochloride',
    genericName: 'Duloxetine',
    brandNames: ['Cymbalta'],
    category: 'Psychiatric / Antidepressant',
    dosage: '30mg - 60mg orally once daily (Max 120mg/day)',
    dosageSchedule: 'Swallow whole with or without meals; do not crush, chew, or open delayed-release capsules.',
    indications: 'Major depressive disorder (MDD), generalized anxiety disorder (GAD), diabetic peripheral neuropathic pain, fibromyalgia, chronic musculoskeletal pain (osteoarthritis, chronic lower back pain).',
    contraindications: 'Concomitant MAOIs, uncontrolled narrow-angle glaucoma, severe hepatic impairment or heavy alcohol consumption.',
    sideEffects: [
      { name: 'Nausea', percentage: 23 },
      { name: 'Dry Mouth (Xerostomia)', percentage: 14 },
      { name: 'Somnolence or Fatigue', percentage: 11 },
      { name: 'Excessive Sweating (Diaphoresis)', percentage: 6 }
    ],
    efficacy: 'Clinically superior efficacy in treating painful somatic and neuropathic symptoms compared to selective serotonin reuptake inhibitors alone.',
    fullDescription: 'Potent and balanced Serotonin and Norepinephrine Reuptake Inhibitor (SNRI) with weak dopamine reuptake inhibition. Modulates descending inhibitory pain pathways in the dorsal horn of the spinal cord.',
    chemicalFormula: 'C18H19NOS',
    molarMass: '297.41 g/mol',
    iupacName: '(3S)-N-methyl-3-naphthalen-1-yloxy-3-thiophen-2-ylpropan-1-amine',
    mechanismOfAction: 'Inhibits neuronal reuptake of serotonin (5-HT) and norepinephrine (NE), enhancing neurotransmission in central descending inhibitory nociceptive pathways.',
    targetReceptors: ['Serotonin Transporter (SERT)', 'Norepinephrine Transporter (NET)'],
    organDistribution: {
      primaryTarget: 'Central nervous system, spinal dorsal horn pain gates, thalamic projections',
      metabolismOrgan: 'Liver (extensively by CYP1A2 and CYP2D6 to multiple inactive glucuronide/sulfate conjugates)',
      eliminationRoute: 'Urine (70%) and feces (20%)'
    },
    pharmacology: {
      metabolism: 'Extensive hepatic CYP1A2 and CYP2D6 biotransformation',
      halfLife: '12 hours',
      clearance: 'Hepatic and renal metabolite clearance',
      peakPlasma: '6 hours post-dose (delayed by 2 hours with food)',
      bioavailability: '30 - 80% (enteric coated to protect from gastric acid degradation)'
    },
    visualPill: {
      shape: 'Capsule',
      color: 'Blue',
      imprint: 'CYMBALTA 60',
      score: 'None',
      matchPct: 98.8,
      svgColorPrimary: '#86efac',
      svgColorSecondary: '#0284c7'
    },
    safetyWarnings: [
      'Black Box Warning: Increased risk of suicidal thoughts and behaviors in pediatric and young adult patients',
      'Monitor blood pressure; SNRIs can elevate systolic and diastolic blood pressure through adrenergic stimulation',
      'Taper gradually when discontinuing to prevent severe SNRI discontinuation syndrome'
    ],
    foodInteractions: 'Administer with or without food. Food delays peak plasma concentrations without affecting total AUC.',
    renalDosing: 'CrCl <30 mL/min: Avoid use due to substantial accumulation of glucuronide metabolites.',
    pregnancyRisk: 'Caution',
    atcCode: 'N06AX21'
  },
  {
    id: 'lorazepam',
    name: 'Lorazepam',
    genericName: 'Lorazepam',
    brandNames: ['Ativan'],
    category: 'Emergency / Critical Care',
    dosage: '0.5mg - 2mg orally or 2 - 4mg slow IV push every 4-6 hours PRN',
    dosageSchedule: 'For status epilepticus: 4mg slow IV push over 2 minutes; repeat once at 10-15 minutes if seizure activity persists.',
    indications: 'Status epilepticus termination, acute anxiety and panic agitation, pre-operative sedative anxiolysis, ICU mechanical ventilation agitation, alcohol withdrawal delirium tremens.',
    contraindications: 'Severe respiratory depression, acute narrow-angle glaucoma, severe hypersensitivity to benzodiazepines, myasthenia gravis.',
    sideEffects: [
      { name: 'Sedation and Drowsiness', percentage: 16 },
      { name: 'Respiratory Depression', percentage: 4 },
      { name: 'Hypotension and Ataxia', percentage: 7 },
      { name: 'Paradoxical Agitation', percentage: 1 }
    ],
    efficacy: 'First-line emergency standard of care for aborting prolonged epileptic seizures with superior duration of seizure control compared to diazepam.',
    fullDescription: 'High-potency, intermediate-acting benzodiazepine that enhances the inhibitory action of gamma-aminobutyric acid (GABA) via allosteric binding to the GABA-A receptor complex.',
    chemicalFormula: 'C15H10Cl2N2O2',
    molarMass: '321.16 g/mol',
    iupacName: '7-chloro-5-(2-chlorophenyl)-3-hydroxy-1,3-dihydro-1,4-benzodiazepin-2-one',
    mechanismOfAction: 'Allosterically modulates GABA-A receptors, increasing channel opening frequency for chloride ions, hyperpolarizing neuronal membranes and dampening epileptiform excitability.',
    targetReceptors: ['GABA-A Receptor Benzodiazepine Allosteric Site (Alpha-1/Gamma-2 interface)'],
    organDistribution: {
      primaryTarget: 'Cerebral cortex, limbic system, subcortical thalamic nuclei, reticular activating system',
      metabolismOrgan: 'Liver (simple Phase II glucuronidation directly to inactive lorazepam glucuronide; bypasses CYP oxidation)',
      eliminationRoute: 'Kidneys (inactive glucuronide metabolite ~75%)'
    },
    pharmacology: {
      metabolism: 'Direct Phase II glucuronidation (safe in liver disease; no active oxidative metabolites)',
      halfLife: '10 - 20 hours',
      clearance: 'Renal clearance of glucuronide conjugate',
      peakPlasma: '2 hours oral, 15-30 mins IM, immediately post IV',
      bioavailability: '90% oral'
    },
    visualPill: {
      shape: 'Round',
      color: 'White',
      imprint: 'ATIVAN 1',
      score: 'Scored',
      matchPct: 99.2,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#cbd5e1'
    },
    safetyWarnings: [
      'Black Box Warning: Concomitant use with opioids may result in profound sedation, respiratory depression, coma, and death',
      'Black Box Warning: Risk of abuse, misuse, addiction, and severe physical dependence; taper cautiously',
      'Monitor continuous pulse oximetry and capnography when administering IV in acute care settings'
    ],
    foodInteractions: 'Oral formulation can be taken with or without food. Alcohol markedly potentiates CNS depression.',
    renalDosing: 'No dosage adjustments necessary in mild-to-moderate renal failure; in continuous IV infusions monitor for propylene glycol vehicle toxicity.',
    pregnancyRisk: 'Contraindicated',
    atcCode: 'N05BA06'
  },
  {
    id: 'esmolol',
    name: 'Esmolol Hydrochloride',
    genericName: 'Esmolol',
    brandNames: ['Brevibloc'],
    category: 'Cardiology / Antiarrhythmic',
    dosage: 'Loading dose 500 mcg/kg IV over 1 min, followed by maintenance infusion of 50 - 200 mcg/kg/min',
    dosageSchedule: 'Continuous IV micro-infusion with invasive arterial line hemodynamic monitoring; titrate by 50 mcg/kg/min increments every 4 minutes.',
    indications: 'Rapid ventricular rate control in atrial fibrillation or flutter, perioperative supraventricular tachycardia, acute aortic dissection (in conjunction with nitroprusside), intraoperative hypertension.',
    contraindications: 'Severe sinus bradycardia (HR <45 bpm), second- or third-degree heart block, cardiogenic shock, decompensated overt heart failure, severe bronchospasm.',
    sideEffects: [
      { name: 'Dose-Dependent Hypotension', percentage: 25 },
      { name: 'Bradycardia', percentage: 8 },
      { name: 'Infusion Site Phlebitis', percentage: 5 },
      { name: 'Bronchospasm', percentage: 2 }
    ],
    efficacy: 'Rapid onset within 2 minutes and ultra-short duration of action (effects resolve within 10-20 minutes after infusion cessation).',
    fullDescription: 'Ultra-short-acting, cardioselective beta-1 adrenergic receptor antagonist administered exclusively by continuous intravenous infusion. Rapidly hydrolyzed by red blood cell esterases.',
    chemicalFormula: 'C16H25NO4 * HCl',
    molarMass: '331.83 g/mol',
    iupacName: 'methyl 3-[4-[2-hydroxy-3-(propan-2-ylamino)propoxy]phenyl]propanoate hydrochloride',
    mechanismOfAction: 'Competitively and selectively blocks cardiac beta-1 adrenergic receptors, diminishing sympathomimetic chronotropy, inotropy, and AV nodal conduction velocity.',
    targetReceptors: ['Cardiac Beta-1 Adrenergic Receptors'],
    organDistribution: {
      primaryTarget: 'Sinoatrial node, atrioventricular node, ventricular myocardium',
      metabolismOrgan: 'Red blood cell cytosolic esterases (independent of hepatic or renal enzymatic clearance)',
      eliminationRoute: 'Urine (as free acid metabolite ~75-80%)'
    },
    pharmacology: {
      metabolism: 'Rapid hydrolysis by erythrocyte cytosol esterases',
      halfLife: '9 minutes (terminal elimination half-life)',
      clearance: 'Red blood cell esterase hydrolysis (20 L/kg/h)',
      peakPlasma: 'Steadily reached within 5 minutes with loading bolus',
      bioavailability: '100% IV'
    },
    visualPill: {
      shape: 'Oblong',
      color: 'Clear',
      imprint: 'BREVIBLOC 10MG/ML',
      score: 'None',
      matchPct: 99.6,
      svgColorPrimary: '#2dd4bf',
      svgColorSecondary: '#0f766e'
    },
    safetyWarnings: [
      'Frequent blood pressure and ECG monitoring required; hypotension is the most common adverse effect and quickly reverses on down-titration',
      'Infuse through central vein or large peripheral vein; extravasation can cause localized tissue necrosis',
      'In acute aortic dissection, beta-blocker must be administered PRIOR to vasodilator to avoid reflex tachycardia'
    ],
    foodInteractions: 'Exclusively administered via continuous IV infusion in monitored hospital ICU/OR settings.',
    renalDosing: 'No dose adjustment required for renal impairment (metabolite accumulates but possesses 1500-fold weaker affinity).',
    pregnancyRisk: 'Caution',
    atcCode: 'C07AB09'
  },
  {
    id: 'hydroxychloroquine',
    name: 'Hydroxychloroquine Sulfate',
    genericName: 'Hydroxychloroquine',
    brandNames: ['Plaquenil'],
    category: 'Rheumatology / Immunology',
    dosage: '200mg - 400mg orally once daily (Max 5.0 mg/kg actual body weight/day)',
    dosageSchedule: 'Take with food or a glass of milk to prevent gastrointestinal upset; annual baseline and maintenance ophthalmologic screening mandatory.',
    indications: 'Systemic lupus erythematosus (SLE) acute flare suppression and organ damage prevention, active rheumatoid arthritis, chronic discoid lupus, malaria chemoprophylaxis.',
    contraindications: 'Pre-existing retinopathy or retinal macular pathology, known hypersensitivity to 4-aminoquinoline compounds.',
    sideEffects: [
      { name: 'Retinal Toxicity / Bullseye Maculopathy', percentage: 2 },
      { name: 'Gastrointestinal Cramping & Nausea', percentage: 8 },
      { name: 'Skin Hyperpigmentation', percentage: 4 },
      { name: 'QT Interval Prolongation', percentage: 1.5 }
    ],
    efficacy: 'Essential foundation therapy for SLE; proven in landmark cohort trials to halve mortality, prevent lupus nephritis, and lower thrombosis risk.',
    fullDescription: 'Disease-Modifying Antirheumatic Drug (DMARD) and antimalarial that concentrates in intracellular lysosomes, raising endosomal pH and dampening autoantigen presentation and toll-like receptor activation.',
    chemicalFormula: 'C18H26ClN3O * H2SO4',
    molarMass: '433.95 g/mol',
    iupacName: '2-[[4-[(7-chloroquinolin-4-yl)amino]pentyl](ethyl)amino]ethanol sulfate',
    mechanismOfAction: 'Accumulates in intracellular acidic vacuoles, raising endosomal/lysosomal pH, blocking toll-like receptor (TLR7/9) signaling and antigen processing in dendritic cells.',
    targetReceptors: ['Endosomal Toll-Like Receptors 7 and 9 (TLR-7, TLR-9)', 'Lysosomal Vacuolar H+-ATPase'],
    organDistribution: {
      primaryTarget: 'Monocytes, macrophages, dendritic cells, hepatic tissue, melanin-rich retinal pigment epithelium',
      metabolismOrgan: 'Liver (CYP3A4, CYP2C8, CYP2D6 to desethylhydroxychloroquine)',
      eliminationRoute: 'Kidneys (15-25% unchanged drug) and feces'
    },
    pharmacology: {
      metabolism: 'Extensive hepatic dealkylation and conversion to active desethyl metabolite',
      halfLife: '40 - 50 days (due to massive tissue distribution and cellular accumulation)',
      clearance: 'Slow renal and biliary elimination over several months',
      peakPlasma: '2 - 4 hours',
      bioavailability: '74%'
    },
    visualPill: {
      shape: 'Round',
      color: 'White',
      imprint: 'PLAQUENIL 200',
      score: 'Scored',
      matchPct: 98.9,
      svgColorPrimary: '#f8fafc',
      svgColorSecondary: '#94a3b8'
    },
    safetyWarnings: [
      'Retinal Toxicity: Baseline dilated ophthalmologic exam and visual field testing within 1st year, then annually after 5 years',
      'Dosing must not exceed 5.0 mg/kg actual body weight per day to prevent irreversible macular damage',
      'Assess baseline ECG and caution in patients with congenital long QT syndrome or concomitant QT-prolonging drugs'
    ],
    foodInteractions: 'Administer with food or milk to minimize gastrointestinal discomfort.',
    renalDosing: 'eGFR <30 mL/min: Reduce dose by 25-50% or monitor drug concentrations due to prolonged excretion.',
    pregnancyRisk: 'Safe',
    atcCode: 'P01BA02'
  },
  {
    id: 'dapagliflozin',
    name: 'Dapagliflozin',
    genericName: 'Dapagliflozin',
    brandNames: ['Farxiga'],
    category: 'Cardiovascular',
    dosage: '5mg - 10mg orally once daily in the morning',
    dosageSchedule: 'Take once daily with or without food. Do not double doses if missed.',
    indications: 'Heart failure with reduced or preserved ejection fraction to reduce hospitalization, chronic kidney disease (CKD) at risk of progression, type 2 diabetes mellitus glycemic management.',
    contraindications: 'Severe hypersensitivity reaction to dapagliflozin, patients on ongoing dialysis therapy.',
    sideEffects: [
      { name: 'Genital Mycotic Infections', percentage: 6 },
      { name: 'Urinary Tract Infections', percentage: 7 },
      { name: 'Volume Depletion', percentage: 3 },
      { name: 'Hypoglycemia (when combined with sulfonylureas or insulin)', percentage: 4 }
    ],
    efficacy: 'DAPA-HF and DAPA-CKD trials established significant 26% reduction in cardiovascular death/HF hospitalization and 39% reduction in renal disease progression.',
    fullDescription: 'Selective sodium-glucose cotransporter 2 (SGLT2) inhibitor delivering organ-protective cardiovascular and nephron hemodynamic benefits independent of diabetes status.',
    chemicalFormula: 'C21H25ClO6',
    molarMass: '408.87 g/mol',
    iupacName: '(2S,3R,4R,5S,6R)-2-[4-chloro-3-[(4-ethoxyphenyl)methyl]phenyl]-6-(hydroxymethyl)oxane-3,4,5-triol',
    mechanismOfAction: 'Inhibits SGLT2 in the S1 segment of proximal renal tubules, reducing glucose and sodium reabsorption, promoting osmotic diuresis and restoring tubuloglomerular feedback to lower intraglomerular pressure.',
    targetReceptors: ['Sodium-Glucose Cotransporter 2 (SGLT2)'],
    organDistribution: {
      primaryTarget: 'Proximal convoluted tubules of renal glomeruli',
      metabolismOrgan: 'Liver (primarily UGT1A9 to inactive dapagliflozin 3-O-glucuronide)',
      eliminationRoute: 'Urine (75% primarily as inactive glucuronide) and feces (21%)'
    },
    pharmacology: {
      metabolism: 'Extensive glucuronidation via UGT1A9; no significant CYP450 involvement',
      halfLife: '12.9 hours',
      clearance: 'Renal and fecal elimination',
      peakPlasma: '2 hours post-dose fasting',
      bioavailability: '78%'
    },
    visualPill: {
      shape: 'Diamond',
      color: 'Yellow',
      imprint: '10 / 1428',
      score: 'None',
      matchPct: 99.1,
      svgColorPrimary: '#fef08a',
      svgColorSecondary: '#f59e0b'
    },
    safetyWarnings: [
      'Maintain adequate fluid intake to avoid symptomatic dehydration and postural hypotension',
      'Assess for euglycemic diabetic ketoacidosis in symptomatic patients even with normal blood glucose levels',
      'Withhold medication for at least 3 days before elective surgical procedures'
    ],
    foodInteractions: 'Administer with or without food.',
    renalDosing: 'eGFR 25-45 mL/min: 10mg once daily for HF/CKD benefits. eGFR <25 mL/min: Initiation not recommended, but may be continued to reduce CKD progression until dialysis.',
    pregnancyRisk: 'Caution',
    atcCode: 'A10BK01'
  }
];
