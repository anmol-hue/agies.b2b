/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiagnosticResult, Medicine, UserAccount, SavedAiScan } from '../types';
import {
  Stethoscope,
  Upload,
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Pill,
  Plus,
  X,
  Loader2,
  Image as ImageIcon,
  Activity,
  Scan,
  History,
  Trash2,
  Calendar,
  Layers,
  FileText,
  FileCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  Paperclip,
  RotateCcw,
  FileCode,
  Info,
  Check,
  Copy,
  Brain,
  Cpu,
  Zap,
  Gauge,
  Microscope,
  Dna,
  Award,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';
import { ThreeAnatomicalScanner, AnatomicalZone } from './ThreeAnatomicalScanner';
import { saveAiScanToFirestore, fetchUserScansFromFirestore, deleteScanFromFirestore } from '../lib/firebase';

interface ClinicalScannerProps {
  user: UserAccount;
  onAddToCabinet: (med: Medicine) => void;
  setActiveTab: (tab: string) => void;
}

interface AttachedScanDocument {
  name: string;
  sizeFormatted: string;
  type: 'pdf' | 'word' | 'image' | 'text';
  mimeType: string;
  dataUrl?: string;
  fileText?: string;
}

export const ClinicalScanner: React.FC<ClinicalScannerProps> = ({
  user,
  onAddToCabinet,
  setActiveTab
}) => {
  const [mainView, setMainView] = useState<'scanner' | 'archive'>('scanner');
  const [activeSubTab, setActiveSubTab] = useState<'symptoms' | 'skin'>('symptoms');

  // Input states — ALL INITIALLY BLANK TO PREVENT CONFUSION
  const [symptomText, setSymptomText] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Attached Scan Files (PDF, Word, Images, Text)
  const [attachedFile, setAttachedFile] = useState<AttachedScanDocument | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Diagnostic Results & Validation
  const [loading, setLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [savedScans, setSavedScans] = useState<SavedAiScan[]>([]);
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [selectedArchiveScan, setSelectedArchiveScan] = useState<SavedAiScan | null>(null);

  // Diagnosis result is initially null — NEVER pre-populated with fake answers
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [copiedSoapNote, setCopiedSoapNote] = useState<boolean>(false);
  const [activeFacultyTab, setActiveFacultyTab] = useState<'consensus' | 'internist' | 'pathology' | 'pharmacology' | 'soap'>('consensus');
  const [consensusStep, setConsensusStep] = useState<number>(1);
  const [orderedLabs, setOrderedLabs] = useState<Record<string, boolean>>({});
  const [medAddedNotification, setMedAddedNotification] = useState<string | null>(null);

  // Multi-Faculty consensus step progression while loading
  useEffect(() => {
    let interval: any;
    if (loading) {
      setConsensusStep(1);
      interval = setInterval(() => {
        setConsensusStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 700);
    } else {
      setConsensusStep(1);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  // Load saved scans from Firestore on mount or user change
  useEffect(() => {
    async function loadScans() {
      const uid = user.id;
      if (uid) {
        const fetched = await fetchUserScansFromFirestore(uid);
        if (fetched.length > 0) {
          setSavedScans(fetched);
        } else if (user.savedScans && user.savedScans.length > 0) {
          setSavedScans(user.savedScans);
        }
      }
    }
    loadScans();
  }, [user.id]);

  const availableTags = [
    'Low-grade Fever',
    'Persistent Cough',
    'Skin Rash / Hives',
    'Chest Pain / Tightness',
    'Shortness of Breath',
    'Sore Throat',
    'Acid Heartburn',
    'Joint Ache',
    'Dizziness',
    'Severe Headache',
    'Abdominal Pain'
  ];

  const handleTagToggle = (tag: string) => {
    soundFx.click();
    setValidationError(null);
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Format file sizes cleanly
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Ultra-fast client-side image compression to prevent large upload lag
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } else {
            resolve(readerEvent.target?.result as string);
          }
        };
        img.onerror = () => resolve(readerEvent.target?.result as string);
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Handle generic scan file selection (PDF, Word, Text, Images)
  const handleGenericFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.scanPulse();
    setValidationError(null);

    const fileName = file.name;
    const lowerName = fileName.toLowerCase();
    const sizeFormatted = formatFileSize(file.size);

    if (file.type.startsWith('image/') || lowerName.endsWith('.dcm')) {
      // Process as Image with ultra-fast browser compression
      const compressedDataUrl = await compressImage(file);
      setImagePreview(compressedDataUrl);
      setImageMimeType('image/jpeg');
      setAttachedFile({
        name: fileName,
        sizeFormatted,
        type: 'image',
        mimeType: 'image/jpeg',
        dataUrl: compressedDataUrl
      });
    } else if (lowerName.endsWith('.pdf') || file.type === 'application/pdf') {
      // Process as PDF Document
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAttachedFile({
          name: fileName,
          sizeFormatted,
          type: 'pdf',
          mimeType: 'application/pdf',
          dataUrl
        });
      };
      reader.readAsDataURL(file);

    } else {
      // Word document or Text document (.doc, .docx, .txt, .rtf)
      const reader = new FileReader();
      reader.onloadend = () => {
        const textContent = (reader.result as string) || '';
        // Extract basic readable text
        const cleanPreview = textContent.replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ').slice(0, 4000);
        setAttachedFile({
          name: fileName,
          sizeFormatted,
          type: lowerName.endsWith('.doc') || lowerName.endsWith('.docx') ? 'word' : 'text',
          mimeType: file.type || 'application/msword',
          fileText: cleanPreview
        });
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveAttachedFile = () => {
    soundFx.click();
    setAttachedFile(null);
    setImagePreview(null);
    setImageMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleRunAnalysis = async () => {
    // PREVENT DIAGNOSIS IF USER HAS NOT PROVIDED ANY INPUT OR ATTACHMENT
    const hasSymptoms = Boolean(symptomText.trim());
    const hasTags = selectedTags.length > 0;
    const hasFile = Boolean(attachedFile);
    const hasImage = Boolean(imagePreview);

    if (!hasSymptoms && !hasTags && !hasFile && !hasImage) {
      soundFx.alert();
      setValidationError('Please type patient symptoms, select symptom tags, or attach a scan file (PDF, Word, or Image) before running diagnosis.');
      return;
    }

    setValidationError(null);
    setAnalysisError(null);
    soundFx.scanPulse();
    setLoading(true);

    const combinedDescription = [
      symptomText.trim(),
      selectedTags.length > 0 ? `Reported symptom indicators: ${selectedTags.join(', ')}` : '',
      activeSubTab === 'skin' ? 'Primary Focus: Dermatological Skin Evaluation' : '',
      attachedFile ? `Attached Clinical File: ${attachedFile.name} (${attachedFile.type.toUpperCase()})` : ''
    ].filter(Boolean).join('. ');

    try {
      const response = await fetch('/api/ai-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: combinedDescription,
          tags: selectedTags,
          anatomicalArea: activeSubTab === 'skin' ? 'skin' : undefined,
          image: imagePreview,
          mimeType: imageMimeType || 'image/jpeg',
          fileName: attachedFile?.name,
          fileText: attachedFile?.fileText,
          fileData: attachedFile?.dataUrl
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || `Diagnostic service response error: ${response.status}`);
      }

      const diagResult: DiagnosticResult = await response.json();

      soundFx.success();
      setResult(diagResult);
      setAnalysisError(null);

      // AUTOMATICALLY SAVE REAL SCAN TO FIRESTORE
      const uid = user.id || 'clinician-user';
      const newSavedScan: SavedAiScan = {
        id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        userId: uid,
        timestamp: new Date().toISOString(),
        scanType: attachedFile ? (attachedFile.type === 'image' ? 'image' : 'symptoms') : 'symptoms',
        queryOrPillName: attachedFile
          ? `File: ${attachedFile.name}`
          : (symptomText.slice(0, 45) || selectedTags.join(', ') || 'Clinical Evaluation'),
        previewUrl: imagePreview || undefined,
        matchedDrugName: diagResult.matches?.[0]?.condition || diagResult.primaryHypothesis,
        confidence: diagResult.confidence,
        primaryHypothesis: diagResult.primaryHypothesis,
        empatheticNarrative: diagResult.empatheticNarrative,
        differentialMatches: diagResult.matches || [],
        isDangerous: diagResult.isDangerous,
        warningSigns: diagResult.warningSigns || [],
        recommendation: diagResult.recDoctor || 'Physician Evaluation'
      };

      await saveAiScanToFirestore(newSavedScan);
      setSavedScans(prev => [newSavedScan, ...prev]);

      setSavedNotification('AI Diagnostic Scan saved to Firebase Cloud Archive.');
      setTimeout(() => setSavedNotification(null), 4500);

    } catch (err: any) {
      console.error('Tri-Model diagnostic service error:', err);
      soundFx.alert();
      setAnalysisError(err.message || 'The diagnostic service encountered high demand. Please click Retry Analysis to evaluate again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetScan = () => {
    soundFx.click();
    setResult(null);
    setSymptomText('');
    setSelectedTags([]);
    handleRemoveAttachedFile();
    setValidationError(null);
    setAnalysisError(null);
  };

  const handleDeleteScan = async (scanId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.click();
    await deleteScanFromFirestore(scanId);
    setSavedScans(prev => prev.filter(s => s.id !== scanId));
    if (selectedArchiveScan?.id === scanId) {
      setSelectedArchiveScan(null);
    }
  };

  const filteredArchive = savedScans.filter(s => 
    s.primaryHypothesis.toLowerCase().includes(archiveSearch.toLowerCase()) ||
    s.queryOrPillName.toLowerCase().includes(archiveSearch.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              AI Clinical & Diagnostic Scanner
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold tracking-wider uppercase font-mono">
              Auto-Sync
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-3xl">
            Multimodal clinical intelligence engine with 3D anatomical organ chamber exploration, disease propagation mapping, and document scan analysis.
          </p>
        </div>

        {/* View Switcher: Live Scanner vs Saved Scans Archive */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => {
              soundFx.click();
              setMainView('scanner');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainView === 'scanner'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Live AI Scanner</span>
          </button>

          <button
            onClick={() => {
              soundFx.click();
              setMainView('archive');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainView === 'archive'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Scans Archive</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono">
              {savedScans.length}
            </span>
          </button>
        </div>
      </div>

      {/* Auto Save Notification Banner */}
      <AnimatePresence>
        {savedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{savedNotification}</span>
            </div>
            <button
              onClick={() => setMainView('archive')}
              className="text-emerald-700 underline text-xs font-extrabold hover:text-emerald-900 cursor-pointer"
            >
              View in Archive →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation Error Banner */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-sm cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clinical Intelligence Command & Consensus Strip */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle atmospheric glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
                <Stethoscope className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    Tri-Specialist Clinical Intelligence Workstation
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CDS Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  High-precision diagnostic triangulation across Diagnostic Internal Medicine, Pathophysiology, and Clinical Pharmacotherapy.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/80 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bayesian Differential</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/80 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-indigo-400" />
                <span>3D Pathology Atlas</span>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/80 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>EMR SOAP Ready</span>
              </span>
            </div>
          </div>

          {/* Quick Specialist Capabilities Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold font-mono uppercase tracking-wider">
                <Brain className="w-4 h-4 text-blue-400 shrink-0" />
                <span>1. Chief Diagnostic Internist</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                Triangulates symptoms into probabilistic differential diagnoses with ICD-10-CM coding and acute emergency stratification.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold font-mono uppercase tracking-wider">
                <Microscope className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>2. Clinical Pathophysiologist</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                Maps anatomical lesion epicenter, cellular cascade mechanisms, downstream collateral organ risks, and propagation routes.
              </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider">
                <Pill className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3. Pharmacotherapy & STAT Orders</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                Formulates guideline-directed medical therapy (GDMT), allergy alternatives, contraindications, and interactive lab order sets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main View: LIVE SCANNER */}
      {mainView === 'scanner' && (
        <div className="space-y-6">
          {/* Sub Tabs: SYMPTOM CHECKER vs AI SKIN SCANNER */}
          <div className="flex items-center gap-6 border-b border-slate-200 text-sm font-bold">
            <button
              onClick={() => {
                soundFx.click();
                setActiveSubTab('symptoms');
              }}
              className={`pb-3 transition-colors uppercase tracking-wider text-xs relative cursor-pointer ${
                activeSubTab === 'symptoms' ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>SYMPTOM INTAKE & SYSTEM CHECK</span>
              {activeSubTab === 'symptoms' && (
                <motion.div layoutId="scannertab-active" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                soundFx.click();
                setActiveSubTab('skin');
              }}
              className={`pb-3 transition-colors uppercase tracking-wider text-xs relative cursor-pointer ${
                activeSubTab === 'skin' ? 'text-blue-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>AI DERMAL & TISSUE SCAN</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-100 text-blue-700 font-mono">VISION 2.0</span>
              </span>
              {activeSubTab === 'skin' && (
                <motion.div layoutId="scannertab-active" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Inputs & Attachments (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
                
                {/* 1. Free-text Symptom Description */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-extrabold text-slate-900 tracking-tight">
                      Describe Patient Symptoms
                    </label>
                    {symptomText && (
                      <button
                        onClick={() => setSymptomText('')}
                        className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Quick Case Presets for Rapid Evaluation */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                    <span className="text-slate-400 font-bold uppercase shrink-0 text-[9px] font-mono">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        setSymptomText('Sudden onset sub-sternal chest pressure radiating to left arm with diaphoresis and shortness of breath.');
                        setSelectedTags(['Chest Pain / Tightness', 'Shortness of Breath', 'Dizziness']);
                        setActiveSubTab('symptoms');
                        setValidationError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 shrink-0 transition-all cursor-pointer"
                    >
                      🫀 Angina / Chest
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        setSymptomText('Erythematous maculopapular rash on forearms with intense pruritus after garden foliage exposure.');
                        setSelectedTags(['Skin Rash / Hives']);
                        setActiveSubTab('skin');
                        setValidationError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 shrink-0 transition-all cursor-pointer"
                    >
                      🔬 Dermal Rash
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        setSymptomText('Sore throat with tonsillar exudate, low-grade fever 100.8 F, productive cough, and tender anterior cervical nodes.');
                        setSelectedTags(['Sore Throat', 'Low-grade Fever', 'Persistent Cough']);
                        setActiveSubTab('symptoms');
                        setValidationError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 shrink-0 transition-all cursor-pointer"
                    >
                      🗣️ Pharyngitis / Cough
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        setSymptomText('Unilateral throbbing frontotemporal cephalea with photophobia, nausea, and visual scintillating scotoma.');
                        setSelectedTags(['Severe Headache', 'Dizziness']);
                        setActiveSubTab('symptoms');
                        setValidationError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 shrink-0 transition-all cursor-pointer"
                    >
                      🧠 Migraine / Cephalea
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.click();
                        setSymptomText('Postprandial retrosternal burning pain aggravated by supine recumbency with acid regurgitation.');
                        setSelectedTags(['Acid Heartburn', 'Abdominal Pain']);
                        setActiveSubTab('symptoms');
                        setValidationError(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold border border-slate-200 shrink-0 transition-all cursor-pointer"
                    >
                      🤢 GERD / Reflux
                    </button>
                  </div>

                  <textarea
                    value={symptomText}
                    onChange={(e) => {
                      setSymptomText(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    rows={3}
                    placeholder="Type symptoms here (e.g. sore throat with white patches, low-grade fever, dry cough, abdominal reflux after meals...)"
                    className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs leading-relaxed"
                  />

                  {/* Quick symptom tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                          }`}
                        >
                          <span>{tag}</span>
                          {isSelected ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Attach Scan Files (PDF, Word, Text, Images) */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span>Attach Scan Files & Reports</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">PDF, Word, Images</span>
                  </div>

                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={handleGenericFileChange}
                    accept=".pdf,.doc,.docx,.txt,.rtf,image/*,.dcm"
                    className="hidden"
                  />

                  {attachedFile ? (
                    /* File Attachment Preview Card */
                    <div className="relative rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            {attachedFile.type === 'pdf' && <FileText className="w-5 h-5 text-rose-200" />}
                            {attachedFile.type === 'word' && <FileCode className="w-5 h-5 text-blue-200" />}
                            {attachedFile.type === 'image' && <ImageIcon className="w-5 h-5 text-emerald-200" />}
                            {attachedFile.type === 'text' && <FileText className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {attachedFile.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                              <span>{attachedFile.sizeFormatted}</span>
                              <span>•</span>
                              <span className="uppercase font-bold text-blue-700">{attachedFile.type} DOCUMENT</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleRemoveAttachedFile}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Remove attachment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* If it's an image, show small thumbnail preview with laser animation */}
                      {imagePreview && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-40 bg-slate-950 flex items-center justify-center relative group">
                          <img src={imagePreview} alt="Attached Scan" className="max-h-40 object-contain w-full" />
                          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
                          {loading && (
                            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-scanner-laser pointer-events-none" />
                          )}
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] text-cyan-300 font-mono flex items-center gap-1 border border-cyan-500/30">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Neural Scan Target</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ready for AI Diagnostic Ingestion</span>
                      </div>
                    </div>
                  ) : (
                    /* Dropzone Button */
                    <div
                      onClick={() => {
                        soundFx.click();
                        docInputRef.current?.click();
                      }}
                      className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 p-5 text-center space-y-2 cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Click or drag to attach scan files
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Supports Lab Reports, Radiology PDFs, Word clinic notes, and Skin/Tissue imagery.
                      </p>
                    </div>
                  )}
                </div>

                {/* Analysis Error & Retry Card */}
                {analysisError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-rose-900">Consortium Connection Notice</div>
                          <div className="text-rose-700 text-[11px] leading-relaxed mt-0.5">
                            {analysisError}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setAnalysisError(null)}
                        className="text-rose-500 hover:text-rose-800 text-sm font-bold p-0.5 cursor-pointer"
                        title="Dismiss"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={handleRunAnalysis}
                        disabled={loading}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] tracking-wide transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry Analysis</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Run Diagnostic Button */}
                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunAnalysis}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                        <span>Tri-Faculty Peer Review in Progress...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-cyan-300" />
                        <span>Run Tri-Model Diagnostic Scan</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Tri-Faculty Consensus Peer Review Chamber Animation */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 space-y-3 shadow-lg overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                          <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                            Tri-Faculty Peer Review Active
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Consensus Stage {consensusStep} of 3
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className={`p-2 rounded-xl border transition-all flex items-center gap-2.5 ${consensusStep >= 1 ? 'bg-slate-800/90 border-cyan-500/50 text-cyan-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                          <Brain className={`w-4 h-4 shrink-0 ${consensusStep === 1 ? 'animate-pulse text-cyan-400' : 'text-cyan-400'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[11px]">Faculty 1: Chief Diagnostic Internist</div>
                            <div className="text-[10px] text-slate-400 truncate">Calculating Bayesian differentials & ICD-10 candidate matrix</div>
                          </div>
                          {consensusStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />}
                        </div>

                        <div className={`p-2 rounded-xl border transition-all flex items-center gap-2.5 ${consensusStep >= 2 ? 'bg-slate-800/90 border-indigo-500/50 text-indigo-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                          <Microscope className={`w-4 h-4 shrink-0 ${consensusStep === 2 ? 'animate-pulse text-indigo-400' : 'text-indigo-400'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[11px]">Faculty 2: Senior Pathophysiologist</div>
                            <div className="text-[10px] text-slate-400 truncate">Triangulating lesion site, cellular cascade & downstream risks</div>
                          </div>
                          {consensusStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : consensusStep === 2 ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" /> : null}
                        </div>

                        <div className={`p-2 rounded-xl border transition-all flex items-center gap-2.5 ${consensusStep >= 3 ? 'bg-slate-800/90 border-emerald-500/50 text-emerald-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                          <Pill className={`w-4 h-4 shrink-0 ${consensusStep === 3 ? 'animate-pulse text-emerald-400' : 'text-emerald-400'}`} />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[11px]">Faculty 3: Clinical Pharmacologist</div>
                            <div className="text-[10px] text-slate-400 truncate">Formulating guideline therapeutics, dosing & STAT orders</div>
                          </div>
                          {consensusStep >= 3 ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" /> : null}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Right Column: 3D Anatomical System Model & Results (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 3D Disease & Clinical Images Explorer (Interactive in both Standby and Result states) */}
              <ThreeAnatomicalScanner
                symptomArea={result?.anatomicalArea}
                affectedOrganSystem={result?.affectedOrganSystem}
                conditionTitle={result?.primaryHypothesis}
                isScanning={loading}
                confidence={result?.confidence}
                hasDiagnosedResult={Boolean(result)}
                height={480}
                primaryLesionSite={result?.primaryLesionSite}
                affectedDownstreamOrgans={result?.affectedDownstreamOrgans}
                systemicSideEffects={result?.systemicSideEffects}
                propagationPathways={result?.propagationPathways}
                differentialMatches={result?.matches}
                patientUploadedImage={imagePreview || attachedFile?.dataUrl}
                empatheticNarrative={result?.empatheticNarrative}
                warningSigns={result?.warningSigns}
                recDoctor={result?.recDoctor}
                isDangerous={result?.isDangerous}
                icd10Code={result?.icd10Code}
                clinicalWorkup={result?.clinicalWorkup}
                pharmacotherapy={result?.pharmacotherapy}
                soapNote={result?.soapNote}
              />

              {/* State A: Result is Null -> Standby Guidance Frame */}
              {!result && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>3D Disease & Clinical Image Explorer (Diagnostic Standby)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The 3D viewer above presents interactive clinical examination modalities in a spatial 3D carousel. Drag or click the arrows to rotate between <strong>Chest Radiography (CXR)</strong>, <strong>Dermatoscopy</strong>, <strong>12-Lead ECG</strong>, <strong>Pharyngeal Exam</strong>, <strong>Gastric Endoscopy</strong>, and <strong>Neurovascular Imaging</strong>. Click any card to deep-inspect normal benchmarks.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">To generate 3D disease dossier:</span>
                    <span>1. Enter symptoms on the left.</span>
                    <span>•</span>
                    <span>2. Or attach a scan file (PDF/Word/Image).</span>
                    <span>•</span>
                    <span>3. Click &quot;Run AI Diagnostic Scan&quot;.</span>
                  </div>
                </div>
              )}

              {/* State B: Result is Ready -> Interactive Multi-Faculty Clinical Diagnostic Dossier */}
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
                >
                  {/* Top Status, Consensus & Credit Shield Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${result.isDangerous === 'Dangerous' ? 'bg-rose-600' : 'bg-emerald-600'} animate-pulse`} />
                      <span className={`text-xs font-extrabold tracking-wider uppercase ${result.isDangerous === 'Dangerous' ? 'text-rose-700' : 'text-emerald-700'}`}>
                        Triage: {result.isDangerous === 'Dangerous' ? 'Emergency / Urgent' : 'Stable / Routine'}
                      </span>
                      {result.affectedOrganSystem && (
                        <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          {result.affectedOrganSystem}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Brain className="w-3 h-3 text-indigo-600" />
                        <span>Consensus: {result.consensusScore || 95}% Agreement</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Clinical Consensus Verified</span>
                      </span>

                      <button
                        onClick={handleResetScan}
                        className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>New Scan</span>
                      </button>
                      <div className="text-xs font-extrabold text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded-md">
                        Match {result.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Primary Diagnostic Hypothesis & ICD-10 */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                          Consensus Diagnostic Hypothesis
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                          {result.primaryHypothesis}
                        </h2>
                      </div>
                      {result.icd10Code && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ICD-10-CM: {result.icd10Code}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Faculty Navigation Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
                    <button
                      onClick={() => {
                        soundFx.click();
                        setActiveFacultyTab('consensus');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeFacultyTab === 'consensus'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Consensus Overview</span>
                    </button>

                    <button
                      onClick={() => {
                        soundFx.click();
                        setActiveFacultyTab('internist');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeFacultyTab === 'internist'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Faculty 1: Internist</span>
                    </button>

                    <button
                      onClick={() => {
                        soundFx.click();
                        setActiveFacultyTab('pathology');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeFacultyTab === 'pathology'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <Microscope className="w-3.5 h-3.5" />
                      <span>Faculty 2: Pathologist</span>
                    </button>

                    <button
                      onClick={() => {
                        soundFx.click();
                        setActiveFacultyTab('pharmacology');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeFacultyTab === 'pharmacology'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Faculty 3: Pharmacologist</span>
                    </button>

                    <button
                      onClick={() => {
                        soundFx.click();
                        setActiveFacultyTab('soap');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeFacultyTab === 'soap'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Hospital SOAP Note</span>
                    </button>
                  </div>

                  {/* TAB 1: Consensus Overview */}
                  {activeFacultyTab === 'consensus' && (
                    <div className="space-y-5">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                        {result.empatheticNarrative}
                      </p>

                      {/* 3-Faculty Peer Review Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                            <Brain className="w-4 h-4 text-indigo-600" />
                            <span>Internist Review</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {result.specialistPanels?.internist?.keyFindings || 'Bayesian probability favors primary hypothesis with differential rank verified.'}
                          </p>
                          <div className="text-[10px] font-mono text-indigo-700 font-bold">
                            ICD-10 Code: {result.icd10Code || 'J06.9'}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                            <Microscope className="w-4 h-4 text-purple-600" />
                            <span>Pathologist Review</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            Epicenter: <strong>{result.primaryLesionSite || 'Regional mucosal/tissue layer'}</strong>.
                          </p>
                          <div className="text-[10px] font-mono text-purple-700 font-bold">
                            Mechanism: {result.specialistPanels?.pathologist?.cellularMechanism || 'Inflammatory cytokine cascade'}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                            <Pill className="w-4 h-4 text-emerald-600" />
                            <span>Pharmacologist Review</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed truncate">
                            Rx: {result.pharmacotherapy?.firstLine || 'Targeted first-line guideline therapy.'}
                          </p>
                          <div className="text-[10px] font-mono text-emerald-700 font-bold">
                            Contraindication screen complete
                          </div>
                        </div>
                      </div>

                      {/* Warning Signs Box */}
                      {result.warningSigns && result.warningSigns.length > 0 && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-950">
                          <div className="font-extrabold uppercase tracking-wider text-[11px] text-rose-700 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Emergency Warning Signs (Seek Urgent Medical Care If Present)</span>
                          </div>
                          <ul className="space-y-1 list-disc list-inside font-medium text-[11px] text-rose-900">
                            {result.warningSigns.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Faculty 1 - Chief Diagnostic Internist */}
                  {activeFacultyTab === 'internist' && (
                    <div className="space-y-5">
                      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-indigo-600" />
                          <div>
                            <div className="text-xs font-bold text-indigo-950">Chief Diagnostic Internist Differential Matrix</div>
                            <div className="text-[10px] text-indigo-700">Bayesian diagnostic ranking with verified ICD-10 diagnostic coding</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-mono font-bold">
                          Model Lead
                        </span>
                      </div>

                      <div className="space-y-3">
                        {result.matches.map((diff, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span className="font-bold text-sm text-slate-900">{diff.condition}</span>
                                {diff.icd10Code && (
                                  <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                                    {diff.icd10Code}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                                {diff.urgency}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {diff.details}
                            </p>

                            <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                              <span><strong>Intervention:</strong> {diff.typicalInterventions}</span>
                              <span className="text-indigo-600 font-mono font-bold">Consult: {result.recDoctor}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Faculty 2 - Senior Pathophysiologist */}
                  {activeFacultyTab === 'pathology' && (
                    <div className="space-y-5">
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Microscope className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="text-xs font-bold text-purple-950">Senior Clinical Pathophysiologist Anatomical Dossier</div>
                            <div className="text-[10px] text-purple-700">Anatomic lesion site, cellular cascade, and organ propagation mapping</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-mono font-bold">
                          Pathology
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-purple-600" />
                            <span>Primary Lesion Epicenter</span>
                          </span>
                          <p className="text-xs text-slate-700 font-semibold">
                            {result.primaryLesionSite || 'Targeted anatomical mucosa / epidermal barrier'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Mechanism: {result.specialistPanels?.pathologist?.cellularMechanism || 'Cell-mediated localized immune and inflammatory response'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-purple-600" />
                            <span>Affected Downstream Organs</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(result.affectedDownstreamOrgans && result.affectedDownstreamOrgans.length > 0
                              ? result.affectedDownstreamOrgans
                              : ['Microvascular capillary beds', 'Regional lymphatic drainage nodes']
                            ).map((org, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-medium">
                                {org}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {result.propagationPathways && result.propagationPathways.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Dna className="w-4 h-4 text-purple-600" />
                            <span>Pathological Propagation Pathways</span>
                          </span>
                          <ul className="space-y-1 text-xs text-slate-700">
                            {result.propagationPathways.map((pathway, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-purple-600 font-bold">›</span>
                                <span>{pathway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: Faculty 3 - Clinical Pharmacologist & STAT Lab Orders */}
                  {activeFacultyTab === 'pharmacology' && (
                    <div className="space-y-5">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Pill className="w-5 h-5 text-emerald-600" />
                          <div>
                            <div className="text-xs font-bold text-emerald-950">Clinical Pharmacologist & Toxicologist Orders</div>
                            <div className="text-[10px] text-emerald-700">Guideline-directed medical therapy, dosing regimens, and STAT diagnostic workup</div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-mono font-bold">
                          Pharmacotherapy
                        </span>
                      </div>

                      {/* Regimens */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                          <span className="text-[11px] font-bold text-blue-900 font-mono uppercase tracking-wider block">
                            First-Line Regimen (Primary GDMT)
                          </span>
                          <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                            {result.pharmacotherapy?.firstLine || 'Initiate standard first-line guideline therapy tailored to renal/hepatic function.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                          <span className="text-[11px] font-bold text-amber-900 font-mono uppercase tracking-wider block">
                            Alternative Regimen (Allergy / Second-Line)
                          </span>
                          <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                            {result.pharmacotherapy?.alternative || 'Second-line allergy-sparing agent based on patient tolerance.'}
                          </p>
                        </div>
                      </div>

                      {/* Contraindications */}
                      {result.pharmacotherapy?.contraindications && result.pharmacotherapy.contraindications.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                          <span className="text-[11px] font-bold text-rose-800 font-mono uppercase tracking-wider block">
                            Contraindications & Screening Precautions
                          </span>
                          <ul className="list-disc list-inside text-xs text-rose-900 space-y-0.5">
                            {result.pharmacotherapy.contraindications.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Interactive Priority Lab Orders Checklist */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>🧪</span> Interactive Priority Lab & Diagnostic Order Set
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">Check to mark order completed</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(result.clinicalWorkup?.labTests && result.clinicalWorkup.labTests.length > 0
                            ? result.clinicalWorkup.labTests
                            : ['Complete Blood Count (CBC) with diff', 'Basic Metabolic Panel (BMP)', 'Inflammatory CRP/ESR markers']
                          ).map((lab, i) => {
                            const isDone = Boolean(orderedLabs[lab]);
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  soundFx.click();
                                  setOrderedLabs(prev => ({ ...prev, [lab]: !prev[lab] }));
                                }}
                                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through opacity-80'
                                    : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                                }`}
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                                    {isDone && <Check className="w-3 h-3 text-white" />}
                                  </span>
                                  <span className="truncate">{lab}</span>
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">STAT</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Hospital EMR SOAP Documentation */}
                  {activeFacultyTab === 'soap' && (
                    <div className="p-5 rounded-3xl bg-slate-900 text-slate-200 space-y-4 shadow-sm border border-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-bold text-white font-mono tracking-wide uppercase">
                            Hospital EMR SOAP Consult Documentation
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const fullSoapText = [
                              `=== CLINICAL DECISION SUPPORT CONSULT NOTE ===`,
                              `DATE: ${new Date().toLocaleDateString()} | TIME: ${new Date().toLocaleTimeString()}`,
                              `CONDITION: ${result.primaryHypothesis}`,
                              result.icd10Code ? `ICD-10 CODE: ${result.icd10Code}` : '',
                              `SPECIALIST: ${result.recDoctor || 'Internal Medicine'}`,
                              `INTER-SPECIALIST CONSENSUS: ${result.consensusScore || 95}%`,
                              '',
                              `[S] SUBJECTIVE:`,
                              result.soapNote?.subjective || result.empatheticNarrative,
                              '',
                              `[O] OBJECTIVE:`,
                              result.soapNote?.objective || `Target lesion: ${result.primaryLesionSite || 'Regional tissue'}. Labs and imaging pending.`,
                              '',
                              `[A] ASSESSMENT:`,
                              result.soapNote?.assessment || `${result.primaryHypothesis} [ICD-10: ${result.icd10Code || 'Unspecified'}]. Confidence: ${result.confidence}%.`,
                              '',
                              `[P] PLAN:`,
                              result.soapNote?.plan || `Initiate first-line regimen: ${result.pharmacotherapy?.firstLine || 'Guideline treatment'}. Complete diagnostic workup.`,
                              '',
                              `CLINICIAN SIGN-OFF: ___________________ MD/DO`
                            ].filter(Boolean).join('\n');

                            navigator.clipboard.writeText(fullSoapText);
                            setCopiedSoapNote(true);
                            setTimeout(() => setCopiedSoapNote(false), 3000);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          {copiedSoapNote ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied to EHR Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy SOAP Note to EHR</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div>
                          <span className="text-sky-400 font-bold block mb-0.5">[S] SUBJECTIVE:</span>
                          <p className="text-slate-300 pl-3 border-l-2 border-sky-500/40 leading-relaxed whitespace-pre-wrap">
                            {result.soapNote?.subjective || result.empatheticNarrative}
                          </p>
                        </div>

                        <div>
                          <span className="text-emerald-400 font-bold block mb-0.5">[O] OBJECTIVE:</span>
                          <p className="text-slate-300 pl-3 border-l-2 border-emerald-500/40 leading-relaxed whitespace-pre-wrap">
                            {result.soapNote?.objective || `Target lesion localized to ${result.primaryLesionSite || 'regional tissue'}. Clinical imaging and laboratory studies evaluated.`}
                          </p>
                        </div>

                        <div>
                          <span className="text-amber-400 font-bold block mb-0.5">[A] ASSESSMENT:</span>
                          <p className="text-slate-300 pl-3 border-l-2 border-amber-500/40 leading-relaxed whitespace-pre-wrap">
                            {result.soapNote?.assessment || `${result.primaryHypothesis} (Confidence: ${result.confidence}%). Key differential candidates evaluated.`}
                          </p>
                        </div>

                        <div>
                          <span className="text-purple-400 font-bold block mb-0.5">[P] PLAN:</span>
                          <p className="text-slate-300 pl-3 border-l-2 border-purple-500/40 leading-relaxed whitespace-pre-wrap">
                            {result.soapNote?.plan || `Prescribe first-line pharmacotherapy: ${result.pharmacotherapy?.firstLine || 'Guideline treatment'}. Complete confirmatory workup.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clinical Decision Support Reference Note */}
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {result.disclaimer}
                    </span>
                  </div>

                </motion.div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main View: SCANS ARCHIVE & SAVED RECORDS */}
      {mainView === 'archive' && (
        <div className="space-y-6">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                placeholder="Search scans by diagnosis, symptoms, or tags..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredArchive.length} of {savedScans.length} cloud records
            </div>
          </div>

          {filteredArchive.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Scan className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Saved AI Scans Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Run an AI symptom check or scan in the Live Scanner tab. Completed analyses are automatically persisted to your Firebase Firestore cloud archive.
              </p>
              <button
                onClick={() => setMainView('scanner')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Scan className="w-4 h-4" />
                <span>Launch Live Scanner</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArchive.map((scan) => (
                <motion.div
                  key={scan.id}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedArchiveScan(scan)}
                  className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(scan.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-700 font-mono">
                        {scan.confidence}% Match
                      </span>
                    </div>

                    {scan.previewUrl && (
                      <div className="h-28 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-2">
                        <img src={scan.previewUrl} alt="Scan preview" className="max-h-full object-contain rounded" />
                      </div>
                    )}

                    <h4 className="text-base font-extrabold text-slate-950 line-clamp-2">
                      {scan.primaryHypothesis}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {scan.empatheticNarrative}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-blue-600 font-mono truncate max-w-[170px]">
                        {scan.queryOrPillName}
                      </span>
                      <button
                        onClick={(e) => handleDeleteScan(scan.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete record from Cloud"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Archive Modal Inspection Dialog */}
      <AnimatePresence>
        {selectedArchiveScan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedArchiveScan(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-mono font-bold">
                    CLOUD ARCHIVED RECORD
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(selectedArchiveScan.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-950">
                  {selectedArchiveScan.primaryHypothesis}
                </h3>
              </div>

              {selectedArchiveScan.previewUrl && (
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex justify-center">
                  <img src={selectedArchiveScan.previewUrl} alt="Visual scan" className="max-h-56 object-contain rounded-xl" />
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedArchiveScan.empatheticNarrative}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Differential Conditions Evaluated:</h4>
                <div className="space-y-2">
                  {selectedArchiveScan.differentialMatches.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{m.condition}</span>
                        <span className="text-blue-700">{m.urgency}</span>
                      </div>
                      <div className="text-slate-600">{m.typicalInterventions}</div>
                      <p className="text-[11px] text-slate-500">{m.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedArchiveScan.warningSigns && selectedArchiveScan.warningSigns.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1 text-rose-700">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Warning Signs:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedArchiveScan.warningSigns.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedArchiveScan(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
                >
                  Close Record
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
