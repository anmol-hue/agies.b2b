/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Activity, 
  FileText, 
  Paperclip, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Heart, 
  ShieldAlert, 
  Upload, 
  Pill, 
  ChevronRight, 
  Calendar, 
  Bed, 
  Building2, 
  Zap, 
  ExternalLink, 
  Sparkles, 
  Trash2, 
  Plus, 
  FileCheck, 
  Maximize2, 
  X,
  Droplet,
  Thermometer,
  Wind,
  Layers,
  Printer,
  ChevronDown
} from 'lucide-react';
import { 
  Patient, 
  PatientStatus, 
  TriageUrgency, 
  PatientAttachment, 
  DoctorSoapNote, 
  CabinetItem, 
  UserAccount,
  Medicine
} from '../types';
import { MEDICINES } from '../data/medicines';

interface PatientManagerProps {
  user: UserAccount;
  onUpdatePatient: (patient: Patient) => void;
  onAddPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: string) => void;
  onRunAiScanForPatient: (patient: Patient) => void;
  onRunInteractionForPatient: (patient: Patient) => void;
  setActiveTab: (tab: string) => void;
}

export function PatientManager({
  user,
  onUpdatePatient,
  onAddPatient,
  onDeletePatient,
  onRunAiScanForPatient,
  onRunInteractionForPatient,
  setActiveTab
}: PatientManagerProps) {
  const patients = user.patients || [];
  
  // Status filter tab
  const [selectedStatusTab, setSelectedStatusTab] = useState<'Pending' | 'Consulted' | 'Treated' | 'All'>('Pending');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  
  // Modals
  const [isAddPatientOpen, setIsAddPatientOpen] = useState<boolean>(false);
  const [isAddAttachmentOpen, setIsAddAttachmentOpen] = useState<boolean>(false);
  const [isPrescribeOpen, setIsPrescribeOpen] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<PatientAttachment | null>(null);

  // SOAP Note Form State for the selected patient
  const [newSoapSubjective, setNewSoapSubjective] = useState<string>('');
  const [newSoapObjective, setNewSoapObjective] = useState<string>('');
  const [newSoapAssessment, setNewSoapAssessment] = useState<string>('');
  const [newSoapPlan, setNewSoapPlan] = useState<string>('');
  const [isWritingSoap, setIsWritingSoap] = useState<boolean>(false);

  // New Patient Form State
  const [newPatName, setNewPatName] = useState<string>('');
  const [newPatAge, setNewPatAge] = useState<number>(55);
  const [newPatGender, setNewPatGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatMrn, setNewPatMrn] = useState<string>(`MRN-${Math.floor(10000 + Math.random() * 90000)}`);
  const [newPatDept, setNewPatDept] = useState<Patient['department']>('Cardiology');
  const [newPatRoom, setNewPatRoom] = useState<string>('Ward 3 - Bed 04');
  const [newPatBlood, setNewPatBlood] = useState<Patient['bloodType']>('O+');
  const [newPatStatus, setNewPatStatus] = useState<PatientStatus>('Pending');
  const [newPatTriage, setNewPatTriage] = useState<TriageUrgency>('Urgent');
  const [newPatComplaint, setNewPatComplaint] = useState<string>('');
  const [newPatSymptoms, setNewPatSymptoms] = useState<string>('');
  const [newPatAllergies, setNewPatAllergies] = useState<string>('NKDA (No Known Drug Allergies)');
  const [newPatHR, setNewPatHR] = useState<number>(84);
  const [newPatBP, setNewPatBP] = useState<string>('126/82');
  const [newPatRR, setNewPatRR] = useState<number>(18);
  const [newPatTemp, setNewPatTemp] = useState<number>(98.6);
  const [newPatSpO2, setNewPatSpO2] = useState<number>(97);
  const [newPatGfr, setNewPatGfr] = useState<number>(85);

  // New Attachment Form State
  const [newAttTitle, setNewAttTitle] = useState<string>('');
  const [newAttCategory, setNewAttCategory] = useState<PatientAttachment['category']>('CT Scan');
  const [newAttModality, setNewAttModality] = useState<string>('GE Revolution 512-Slice CT');
  const [newAttFindings, setNewAttFindings] = useState<string>('');
  const [newAttUrgency, setNewAttUrgency] = useState<PatientAttachment['urgency']>('Abnormal');
  const [newAttUrl, setNewAttUrl] = useState<string>('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80');

  // Selected drug for prescribing
  const [selectedMedIdToPrescribe, setSelectedMedIdToPrescribe] = useState<string>(MEDICINES[0]?.id || '');
  const [prescribeDosage, setPrescribeDosage] = useState<string>(MEDICINES[0]?.dosage || '');
  const [prescribeFrequency, setPrescribeFrequency] = useState<string>('Daily');
  const [prescribeInstructions, setPrescribeInstructions] = useState<string>('Take with meals as clinically indicated.');

  // Canvas ref for live 2D ECG telemetry monitor
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active patient object
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0] || null;

  // Filtered patients list
  const filteredPatients = patients.filter(p => {
    const matchesStatus = selectedStatusTab === 'All' || p.status === selectedStatusTab;
    const matchesDept = departmentFilter === 'All' || p.department === departmentFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roomBed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDept && matchesSearch;
  });

  // Count per status
  const pendingCount = patients.filter(p => p.status === 'Pending').length;
  const consultedCount = patients.filter(p => p.status === 'Consulted').length;
  const treatedCount = patients.filter(p => p.status === 'Treated').length;

  // 2D Canvas ECG Rhythm Waveform Animation
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;
    const hr = activePatient?.vitals.heartRate || 75;
    const speed = (hr / 60) * 1.6;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    const drawECG = () => {
      ctx.fillStyle = 'rgba(10, 15, 29, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG wave path
      ctx.beginPath();
      ctx.strokeStyle = activePatient?.triageLevel === 'Critical' ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = activePatient?.triageLevel === 'Critical' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 8;

      for (let x = 0; x < width; x++) {
        const cycle = ((x + offset) * speed) % 180;
        let y = midY;

        // P Wave
        if (cycle >= 20 && cycle < 40) {
          y -= Math.sin(((cycle - 20) / 20) * Math.PI) * 6;
        }
        // Q Wave
        else if (cycle >= 50 && cycle < 56) {
          y += 5;
        }
        // R Wave (Spike)
        else if (cycle >= 56 && cycle < 66) {
          y -= 38;
        }
        // S Wave
        else if (cycle >= 66 && cycle < 74) {
          y += 10;
        }
        // T Wave
        else if (cycle >= 95 && cycle < 130) {
          y -= Math.sin(((cycle - 95) / 35) * Math.PI) * 12;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      offset += 1.8;
      animationId = requestAnimationFrame(drawECG);
    };

    drawECG();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activePatient?.id, activePatient?.vitals.heartRate, activePatient?.triageLevel]);

  // Handle status transition
  const handleUpdateStatus = (patient: Patient, nextStatus: PatientStatus) => {
    const updated: Patient = {
      ...patient,
      status: nextStatus,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onUpdatePatient(updated);
  };

  // Handle adding new patient
  const handleSubmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName.trim()) return;

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      mrn: newPatMrn.trim() || `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newPatName.trim(),
      age: Number(newPatAge) || 45,
      gender: newPatGender,
      department: newPatDept,
      roomBed: newPatRoom.trim() || 'Ward 1 - Bed 01',
      bloodType: newPatBlood,
      status: newPatStatus,
      triageLevel: newPatTriage,
      admissionDate: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      chiefComplaint: newPatComplaint.trim() || 'General acute triage evaluation requested.',
      symptoms: newPatSymptoms.split(',').map(s => s.trim()).filter(Boolean),
      allergies: newPatAllergies.split(',').map(a => a.trim()).filter(Boolean),
      vitals: {
        heartRate: Number(newPatHR) || 75,
        bloodPressure: newPatBP || '120/80',
        respiratoryRate: Number(newPatRR) || 16,
        temperature: Number(newPatTemp) || 98.6,
        oxygenSat: Number(newPatSpO2) || 98,
        gfr: Number(newPatGfr) || 90
      },
      attachments: [],
      prescriptions: [],
      doctorNotes: [
        {
          id: `note-${Date.now()}`,
          date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          author: user.doctorProfile?.name || user.name || 'Attending Physician',
          subjective: `Initial admission intake for ${newPatName}. Chief complaint: ${newPatComplaint}`,
          objective: `Initial Vitals: HR ${newPatHR}, BP ${newPatBP}, RR ${newPatRR}, Temp ${newPatTemp}°F, SpO2 ${newPatSpO2}%.`,
          assessment: `Patient triaged as ${newPatTriage} in ${newPatDept}.`,
          plan: '1. Initiate continuous vital telemetry.\n2. Complete initial clinical workup and laboratory screening.\n3. Clinical review pending.'
        }
      ],
      diagnosticHistory: [],
      lastUpdated: 'Just now',
      assignedDoctor: user.doctorProfile?.name || user.name || 'Dr. Marcus Vance, MD',
      hospitalUnit: user.doctorProfile?.activeHospitalWard || 'Metropolitan Acute Ward'
    };

    onAddPatient(newPatient);
    setSelectedPatientId(newPatient.id);
    setIsAddPatientOpen(false);
    // Reset inputs
    setNewPatName('');
    setNewPatComplaint('');
    setNewPatSymptoms('');
    setNewPatMrn(`MRN-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  // Add SOAP Note to active patient
  const handleAddSoapNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;
    if (!newSoapSubjective && !newSoapAssessment && !newSoapPlan) return;

    const newNote: DoctorSoapNote = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      author: user.doctorProfile?.name || user.name || 'Attending Clinician',
      subjective: newSoapSubjective || 'Subjective report recorded during round.',
      objective: newSoapObjective || `Vitals checked: HR ${activePatient.vitals.heartRate} bpm, BP ${activePatient.vitals.bloodPressure}, SpO2 ${activePatient.vitals.oxygenSat}%.`,
      assessment: newSoapAssessment || 'Clinical condition reviewed.',
      plan: newSoapPlan || 'Continue current clinical regimen and monitor.'
    };

    const updatedPatient: Patient = {
      ...activePatient,
      doctorNotes: [newNote, ...(activePatient.doctorNotes || [])],
      status: activePatient.status === 'Pending' ? 'Consulted' : activePatient.status,
      lastUpdated: 'Just now'
    };

    onUpdatePatient(updatedPatient);
    setNewSoapSubjective('');
    setNewSoapObjective('');
    setNewSoapAssessment('');
    setNewSoapPlan('');
    setIsWritingSoap(false);
  };

  // Add Attachment to active patient
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !newAttTitle.trim()) return;

    const newAtt: PatientAttachment = {
      id: `att-${Date.now()}`,
      title: newAttTitle.trim(),
      category: newAttCategory,
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      fileUrl: newAttUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      findings: newAttFindings.trim() || 'Imaging reviewed by attending radiologist. Detailed report attached.',
      modality: newAttModality.trim() || 'Clinical Diagnostic Station',
      urgency: newAttUrgency,
      fileSize: '4.2 MB'
    };

    const updatedPatient: Patient = {
      ...activePatient,
      attachments: [newAtt, ...(activePatient.attachments || [])],
      lastUpdated: 'Just now'
    };

    onUpdatePatient(updatedPatient);
    setIsAddAttachmentOpen(false);
    setNewAttTitle('');
    setNewAttFindings('');
  };

  // Prescribe medicine to active patient
  const handlePrescribeMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;
    const med = MEDICINES.find(m => m.id === selectedMedIdToPrescribe);
    if (!med) return;

    const newRx: CabinetItem = {
      id: `rx-${Date.now()}`,
      medicineId: med.id,
      name: med.name,
      dosage: prescribeDosage || med.dosage,
      frequency: prescribeFrequency,
      instructions: prescribeInstructions,
      nextDose: '08:00 AM',
      takenToday: true,
      historyDates: [new Date().toISOString().split('T')[0]],
      prescribedBy: user.doctorProfile?.name || user.name || 'Attending Physician',
      startDate: new Date().toLocaleDateString()
    };

    const updatedPatient: Patient = {
      ...activePatient,
      prescriptions: [newRx, ...(activePatient.prescriptions || [])],
      lastUpdated: 'Just now'
    };

    onUpdatePatient(updatedPatient);
    setIsPrescribeOpen(false);
  };

  // Quick SOAP macro insertion helper
  const insertSoapMacro = (macroText: string) => {
    setNewSoapPlan(prev => prev ? `${prev}\n• ${macroText}` : `• ${macroText}`);
  };

  return (
    <div id="patient-emr-station" className="space-y-6 pb-16">
      
      {/* Top Clinical Header & Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-blue-50/60 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-800 border border-blue-200/60">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                {user.doctorProfile?.hospital || 'Metropolitan General Hospital'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                {user.doctorProfile?.specialty || 'Internal Medicine & Critical Care'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Hospital Clinical EMR & Patient Diagnostics
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                Live B2B Station
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Direct patient intake, high-resolution scans, multi-drug contraindication screenings, and AI differential diagnostics in one unified clinician suite.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              id="btn-admit-patient"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              Admit New Patient
            </button>
            <button
              onClick={() => window.print()}
              title="Print Clinical Summary Report"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Export EMR</span>
            </button>
          </div>
        </div>

        {/* 3 Status Filter Tabs + Counter Pills */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
            {/* PENDING TAB */}
            <button
              onClick={() => setSelectedStatusTab('Pending')}
              id="tab-status-pending"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                selectedStatusTab === 'Pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending Intake</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedStatusTab === 'Pending' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingCount}
              </span>
              {pendingCount > 0 && selectedStatusTab !== 'Pending' && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>

            {/* CONSULTED TAB */}
            <button
              onClick={() => setSelectedStatusTab('Consulted')}
              id="tab-status-consulted"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedStatusTab === 'Consulted'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Consulted / Active</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedStatusTab === 'Consulted' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                {consultedCount}
              </span>
            </button>

            {/* TREATED TAB */}
            <button
              onClick={() => setSelectedStatusTab('Treated')}
              id="tab-status-treated"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedStatusTab === 'Treated'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Treated / Discharged</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedStatusTab === 'Treated' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {treatedCount}
              </span>
            </button>

            {/* ALL TAB */}
            <button
              onClick={() => setSelectedStatusTab('All')}
              id="tab-status-all"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectedStatusTab === 'All'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>All ({patients.length})</span>
            </button>
          </div>

          {/* Quick Search & Department Filter */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient, MRN, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Emergency & Trauma">Emergency & Trauma</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Infectious Disease">Infectious Disease</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Patients List / Queue (5 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ward Triage Queue ({filteredPatients.length})
            </span>
            <span className="text-xs text-slate-500">
              Auto-sync active
            </span>
          </div>

          <div className="space-y-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Patients in this status</p>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your filter or admit a new patient.
                </p>
                <button
                  onClick={() => setIsAddPatientOpen(true)}
                  className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-colors"
                >
                  + Admit Patient
                </button>
              </div>
            ) : (
              filteredPatients.map((pat) => {
                const isSelected = activePatient?.id === pat.id;
                const isCritical = pat.triageLevel === 'Critical';

                return (
                  <motion.div
                    key={pat.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedPatientId(pat.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          pat.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {pat.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                              {pat.name}
                            </h3>
                            <span className="text-[11px] font-mono text-slate-400">
                              {pat.mrn}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{pat.age}y, {pat.gender}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{pat.bloodType}</span>
                            <span>•</span>
                            <span className="text-slate-600">{pat.roomBed}</span>
                          </p>
                        </div>
                      </div>

                      {/* Triage Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : pat.triageLevel === 'Urgent'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {pat.triageLevel}
                      </span>
                    </div>

                    {/* Complaint & Symptoms */}
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Complaint:</span> {pat.chiefComplaint}
                    </p>

                    {/* Micro Vitals & Attachments Count */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-mono">
                          <Heart className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-500' : 'text-emerald-500'}`} />
                          {pat.vitals.heartRate} bpm
                        </span>
                        <span className="font-mono">
                          BP {pat.vitals.bloodPressure}
                        </span>
                        <span className="font-mono">
                          SpO2 {pat.vitals.oxygenSat}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(pat.attachments || []).length > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-blue-600 font-medium">
                            <Paperclip className="w-3 h-3" />
                            {pat.attachments.length}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          pat.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          pat.status === 'Consulted' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {pat.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Deep Diagnostic & Clinical Console (8 Cols) */}
        <div className="lg:col-span-8">
          {activePatient ? (
            <div className="space-y-6">
              
              {/* Patient Profile & Direct Action Banner */}
              <motion.div 
                key={activePatient.id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-5"
              >
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {activePatient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-900">
                          {activePatient.name}
                        </h2>
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                          {activePatient.mrn}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span>{activePatient.age} Years Old ({activePatient.gender})</span>
                        <span>•</span>
                        <span className="text-slate-700 font-medium">{activePatient.department}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">{activePatient.roomBed}</span>
                        <span>•</span>
                        <span>Blood: <strong className="text-rose-600">{activePatient.bloodType}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* Status Progression Control */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                      {(['Pending', 'Consulted', 'Treated'] as PatientStatus[]).map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => handleUpdateStatus(activePatient, statusOption)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                            activePatient.status === statusOption
                              ? statusOption === 'Pending' ? 'bg-amber-500 text-white shadow-sm' :
                                statusOption === 'Consulted' ? 'bg-blue-600 text-white shadow-sm' :
                                'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI DIRECT ACTION BAR (Doctor can run scans & interaction checks with 1 click) */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      AI Assisted Clinical Engine
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Instant Multi-Modal Diagnostic & Drug Contraindication Checks
                    </p>
                    <p className="text-xs text-slate-300">
                      Pre-populates {activePatient.name}'s active symptoms, scan files, and {activePatient.prescriptions.length} active prescriptions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Launch AI Diagnostics */}
                    <button
                      onClick={() => onRunAiScanForPatient(activePatient)}
                      id="btn-run-ai-diagnostic-patient"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Run AI Diagnostic Scan
                    </button>

                    {/* Launch Interaction Checker */}
                    <button
                      onClick={() => onRunInteractionForPatient(activePatient)}
                      id="btn-run-interaction-patient"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Multi-Drug Screen
                    </button>
                  </div>
                </div>

                {/* Vitals Telemetry Section with Live 2D ECG Monitor */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-rose-500" />
                      Real-Time Vitals & Rhythm Telemetry
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ward Sensor Hub #08 • Active
                    </span>
                  </div>

                  {/* Vitals 4-Grid + ECG Canvas */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {/* Heart Rate */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Heart Rate</span>
                        <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                        {activePatient.vitals.heartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        activePatient.vitals.heartRate > 100 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {activePatient.vitals.heartRate > 100 ? 'Tachycardia' : 'Normal Sinus'}
                      </span>
                    </div>

                    {/* Blood Pressure */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Blood Pressure</span>
                        <Droplet className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                        {activePatient.vitals.bloodPressure} <span className="text-xs font-normal text-slate-500">mmHg</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        MAP ~{Math.round((parseInt(activePatient.vitals.bloodPressure.split('/')[0]) + 2 * parseInt(activePatient.vitals.bloodPressure.split('/')[1])) / 3)} mmHg
                      </span>
                    </div>

                    {/* Oxygen Saturation */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>SpO2 Oxygen</span>
                        <Wind className="w-3.5 h-3.5 text-cyan-500" />
                      </div>
                      <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                        {activePatient.vitals.oxygenSat}%
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        activePatient.vitals.oxygenSat < 93 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {activePatient.vitals.oxygenSat < 93 ? 'Hypoxic Flag' : 'Adequate'}
                      </span>
                    </div>

                    {/* Temperature & GFR */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Temp / eGFR</span>
                        <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-mono mt-1">
                        {activePatient.vitals.temperature}°F
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono">
                        eGFR: {activePatient.vitals.gfr} mL/min
                      </span>
                    </div>
                  </div>

                  {/* 2D Animated ECG Telemetry Strip */}
                  <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 relative overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pb-1.5 font-mono">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        LEAD II CONTINUOUS RHYTHM
                      </span>
                      <span>Gain: 10mm/mV • Sweep: 25mm/s</span>
                    </div>
                    <canvas 
                      ref={ecgCanvasRef} 
                      width={640} 
                      height={90} 
                      className="w-full h-[90px] rounded block bg-slate-950"
                    />
                  </div>
                </div>

                {/* Chief Complaint, Symptoms & Allergies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Chief Complaint & Presentation
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {activePatient.chiefComplaint}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {activePatient.symptoms.map((sym, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-50/50 rounded-xl p-3.5 border border-rose-200/60">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                      Known Allergies & Critical Contraindications
                    </span>
                    <div className="space-y-1 mt-2">
                      {activePatient.allergies.map((alg, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-rose-900 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {alg}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ATTACHMENTS & SCANS VIEWER (Direct Doctor Scans, X-Rays, MRIs, CTs) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      Diagnostic Imaging Scans & Lab Attachments
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      High-resolution imaging files, CT slices, and pathology results directly attached to {activePatient.name}.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddAttachmentOpen(true)}
                    id="btn-upload-scan-modal"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Attach New Scan / Lab
                  </button>
                </div>

                {/* Attachments Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(activePatient.attachments || []).length === 0 ? (
                    <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <Paperclip className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs text-slate-500 font-medium">No imaging scans attached yet.</p>
                      <button
                        onClick={() => setIsAddAttachmentOpen(true)}
                        className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                      >
                        + Upload First Scan
                      </button>
                    </div>
                  ) : (
                    activePatient.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="group bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 p-3 transition-all cursor-pointer relative overflow-hidden"
                        onClick={() => setPreviewAttachment(att)}
                      >
                        {/* Thumbnail */}
                        <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-900 mb-2.5">
                          <img
                            src={att.fileUrl}
                            alt={att.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            att.urgency === 'Critical Flag' ? 'bg-rose-600 text-white' :
                            att.urgency === 'Abnormal' ? 'bg-amber-500 text-white' :
                            'bg-emerald-600 text-white'
                          }`}>
                            {att.category}
                          </span>
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-semibold flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md">
                              <Maximize2 className="w-3.5 h-3.5" /> View Scan
                            </span>
                          </div>
                        </div>

                        {/* Title & Date */}
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {att.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5 font-mono">
                          <span>{att.date}</span>
                          <span>{att.fileSize || '3.2 MB'}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-1.5 italic">
                          "{att.findings}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ACTIVE PRESCRIPTIONS & PHARMACY FORMULARY */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-600" />
                      Active Inpatient & Discharge Prescriptions
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Medication orders, scheduled dosages, and bedside administration history.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPrescribeOpen(true)}
                    id="btn-prescribe-modal"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Prescribe Medication
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {activePatient.prescriptions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No active medications currently ordered for this patient.
                    </div>
                  ) : (
                    activePatient.prescriptions.map((rx) => {
                      const medInfo = MEDICINES.find(m => m.id === rx.medicineId);

                      return (
                        <div key={rx.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                              Rx
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900">{rx.name}</h4>
                                <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono">
                                  {rx.dosage}
                                </span>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                  {rx.frequency}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {rx.instructions} • <span className="italic">{rx.prescribedBy || 'Attending MD'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const updatedRx = activePatient.prescriptions.filter(r => r.id !== rx.id);
                                onUpdatePatient({
                                  ...activePatient,
                                  prescriptions: updatedRx,
                                  lastUpdated: 'Just now'
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Discontinue Medication"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* DOCTOR SOAP CLINICAL PROGRESS NOTES */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Doctor SOAP Clinical Progress Notes
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subjective, Objective, Assessment, and Plan documentation signed by attending staff.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsWritingSoap(!isWritingSoap)}
                    id="btn-toggle-soap-form"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {isWritingSoap ? 'Cancel Note' : 'Write Progress Note'}
                  </button>
                </div>

                {/* Interactive SOAP Note Writer */}
                <AnimatePresence>
                  {isWritingSoap && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddSoapNote}
                      className="bg-indigo-50/40 rounded-xl border border-indigo-200/70 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                        <span>New SOAP Note Entry</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-indigo-600 font-normal">Quick Macros:</span>
                          <button 
                            type="button" 
                            onClick={() => insertSoapMacro('Renal dose adjustment verified.')}
                            className="px-2 py-0.5 bg-white text-indigo-700 rounded text-[10px] border border-indigo-200 hover:bg-indigo-50"
                          >
                            + Renal Adj.
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertSoapMacro('Follow-up CT Angiogram ordered.')}
                            className="px-2 py-0.5 bg-white text-indigo-700 rounded text-[10px] border border-indigo-200 hover:bg-indigo-50"
                          >
                            + Order CT
                          </button>
                          <button 
                            type="button" 
                            onClick={() => insertSoapMacro('Discharge planning with 48h outpatient review.')}
                            className="px-2 py-0.5 bg-white text-indigo-700 rounded text-[10px] border border-indigo-200 hover:bg-indigo-50"
                          >
                            + Discharge Plan
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            (S) Subjective - Patient Symptoms & History
                          </label>
                          <textarea
                            rows={2}
                            value={newSoapSubjective}
                            onChange={(e) => setNewSoapSubjective(e.target.value)}
                            placeholder="Patient states pain is improved, denies nausea or dizziness..."
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            (O) Objective - Physical Exam & Lab Findings
                          </label>
                          <textarea
                            rows={2}
                            value={newSoapObjective}
                            onChange={(e) => setNewSoapObjective(e.target.value)}
                            placeholder={`HR ${activePatient.vitals.heartRate}, BP ${activePatient.vitals.bloodPressure}, SpO2 ${activePatient.vitals.oxygenSat}%...`}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            (A) Assessment - Clinical Diagnostic Impression
                          </label>
                          <textarea
                            rows={2}
                            value={newSoapAssessment}
                            onChange={(e) => setNewSoapAssessment(e.target.value)}
                            placeholder="Primary clinical assessment and differential ranking..."
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            (P) Plan - Interventions, Meds, & Follow-up
                          </label>
                          <textarea
                            rows={2}
                            value={newSoapPlan}
                            onChange={(e) => setNewSoapPlan(e.target.value)}
                            placeholder="1. Continue therapy\n2. Repeat labs in AM..."
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsWritingSoap(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Sign & Save Note
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Progress Notes Timeline */}
                <div className="space-y-3">
                  {(activePatient.doctorNotes || []).map((note) => (
                    <div key={note.id} className="bg-slate-50/80 rounded-xl border border-slate-200/70 p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/50">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                          {note.author}
                        </span>
                        <span className="font-mono">{note.date}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                        <div>
                          <strong className="text-slate-900 block font-semibold">Subjective:</strong>
                          <p className="mt-0.5">{note.subjective}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold">Objective:</strong>
                          <p className="mt-0.5">{note.objective}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold">Assessment:</strong>
                          <p className="mt-0.5 text-blue-950 font-medium">{note.assessment}</p>
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-semibold">Plan:</strong>
                          <p className="mt-0.5 whitespace-pre-line">{note.plan}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Select a Patient to View EMR</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Choose a patient from the ward triage list on the left to inspect live vitals, attached radiology scans, and initiate AI diagnostics.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: ADMIT NEW PATIENT */}
      <AnimatePresence>
        {isAddPatientOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Hospital Patient Admission Intake</h3>
                </div>
                <button
                  onClick={() => setIsAddPatientOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitNewPatient} className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Hayes"
                      value={newPatName}
                      onChange={(e) => setNewPatName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Age & Gender</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newPatAge}
                        onChange={(e) => setNewPatAge(Number(e.target.value))}
                        className="w-20 p-2 rounded-lg border border-slate-200"
                      />
                      <select
                        value={newPatGender}
                        onChange={(e) => setNewPatGender(e.target.value as any)}
                        className="flex-1 p-2 rounded-lg border border-slate-200"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Medical Record # (MRN)</label>
                    <input
                      type="text"
                      value={newPatMrn}
                      onChange={(e) => setNewPatMrn(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Clinical Department</label>
                    <select
                      value={newPatDept}
                      onChange={(e) => setNewPatDept(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pulmonology">Pulmonology</option>
                      <option value="Emergency & Trauma">Emergency & Trauma</option>
                      <option value="Infectious Disease">Infectious Disease</option>
                      <option value="Oncology">Oncology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Room / Bed Assignment</label>
                    <input
                      type="text"
                      value={newPatRoom}
                      onChange={(e) => setNewPatRoom(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Blood Type</label>
                    <select
                      value={newPatBlood}
                      onChange={(e) => setNewPatBlood(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                    <select
                      value={newPatStatus}
                      onChange={(e) => setNewPatStatus(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="Pending">Pending Intake</option>
                      <option value="Consulted">Consulted / Active</option>
                      <option value="Treated">Treated / Discharged</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Triage Urgency</label>
                    <select
                      value={newPatTriage}
                      onChange={(e) => setNewPatTriage(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="Critical">Critical (Immediate)</option>
                      <option value="Urgent">Urgent (Within 1h)</option>
                      <option value="Standard">Standard (Ward)</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chief Complaint *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe presentation reason..."
                    value={newPatComplaint}
                    onChange={(e) => setNewPatComplaint(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Symptoms (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Chest pain, Shortness of breath, Cough"
                      value={newPatSymptoms}
                      onChange={(e) => setNewPatSymptoms(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Known Drug Allergies</label>
                    <input
                      type="text"
                      placeholder="Penicillin, Sulfa, NKDA"
                      value={newPatAllergies}
                      onChange={(e) => setNewPatAllergies(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                {/* Vitals Baseline */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="block font-bold text-slate-800 mb-2">Baseline Triage Vitals</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">HR (bpm)</span>
                      <input
                        type="number"
                        value={newPatHR}
                        onChange={(e) => setNewPatHR(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">BP (mmHg)</span>
                      <input
                        type="text"
                        value={newPatBP}
                        onChange={(e) => setNewPatBP(e.target.value)}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">RR (bpm)</span>
                      <input
                        type="number"
                        value={newPatRR}
                        onChange={(e) => setNewPatRR(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Temp (°F)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={newPatTemp}
                        onChange={(e) => setNewPatTemp(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">SpO2 (%)</span>
                      <input
                        type="number"
                        value={newPatSpO2}
                        onChange={(e) => setNewPatSpO2(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">GFR</span>
                      <input
                        type="number"
                        value={newPatGfr}
                        onChange={(e) => setNewPatGfr(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddPatientOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    Complete Admission
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ATTACH NEW SCAN / LAB */}
      <AnimatePresence>
        {isAddAttachmentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Attach Radiology / Pathology Scan</h3>
                </div>
                <button
                  onClick={() => setIsAddAttachmentOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAttachment} className="space-y-3.5 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scan Title / Study Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Axial Brain MRI (T1/T2 Flair)"
                    value={newAttTitle}
                    onChange={(e) => setNewAttTitle(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newAttCategory}
                      onChange={(e) => setNewAttCategory(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="CT Scan">CT Scan</option>
                      <option value="MRI Scan">MRI Scan</option>
                      <option value="X-Ray">X-Ray</option>
                      <option value="ECG Strip">ECG Strip</option>
                      <option value="Pathology / Lab">Pathology / Lab</option>
                      <option value="Derm Photo">Dermatology Photo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Clinical Urgency</label>
                    <select
                      value={newAttUrgency}
                      onChange={(e) => setNewAttUrgency(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="Critical Flag">Critical Flag</option>
                      <option value="Abnormal">Abnormal Finding</option>
                      <option value="Normal">Normal / Unremarkable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Imaging System / Modality</label>
                  <input
                    type="text"
                    value={newAttModality}
                    onChange={(e) => setNewAttModality(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Radiologist / Lab Findings Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Document anatomical observations, lesions, density changes..."
                    value={newAttFindings}
                    onChange={(e) => setNewAttFindings(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddAttachmentOpen(false)}
                    className="px-3 py-1.5 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Attach to EMR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: PRESCRIBE MEDICATION */}
      <AnimatePresence>
        {isPrescribeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">Hospital Formulary Prescription Order</h3>
                </div>
                <button
                  onClick={() => setIsPrescribeOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePrescribeMedicine} className="space-y-3.5 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Medicine from Hospital Formulary</label>
                  <select
                    value={selectedMedIdToPrescribe}
                    onChange={(e) => {
                      setSelectedMedIdToPrescribe(e.target.value);
                      const m = MEDICINES.find(item => item.id === e.target.value);
                      if (m) {
                        setPrescribeDosage(m.dosage.split('(')[0].trim());
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                  >
                    {MEDICINES.map((med) => (
                      <option key={med.id} value={med.id}>
                        {med.name} ({med.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={prescribeDosage}
                      onChange={(e) => setPrescribeDosage(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Frequency</label>
                    <select
                      value={prescribeFrequency}
                      onChange={(e) => setPrescribeFrequency(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    >
                      <option value="Daily">Once Daily</option>
                      <option value="2x Daily">Twice Daily (BID)</option>
                      <option value="3x Daily">Three Times Daily (TID)</option>
                      <option value="Every 4-6h PRN">Every 4-6 Hours PRN</option>
                      <option value="Continuous Infusion">Continuous IV Infusion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinical Administration Instructions</label>
                  <textarea
                    rows={2}
                    value={prescribeInstructions}
                    onChange={(e) => setPrescribeInstructions(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPrescribeOpen(false)}
                    className="px-3 py-1.5 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Authorize Prescription
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: SCAN LIGHTBOX PREVIEW */}
      <AnimatePresence>
        {previewAttachment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{previewAttachment.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {previewAttachment.category} • {previewAttachment.modality} • {previewAttachment.date}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 rounded-xl overflow-hidden bg-black max-h-[50vh] flex items-center justify-center border border-slate-800">
                <img
                  src={previewAttachment.fileUrl}
                  alt={previewAttachment.title}
                  className="max-h-[50vh] w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Radiology & Pathological Findings:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {previewAttachment.findings}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
