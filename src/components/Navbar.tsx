/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount } from '../types';
import { 
  User, 
  LogIn, 
  Activity, 
  Pill, 
  ShieldAlert, 
  Stethoscope, 
  Users, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Lock,
  Archive,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  selectedDrugCount?: number;
  pendingPatientCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onSignOut,
  selectedDrugCount = 2,
  pendingPatientCount = 2
}) => {
  const isGuest = !user;
  const [isAudioMuted, setIsAudioMuted] = useState(soundFx.isMuted());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) soundFx.click();
  };

  const navItems = [
    { 
      id: 'home', 
      label: 'Clinical Command Hub', 
      shortLabel: 'Hub',
      icon: Activity,
      badge: null,
      requiresAuth: false
    },
    { 
      id: 'patients', 
      label: 'Patient EMR & Ward Diagnostics', 
      shortLabel: 'Patients EMR',
      icon: Users,
      badge: isGuest ? null : (pendingPatientCount > 0 ? `${pendingPatientCount} Pending` : `${(user?.patients || []).length}`),
      requiresAuth: true
    },
    { 
      id: 'directory', 
      label: 'Hospital Formulary & 3D Identifier', 
      shortLabel: 'Formulary DB',
      icon: Pill,
      badge: isGuest ? null : '16+ Meds',
      requiresAuth: true
    },
    { 
      id: 'interactions', 
      label: 'Multi-Drug Contraindication Screen', 
      shortLabel: 'Interactions',
      icon: ShieldAlert,
      badge: isGuest ? null : (selectedDrugCount > 0 ? `${selectedDrugCount} Active` : null),
      requiresAuth: true
    },
    { 
      id: 'scanner', 
      label: 'Multimodal AI Diagnostics & Scans', 
      shortLabel: 'AI Diagnostics',
      icon: Stethoscope,
      badge: isGuest ? null : 'AI Vision',
      requiresAuth: true
    },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-xs border-b border-slate-200/80 py-2' 
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200 py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo with 3D glowing molecular icon */}
        <button 
          onClick={() => {
            soundFx.click();
            setActiveTab('home');
          }}
          className="flex items-center gap-2.5 group focus:outline-none text-left cursor-pointer shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/35 transition-all">
            <svg className="w-5 h-5 text-white animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animationDuration: '24s' }}>
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v6" />
              <path d="M12 15v6" />
              <path d="M3 12h6" />
              <path d="M15 12h6" />
              <circle cx="12" cy="3" r="1.5" />
              <circle cx="12" cy="21" r="1.5" />
              <circle cx="3" cy="12" r="1.5" />
              <circle cx="21" cy="12" r="1.5" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-ping"></span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">tpis</span>
              <span className="font-extrabold text-xl text-blue-600">.</span>
              <span className="font-bold text-xl tracking-tight text-slate-900">agies</span>
            </div>
            <span className="text-[9px] font-bold tracking-widest text-slate-600 uppercase font-mono">
              3D Clinical Engine
            </span>
          </div>
        </button>

        {/* Desktop Navigation Floating Pill Bar */}
        <nav className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/80 shadow-2xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            const showLock = item.requiresAuth && isGuest;

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.click();
                  setActiveTab(item.id);
                }}
                className={`relative px-3.5 py-1.5 text-xs font-bold transition-all rounded-full flex items-center gap-1.5 cursor-pointer z-10 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {/* Active animated pill indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-sm shadow-blue-500/30"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.shortLabel}</span>
                  {showLock ? (
                    <Lock className={`w-2.5 h-2.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
                  ) : item.badge ? (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-extrabold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Audio Equalizer Toggle & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Audio Visualizer Button */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAudioMuted
                ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                : 'bg-blue-50 border-blue-200 text-blue-600 shadow-2xs hover:bg-blue-100/70'
            }`}
            title={isAudioMuted ? 'Unmute 3D Audio FX' : 'Mute 3D Audio FX'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-0.5">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-0.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                </span>
              </div>
            )}
          </button>

          {/* User Sign In / Profile */}
          {isGuest ? (
            <button
              onClick={() => {
                soundFx.modalOpen();
                onOpenAuth();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-blue-600 text-white transition-all font-extrabold text-xs tracking-wider cursor-pointer group shadow-sm hover:shadow-blue-500/20"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:rotate-12 transition-transform">
                <User className="w-3 h-3" />
              </div>
              <span className="uppercase text-[11px] font-bold tracking-wider">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.click();
                  setActiveTab('patients');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-blue-800 hover:bg-blue-100 transition-all text-xs font-semibold cursor-pointer"
                title={user?.email || 'Clinical Account'}
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'D')}
                </div>
                <span className="max-w-[110px] truncate font-medium">{user?.name || user?.email?.split('@')[0] || 'Clinician'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </button>
              
              <button
                onClick={() => {
                  soundFx.click();
                  onSignOut();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Sign out of Firebase"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Floating Bottom Dock */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-50 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const showLock = item.requiresAuth && isGuest;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.click();
                setActiveTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-blue-50 rounded-xl border border-blue-200/60"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon className="w-4 h-4 relative z-10" />
                {showLock && (
                  <Lock className="w-2 h-2 text-slate-400 absolute -top-1 -right-1 z-20" />
                )}
              </div>
              <span className="text-[10px] relative z-10 mt-0.5 font-medium">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
