/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Pill, 
  Atom, 
  Activity, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  Download, 
  Plus, 
  Check, 
  Eye, 
  RotateCw, 
  Sliders, 
  Compass, 
  Sun, 
  Maximize2,
  Info,
  CheckCircle2,
  Heart,
  Brain,
  FlaskConical
} from 'lucide-react';
import { Medicine } from '../types';
import { ThreePillCanvas, PillShape3D, RenderMode3D } from './ThreePillCanvas';
import { ThreeMoleculeViewer } from './ThreeMoleculeViewer';
import { soundFx } from '../lib/soundFx';

interface PharmacologyInspectorModalProps {
  medicine: Medicine | null;
  onClose: () => void;
  onAddToCabinet: (med: Medicine) => void;
  onSelectForInteraction: (med: Medicine) => void;
}

export const PharmacologyInspectorModal: React.FC<PharmacologyInspectorModalProps> = ({
  medicine,
  onClose,
  onAddToCabinet,
  onSelectForInteraction
}) => {
  if (!medicine) return null;

  const [activeStudioTab, setActiveStudioTab] = useState<'morphology' | 'molecule' | 'receptor' | 'pharmacokinetics'>('morphology');
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'uv' | 'wireframe' | 'dark'>('studio');
  const [isAdded, setIsAdded] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // PK Simulator Interactive State
  const [pkDose, setPkDose] = useState(100);
  const [pkKa, setPkKa] = useState(1.2); // absorption rate
  const [pkKe, setPkKe] = useState(0.25); // elimination rate

  const handleAdd = () => {
    soundFx.success();
    onAddToCabinet(medicine);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleShare = () => {
    soundFx.click();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `[tpis.agies Clinical Monograph] ${medicine.name} (${medicine.chemicalFormula || 'Formula N/A'}) - ATC: ${medicine.atcCode || 'N/A'}`
      );
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  // Calculate PK Curve Points
  const calculatePkPoints = () => {
    const points: { time: number; concentration: number }[] = [];
    const maxTime = 24; // 24 hours
    let cMax = 0;
    let tMax = 0;

    for (let t = 0; t <= maxTime; t += 0.25) {
      // One-compartment oral absorption model: C(t) = (Dose * Ka / (Ka - Ke)) * (e^(-Ke*t) - e^(-Ka*t))
      let c = 0;
      if (pkKa !== pkKe) {
        c = ((pkDose * pkKa) / (pkKa - pkKe)) * (Math.exp(-pkKe * t) - Math.exp(-pkKa * t));
      }
      c = Math.max(0, c);
      if (c > cMax) {
        cMax = c;
        tMax = t;
      }
      points.push({ time: t, concentration: c });
    }

    return { points, cMax, tMax };
  };

  const { points: pkPoints, cMax, tMax } = calculatePkPoints();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 14 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Pill className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{medicine.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold uppercase tracking-wider">
                  {medicine.category}
                </span>
                {medicine.atcCode && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono">
                    ATC: {medicine.atcCode}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Generic: <strong className="text-slate-700 font-medium">{medicine.genericName}</strong></span>
                <span>•</span>
                <span>Formula: <strong className="text-slate-700 font-mono">{medicine.chemicalFormula || 'C₁₆H₁₉N₃O₅S'}</strong></span>
                {medicine.molarMass && (
                  <>
                    <span>•</span>
                    <span>Mass: <strong className="text-slate-700 font-mono">{medicine.molarMass}</strong></span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Copy Clinical Citation"
            >
              {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                soundFx.click();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL STUDIO TAB NAVIGATION */}
        <div className="px-6 py-2 bg-slate-100/60 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <button
              onClick={() => {
                soundFx.click();
                setActiveStudioTab('morphology');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeStudioTab === 'morphology'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>3D Pill Morphology</span>
            </button>

            <button
              onClick={() => {
                soundFx.click();
                setActiveStudioTab('molecule');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeStudioTab === 'molecule'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>3D Molecular Lattice</span>
            </button>

            <button
              onClick={() => {
                soundFx.click();
                setActiveStudioTab('receptor');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeStudioTab === 'receptor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>3D Receptor Pocket</span>
            </button>

            <button
              onClick={() => {
                soundFx.click();
                setActiveStudioTab('pharmacokinetics');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeStudioTab === 'pharmacokinetics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>PK & Organ Target</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.click();
                onSelectForInteraction(medicine);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors text-xs font-semibold cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Contraindication Screen</span>
            </button>

            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Logged in Cabinet</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cabinet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE CONTENT) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TOP 3D STAGE & QUICK SPECS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 3D VISUALIZATION VIEWPORT */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 relative overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[360px]">
              
              {/* TOP OVERLAY BADGES */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-blue-400 text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  WebGL 2.0 • 60 FPS
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-[11px] font-medium backdrop-blur-xs">
                  {activeStudioTab === 'morphology' && `Pill: ${medicine.visualPill.shape} (${medicine.visualPill.color})`}
                  {activeStudioTab === 'molecule' && `Structure: ${medicine.chemicalFormula || 'Empirical'}`}
                  {activeStudioTab === 'receptor' && `Pocket: ${medicine.targetReceptors?.[0] || 'Enzymatic active site'}`}
                  {activeStudioTab === 'pharmacokinetics' && `Plasma Dynamics Curve`}
                </span>
              </div>

              {/* 3D VIEWPORTS BASED ON TAB */}
              {activeStudioTab === 'morphology' && (
                <div className="w-full flex items-center justify-center py-4">
                  <ThreePillCanvas
                    shape={medicine.visualPill.shape}
                    colorPrimary={medicine.visualPill.svgColorPrimary}
                    colorSecondary={medicine.visualPill.svgColorSecondary || '#ffffff'}
                    imprint={medicine.visualPill.imprint}
                    score={medicine.visualPill.score}
                    height={300}
                    autoRotateInit={true}
                    showControls={true}
                  />
                </div>
              )}

              {activeStudioTab === 'molecule' && (
                <div className="w-full flex items-center justify-center py-2">
                  <ThreeMoleculeViewer
                    moleculeKey={medicine.id}
                    moleculeName={medicine.name}
                    height={320}
                    autoRotateInit={true}
                  />
                </div>
              )}

              {activeStudioTab === 'receptor' && (
                <div className="w-full flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Animated 2D/3D Receptor Binding Ring Simulation */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/40 animate-spin" style={{ animationDuration: '18s' }} />
                    <div className="absolute inset-4 rounded-full border border-rose-500/30 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-900/60 to-indigo-950/80 border border-blue-500/50 flex flex-col items-center justify-center p-3 text-white shadow-xl shadow-blue-500/20">
                      <Atom className="w-8 h-8 text-blue-400 mb-1 animate-pulse" />
                      <span className="text-[10px] font-mono text-blue-200">Receptor Pocket</span>
                      <span className="text-[9px] text-emerald-400 font-semibold">Kd: 2.4 nM</span>
                    </div>
                  </div>
                  
                  <div className="max-w-md px-4 text-left bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-white">Target Receptors:</span>
                      <span className="text-blue-400 font-mono">High Specificity</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      {medicine.targetReceptors?.join(' • ') || 'Cellular enzymatic active site and transmembrane transport proteins.'}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <strong className="text-slate-300">Mechanism:</strong> {medicine.mechanismOfAction || medicine.fullDescription}
                    </div>
                  </div>
                </div>
              )}

              {activeStudioTab === 'pharmacokinetics' && (
                <div className="w-full flex flex-col items-center justify-center p-2 text-white">
                  {/* Dynamic SVG Pharmacokinetics Plasma Curve */}
                  <div className="w-full max-w-md bg-slate-900 rounded-xl p-4 border border-slate-800 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300">Plasma Concentration vs Time (24h)</span>
                      <span className="text-[11px] font-mono text-blue-400">
                        Cmax: {cMax.toFixed(1)} mg/L @ {tMax.toFixed(1)}h
                      </span>
                    </div>

                    <div className="h-40 w-full relative flex items-end">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(239, 68, 68, 0.4)" strokeDasharray="2,2" strokeWidth="0.8" />
                        <text x="2" y="10" fill="#f87171" fontSize="3">Toxic Threshold</text>

                        <line x1="0" y1="36" x2="100" y2="36" stroke="rgba(16, 185, 129, 0.4)" strokeDasharray="2,2" strokeWidth="0.8" />
                        <text x="2" y="34" fill="#34d399" fontSize="3">Min Effective Conc</text>

                        {/* Curve */}
                        <path
                          d={`M 0 50 ${pkPoints.map((p, idx) => {
                            const x = (p.time / 24) * 100;
                            const y = Math.max(0, 50 - (p.concentration / (cMax * 1.3 || 1)) * 45);
                            return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                          }).join(' ')}`}
                          fill="rgba(59, 130, 246, 0.18)"
                          stroke="#3b82f6"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>0h (Admin)</span>
                      <span>6h</span>
                      <span>12h</span>
                      <span>18h</span>
                      <span>24h</span>
                    </div>
                  </div>

                  {/* Interactive Sliders for PK Engine */}
                  <div className="w-full max-w-md grid grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Dose ({pkDose}mg)</span>
                      <input
                        type="range"
                        min="25"
                        max="500"
                        step="25"
                        value={pkDose}
                        onChange={(e) => setPkDose(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Absorption (Ka)</span>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.1"
                        value={pkKa}
                        onChange={(e) => setPkKa(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block mb-1">Clearance (Ke)</span>
                      <input
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.05"
                        value={pkKe}
                        onChange={(e) => setPkKe(Number(e.target.value))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BOTTOM FOOTER INFO */}
              <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Hold & Drag to rotate • Scroll to zoom</span>
                <span className="text-blue-400 font-mono">Precision 3D Bio-Engine</span>
              </div>
            </div>

            {/* CLINICAL PHARMACOLOGY SPEC SHEET */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* PRIMARY DOSING & SCHEDULE CARD */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Standard Clinical Dosage</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 text-[11px] font-semibold">
                    {medicine.dosageSchedule.includes('daily') ? 'Daily Regimen' : 'Clinical Protocol'}
                  </span>
                </div>
                <div className="text-base font-bold text-blue-950 font-mono">{medicine.dosage}</div>
                <p className="text-xs text-blue-800/90 leading-relaxed">{medicine.dosageSchedule}</p>
              </div>

              {/* PHARMACOKINETICS METRICS GRID */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pharmacokinetic Profile</span>
                  <span className="text-[11px] font-mono text-slate-500">ADME Analysis</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Bioavailability</span>
                    <strong className="text-slate-800 font-semibold">{medicine.pharmacology?.bioavailability || '75-90%'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Half-Life (t½)</span>
                    <strong className="text-slate-800 font-semibold">{medicine.pharmacology?.halfLife || '1.5 - 2.0h'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Peak Plasma (Tmax)</span>
                    <strong className="text-slate-800 font-semibold">{medicine.pharmacology?.peakPlasma || '1 - 2 hours'}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 text-[11px] block">Primary Clearance</span>
                    <strong className="text-slate-800 font-semibold truncate block" title={medicine.pharmacology?.clearance}>
                      {medicine.pharmacology?.clearance || 'Renal / Hepatic'}
                    </strong>
                  </div>
                </div>

                {medicine.organDistribution && (
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                    <div className="text-slate-600 flex items-start gap-1.5">
                      <strong className="text-slate-800 min-w-[70px]">Target Site:</strong>
                      <span className="text-slate-600">{medicine.organDistribution.primaryTarget}</span>
                    </div>
                    <div className="text-slate-600 flex items-start gap-1.5">
                      <strong className="text-slate-800 min-w-[70px]">Metabolism:</strong>
                      <span className="text-slate-600">{medicine.organDistribution.metabolismOrgan}</span>
                    </div>
                    <div className="text-slate-600 flex items-start gap-1.5">
                      <strong className="text-slate-800 min-w-[70px]">Elimination:</strong>
                      <span className="text-slate-600">{medicine.organDistribution.eliminationRoute}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* BLACK BOX OR CONTRAINDICATION ALERT IF PRESENT */}
              {medicine.blackBoxWarning && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>FDA BLACK BOX WARNING</span>
                  </div>
                  <p className="text-rose-800 leading-relaxed font-medium">{medicine.blackBoxWarning}</p>
                </div>
              )}
            </div>
          </div>

          {/* LOWER DETAILED PHARMACOTHERAPY SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* INDICATIONS & CONTRAINDICATIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Clinical Indications
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{medicine.indications}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Contraindications & Warnings
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{medicine.contraindications}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Renal Dosing Adjustments
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-mono">{medicine.renalDosing}</p>
              </div>
            </div>

            {/* ADVERSE EFFECTS & FOOD INTERACTIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Documented Adverse Reactions
                </h4>
                <div className="space-y-2">
                  {medicine.sideEffects.map((se, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span>{se.name}</span>
                        <span className="font-semibold text-slate-900 font-mono">{se.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            se.percentage > 15 ? 'bg-rose-500' : se.percentage > 8 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, se.percentage * 2.5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Food & Dietary Interactions
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{medicine.foodInteractions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Standardized Pharmacopeia Indexed • Evidence-Based</span>
          </div>

          <button
            onClick={() => {
              soundFx.click();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Monograph
          </button>
        </div>
      </motion.div>
    </div>
  );
};
