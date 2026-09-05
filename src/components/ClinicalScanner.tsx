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
  Copy
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';
import { ThreeAnatomicalScanner, AnatomicalZone } from './ThreeAnatomicalScanner';
import { saveAiScanToFirestore, fetchUserScansFromFirestore, deleteScanFromFirestore } from '../lib/firebase';
import { browserAI } from '../lib/browserAI';

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
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [savedScans, setSavedScans] = useState<SavedAiScan[]>([]);
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [selectedArchiveScan, setSelectedArchiveScan] = useState<SavedAiScan | null>(null);

  // Diagnosis result is initially null — NEVER pre-populated with fake answers
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [copiedSoapNote, setCopiedSoapNote] = useState<boolean>(false);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const textContent = (reader.result as string) || '';
        const cleanPreview = textContent.replace(/[\\x00-\\x09\\x0B-\\x1F\\x7F-\\x9F]/g, ' ').slice(0, 4000);
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
          image: imagePreview,
          mimeType: imageMimeType,
          fileData: attachedFile?.dataUrl,
          fileName: attachedFile?.name,
          fileText: attachedFile?.fileText
        })
      });

      if (!response.ok) throw new Error(`Server AI error: ${response.status}`);

      const diagResult = await response.json();
      setResult(diagResult);
    } catch (err: any) {
      console.error('AI Diagnosis error:', err);
      setValidationError(`Critical System Error: ${err.message}. Please try again or check your connection.`);
    } finally {
      soundFx.success();
      setLoading(false);

      if (result) {
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
          matchedDrugName: result.matches?.[0]?.condition || result.primaryHypothesis,
          confidence: result.confidence,
          primaryHypothesis: result.primaryHypothesis,
          empatheticNarrative: result.empatheticNarrative,
          differentialMatches: result.matches || [],
          isDangerous: result.isDangerous,
          warningSigns: result.warningSigns || [],
          recommendation: result.recDoctor || 'Physician Evaluation'
        };

        await saveAiScanToFirestore(newSavedScan);
        setSavedScans(prev => [newSavedScan, ...prev]);

        setSavedNotification('High-accuracy AI Diagnostic Scan automatically saved to Firebase.');
        setTimeout(() => setSavedNotification(null), 4500);
      }
    }
  };

  const handleResetScan = () => {
    soundFx.click();
    setResult(null);
    setSymptomText('');
    setSelectedTags([]);
    handleRemoveAttachedFile();
    setValidationError(null);
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
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              AI Clinical & Diagnostic Scanner
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-blue-300 text-[10px] font-bold tracking-wider uppercase font-mono border border-blue-500/30">
              Auto-Sync
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-3xl">
            Multimodal clinical intelligence engine with 3D anatomical organ chamber exploration, disease propagation mapping, and document scan analysis.
          </p>
        </div>

        {/* View Switcher: Live Scanner vs Saved Scans Archive */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              soundFx.click();
              setMainView('scanner');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainView === 'scanner'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-100'
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
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Scans Archive</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-900/40 text-blue-300 text-[10px] font-mono border border-blue-500/30">
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
            className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{savedNotification}</span>
            </div>
            <button
              onClick={() => setMainView('archive')}
              className="text-emerald-300 underline text-xs font-extrabold hover:text-emerald-100 cursor-pointer"
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
            className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-amber-300 hover:text-amber-100 font-bold ml-2 text-sm cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View: LIVE SCANNER */}
      {mainView === 'scanner' && (
        <div className="space-y-6">
          {/* Sub Tabs: SYMPTOM CHECKER vs AI SKIN SCANNER */}
          <div className="flex items-center gap-6 border-b border-slate-800 text-sm font-bold">
            <button
              onClick={() => {
                soundFx.click();
                setActiveSubTab('symptoms');
              }}
              className={`pb-3 transition-colors uppercase tracking-wider text-xs relative cursor-pointer ${
                activeSubTab === 'symptoms' ? 'text-blue-400 font-extrabold' : 'text-slate-500 hover:text-slate-100'
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
                activeSubTab === 'skin' ? 'text-blue-400 font-extrabold' : 'text-slate-500 hover:text-slate-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>AI DERMAL & TISSUE SCAN</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-900/40 text-blue-300 font-mono border border-blue-500/30">VISION 2.0</span>
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
              <div className="clinical-panel border-beam rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm relative">
                <div className="hud-corner hud-tl" />
                <div className="hud-corner hud-tr" />
                <div className="hud-corner hud-bl" />
                <div className="hud-corner hud-br" />

                {/* 1. Free-text Symptom Description */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-extrabold text-slate-100 tracking-tight">
                      Describe Patient Symptoms
                    </label>
                    {symptomText && (
                      <button
                        onClick={() => setSymptomText('')}
                        className="text-[11px] text-slate-500 hover:text-rose-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <textarea
                    value={symptomText}
                    onChange={(e) => {
                      setSymptomText(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    rows={3}
                    placeholder="Type symptoms here (e.g. sore throat with white patches, low-grade fever, dry cough, abdominal reflux after meals...)"
                    className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs leading-relaxed"
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
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          <span>{tag}</span>
                          {isSelected ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3 text-slate-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Attach Scan Files (PDF, Word, Text, Images) */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-extrabold text-slate-100 tracking-tight flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-blue-400" />
                      <span>Attach Scan Files & Reports</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">PDF, Word, Images</span>
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
                    <div className="relative rounded-2xl border border-blue-500/30 bg-slate-950 p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            {attachedFile.type === 'pdf' && <FileText className="w-5 h-5 text-rose-200" />}
                            {attachedFile.type === 'word' && <FileCode className="w-5 h-5 text-blue-200" />}
                            {attachedFile.type === 'image' && <ImageIcon className="w-5 h-5 text-emerald-200" />}
                            {attachedFile.type === 'text' && <FileText className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-100 truncate">
                              {attachedFile.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                              <span>{attachedFile.sizeFormatted}</span>
                              <span>•</span>
                              <span className="uppercase font-bold text-blue-400">{attachedFile.type} DOCUMENT</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleRemoveAttachedFile}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-900/20 cursor-pointer transition-colors"
                          title="Remove attachment"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* If it's an image, show small thumbnail preview */}
                      {imagePreview && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 max-h-36 bg-black flex items-center justify-center">
                          <img src={imagePreview} alt="Attached Scan" className="max-h-36 object-contain" />
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
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
                      className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-blue-500 hover:bg-blue-600/10 p-5 text-center space-y-2 cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-slate-800">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold text-slate-300">
                        Click or drag to attach scan files
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Supports Lab Reports, Radiology PDFs, Word clinic notes, and Skin/Tissue imagery.
                      </p>
                    </div>
                  )}
                </div>

                {/* Run Diagnostic Button */}
                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRunAnalysis}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Executing Multi-Tier Neural Cascade...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run AI Diagnostic Scan</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 relative">

              {/* Cinematic Scan Laser Line Overlay */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-blue-500 z-50 shadow-[0_0_15px_2px_rgba(59,130,246,0.8)] pointer-events-none"
                    style={{ width: '100%' }}
                  />
                )}
              </AnimatePresence>

              {/* 3D Disease & Clinical Images Explorer */}
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
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-2 text-slate-100 font-extrabold text-sm">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span>3D Disease & Clinical Image Explorer (Diagnostic Standby)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The 3D viewer above presents interactive clinical examination modalities in a spatial 3D carousel. Drag or click the arrows to rotate between <strong className="text-slate-200">Chest Radiography (CXR)</strong>, <strong className="text-slate-200">Dermatoscopy</strong>, <strong className="text-slate-200">12-Lead ECG</strong>, <strong className="text-slate-200">Pharyngeal Exam</strong>, <strong className="text-slate-200">Gastric Endoscopy</strong>, and <strong className="text-slate-200">Neurovascular Imaging</strong>. Click any card to deep-inspect normal benchmarks.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-300">To generate 3D disease dossier:</span>
                    <span className="clinical-text-mono">1. Enter symptoms on the left.</span>
                    <span className="text-slate-600">•</span>
                    <span className="clinical-text-mono">2. Or attach a scan file (PDF/Word/Image).</span>
                    <span className="text-slate-600">•</span>
                    <span className="clinical-text-mono">3. Click &quot;Run AI Diagnostic Scan&quot;.</span>
                  </div>
                </div>
              )}

              {/* State B: Result is Ready -> Comprehensive Clinical Diagnostic Dossier */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="clinical-panel border-beam data-stream rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative z-10"
                >
                  <div className="hud-corner hud-tl" />
                  <div className="hud-corner hud-tr" />
                  <div className="hud-corner hud-bl" />
                  <div className="hud-corner hud-br" />
                  {/* Header Status & Match Score */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${result.isDangerous === 'Dangerous' ? 'bg-rose-600' : 'bg-blue-600'} animate-pulse`}></span>
                      <span className={`text-xs font-extrabold tracking-wider uppercase ${result.isDangerous === 'Dangerous' ? 'text-rose-400' : 'text-blue-400'}`}>
                        Triage: {result.isDangerous === 'Dangerous' ? 'Emergency / Urgent' : 'Stable / Routine'}
                      </span>
                      {result.affectedOrganSystem && (
                        <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-md">
                          {result.affectedOrganSystem}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetScan}
                        className="text-xs text-slate-500 hover:text-slate-100 font-bold px-2.5 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>New Scan</span>
                      </button>
                      <div className="text-xs font-extrabold text-blue-400 font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                        Match {result.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Primary Diagnostic Hypothesis & ICD-10 */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                        {result.primaryHypothesis}
                      </h2>
                      {result.icd10Code && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>ICD-10-CM: {result.icd10Code}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      {result.empatheticNarrative}
                    </p>
                  </div>

                  {/* PHYSICIAN CLINICAL DECISION SUPPORT */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-100 tracking-tight flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span>Physician Diagnostic Workup & Order Panel</span>
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500">Evidence-Based Clinical Guidance</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Priority Labs */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <span>🧪</span> Priority Lab Orders
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">STAT/Urgent</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {(result.clinicalWorkup?.labTests && result.clinicalWorkup.labTests.length > 0 ? result.clinicalWorkup.labTests : [
                            'Complete Blood Count (CBC) with diff',
                            'Comprehensive Metabolic Panel (CMP)',
                            'C-Reactive Protein (CRP) / Inflammatory markers'
                          ]).map((lab, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">›</span>
                              <span>{lab}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Imaging Modalities */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                            <span>🩻</span> Imaging Modalities
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">Radiology</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {(result.clinicalWorkup?.imagingStudies && result.clinicalWorkup.imagingStudies.length > 0 ? result.clinicalWorkup.imagingStudies : [
                            'Targeted Point-of-Care Ultrasound (POCUS)',
                            'Plain Radiographs (AP/Lateral)',
                            'Cross-sectional CT / MRI if red flags present'
                          ]).map((img, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-sky-600 font-bold">›</span>
                              <span>{img}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Physical Exam Signs */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <span>🩺</span> Physical Maneuvers
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">Objective</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {(result.clinicalWorkup?.physicalSigns && result.clinicalWorkup.physicalSigns.length > 0 ? result.clinicalWorkup.physicalSigns : [
                            'Targeted palpation for point tenderness and swelling',
                            'Regional auscultation and perfusion check',
                            'Provocative sign assessment'
                          ]).map((sign, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold">›</span>
                              <span>{sign}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Pharmacotherapy & Guideline Therapeutics */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-base text-slate-100 tracking-tight flex items-center gap-2">
                          <Pill className="w-4 h-4 text-blue-400" />
                          <span>Guideline Pharmacotherapy & Dosing Regimens</span>
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500">
                          Consult Specialist: <strong className="text-slate-100">{result.recDoctor || 'Internal Medicine'}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 space-y-1.5">
                          <span className="text-[11px] font-bold text-blue-300 font-mono uppercase tracking-wider block">
                            First-Line Regimen
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                            {result.pharmacotherapy?.firstLine || 'Initiate standard first-line guideline therapy tailored to renal and hepatic function.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-900/30 border border-amber-500/30 space-y-1.5">
                          <span className="text-[11px] font-bold text-amber-300 font-mono uppercase tracking-wider block">
                            Alternative Regimen (Allergy / Intolerance)
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                            {result.pharmacotherapy?.alternative || 'Second-line allergy-sparing agent based on patient tolerance.'}
                          </p>
                        </div>
                      </div>

                      {result.pharmacotherapy?.contraindications && result.pharmacotherapy.contraindications.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-rose-900/30 border border-rose-500/30 space-y-1">
                          <span className="text-[11px] font-bold text-rose-300 font-mono uppercase tracking-wider block">
                            Contraindications & Safety Screening
                          </span>
                          <ul className="list-disc list-inside text-xs text-rose-200 space-y-0.5">
                            {result.pharmacotherapy.contraindications.map((contra, idx) => (
                              <li key={idx}>{contra}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Hospital EMR SOAP Documentation */}
                    <div className="p-5 rounded-3xl bg-slate-950 text-slate-200 space-y-4 shadow-sm border border-slate-800">
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
                              result.soapNote?.plan || `Initiate first-line regimen: ${result.pharmacotherapy?.firstLine || 'Guideline treatment'}. Complete confirmatory workup.`,
                              '',
                              `CLINICIAN SIGN-OFF: ___________________ MD/DO`
                            ].filter(Boolean).join('\\n');

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

                    {/* Differential Diagnoses List */}
                    <div className="space-y-4 pt-2">
                      <h3 className="font-extrabold text-base text-slate-100 tracking-tight">
                        Differential Diagnoses Matrix
                      </h3>

                      <div className="space-y-3">
                        {result.matches.map((diff, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-blue-500/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-sm text-slate-100">{diff.condition}</div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-md border border-blue-500/30">
                                {diff.urgency}
                              </span>
                            </div>

                            <div className="text-xs text-slate-400 leading-relaxed">
                              <span className="font-semibold text-slate-300">Specialist: </span>
                              {result.recDoctor}. <span className="font-semibold text-slate-300">Intervention: </span>
                              {diff.typicalInterventions}
                            </div>

                            <p className="text-[11px] text-slate-500 font-normal">
                              {diff.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Warning Signs Box */}
                    {result.warningSigns && result.warningSigns.length > 0 && (
                      <div className="p-4 rounded-2xl bg-rose-900/30 border border-rose-500/30 space-y-2 text-xs text-rose-200">
                        <div className="font-extrabold uppercase tracking-wider text-[11px] text-rose-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Emergency Warning Signs (Seek Urgent Care If Present)</span>
                        </div>
                        <ul className="space-y-1 list-disc list-inside font-medium text-[11px] text-rose-300">
                          {result.warningSigns.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Clinical Decision Support Reference Note */}
                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                      <span>
                        {result.disclaimer}
                      </span>
                    </div>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                placeholder="Search scans by diagnosis, symptoms, or tags..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Showing {filteredArchive.length} of {savedScans.length} cloud records
            </div>
          </div>

          {filteredArchive.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-950 text-blue-400 flex items-center justify-center mx-auto border border-slate-800">
                <Scan className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">No Saved AI Scans Yet</h3>
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
                  className="clinical-panel rounded-3xl p-5 space-y-4 shadow-xs hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(scan.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-900/40 text-blue-300 font-mono border border-blue-500/30">
                        {scan.confidence}% Match
                      </span>
                    </div>

                    {scan.previewUrl && (
                      <div className="h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-2">
                        <img src={scan.previewUrl} alt="Scan preview" className="max-h-full object-contain rounded" />
                      </div>
                    )}

                    <h4 className="text-base font-extrabold text-slate-100 line-clamp-2">
                      {scan.primaryHypothesis}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {scan.empatheticNarrative}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-blue-400 font-mono truncate max-w-[170px]">
                        {scan.queryOrPillName}
                      </span>
                      <button
                        onClick={(e) => handleDeleteScan(scan.id, e)}
                        className="text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-900/20 transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedArchiveScan(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-900/40 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                    CLOUD ARCHIVED RECORD
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(selectedArchiveScan.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-100">
                  {selectedArchiveScan.primaryHypothesis}
                </h3>
              </div>

              {selectedArchiveScan.previewUrl && (
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 p-2 flex justify-center">
                  <img src={selectedArchiveScan.previewUrl} alt="Visual scan" className="max-h-56 object-contain rounded-xl" />
                </div>
              )}

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedArchiveScan.empatheticNarrative}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-100">Differential Conditions Evaluated:</h4>
                <div className="space-y-2">
                  {selectedArchiveScan.differentialMatches.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-100">
                        <span>{m.condition}</span>
                        <span className="text-blue-400">{m.urgency}</span>
                      </div>
                      <div className="text-slate-400">{m.typicalInterventions}</div>
                      <p className="text-[11px] text-slate-500">{m.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedArchiveScan.warningSigns && selectedArchiveScan.warningSigns.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-900/30 border border-rose-500/30 text-xs text-rose-200 space-y-1.5">
                  <div className="font-bold flex items-center gap-1 text-rose-400">
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
                  className="px-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 border border-slate-800"
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
