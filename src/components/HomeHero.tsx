/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  ShieldAlert, 
  Stethoscope, 
  Briefcase, 
  Users,
  Building2,
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Database, 
  Lock, 
  Zap,
  Layers,
  ChevronRight,
  RotateCw,
  Eye,
  Atom,
  Volume2,
  VolumeX,
  Compass,
  Radio,
  Sliders
} from 'lucide-react';
import { UserAccount } from '../types';
import { Hero3DBackground } from './Hero3DBackground';
import { ThreePillCanvas, PillShape3D } from './ThreePillCanvas';
import { ThreeMoleculeViewer } from './ThreeMoleculeViewer';
import { ThreeBiometricRings } from './ThreeBiometricRings';
import { soundFx } from '../lib/soundFx';

interface HomeHeroProps {
  setActiveTab: (tab: string) => void;
  user: UserAccount | null;
  onOpenAuth?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ setActiveTab, user, onOpenAuth }) => {
  const [selectedMetric, setSelectedMetric] = useState<number>(0);
  const [hero3DMode, setHero3DMode] = useState<'pill' | 'molecule' | 'biometric'>('pill');
  const [heroPillShape, setHeroPillShape] = useState<PillShape3D>('Capsule');
  const [isAudioMuted, setIsAudioMuted] = useState(soundFx.isMuted());

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) soundFx.click();
  };

  const heroModules = [
    {
      id: 'patients',
      label: 'PATIENT EMR & WARDS',
      icon: Users,
      badge: 'Live Triage',
      description: 'Inpatient triage queue, imaging scans, SOAP progress notes & active Rx'
    },
    {
      id: 'directory',
      label: 'HOSPITAL FORMULARY',
      icon: Pill,
      badge: '30+ Meds DB',
      description: 'Comprehensive clinical drug database with 3D molecular structures'
    },
    {
      id: 'interactions',
      label: 'CONTRAINDICATION SCREEN',
      icon: ShieldAlert,
      badge: '3D Receptor Docking',
      description: 'Multi-drug CYP3A4/CYP2C9 competitive receptor interaction simulator'
    },
    {
      id: 'scanner',
      label: 'AI CLINICAL DIAGNOSTICS',
      icon: Stethoscope,
      badge: 'Multimodal Vision',
      description: 'Multimodal AI differential diagnosis with imaging & lab evaluation'
    }
  ];

  const pendingCount = (user?.patients || []).filter(p => p.status === 'Pending').length;

  const metrics = [
    {
      label: 'WARD TRIAGE',
      value: `${pendingCount > 0 ? `${pendingCount} PENDING` : 'ALL TRIAGED'}`,
      detailTitle: 'INPATIENT CLINICAL WORKFLOW',
      detailSub: 'Real-time patient queue with Pending, Consulted, and Treated states, attached radiology scans, and doctor SOAP notes.',
      description: 'Active hospital intake status across ICU, Cardiology, and Respiratory wards.',
      actionTab: 'patients',
      actionLabel: 'OPEN PATIENT EMR'
    },
    {
      label: 'FORMULARY DB',
      value: '30+ THERAPEUTICS',
      detailTitle: 'STANDARDIZED HOSPITAL FORMULARY',
      detailSub: 'Critical care, oncology, cardiology, and antimicrobial therapeutics with full pharmacology profiles.',
      description: 'Curated RxNorm and ATC pharmacotherapy catalog with real-time 3D models.',
      actionTab: 'directory',
      actionLabel: 'BROWSE FORMULARY'
    },
    {
      label: 'AI DIAGNOSTICS',
      value: 'INTERACTIVE DSS',
      detailTitle: 'MULTIMODAL DIFFERENTIAL ENGINE',
      detailSub: 'Analyzes patient symptom presentations, CT/X-Ray imaging scans, and vitals telemetry with clinical differentials.',
      description: 'Rapid differential hypothesis generation and algorithmic triage indicators.',
      actionTab: 'scanner',
      actionLabel: 'RUN AI SCAN'
    },
    {
      label: 'CONTRAINDICATIONS',
      value: 'CYP450 / DOAC',
      detailTitle: 'PAIRWISE RECEPTOR SCREENING',
      detailSub: '3D biochemical simulation of competitive enzymatic active site docking and drug-drug synergies.',
      description: 'Severe and moderate contraindication alerts with clinical intervention guidance.',
      actionTab: 'interactions',
      actionLabel: 'SCREEN DRUGS'
    }
  ];

  return (
    <div className="w-full space-y-10 pb-16">
      
      {/* Primary Hero Section with 3D Background */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 lg:p-14 text-center"
      >
        {/* Real-time 3D Particle Mesh Background */}
        <Hero3DBackground />

        {/* Ambient audio toggle in top right */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isAudioMuted
                ? 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600'
                : 'bg-blue-50/90 border-blue-200 text-blue-600 shadow-xs'
            }`}
            title={isAudioMuted ? 'Unmute UI Audio FX' : 'Mute UI Audio FX'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />}
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-mono">
              {isAudioMuted ? 'FX Muted' : 'Audio Live'}
            </span>
          </button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          
          {/* Animated Clinical ECG Vital Ribbon */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-6 w-32 relative overflow-hidden flex items-center opacity-75">
              <svg className="w-full h-full text-blue-500" viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 12 L30 12 L36 4 L42 20 L48 10 L52 14 L56 12 L120 12" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-shimmer" style={{ width: '40%', animationDuration: '2s' }}></div>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 backdrop-blur-xs border border-blue-200/80 text-blue-700 text-xs font-extrabold tracking-wider uppercase shadow-2xs hover:scale-105 transition-transform cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span>3D CLINICAL DECISION SUPPORT SYSTEM</span>
            </motion.div>

            <div className="h-6 w-32 relative overflow-hidden flex items-center opacity-75">
              <svg className="w-full h-full text-blue-500" viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 12 L30 12 L36 4 L42 20 L48 10 L52 14 L56 12 L120 12" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-shimmer" style={{ width: '40%', animationDuration: '2s' }}></div>
            </div>
          </div>

          {/* Display Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 uppercase leading-none"
          >
            CLINICAL <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-blue-900 to-blue-600">
              INTELLIGENCE CENTER
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Multimodal diagnostic toolkit with real-time 3D WebGL molecular simulation, pairwise interaction screening, and personal adherence tracking.
          </motion.p>

          {/* 4 Interactive Hero Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 max-w-4xl mx-auto"
          >
            {heroModules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.button
                  key={module.id}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  onClick={() => {
                    soundFx.click();
                    setActiveTab(module.id);
                  }}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-[10px] tracking-wider transition-all shadow-md hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer border border-blue-400/30 overflow-hidden uppercase"
                >
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-sky-200 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="tracking-wider">{module.label}</span>
                  </div>
                  <div className="relative z-10 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-[9px] text-blue-200 font-mono font-medium uppercase">
                      {module.badge}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* 3 Key Stats Strip */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-2xl mx-auto text-center">
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight font-['JetBrains_Mono',monospace]">EVIDENCE</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">CLINICAL GUIDELINES</div>
            </div>
            <div className="space-y-1 border-x border-slate-200">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight font-['JetBrains_Mono',monospace]">30+</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">CORE MONOGRAPHS</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight font-['JetBrains_Mono',monospace]">CLOUD</div>
              <div className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">FIRESTORE SYNC</div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Interactive 3D Showcase Studio Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 glass-panel"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                3D Interactive Clinical Lab & Morphology Studio
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Drag, rotate 360°, inspect chemical lattice bonds, and examine inner API micro-granules in real-time WebGL.
            </p>
          </div>

          {/* Mode Switcher: 3D Capsule vs 3D Molecule vs 3D Biometric */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                soundFx.pillFlip();
                setHero3DMode('pill');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                hero3DMode === 'pill'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>3D Pill</span>
            </button>

            <button
              onClick={() => {
                soundFx.pillFlip();
                setHero3DMode('molecule');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                hero3DMode === 'molecule'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>3D Lattice</span>
            </button>

            <button
              onClick={() => {
                soundFx.pillFlip();
                setHero3DMode('biometric');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                hero3DMode === 'biometric'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>3D Biometrics</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {hero3DMode === 'pill' ? (
                <motion.div
                  key="pill-viewer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThreePillCanvas
                    shape={heroPillShape}
                    colorPrimary="#2563eb"
                    colorSecondary="#f8fafc"
                    imprint="AGIES 500"
                    score="Single"
                    height={360}
                    interactive={true}
                    autoRotateInit={true}
                    showControls={true}
                  />
                </motion.div>
              ) : hero3DMode === 'molecule' ? (
                <motion.div
                  key="mol-viewer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThreeMoleculeViewer
                    medicineId="amoxicillin"
                    medicineName="Amoxicillin"
                    height={360}
                    autoRotate={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="bio-viewer"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThreeBiometricRings
                    height={360}
                    interactive={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Controls & Info Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>Morphology Parameters</span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  WebGL 2.0 Active
                </span>
              </div>

              {hero3DMode === 'pill' ? (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500">Preset Geometry</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Capsule', 'Round', 'Oval', 'Oblong'] as PillShape3D[]).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => {
                          soundFx.click();
                          setHeroPillShape(shape);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                          heroPillShape === shape
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
                    Supports high-resolution ray casting, specular highlight shifts, debossed score lines, and inner active nanoparticle rendering.
                  </p>
                </div>
              ) : hero3DMode === 'molecule' ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Interactive atomic orbital structure with covalent bonds and thermal vibration simulations for leading pharmaceutical compounds.
                  </p>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>View In Medicine Directory</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Multi-axial kinetic gyroscope mapping real-time diagnostic latency, pharmacokinetic bio-distribution, and rule engine integrity.
                  </p>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>Launch AI Diagnostics</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metric Detail Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs transition-all glass-panel">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                {metrics[selectedMetric].detailTitle}
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-3xl">
              {metrics[selectedMetric].detailSub}
            </p>
          </div>
          <button
            onClick={() => {
              soundFx.click();
              setActiveTab(metrics[selectedMetric].actionTab);
            }}
            className="self-start md:self-center px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs tracking-wider flex items-center gap-2 transition-all border border-blue-200/70 shrink-0 cursor-pointer"
          >
            <span>{metrics[selectedMetric].actionLabel}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Clinical Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const isSelected = selectedMetric === idx;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundFx.click();
                setSelectedMetric(idx);
              }}
              className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-400/20'
                  : 'bg-white/60 backdrop-blur-sm border-slate-200 text-slate-950 hover:border-blue-300 hover:bg-white/80'
              }`}
            >
              <div>
                <div className={`text-[10px] font-bold tracking-wider uppercase ${
                  isSelected ? 'text-blue-100' : 'text-slate-600'
                }`}>
                  {metric.label}
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 font-['JetBrains_Mono',monospace] ${
                  isSelected ? 'text-white' : 'text-blue-600'
                }`}>
                  {metric.value}
                </div>
              </div>

              <div className={`text-xs mt-4 leading-relaxed font-medium ${
                isSelected ? 'text-blue-50' : 'text-slate-500'
              }`}>
                {metric.description}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Clinical Insights & Safety Overview Header Section */}
      <div className="pt-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Clinical Insights & Safety Overview
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Live diagnostic intelligence, pairwise molecular matrices, and personal adherence monitors.
            </p>
          </div>
          <button
            onClick={() => {
              soundFx.click();
              setActiveTab('directory');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <span>Explore Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              soundFx.click();
              setActiveTab('directory');
            }}
            className="group p-6 rounded-2xl glass-panel hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
              3D Pill Identifier & Imprint Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Identify unknown oral capsules and tablets by shape, color palette, and laser imprints with 3D WebGL rotation and zoom.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Launch 3D Identifier</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              soundFx.click();
              setActiveTab('interactions');
            }}
            className="group p-6 rounded-2xl glass-panel hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition-colors">
              Multi-Drug Interaction Matrices
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time pairwise checking across CYP450 pathways, renal clearances, and special pregnancy/geriatric alerts with 3D binding simulator.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
              <span>Analyze Cross-Risks</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            onClick={() => {
              soundFx.click();
              setActiveTab('scanner');
            }}
            className="group p-6 rounded-2xl glass-panel hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
              AI Symptom & Dermatology Scanner
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multimodal image capture combined with clinical reasoning and 3D anatomical radar for rapid differential diagnostics.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Start Multimodal Scan</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};
