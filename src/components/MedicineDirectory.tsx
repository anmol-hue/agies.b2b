/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { MEDICINES } from '../data/medicines';
import { Medicine, UserAccount } from '../types';
import { 
  Search, 
  Pill, 
  Sparkles, 
  Plus, 
  Check, 
  Filter, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Info,
  Layers,
  ChevronRight,
  Activity,
  X,
  Atom,
  RotateCw,
  Sliders,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { ThreePillCanvas, PillShape3D } from './ThreePillCanvas';
import { PharmacologyInspectorModal } from './PharmacologyInspectorModal';
import { soundFx } from '../lib/soundFx';

interface MedicineDirectoryProps {
  user: UserAccount;
  onAddToCabinet: (med: Medicine) => void;
  onSelectForInteraction: (med: Medicine) => void;
  setActiveTab: (tab: string) => void;
}

export const MedicineDirectory: React.FC<MedicineDirectoryProps> = ({
  user,
  onAddToCabinet,
  onSelectForInteraction,
  setActiveTab
}) => {
  const [subTab, setSubTab] = useState<'directory' | 'identifier'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Selected detail modal
  const [detailedMed, setDetailedMed] = useState<Medicine | null>(null);

  // Pill Identifier State
  const [selectedShape, setSelectedShape] = useState<PillShape3D>('Capsule');
  const [selectedColor, setSelectedColor] = useState<string>('White/Pink');
  const [imprintQuery, setImprintQuery] = useState<string>('AMOX 500');
  const [identifierRan, setIdentifierRan] = useState<boolean>(true);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const categories = [
    'ALL',
    'ANTIBIOTICS',
    'NSAIDS',
    'CARDIOVASCULAR',
    'ANTI-DIABETIC',
    'CRITICAL CARE',
    'CNS / ANALGESIC',
    'RESPIRATORY',
    'IMMUNOMODULATOR'
  ];

  const shapes: PillShape3D[] = ['Capsule', 'Round', 'Oval', 'Oblong'];
  const colors = [
    { label: 'White', colorClass: 'bg-slate-100 text-slate-800 border-slate-300' },
    { label: 'Blue', colorClass: 'bg-sky-100 text-sky-800 border-sky-300' },
    { label: 'Pink', colorClass: 'bg-pink-100 text-pink-800 border-pink-300' },
    { label: 'Yellow', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
    { label: 'Red', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
    { label: 'White/Pink', colorClass: 'bg-gradient-to-r from-slate-100 to-pink-200 text-slate-800 border-pink-300' },
    { label: 'White/Blue', colorClass: 'bg-gradient-to-r from-slate-100 to-sky-200 text-slate-800 border-sky-300' }
  ];

  // Filter medicines
  const filteredMedicines = MEDICINES.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.indications.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.chemicalFormula && med.chemicalFormula.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.brandNames.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'ANTIBIOTICS' && (med.category === 'Antibiotic' || med.category === 'Antifungal' || med.category === 'Antiviral')) ||
      (selectedCategory === 'NSAIDS' && med.category === 'NSAID') ||
      (selectedCategory === 'CARDIOVASCULAR' && (['Statin', 'ACE Inhibitor', 'Anticoagulant', 'Calcium Channel Blocker', 'Cardiology / Antiarrhythmic'] as string[]).includes(med.category)) ||
      (selectedCategory === 'ANTI-DIABETIC' && med.category === 'Anti-Diabetic') ||
      (selectedCategory === 'CRITICAL CARE' && med.category === 'Emergency / Critical Care') ||
      (selectedCategory === 'CNS / ANALGESIC' && (['Psychiatric / Antidepressant', 'Neuropathic'] as string[]).includes(med.category)) ||
      (selectedCategory === 'RESPIRATORY' && (med.category === 'Respiratory' || med.category === 'Corticosteroid')) ||
      (selectedCategory === 'IMMUNOMODULATOR' && (med.category === 'Immunosuppressant' || med.category === 'Oncology'));

    return matchesSearch && matchesCategory;
  });

  // Identifier match finder
  const identifierResults = MEDICINES.filter((med) => {
    if (!identifierRan) return false;
    const matchShape = !selectedShape || med.visualPill.shape.toLowerCase() === selectedShape.toLowerCase();
    const matchColor = !selectedColor || med.visualPill.color.toLowerCase() === selectedColor.toLowerCase();
    const matchImprint = !imprintQuery.trim() || med.visualPill.imprint.toLowerCase().includes(imprintQuery.toLowerCase().trim());
    return matchShape && (matchColor || matchImprint);
  });

  const handleQuickAdd = (med: Medicine) => {
    soundFx.success();
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#38bdf8', '#10b981', '#ffffff']
    });
    onAddToCabinet(med);
    setAddedNotice(`Added ${med.name} to Personal Medicine Cabinet`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const openDetailModal = (med: Medicine) => {
    soundFx.modalOpen();
    setDetailedMed(med);
  };

  return (
    <div className="w-full space-y-8 pb-16">
      
      {/* Toast Notice */}
      <AnimatePresence>
        {addedNotice && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-950 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{addedNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title & Subtitle Badge */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
          Medicine Directory & 3D Pill Identifier
        </h1>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50/80 border border-blue-200 text-blue-700 text-[11px] font-extrabold tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>PRIMARY DIAGNOSTIC ENGINE: 3D MORPHOLOGY & CLINICAL PROFILES</span>
        </div>
        
        <p className="text-sm text-slate-600 max-w-3xl">
          Clinical-grade database with real-time 3D WebGL pill inspection, atomic molecular lattice visualizer, and pairwise indications.
        </p>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-sm font-bold">
        <button
          onClick={() => {
            soundFx.click();
            setSubTab('directory');
          }}
          className={`pb-3 transition-colors uppercase tracking-wider text-xs relative cursor-pointer ${
            subTab === 'directory' ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>SEARCHABLE DIRECTORY</span>
          {subTab === 'directory' && (
            <motion.div layoutId="subtab-active" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => {
            soundFx.click();
            setSubTab('identifier');
          }}
          className={`pb-3 transition-colors uppercase tracking-wider text-xs relative cursor-pointer ${
            subTab === 'identifier' ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span>3D PILL IDENTIFIER TOOL</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-100 text-blue-700 font-mono">WebGL</span>
          </span>
          {subTab === 'identifier' && (
            <motion.div layoutId="subtab-active" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SEARCHABLE MEDICINE DIRECTORY */}
      {/* ========================================================= */}
      {subTab === 'directory' && (
        <div className="space-y-6">
          
          {/* Search Bar & Category Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by chemical name, brand, or molecule..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm shadow-2xs transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFx.click();
                      setSelectedCategory(cat);
                    }}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Molecule Cards Grid with Motion */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMedicines.map((med, idx) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.35 }}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 
                        onClick={() => openDetailModal(med)}
                        className="font-extrabold text-xl text-blue-600 hover:text-blue-700 cursor-pointer tracking-tight transition-colors flex items-center gap-1.5"
                      >
                        <span>{med.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">3D</span>
                      </h3>
                      <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mt-0.5">
                        {med.category.toUpperCase()}
                      </div>
                    </div>
                    <button
                      onClick={() => openDetailModal(med)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Inspect in 3D WebGL"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dosage badge & indications */}
                  <div className="space-y-2 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="font-bold text-slate-900">Dosage: </span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {med.dosage.split('(')[0]}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900">Indications: </span>
                      <span className="text-slate-600 leading-snug">{med.indications}</span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900">Contraindications: </span>
                      <span className="text-slate-600 leading-snug">{med.contraindications}</span>
                    </div>
                  </div>

                  {/* Side effect pills with percentages */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {med.sideEffects.slice(0, 3).map((se, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {se.name} ({se.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-5 border-t border-slate-100 flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleQuickAdd(med)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                  >
                    ADD TO CABINET
                  </button>
                  <button
                    onClick={() => {
                      soundFx.click();
                      onSelectForInteraction(med);
                      setActiveTab('interactions');
                    }}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    title="Check Interactions"
                  >
                    Check Cross-Risk
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl space-y-3">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-bold text-base text-slate-800">No matching pharmaceuticals found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for a different generic title, brand, or resetting the category filter.
              </p>
            </div>
          )}

          {/* Jump to Pill Identifier Card */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-slate-800">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D WEBGL GRAPHICS ACCELERATOR</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">Need to Inspect a Physical Pill in 3D?</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Launch the 3D Identifier Matrix with real-time orbit controls, debossed imprints, and atomic chemical lattices.
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.click();
                setSubTab('identifier');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider transition-all shadow-md active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>LAUNCH 3D IDENTIFIER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PILL IDENTIFIER TOOL (3D WEBGL) */}
      {/* ========================================================= */}
      {subTab === 'identifier' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel (Left Col) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold font-mono">
                <Sliders className="w-3.5 h-3.5" />
                <span>3D MORPHOLOGY MATRIX</span>
              </div>
              <h2 className="font-extrabold text-lg text-slate-900">Physical Parameter Tuning</h2>
              <p className="text-xs text-slate-500">Configure visual physical imprint and shape specs.</p>
            </div>

            {/* Shape Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Shape Morphology
              </label>
              <div className="grid grid-cols-2 gap-2">
                {shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      soundFx.click();
                      setSelectedShape(s);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold tracking-wide border transition-all cursor-pointer ${
                      selectedShape === s
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Color Palette
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => {
                      soundFx.click();
                      setSelectedColor(c.label);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${c.colorClass} ${
                      selectedColor === c.label ? 'ring-2 ring-blue-600 ring-offset-1 font-extrabold' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Imprint Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Laser Imprint Key
              </label>
              <input
                type="text"
                value={imprintQuery}
                onChange={(e) => setImprintQuery(e.target.value)}
                placeholder="Enter imprint (e.g. AMOX 500, I-2, L 10)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Run Identification Button */}
            <button
              onClick={() => {
                soundFx.scanPulse();
                setIdentifierRan(true);
              }}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run 3D Identification</span>
            </button>
          </div>

          {/* Results Panel (Right Col) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-800">
                Found {identifierResults.length} high-confidence clinical match based on imprint and profile.
              </span>
              <span className="font-semibold text-blue-600">3D WebGL Visual Verification</span>
            </div>

            {identifierResults.map((med) => (
              <div
                key={med.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs hover:border-blue-300 transition-all space-y-6"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
                  
                  {/* Left: Interactive 3D WebGL Pill Canvas */}
                  <div className="w-full lg:w-80 space-y-2 shrink-0">
                    <ThreePillCanvas
                      shape={med.visualPill.shape as PillShape3D}
                      colorPrimary={med.visualPill.svgColorPrimary}
                      colorSecondary={med.visualPill.svgColorSecondary || med.visualPill.svgColorPrimary}
                      imprint={med.visualPill.imprint}
                      score={med.visualPill.score}
                      height={260}
                      interactive={true}
                      autoRotateInit={true}
                      showControls={true}
                    />
                    <div className="flex items-center justify-between px-2 text-[11px] font-bold text-slate-500">
                      <span>Imprint: <span className="text-blue-600 font-mono">{med.visualPill.imprint}</span></span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono">
                        Match {med.visualPill.matchPct}%
                      </span>
                    </div>
                  </div>

                  {/* Right: Pill Specification Parameters */}
                  <div className="flex-1 space-y-3 text-center lg:text-left">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">{med.name}</h3>
                      <div className="text-xs font-bold text-blue-600">
                        {med.visualPill.shape} | {med.dosage.split(' ')[0]} Strength
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Class</span>
                        <span className="font-bold text-slate-800">{med.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Imprint</span>
                        <span className="font-extrabold text-blue-600 font-mono">{med.visualPill.imprint}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {med.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={() => openDetailModal(med)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View 3D Report</span>
                  </button>
                  <button
                    onClick={() => handleQuickAdd(med)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cabinet</span>
                  </button>
                </div>
              </div>
            ))}

            {identifierResults.length === 0 && (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
                <Pill className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800">No Pill Profile Match</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the imprint query (e.g. "AMOX 500", "L 10", "I-2") or switching shape and color palettes.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* DETAILED MOLECULE MODAL (WITH 3D WEBGL ENGINE & PK SUITE) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {detailedMed && (
          <PharmacologyInspectorModal
            medicine={detailedMed}
            onClose={() => setDetailedMed(null)}
            onAddToCabinet={(med) => handleQuickAdd(med)}
            onSelectForInteraction={(med) => {
              onSelectForInteraction(med);
              setActiveTab('interactions');
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
