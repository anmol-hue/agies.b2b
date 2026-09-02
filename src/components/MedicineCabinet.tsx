/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserAccount, CabinetItem, ClinicalHistoryEntry } from '../types';
import { MEDICINES } from '../data/medicines';
import { 
  Briefcase, 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  Eye,
  CheckCircle2,
  FileCheck,
  X,
  Sparkles,
  Flame,
  Pill,
  Award
} from 'lucide-react';
import { ThreePillCanvas, PillShape3D } from './ThreePillCanvas';
import { ThreeCabinetDispenser } from './ThreeCabinetDispenser';
import { soundFx } from '../lib/soundFx';

interface MedicineCabinetProps {
  user: UserAccount;
  onUpdateCabinetItem: (item: CabinetItem) => void;
  onDeleteCabinetItem: (id: string) => void;
  onAddCustomItem: (item: CabinetItem) => void;
  setActiveTab: (tab: string) => void;
}

export const MedicineCabinet: React.FC<MedicineCabinetProps> = ({
  user,
  onUpdateCabinetItem,
  onDeleteCabinetItem,
  onAddCustomItem,
  setActiveTab
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedMedToAdd, setSelectedMedToAdd] = useState<string>('amoxicillin');
  const [customDosage, setCustomDosage] = useState<string>('500mg (3x Daily)');
  const [customInstructions, setCustomInstructions] = useState<string>('Take with food as prescribed.');
  const [customNextDose, setCustomNextDose] = useState<string>('08:00 AM');
  
  // 3D Quick Inspect Modal
  const [inspectItem3D, setInspectItem3D] = useState<CabinetItem | null>(null);

  // History item modal viewer
  const [viewHistoryModal, setViewHistoryModal] = useState<ClinicalHistoryEntry | null>(null);

  const cabinet = user.cabinet || [];
  const history = user.history || [];

  // Calculate adherence statistics
  const totalMeds = cabinet.length;
  const takenCount = cabinet.filter(c => c.takenToday).length;
  const adherencePercentage = totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 85;

  const handleToggleTaken = (item: CabinetItem) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newTakenState = !item.takenToday;
    
    let updatedHistoryDates = [...(item.historyDates || [])];
    if (newTakenState) {
      soundFx.success();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#38bdf8']
      });
      if (!updatedHistoryDates.includes(todayStr)) {
        updatedHistoryDates.push(todayStr);
      }
    } else {
      soundFx.click();
      updatedHistoryDates = updatedHistoryDates.filter(d => d !== todayStr);
    }

    onUpdateCabinetItem({
      ...item,
      takenToday: newTakenState,
      historyDates: updatedHistoryDates
    });
  };

  const handleAddNewMolecule = () => {
    soundFx.success();
    const med = MEDICINES.find(m => m.id === selectedMedToAdd);
    const newItem: CabinetItem = {
      id: `cab-${Date.now()}`,
      medicineId: selectedMedToAdd,
      name: med ? med.name : 'Custom Pharmaceutical',
      dosage: customDosage,
      frequency: 'Daily',
      instructions: customInstructions,
      nextDose: customNextDose,
      takenToday: false,
      historyDates: []
    };

    onAddCustomItem(newItem);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    soundFx.alert();
    onDeleteCabinetItem(id);
  };

  return (
    <div className="w-full space-y-10 pb-16">
      
      {/* Header Section */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Personal Medicine Cabinet
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Secure dashboard for clinical molecule management, dose schedules, and 3D adherence monitoring.
        </p>
      </div>

      {/* Top Banner with My Medications + Adherence Score Index */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Medication Manager */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                  My Medications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged patient pharmaceutical regimens with one-click dose recording.
                </p>
              </div>
              <button
                onClick={() => {
                  soundFx.modalOpen();
                  setShowAddModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 border border-blue-200/80 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add molecule</span>
              </button>
            </div>

            {/* List of Cabinet Medications with Animations */}
            <div className="space-y-4">
              <AnimatePresence>
                {cabinet.map((item, idx) => {
                  const matchingMed = MEDICINES.find(m => m.id === item.medicineId || m.name === item.name);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.25 }}
                      className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.takenToday 
                          ? 'bg-slate-50/80 border-slate-200' 
                          : 'bg-white border-blue-200 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-lg text-slate-950 tracking-tight flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.takenToday && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Logged</span>
                              </span>
                            )}
                          </h3>
                          <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.frequency}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          {item.instructions}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] font-mono font-semibold text-slate-500 pt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Next: {item.nextDose}</span>
                          </div>
                          {matchingMed && (
                            <button
                              onClick={() => {
                                soundFx.pillFlip();
                                setInspectItem3D(item);
                              }}
                              className="text-blue-600 hover:text-blue-700 font-sans text-[11px] font-bold underline flex items-center gap-1 cursor-pointer"
                            >
                              <Pill className="w-3 h-3" />
                              <span>View 3D Pill</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleToggleTaken(item)}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            item.takenToday
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{item.takenToday ? 'Dose Taken' : 'LOG DOSE'}</span>
                        </motion.button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete molecule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {cabinet.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl space-y-3">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="font-bold text-sm text-slate-800">Your Medicine Cabinet is Empty</div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Add molecules from the Medicine Directory or click "+ Add molecule" above.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right 4 Cols: Adherence Score Index & Clinical History */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 3D Smart Bottle Adherence Dispenser */}
          <ThreeCabinetDispenser
            totalMeds={totalMeds}
            adherencePct={adherencePercentage}
            height={260}
          />

          {/* Adherence Score Ring & Metric */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 text-amber-500 text-xs font-extrabold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-current" />
              <span>12-Day Adherence Streak</span>
            </div>

            <div className="text-5xl font-extrabold text-blue-600 tracking-tight font-['JetBrains_Mono',monospace]">
              {adherencePercentage}%
            </div>
            
            <div className="text-xs font-extrabold tracking-widest text-slate-800 uppercase">
              ADHERENCE SCORE INDEX
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              High clinical compliance. Steady blood plasma therapeutic levels sustained.
            </p>

            {/* Daily Tracker Mini Bar */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {takenCount}/{totalMeds}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  TAKEN TODAY
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-lg font-bold text-blue-600 font-mono">
                  {adherencePercentage}%
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  MONTHLY
                </div>
              </div>
            </div>
          </div>

          {/* Clinical History Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                Clinical History
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Recent</span>
            </div>

            <div className="space-y-3">
              {history.map((h) => (
                <div 
                  key={h.id} 
                  onClick={() => {
                    soundFx.click();
                    setViewHistoryModal(h);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/60 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-700">
                    <span>{h.type}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{h.date}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    [{h.resultSummary}]
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Secure Diagnostic History Strip */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
          Secure Diagnostic History
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Clinical Scans */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-2xs hover:border-blue-300 transition-all">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">AI Clinical Scans</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Last Scan: Oct 12, 2026. 98% Match confidence recorded.
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.click();
                setActiveTab('scanner');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              VIEW LOG
            </button>
          </div>

          {/* Card 2: Interaction Reports */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-2xs hover:border-blue-300 transition-all">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Interaction Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cross-interaction diagnostic: Safety report generated for 3 new molecules.
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.click();
                setActiveTab('interactions');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              VIEW REPORT
            </button>
          </div>

          {/* Card 3: Symptom Logs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-2xs hover:border-blue-300 transition-all">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-900">Symptom Logs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracked deviations in respiratory indices over a 24-hour cycle.
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.click();
                setActiveTab('scanner');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              BROWSE
            </button>
          </div>

        </div>
      </div>

      {/* 3D Quick Inspect Modal */}
      <AnimatePresence>
        {inspectItem3D && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 font-mono">3D PATIENT MEDICATION</span>
                  <h3 className="text-lg font-extrabold text-slate-900">{inspectItem3D.name}</h3>
                </div>
                <button
                  onClick={() => setInspectItem3D(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3D Pill Canvas */}
              {(() => {
                const med = MEDICINES.find(m => m.id === inspectItem3D.medicineId || m.name === inspectItem3D.name);
                return (
                  <ThreePillCanvas
                    shape={(med?.visualPill.shape as PillShape3D) || 'Capsule'}
                    colorPrimary={med?.visualPill.svgColorPrimary || '#2563eb'}
                    colorSecondary={med?.visualPill.svgColorSecondary || '#ffffff'}
                    imprint={med?.visualPill.imprint || 'MED'}
                    score={med?.visualPill.score || 'None'}
                    height={240}
                    interactive={true}
                    autoRotateInit={true}
                    showControls={true}
                  />
                );
              })()}

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                <div><span className="font-bold text-slate-800">Prescription:</span> {inspectItem3D.instructions}</div>
                <div><span className="font-bold text-slate-800">Next Scheduled Dose:</span> {inspectItem3D.nextDose}</div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInspectItem3D(null)}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Molecule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Add New Medication</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Select Pharmaceutical Molecule</label>
                <select
                  value={selectedMedToAdd}
                  onChange={(e) => setSelectedMedToAdd(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 text-xs"
                >
                  {MEDICINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Dosage & Frequency</label>
                <input
                  type="text"
                  value={customDosage}
                  onChange={(e) => setCustomDosage(e.target.value)}
                  placeholder="e.g. 500mg (3x Daily)"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Physician Notes / Instructions</label>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Dr. Smith: Take with food until clinical course completes."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Next Scheduled Dose Time</label>
                <input
                  type="text"
                  value={customNextDose}
                  onChange={(e) => setCustomNextDose(e.target.value)}
                  placeholder="e.g. 08:00 AM"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewMolecule}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider shadow-md cursor-pointer"
              >
                Save Molecule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Entry Detail Modal */}
      {viewHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-600 font-mono uppercase">{viewHistoryModal.type}</span>
                <h3 className="text-lg font-extrabold text-slate-900">{viewHistoryModal.title}</h3>
              </div>
              <button
                onClick={() => setViewHistoryModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-700">Timestamp:</span>
                <span className="font-mono">{viewHistoryModal.date}</span>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                <div className="font-extrabold text-blue-900 text-sm">Result: {viewHistoryModal.resultSummary}</div>
                <p className="text-slate-600">{viewHistoryModal.details || 'Standard diagnostic profile verification recorded.'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setViewHistoryModal(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
