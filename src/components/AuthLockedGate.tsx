/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  Scan, 
  Pill, 
  FileText, 
  Users, 
  ArrowRight,
  Sparkles,
  KeyRound,
  Building2
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface AuthLockedGateProps {
  tabName: string;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

export const AuthLockedGate: React.FC<AuthLockedGateProps> = ({
  tabName,
  onOpenLogin,
  onOpenSignUp
}) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl p-8 sm:p-12 text-center overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-100 rounded-full blur-3xl pointer-events-none opacity-60" />

        {/* Floating Lock Icon badge */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 mb-6">
          <Lock className="w-9 h-9" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Headline & Explanation */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
          Clinician Authentication Required
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
          The <strong className="text-slate-900 font-semibold">{tabName}</strong> module contains protected health information, private patient records, custom medication cabinets, and saved AI diagnostic scan archives synced with Cloud Firestore.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-10">
          <button
            onClick={() => {
              soundFx.click();
              onOpenLogin();
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In to Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFx.click();
              onOpenSignUp();
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Protected Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">AI Diagnostic Scans</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Automatically stores all vision and clinical scans to your private cloud archive.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Patient EMR Records</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">SOAP notes, telemetry strips, and triage statuses are persistently synced.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Interactive Cabinet</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Custom prescriptions, adherence logs, and pharmacokinetic tracking.</p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
