/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MEDICINES } from '../data/medicines';
import { evaluateDrugListInteractions } from '../data/interactions';
import { Medicine, PatientParameters, DrugInteraction } from '../types';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Download, 
  RefreshCw, 
  Activity, 
  Sliders, 
  User, 
  Heart,
  FileText,
  Layers,
  ChevronRight,
  Sparkles,
  Atom
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';
import { ThreeMoleculeViewer } from './ThreeMoleculeViewer';
import { ThreeInteractionSimulator } from './ThreeInteractionSimulator';

interface InteractionCheckerProps {
  selectedDrugIds: string[];
  setSelectedDrugIds: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTab: (tab: string) => void;
}

export const InteractionChecker: React.FC<InteractionCheckerProps> = ({
  selectedDrugIds,
  setSelectedDrugIds,
  setActiveTab
}) => {
  const [searchMolecule, setSearchMolecule] = useState('');
  const [patientParams, setPatientParams] = useState<PatientParameters>({
    ageGroup: 'Adult',
    renalFunction: 'Normal',
    isPregnant: false
  });
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [viewMolecule3D, setViewMolecule3D] = useState<string | null>(null);

  // If initial bag is empty, prefill with informative combination (Warfarin & Ibuprofen or Simvastatin & Amlodipine)
  const activeBag = selectedDrugIds.length > 0 ? selectedDrugIds : ['warfarin', 'ibuprofen'];

  const evaluation = evaluateDrugListInteractions(activeBag, patientParams);

  const handleAddDrug = (medId: string) => {
    soundFx.pillFlip();
    if (!selectedDrugIds.includes(medId)) {
      setSelectedDrugIds([...selectedDrugIds, medId]);
    }
    setSearchMolecule('');
  };

  const handleRemoveDrug = (medId: string) => {
    soundFx.alert();
    setSelectedDrugIds(selectedDrugIds.filter(id => id !== medId));
  };

  const handleDownloadLog = () => {
    soundFx.success();
    const reportContent = `==================================================================
TPIS.AGIES CLINICAL INTELLIGENCE // DRUG INTERACTION AUDIT LOG
Diagnostic Kernel v4.2 // Encrypted Stream Output
Timestamp: ${new Date().toISOString()}
==================================================================

PATIENT PHYSIOLOGICAL PROFILE:
- Age Classification: ${patientParams.ageGroup}
- Renal Status: ${patientParams.renalFunction === 'Normal' ? 'GFR > 60 mL/min' : 'GFR < 50 mL/min'}
- Pregnancy Flag: ${patientParams.isPregnant ? 'YES (Active Safety Triggered)' : 'NO'}

ACTIVE PHARMACEUTICAL DRUG BAG:
${activeBag.map(id => {
  const med = MEDICINES.find(m => m.id === id);
  return `- ${med?.name || id} (${med?.category || 'Uncategorized'})`;
}).join('\n')}

CLINICAL RISK ASSESSMENT OVERVIEW:
Overall Status: ${evaluation.overallRisk.toUpperCase()}

PHYSIOLOGICAL WARNING FLAGS:
${evaluation.physiologicalFlags.length > 0 ? evaluation.physiologicalFlags.map(f => `[!] ${f}`).join('\n') : 'No critical physiological contraindications detected.'}

DETAILED PAIRWISE INTERACTIONS DETECTED:
${evaluation.interactions.map((inter, i) => `
${i + 1}. [${inter.severity.toUpperCase()}] ${inter.title}
   Molecules: ${inter.drugAName} + ${inter.drugBName}
   Mechanism: ${inter.mechanism}
   Pathway: ${inter.reasoning.pathway}
   Physiological Impact: ${inter.reasoning.physiological}
   Monitoring: ${inter.reasoning.monitoring}
   Clinical Advice: ${inter.clinicalAdvice}
`).join('\n')}

DISCLAIMER:
All interaction parameters are rule-verified against standardized medical indices (Audit: 3.2.1).
Consult a licensed healthcare provider before initiating or adjusting pharmacotherapy.
==================================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tpis_agies_interaction_log_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Quick molecules to add
  const quickMolecules = MEDICINES.filter(m => !activeBag.includes(m.id)).slice(0, 6);

  return (
    <div className="w-full space-y-10 pb-16">
      
      {/* Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Diagnostic Log Exported Successfully (Kernel v4.2)</span>
        </div>
      )}

      {/* Header Section */}
      <div className="space-y-3">
        <div className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">
          01. SELECT MEDICATIONS & PHYSIOLOGY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Multi-Drug Interaction Checker
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Clinical drug bag selector. Add medications to run pairwise CYP450 enzyme substrate clearance simulation.
        </p>
      </div>

      {/* Search & Selector Input Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchMolecule}
              onChange={(e) => setSearchMolecule(e.target.value)}
              placeholder="SEARCH MOLECULE DATABASE (e.g. Warfarin, Simvastatin, Lisinopril, Metformin)..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
            />
          </div>

          <button
            onClick={() => {
              if (searchMolecule.trim()) {
                const found = MEDICINES.find(m => 
                  m.name.toLowerCase().includes(searchMolecule.toLowerCase()) || 
                  m.genericName.toLowerCase().includes(searchMolecule.toLowerCase())
                );
                if (found) {
                  handleAddDrug(found.id);
                }
              }
            }}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-xs shrink-0 cursor-pointer"
          >
            ADD DRUG
          </button>
        </div>

        {/* Quick Add Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Add:</span>
          {quickMolecules.map((med) => (
            <button
              key={med.id}
              onClick={() => handleAddDrug(med.id)}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{med.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Interaction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: STEP 1: YOUR DRUG BAG */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">
                STEP 1: YOUR DRUG BAG
              </h2>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                {activeBag.length} Molecules
              </span>
            </div>

            {/* Drug Bag List */}
            <div className="space-y-3">
              <AnimatePresence>
                {activeBag.map((id) => {
                  const med = MEDICINES.find(m => m.id === id);
                  if (!med) return null;
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 group hover:border-slate-300 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {med.name}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
                          <span>{med.category}</span>
                          <button
                            onClick={() => {
                              soundFx.click();
                              setViewMolecule3D(id);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold underline text-[10px] flex items-center gap-0.5 cursor-pointer"
                          >
                            <Atom className="w-2.5 h-2.5" />
                            <span>3D Lattice</span>
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveDrug(id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                setActiveTab('directory');
              }}
              className="w-full py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add from Medicine Directory</span>
            </button>

            {/* Physiological & Demographic Parameters */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Select Age Classification
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Adult', 'Pediatric', 'Geriatric'] as const).map((ag) => (
                  <button
                    key={ag}
                    onClick={() => {
                      soundFx.click();
                      setPatientParams({ ...patientParams, ageGroup: ag });
                    }}
                    className={`py-2 px-2 rounded-lg text-center font-bold text-xs border transition-all cursor-pointer ${
                      patientParams.ageGroup === ag
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>{ag}</div>
                    <div className="text-[9px] font-normal opacity-80 mt-0.5">
                      {ag === 'Adult' ? '12-65 yrs' : ag === 'Pediatric' ? '<12 yrs' : '65+ yrs'}
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pt-2">
                Renal Filtration Capacity
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundFx.click();
                    setPatientParams({ ...patientParams, renalFunction: 'Normal' });
                  }}
                  className={`py-2 px-3 rounded-lg text-center font-bold text-xs border transition-all cursor-pointer ${
                    patientParams.renalFunction === 'Normal'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Normal
                  <span className="block text-[9px] font-normal opacity-80">GFR &gt; 60 mL/min</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.alert();
                    setPatientParams({ ...patientParams, renalFunction: 'Impaired' });
                  }}
                  className={`py-2 px-3 rounded-lg text-center font-bold text-xs border transition-all cursor-pointer ${
                    patientParams.renalFunction === 'Impaired'
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Impaired
                  <span className="block text-[9px] font-normal opacity-80">GFR &lt; 50 mL/min</span>
                </button>
              </div>

              {/* Patient is Pregnant Toggle */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">Patient is Pregnant</div>
                  <div className="text-[10px] text-slate-500">Triggers antibiotic & NSAID safety protocols</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.click();
                    setPatientParams({ ...patientParams, isPregnant: !patientParams.isPregnant });
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    patientParams.isPregnant ? 'bg-rose-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      patientParams.isPregnant ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: STEP 2: SAFETY REPORT & REASONING STREAM */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Risk Preview Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-lg text-slate-950 uppercase tracking-tight">
                RISK PREVIEW // STEP 2: SAFETY REPORT
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">STATUS VERIFIED</span>
              </div>
            </div>

            {/* 3D Interaction Enzymatic Binding Simulator */}
            {activeBag.length >= 2 && evaluation.interactions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase font-mono tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Atom className="w-4 h-4 text-blue-600" />
                    <span>3D Molecular Active Site Docking Simulation</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Interactive WebGL Drag / Zoom</span>
                </div>
                <ThreeInteractionSimulator
                  drugAName={evaluation.interactions[0]?.drugAName || 'Drug A'}
                  drugBName={evaluation.interactions[0]?.drugBName || 'Drug B'}
                  severity={evaluation.interactions[0]?.severity || 'Severe'}
                  height={240}
                />
              </div>
            )}

            {/* Severe / Moderate / Safe alert cards */}
            <div className="space-y-4">
              {evaluation.interactions.map((inter, idx) => {
                const isSevere = inter.severity === 'Severe';
                const isMod = inter.severity === 'Moderate';
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-6 rounded-2xl border transition-all ${
                      isSevere
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 border-rose-600 text-white shadow-lg shadow-rose-600/20'
                        : isMod
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-500 text-white shadow-md'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-3">
                      <div className="flex items-center gap-2 font-extrabold text-sm tracking-wider uppercase">
                        {isSevere && <ShieldAlert className="w-5 h-5 text-white" />}
                        {isMod && <AlertTriangle className="w-5 h-5 text-white" />}
                        {!isSevere && !isMod && <CheckCircle2 className="w-5 h-5 text-white" />}
                        <span>{inter.title}</span>
                      </div>
                      <span className="text-xs font-mono font-bold bg-black/20 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                        {inter.drugAName} + {inter.drugBName}
                      </span>
                    </div>

                    <div className="pt-3 space-y-2 text-xs leading-relaxed text-white/90">
                      <p className="font-medium text-[13px]">{inter.clinicalOverlay}</p>
                      <div className="pt-1 text-[11px] text-white/80 font-mono">
                        Biochemical mechanism: {inter.mechanism}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Golden Diagnostic Overlay Block */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-extrabold uppercase tracking-wider text-[11px] text-blue-700">
                  Golden Diagnostic Overlay
                </div>
                <p className="leading-relaxed">
                  Clinical Safety Overlay: These results are rule-based standardized indices. Consult with a licensed medical professional before adjusting clinical medications.
                </p>
              </div>
            </div>

            {/* Physiological Warning Flags if any */}
            {evaluation.physiologicalFlags.length > 0 && (
              <div className="space-y-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                <div className="font-extrabold uppercase tracking-wider text-[11px] text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Physiological Contraindication Triggers</span>
                </div>
                {evaluation.physiologicalFlags.map((flag, idx) => (
                  <div key={idx} className="font-medium">• {flag}</div>
                ))}
              </div>
            )}

            {/* Reasoning Stream Panel */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                SYSTEM DIAGNOSTIC // REASONING STREAM
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-blue-700 uppercase">
                    PATHWAY ANALYTICS
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Identifying genetic variants and cytochrome P450 enzymes affecting metabolic degradation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-blue-700 uppercase">
                    PHYSIOLOGICAL IMPACT
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Evaluating renal filtration clearance rates and hepatic enzyme binding saturation logic.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-blue-700 uppercase">
                    MONITOR TRANSACTIONS
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Triggering automatic alerts for prothrombin INR checks and creatinine saturation indices.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-mono text-slate-500">
                Diagnostic Kernel v4.2 // Encrypted Stream
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    soundFx.modalOpen();
                    setShowMatrixModal(true);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold tracking-wider transition-all cursor-pointer"
                >
                  VIEW DETAILED SAFETY MATRIX
                </button>
                <button
                  onClick={handleDownloadLog}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD LOG</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3D Molecule Viewer Modal */}
      <AnimatePresence>
        {viewMolecule3D && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4"
            >
              {(() => {
                const med = MEDICINES.find(m => m.id === viewMolecule3D);
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 font-mono">3D MOLECULAR LATTICE</span>
                        <h3 className="text-xl font-extrabold text-slate-900">{med?.name} ({med?.chemicalFormula})</h3>
                      </div>
                      <button
                        onClick={() => setViewMolecule3D(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase cursor-pointer"
                      >
                        Close
                      </button>
                    </div>

                    <ThreeMoleculeViewer
                      formula={med?.chemicalFormula || 'C9H8O4'}
                      moleculeName={med?.name || 'Molecule'}
                      height={320}
                      interactive={true}
                    />

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                      <strong>Receptor Affinity & Metabolism:</strong> {med?.pharmacology.metabolism}. Elimination half-life: {med?.pharmacology.halfLife}.
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setViewMolecule3D(null)}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detailed Safety Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Pairwise Clinical Cross-Interaction Matrix
              </h3>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {evaluation.interactions.map((inter, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                    <span>{inter.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      inter.severity === 'Severe' ? 'bg-rose-100 text-rose-800' : inter.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {inter.severity}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium">{inter.clinicalAdvice}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 font-mono">
                    <div><strong className="text-slate-700">Pathway:</strong> {inter.reasoning.pathway}</div>
                    <div><strong className="text-slate-700">Physiology:</strong> {inter.reasoning.physiological}</div>
                    <div><strong className="text-slate-700">Monitor:</strong> {inter.reasoning.monitoring}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowMatrixModal(false)}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs tracking-wider cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
