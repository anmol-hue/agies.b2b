/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Loader2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowRight
} from 'lucide-react';
import { 
  auth, 
  googleAuthProvider,
  saveLocalAccount, 
  syncUserToFirestore, 
  fetchUserFromFirestore,
  createFreshUserAccount
} from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { UserAccount } from '../types';
import { soundFx } from '../lib/soundFx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  initialMode?: 'signin' | 'signup';
  customTitle?: string;
  customSubtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
  customTitle,
  customSubtitle
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both clinical email address and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = createFreshUserAccount(cred.user.uid, cred.user.email || email, fullName);
        await syncUserToFirestore(newUser);
        soundFx.success();
        onSuccess(newUser);
        onClose();
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const existingData = await fetchUserFromFirestore(cred.user.uid);
        const loggedUser: UserAccount = existingData || createFreshUserAccount(cred.user.uid, cred.user.email || email, cred.user.displayName);
        saveLocalAccount(loggedUser);
        soundFx.success();
        onSuccess(loggedUser);
        onClose();
      }
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      let message = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Switch to Log In.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid medical email address.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      const existingData = await fetchUserFromFirestore(fbUser.uid);
      
      const clinicalUser: UserAccount = existingData || createFreshUserAccount(fbUser.uid, fbUser.email || 'clinician@hospital.org', fbUser.displayName);

      await syncUserToFirestore(clinicalUser);
      soundFx.success();
      onSuccess(clinicalUser);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google sign in encountered an issue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 my-8 text-slate-900 overflow-hidden">
        
        {/* Subtle decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.click();
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Clinical Badge */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs mb-1">
            <Stethoscope className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            {customTitle || (isSignUp ? 'Clinician Sign Up' : 'Clinician Log In')}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {customSubtitle || (isSignUp 
              ? 'Access HIPAA-grade AI scanner, patient records, interactive cabinets, and drug interactions.'
              : 'Sign in to access your persistent medical records, AI scans archive, and patient consultations.')}
          </p>

          <div className="flex justify-center items-center gap-1 text-xs text-slate-600 pt-1">
            {isSignUp ? (
              <>
                <span>Already registered?</span>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.click();
                    setIsSignUp(false);
                    setErrorMsg('');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer ml-1"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <span>New clinician?</span>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.click();
                    setIsSignUp(true);
                    setErrorMsg('');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer ml-1"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Primary One-Click Auth */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-800 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            or clinical email
          </span>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {isSignUp && (
            <div className="space-y-1 text-left">
              <label className="block text-xs font-bold text-slate-700">Full Name / Title</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Sarah Chen, MD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="block text-xs font-bold text-slate-700">Medical / Institutional Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="physician@hospital.org"
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{isSignUp ? 'Create Clinician Account' : 'Authenticate & Enter'}</span>
            )}
          </button>
        </form>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Firebase Cloud Encrypted
          </span>
          <span>•</span>
          <span>HIPAA Compliant Protocol</span>
        </div>

      </div>
    </div>
  );
};
