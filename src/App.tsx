/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { MedicineDirectory } from './components/MedicineDirectory';
import { InteractionChecker } from './components/InteractionChecker';
import { ClinicalScanner } from './components/ClinicalScanner';
import { MedicineCabinet } from './components/MedicineCabinet';
import { PatientManager } from './components/PatientManager';
import { AuthModal } from './components/AuthModal';
import { AuthLockedGate } from './components/AuthLockedGate';
import { Footer } from './components/Footer';
import { Background3DField } from './components/Background3DField';
import { AnimatedBackground2D } from './components/AnimatedBackground2D';
import { FloatingMedicalElements } from './components/FloatingMedicalElements';
import { 
  UserAccount, 
  Medicine, 
  CabinetItem, 
  ClinicalHistoryEntry,
  Patient
} from './types';
import { 
  loadLocalAccount, 
  saveLocalAccount, 
  syncUserToFirestore, 
  auth,
  logOutUser,
  fetchUserScansFromFirestore,
  fetchUserFromFirestore,
  createFreshUserAccount
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<UserAccount | null>(() => {
    return loadLocalAccount();
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedDrugIds, setSelectedDrugIds] = useState<string[]>(['warfarin', 'ibuprofen']);

  // Sync auth state listener with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch persisted user data & scans from Firestore
        const [cloudUser, scans] = await Promise.all([
          fetchUserFromFirestore(fbUser.uid),
          fetchUserScansFromFirestore(fbUser.uid)
        ]);

        const resolvedUser: UserAccount = cloudUser || createFreshUserAccount(
          fbUser.uid,
          fbUser.email || 'clinician@hospital.org',
          fbUser.displayName
        );

        resolvedUser.savedScans = scans;
        resolvedUser.lastLogin = new Date().toISOString();

        setUser(resolvedUser);
        saveLocalAccount(resolvedUser);
      } else {
        setUser(null);
        saveLocalAccount(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save changes to localStorage and Firestore
  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUser(updatedUser);
    saveLocalAccount(updatedUser);
    syncUserToFirestore(updatedUser);
  };

  // Patient EMR Handlers
  const handleUpdatePatient = (updatedPatient: Patient) => {
    if (!user) return;
    const currentPatients = user.patients || [];
    const updatedPatients = currentPatients.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    );
    handleUpdateUser({
      ...user,
      patients: updatedPatients
    });
  };

  const handleAddPatient = (newPatient: Patient) => {
    if (!user) return;
    const currentPatients = user.patients || [];
    const updatedPatients = [newPatient, ...currentPatients];
    handleUpdateUser({
      ...user,
      patients: updatedPatients
    });
  };

  const handleDeletePatient = (patientId: string) => {
    if (!user) return;
    const currentPatients = user.patients || [];
    const updatedPatients = currentPatients.filter(p => p.id !== patientId);
    handleUpdateUser({
      ...user,
      patients: updatedPatients
    });
  };

  const handleRunAiScanForPatient = (patient: Patient) => {
    setActiveTab('scanner');
  };

  const handleRunInteractionForPatient = (patient: Patient) => {
    if (patient.prescriptions && patient.prescriptions.length > 0) {
      const drugIds = patient.prescriptions.map(p => p.medicineId);
      setSelectedDrugIds(drugIds.slice(0, 4));
    }
    setActiveTab('interactions');
  };

  // Add medicine to Cabinet from Directory or Scanner
  const handleAddToCabinet = (med: Medicine) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    const existing = (user.cabinet || []).find(c => c.medicineId === med.id);
    if (!existing) {
      const newItem: CabinetItem = {
        id: `cab-${Date.now()}`,
        medicineId: med.id,
        name: `${med.name} ${med.dosage.split(' ')[0]}`,
        dosage: med.dosage,
        frequency: med.dosage.includes('twice') ? '2x Daily' : 'Daily',
        instructions: `Take as directed for ${med.category}.`,
        nextDose: '08:00 AM',
        takenToday: false,
        historyDates: []
      };

      const updatedCabinet = [newItem, ...(user.cabinet || [])];
      handleUpdateUser({
        ...user,
        cabinet: updatedCabinet
      });
    }
  };

  // Select medicine directly for Multi-Drug Interaction Checker
  const handleSelectForInteraction = (med: Medicine) => {
    if (!selectedDrugIds.includes(med.id)) {
      setSelectedDrugIds([...selectedDrugIds, med.id]);
    }
  };

  // Update a single cabinet item (e.g. logging dose)
  const handleUpdateCabinetItem = (updatedItem: CabinetItem) => {
    if (!user) return;
    const updatedCabinet = (user.cabinet || []).map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    handleUpdateUser({
      ...user,
      cabinet: updatedCabinet
    });
  };

  // Delete cabinet item
  const handleDeleteCabinetItem = (id: string) => {
    if (!user) return;
    const updatedCabinet = (user.cabinet || []).filter(item => item.id !== id);
    handleUpdateUser({
      ...user,
      cabinet: updatedCabinet
    });
  };

  // Add custom manual cabinet item
  const handleAddCustomCabinetItem = (newItem: CabinetItem) => {
    if (!user) return;
    const updatedCabinet = [newItem, ...(user.cabinet || [])];
    handleUpdateUser({
      ...user,
      cabinet: updatedCabinet
    });
  };

  // Sign out handler
  const handleSignOut = async () => {
    await logOutUser();
    setUser(null);
    saveLocalAccount(null);
  };

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const isAuthenticated = user !== null;
  const pendingPatientCount = isAuthenticated ? (user?.patients || []).filter(p => p.status === 'Pending').length : 0;

  // Render tab helper with Auth Locked Gate check
  const renderTabContent = () => {
    if (activeTab === 'home') {
      return (
        <HomeHero
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      );
    }

    // All other tabs require Authentication
    if (!isAuthenticated) {
      const tabLabels: Record<string, string> = {
        patients: 'Patient EMR & Ward Diagnostics',
        directory: 'Hospital Formulary & 3D Identifier',
        interactions: 'Multi-Drug Contraindication Screen',
        scanner: 'Multimodal AI Diagnostics & Scans',
        cabinet: 'Medicine Cabinet & Pharmacokinetics'
      };

      return (
        <AuthLockedGate
          tabName={tabLabels[activeTab] || 'Clinical Intelligence Module'}
          onOpenLogin={() => setIsAuthOpen(true)}
          onOpenSignUp={() => setIsAuthOpen(true)}
        />
      );
    }

    // Authenticated View
    switch (activeTab) {
      case 'patients':
        return (
          <PatientManager
            user={user!}
            onUpdatePatient={handleUpdatePatient}
            onAddPatient={handleAddPatient}
            onDeletePatient={handleDeletePatient}
            onRunAiScanForPatient={handleRunAiScanForPatient}
            onRunInteractionForPatient={handleRunInteractionForPatient}
            setActiveTab={setActiveTab}
          />
        );

      case 'directory':
        return (
          <MedicineDirectory
            user={user!}
            onAddToCabinet={handleAddToCabinet}
            onSelectForInteraction={handleSelectForInteraction}
            setActiveTab={setActiveTab}
          />
        );

      case 'interactions':
        return (
          <InteractionChecker
            selectedDrugIds={selectedDrugIds}
            setSelectedDrugIds={setSelectedDrugIds}
            setActiveTab={setActiveTab}
          />
        );

      case 'scanner':
        return (
          <ClinicalScanner
            user={user!}
            onAddToCabinet={handleAddToCabinet}
            setActiveTab={setActiveTab}
          />
        );

      case 'cabinet':
        return (
          <MedicineCabinet
            user={user!}
            onUpdateCabinetItem={handleUpdateCabinetItem}
            onDeleteCabinetItem={handleDeleteCabinetItem}
            onAddCustomItem={handleAddCustomCabinetItem}
            setActiveTab={setActiveTab}
          />
        );

      default:
        return (
          <HomeHero
            setActiveTab={setActiveTab}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfd] text-slate-900 selection:bg-blue-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif] relative">
      
      {/* Dynamic Tab-Specific 2D Background Animation Canvas */}
      <AnimatedBackground2D activeTab={activeTab} />

      {/* Floating 3D and 2D Medical Equipment in Free Space */}
      <FloatingMedicalElements />

      {/* Subtle Background 3D Field */}
      <Background3DField />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        selectedDrugCount={selectedDrugIds.length}
        pendingPatientCount={pendingPatientCount}
      />

      {/* Main Content Area with Smooth Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (isAuthenticated ? '-auth' : '-guest')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Auth Modal with Firebase Google & Email/Password */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(newUser) => {
          setUser(newUser);
          saveLocalAccount(newUser);
          syncUserToFirestore(newUser);
        }}
      />

      {/* Global Footer */}
      <Footer />
      
    </div>
  );
}
