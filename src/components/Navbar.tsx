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
import { ThreeLogo3D } from './ThreeLogo3D';

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
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950 shadow-lg border-b border-slate-800 py-2'
          : 'bg-slate-950 border-b border-slate-800 py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <button
            onClick={() => {
              soundFx.click();
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 group focus:outline-none text-left cursor-pointer shrink-0"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-slate-900 p-0.5 shadow-md shadow-blue-500/10 group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-300 flex items-center justify-center border border-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <ThreeLogo3D size={38} className="relative z-10" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-slate-950 animate-ping"></span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-950"></span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">tpis</span>
                <span className="font-extrabold text-xl text-blue-500 animate-pulse">.</span>
                <span className="font-bold text-xl tracking-tight text-slate-300">agies</span>
                <span className="ml-1.5 px-1.5 py-0.5 bg-slate-900 text-blue-400 border border-slate-800 rounded-md text-[9px] font-extrabold tracking-wider font-mono">3D</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase font-mono">
                  3D Clinical Engine
                </span>
                <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
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
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-blue-600 rounded-full shadow-sm shadow-blue-500/30"
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
                          : 'bg-slate-800 text-blue-400 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                isAudioMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-slate-900 border-blue-500/30 text-blue-400 shadow-2xs hover:bg-slate-800'
              }`}
              title={isAudioMuted ? 'Unmute 3D Audio FX' : 'Mute 3D Audio FX'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-0.5">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="w-0.5 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-0.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                  </span>
                </div>
              )}
            </button>

            {isGuest ? (
              <button
                onClick={() => {
                  soundFx.modalOpen();
                  onOpenAuth();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all font-extrabold text-xs tracking-wider cursor-pointer group shadow-md shadow-blue-500/20"
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-100 hover:bg-slate-800 transition-all text-xs font-semibold cursor-pointer"
                  title={user?.email || 'Clinical Account'}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'D')}
                  </div>
                  <span className="max-w-[110px] truncate font-medium">{user?.name || user?.email?.split('@')[0] || 'Clinician'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
                </button>

                <button
                  onClick={() => {
                    soundFx.click();
                    onSignOut();
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
                  title="Sign out of Firebase"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Dock */}
      <div className="lg:hidden fixed bottom-3 inset-x-3 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-1.5 flex items-center justify-around">
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
                  ? 'text-blue-400 font-extrabold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-pill"
                  className="absolute inset-0 bg-blue-600/20 rounded-xl border border-blue-500/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                {showLock && (
                  <Lock className="w-2 h-2 text-slate-400 absolute -top-1 -right-1 z-20" />
                )}
              </div>
              <span className="text-[10px] relative z-10 mt-0.5 font-medium">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
