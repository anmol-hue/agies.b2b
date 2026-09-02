/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Pill, 
  Activity, 
  Dna, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Microscope, 
  Stethoscope, 
  Syringe, 
  Crosshair,
  Layers
} from 'lucide-react';

interface FloatingItem {
  id: string;
  type: 'pill-capsule' | 'pill-round' | 'dna' | 'stethoscope' | 'syringe' | 'pulse' | 'shield' | 'molecule' | 'iv-bag' | 'microscope-lens';
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  rotateRange: number[];
  colorTheme: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'violet';
  label?: string;
  hideOnMobile?: boolean;
}

const MEDICAL_ELEMENTS: FloatingItem[] = [
  {
    id: 'elem-1',
    type: 'pill-capsule',
    x: '3%',
    y: '14%',
    size: 48,
    duration: 7.5,
    delay: 0,
    rotateRange: [-18, 22, -18],
    colorTheme: 'blue',
    label: '500mg',
    hideOnMobile: false
  },
  {
    id: 'elem-2',
    type: 'stethoscope',
    x: '91%',
    y: '16%',
    size: 44,
    duration: 9.5,
    delay: 0.8,
    rotateRange: [8, -18, 8],
    colorTheme: 'indigo',
    hideOnMobile: false
  },
  {
    id: 'elem-3',
    type: 'dna',
    x: '4%',
    y: '48%',
    size: 40,
    duration: 11.5,
    delay: 1.6,
    rotateRange: [-25, 25, -25],
    colorTheme: 'cyan',
    hideOnMobile: true
  },
  {
    id: 'elem-4',
    type: 'pill-round',
    x: '93%',
    y: '52%',
    size: 38,
    duration: 6.8,
    delay: 0.4,
    rotateRange: [0, 180, 360],
    colorTheme: 'emerald',
    label: 'Rx',
    hideOnMobile: false
  },
  {
    id: 'elem-5',
    type: 'syringe',
    x: '2%',
    y: '80%',
    size: 40,
    duration: 8.8,
    delay: 1.2,
    rotateRange: [42, 12, 42],
    colorTheme: 'rose',
    hideOnMobile: true
  },
  {
    id: 'elem-6',
    type: 'pulse',
    x: '89%',
    y: '84%',
    size: 42,
    duration: 8.0,
    delay: 2.5,
    rotateRange: [-8, 8, -8],
    colorTheme: 'blue',
    hideOnMobile: false
  },
  {
    id: 'elem-7',
    type: 'molecule',
    x: '10%',
    y: '32%',
    size: 34,
    duration: 10.5,
    delay: 2.0,
    rotateRange: [0, 360],
    colorTheme: 'amber',
    hideOnMobile: true
  },
  {
    id: 'elem-8',
    type: 'iv-bag',
    x: '88%',
    y: '36%',
    size: 36,
    duration: 8.2,
    delay: 1.4,
    rotateRange: [-5, 5, -5],
    colorTheme: 'violet',
    hideOnMobile: true
  }
];

export const FloatingMedicalElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden select-none">
      {MEDICAL_ELEMENTS.map((item) => {
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0.45, 0.85, 0.45],
              y: ['0px', '-20px', '0px'],
              x: ['0px', '10px', '0px'],
              rotate: item.rotateRange
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay
            }}
            style={{
              left: item.x,
              top: item.y
            }}
            className={`absolute ${item.hideOnMobile ? 'hidden lg:flex' : 'hidden md:flex'} flex-col items-center justify-center filter drop-shadow-md`}
          >
            {/* Render 3D Stylized Element */}
            {item.type === 'pill-capsule' && (
              <div className="relative group cursor-pointer pointer-events-auto">
                {/* 3D Capsule Pill */}
                <div className="w-16 h-7 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-white shadow-xl border border-blue-400/50 flex items-center justify-between px-2.5 overflow-hidden transform -rotate-12 hover:scale-115 transition-transform">
                  <div className="text-[9px] font-black text-white/95 tracking-tighter pl-0.5">TPIS</div>
                  <div className="w-1.5 h-full bg-slate-900/15" />
                  <div className="text-[9px] font-black text-blue-900/90 tracking-tighter pr-0.5">500</div>
                  {/* Glossy Reflection Highlight */}
                  <div className="absolute top-0.5 left-2 right-2 h-1.5 bg-white/50 rounded-full blur-[0.5px]" />
                </div>
              </div>
            )}

            {item.type === 'pill-round' && (
              <div className="relative group cursor-pointer pointer-events-auto">
                {/* 3D Debossed Round Tablet */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-400 shadow-xl border border-emerald-300 flex items-center justify-center hover:scale-115 transition-transform">
                  <div className="w-8 h-8 rounded-full border border-emerald-500/35 flex items-center justify-center">
                    <span className="text-[10px] font-black text-emerald-800">Rx</span>
                  </div>
                  <div className="absolute w-full h-[1px] bg-emerald-500/45 top-1/2 -translate-y-1/2" />
                  {/* Glossy shine */}
                  <div className="absolute top-1 left-2.5 w-3.5 h-2 bg-white/70 rounded-full blur-[0.5px]" />
                </div>
              </div>
            )}

            {item.type === 'stethoscope' && (
              <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-indigo-200/90 shadow-xl text-indigo-600 hover:scale-115 transition-transform pointer-events-auto">
                <Stethoscope className="w-6 h-6" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white animate-ping" />
              </div>
            )}

            {item.type === 'dna' && (
              <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-cyan-200/90 shadow-xl text-cyan-600 hover:scale-115 transition-transform pointer-events-auto">
                <Dna className="w-6 h-6 animate-pulse" />
              </div>
            )}

            {item.type === 'syringe' && (
              <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-200/90 shadow-xl text-rose-500 hover:scale-115 transition-transform pointer-events-auto">
                <Syringe className="w-6 h-6" />
              </div>
            )}

            {item.type === 'pulse' && (
              <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-200/90 shadow-xl text-blue-600 hover:scale-115 transition-transform pointer-events-auto">
                <Activity className="w-6 h-6" />
              </div>
            )}

            {item.type === 'molecule' && (
              <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-200/90 shadow-xl text-amber-600 hover:scale-115 transition-transform pointer-events-auto flex items-center justify-center">
                <Microscope className="w-5 h-5" />
              </div>
            )}

            {item.type === 'iv-bag' && (
              <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-violet-200/90 shadow-xl text-violet-600 hover:scale-115 transition-transform pointer-events-auto flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
