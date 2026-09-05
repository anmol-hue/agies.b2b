/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Activity, 
  RotateCcw, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  Crosshair, 
  Eye, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  ShieldCheck,
  Sparkles,
  Heart,
  Wind,
  Brain,
  ShieldAlert,
  HelpCircle,
  Minimize2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Pill,
  FileText,
  FileCheck,
  Copy,
  Check,
  Printer
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

export type AnatomicalZone = 'general' | 'throat' | 'lungs' | 'heart' | 'head' | 'abdomen' | 'skin' | 'limbs';

export interface DifferentialMatchItem {
  condition: string;
  details: string;
  typicalInterventions: string;
  urgency: string;
  icd10Code?: string;
  distinguishingFeatures?: string;
}

export interface ThreeAnatomicalScannerProps {
  symptomArea?: AnatomicalZone;
  affectedOrganSystem?: string;
  conditionTitle?: string;
  isScanning?: boolean;
  confidence?: number;
  hasDiagnosedResult?: boolean;
  height?: number;
  className?: string;
  primaryLesionSite?: string;
  affectedDownstreamOrgans?: string[];
  systemicSideEffects?: string[];
  propagationPathways?: string[];
  differentialMatches?: DifferentialMatchItem[];
  patientUploadedImage?: string | null;
  empatheticNarrative?: string;
  warningSigns?: string[];
  recDoctor?: string;
  isDangerous?: 'Dangerous' | 'Safe';
  icd10Code?: string;
  clinicalWorkup?: {
    labTests: string[];
    imagingStudies: string[];
    physicalSigns: string[];
  };
  pharmacotherapy?: {
    firstLine: string;
    alternative: string;
    contraindications: string[];
  };
  soapNote?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  onSelectZone?: (zone: AnatomicalZone) => void;
}

export interface DiseaseCardData {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  accentHex: string;
  accentColorNum: number;
  badge: string;
  bulletPoints: string[];
  details: string;
  modalityType: 'similar-images' | 'pathology' | 'differential' | 'hallmarks' | 'therapeutics' | 'red-flags' | 'home-care' | 'doctor-questions' | 'workup' | 'soap-note';
  clinicalHallmarks?: string[];
  comparativeNote?: string;
  normalBaselineNote?: string;
  similarCaseNote?: string;
  homeCareTips?: string[];
  doctorQuestions?: string[];
  whatItMeansSimple?: string;
  icd10Code?: string;
}

// Draw crisp, medical-grade canvas textures for the 3D cards
function renderCardTexture(
  canvas: HTMLCanvasElement, 
  card: DiseaseCardData, 
  isStandby: boolean,
  uploadedThumbnail?: HTMLImageElement | null
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Background: High-contrast clinical slate
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#020617');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Outer glowing card border
  ctx.strokeStyle = card.accentHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  // Inner subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(14, 14, w - 28, h - 28);

  // 2. Header Bar with Accent Color
  ctx.fillStyle = card.accentHex;
  ctx.fillRect(16, 16, w - 32, 10);

  // Category Tag Pill
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(28, 38, w - 56, 36, 10);
  ctx.fill();
  ctx.strokeStyle = card.accentHex;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = card.accentHex;
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(card.badge.toUpperCase(), w / 2, 62);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';

  // Wrap title if long
  const titleWords = card.title.split(' ');
  let titleLine1 = '';
  let titleLine2 = '';
  for (const word of titleWords) {
    if ((titleLine1 + ' ' + word).length < 24) {
      titleLine1 += (titleLine1 ? ' ' : '') + word;
    } else {
      titleLine2 += (titleLine2 ? ' ' : '') + word;
    }
  }

  ctx.fillText(titleLine1, 30, 114);
  if (titleLine2) {
    ctx.fillText(titleLine2, 30, 142);
  }

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(card.subtitle.slice(0, 36), 30, titleLine2 ? 168 : 144);

  // 3. Clinical Visual Diagram / Image Box
  const imgBoxY = titleLine2 ? 186 : 166;
  const imgBoxH = 200;
  ctx.fillStyle = '#020617';
  ctx.fillRect(28, imgBoxY, w - 56, imgBoxH);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, imgBoxY, w - 56, imgBoxH);

  // Draw Specific Clinical Visualizations based on modality
  if (card.modalityType === 'similar-images') {
    if (uploadedThumbnail && uploadedThumbnail.complete && uploadedThumbnail.naturalWidth > 0) {
      // Draw User's Attached Scan Image
      ctx.drawImage(uploadedThumbnail, 32, imgBoxY + 4, w - 64, imgBoxH - 8);
      ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
      ctx.fillRect(32, imgBoxY + imgBoxH - 32, w - 64, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PATIENT SCAN + VERIFIED REFERENCE', w / 2, imgBoxY + imgBoxH - 14);
    } else {
      // Draw Medical Reference Image Presentation (Comparative Split Simulation)
      const splitW = (w - 60) / 2;
      // Left: Condition Presentation
      const lesionGrad = ctx.createRadialGradient(28 + splitW / 2, imgBoxY + imgBoxH / 2, 10, 28 + splitW / 2, imgBoxY + imgBoxH / 2, 70);
      lesionGrad.addColorStop(0, '#f43f5e');
      lesionGrad.addColorStop(0.6, '#be123c');
      lesionGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = lesionGrad;
      ctx.fillRect(30, imgBoxY + 2, splitW - 2, imgBoxH - 4);

      // Microscopic / Dermoscopic hallmark patterns
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(36 + (i * 22) % (splitW - 16), imgBoxY + 30 + (i * 28) % (imgBoxH - 60), 4 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CONDITION CASE', 30 + splitW / 2, imgBoxY + imgBoxH - 12);

      // Right: Normal Healthy Baseline
      const normalGrad = ctx.createRadialGradient(30 + splitW + splitW / 2, imgBoxY + imgBoxH / 2, 10, 30 + splitW + splitW / 2, imgBoxY + imgBoxH / 2, 70);
      normalGrad.addColorStop(0, '#0284c7');
      normalGrad.addColorStop(0.7, '#0f172a');
      normalGrad.addColorStop(1, '#020617');
      ctx.fillStyle = normalGrad;
      ctx.fillRect(30 + splitW, imgBoxY + 2, splitW - 4, imgBoxH - 4);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('NORMAL BASELINE', 30 + splitW + splitW / 2, imgBoxY + imgBoxH - 12);

      // Center Divider line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30 + splitW, imgBoxY + 2);
      ctx.lineTo(30 + splitW, imgBoxY + imgBoxH - 2);
      ctx.stroke();
    }

  } else if (card.modalityType === 'pathology') {
    // Pathology cellular / tissue network diagram
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    // Hexagonal cellular array
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const cx = 70 + col * 75 + (row % 2) * 35;
        const cy = imgBoxY + 45 + row * 55;
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (a * Math.PI) / 3;
          const px = cx + 24 * Math.cos(angle);
          const py = cy + 24 * Math.sin(angle);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = (row === 1 && col === 1) ? 'rgba(244, 63, 94, 0.4)' : 'rgba(139, 92, 246, 0.15)';
        ctx.fill();
        ctx.stroke();
      }
    }
    // Lesion callout
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(180, imgBoxY + 100, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FOCAL LESION CASCADE', w / 2, imgBoxY + imgBoxH - 14);

  } else if (card.modalityType === 'differential') {
    // Comparative Venn / Bar match diagram
    const barY = imgBoxY + 30;
    const barH = 28;
    // Match 1
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(40, barY, w - 180, barH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('PRIMARY MATCH (85-95%)', 46, barY + 19);

    // Match 2
    ctx.fillStyle = '#64748b';
    ctx.fillRect(40, barY + 45, w - 240, barH);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('DIFFERENTIAL B (55%)', 46, barY + 64);

    // Match 3
    ctx.fillStyle = '#475569';
    ctx.fillRect(40, barY + 90, w - 290, barH);
    ctx.fillText('DIFFERENTIAL C (30%)', 46, barY + 109);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CLINICAL OVERLAP & DISTINCTIONS', w / 2, imgBoxY + imgBoxH - 14);

  } else if (card.modalityType === 'hallmarks') {
    // Clinical Stethoscope / Vital Signs Waveform
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(35, imgBoxY + 100);
    ctx.lineTo(85, imgBoxY + 100);
    ctx.lineTo(105, imgBoxY + 60);
    ctx.lineTo(125, imgBoxY + 140);
    ctx.lineTo(145, imgBoxY + 40);
    ctx.lineTo(165, imgBoxY + 115);
    ctx.lineTo(185, imgBoxY + 95);
    ctx.lineTo(250, imgBoxY + 100);
    ctx.lineTo(280, imgBoxY + 80);
    ctx.lineTo(340, imgBoxY + 100);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DIAGNOSTIC CRITERIA & HALLMARKS', w / 2, imgBoxY + imgBoxH - 14);

  } else if (card.modalityType === 'home-care') {
    // Soothing Home Care & Practical Relief
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.beginPath();
    ctx.roundRect(40, imgBoxY + 20, w - 80, 120, 14);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Soothing cross / comfort emblem
    ctx.fillStyle = '#10b981';
    ctx.fillRect(w / 2 - 5, imgBoxY + 32, 10, 32);
    ctx.fillRect(w / 2 - 16, imgBoxY + 43, 32, 10);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PRACTICAL HOME CARE & RELIEF', w / 2, imgBoxY + 95);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Hydration • Rest • Soothing Comfort Habits', w / 2, imgBoxY + 118);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('SAFE ACTIONS YOU CAN TAKE TODAY', w / 2, imgBoxY + imgBoxH - 14);

  } else if (card.modalityType === 'doctor-questions') {
    // Smart Questions & Appointment Prep Checklist
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.roundRect(40, imgBoxY + 20, w - 80, 120, 14);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Checklist graphics
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    // Row 1
    ctx.beginPath();
    ctx.moveTo(65, imgBoxY + 44); ctx.lineTo(72, imgBoxY + 51); ctx.lineTo(82, imgBoxY + 39); ctx.stroke();
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(92, imgBoxY + 43, w - 160, 5);
    // Row 2
    ctx.beginPath();
    ctx.moveTo(65, imgBoxY + 68); ctx.lineTo(72, imgBoxY + 75); ctx.lineTo(82, imgBoxY + 63); ctx.stroke();
    ctx.fillRect(92, imgBoxY + 67, w - 180, 5);
    // Row 3
    ctx.beginPath();
    ctx.moveTo(65, imgBoxY + 92); ctx.lineTo(72, imgBoxY + 99); ctx.lineTo(82, imgBoxY + 87); ctx.stroke();
    ctx.fillRect(92, imgBoxY + 91, w - 150, 5);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SMART QUESTIONS TO ASK YOUR DOCTOR', w / 2, imgBoxY + imgBoxH - 14);

  } else if (card.modalityType === 'therapeutics') {
    // Prescription & Protocol Icons
    ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
    ctx.beginPath();
    ctx.roundRect(50, imgBoxY + 25, w - 100, 110, 12);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Rx: EVIDENCE-BASED PROTOCOL', w / 2, imgBoxY + 60);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText('First-line therapeutics & supportive care', w / 2, imgBoxY + 90);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('CLINICAL GUIDELINE STANDARDS', w / 2, imgBoxY + imgBoxH - 14);

  } else {
    // Red Flags Emergency Shield
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2, imgBoxY + 25);
    ctx.lineTo(w / 2 + 55, imgBoxY + 50);
    ctx.lineTo(w / 2 + 45, imgBoxY + 115);
    ctx.lineTo(w / 2, imgBoxY + 150);
    ctx.lineTo(w / 2 - 45, imgBoxY + 115);
    ctx.lineTo(w / 2 - 55, imgBoxY + 50);
    ctx.closePath();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fill();
    ctx.stroke();

    // Exclamation mark
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('!', w / 2, imgBoxY + 110);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('EMERGENCY TRIAGE THRESHOLD', w / 2, imgBoxY + imgBoxH - 14);
  }

  // 4. Bullet Points Section
  const bulletStartY = imgBoxY + imgBoxH + 25;
  ctx.textAlign = 'left';
  card.bulletPoints.slice(0, 3).forEach((bp, idx) => {
    const yPos = bulletStartY + idx * 36;
    // Bullet marker
    ctx.fillStyle = card.accentHex;
    ctx.beginPath();
    ctx.arc(38, yPos - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(bp.slice(0, 38), 52, yPos);
  });

  // 5. Footer CTA "Click to Inspect"
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.beginPath();
  ctx.roundRect(28, h - 65, w - 56, 42, 8);
  ctx.fill();
  ctx.strokeStyle = card.accentHex;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = card.accentHex;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CLICK CARD TO DEEP INSPECT ➔', w / 2, h - 39);
}

// Generate the 6 Cards based on Standby vs Diagnosed state & View Mode (Patient vs Doctor)
function generateCardsData(
  hasDiagnosedResult: boolean,
  conditionTitle?: string,
  affectedOrganSystem?: string,
  primaryLesionSite?: string,
  affectedDownstreamOrgans?: string[],
  systemicSideEffects?: string[],
  propagationPathways?: string[],
  differentialMatches?: DifferentialMatchItem[],
  warningSigns?: string[],
  recDoctor?: string,
  isDangerous?: 'Dangerous' | 'Safe',
  viewMode: 'patient' | 'clinical' = 'clinical',
  icd10Code?: string,
  clinicalWorkup?: {
    labTests: string[];
    imagingStudies: string[];
    physicalSigns: string[];
  },
  pharmacotherapy?: {
    firstLine: string;
    alternative: string;
    contraindications: string[];
  },
  soapNote?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }
): DiseaseCardData[] {
  const isPatientMode = viewMode === 'patient';

  if (!hasDiagnosedResult || !conditionTitle) {
    // -------------------------------------------------------------
    // STANDBY MODE: 100% HEALTH & ANATOMICAL REFERENCE ATLAS (NO PRE-DISEASE)
    // -------------------------------------------------------------
    if (isPatientMode) {
      return [
        {
          id: 'ref-pulmonary',
          category: 'Lungs & Breathing',
          title: 'Lungs & Breathing',
          subtitle: 'Cough, Wheezing & Deep Breaths',
          accentHex: '#06b6d4',
          accentColorNum: 0x06b6d4,
          badge: 'Airway & Chest',
          bulletPoints: [
            'Healthy breathing is quiet, effortless and comfortable',
            'Triggers: cold air, seasonal pollen, dust, or viral colds',
            'When to check: cough >10 days or breathless climbing stairs'
          ],
          details: 'Learn how healthy lungs exchange oxygen, what different coughs mean, and how simple habits like steam inhalation and hydration soothe your chest.',
          modalityType: 'similar-images',
          normalBaselineNote: 'Smooth, effortless inhalation with clear airflow and quiet lungs.',
          similarCaseNote: 'Compare with common cold cough vs seasonal chest allergies or bronchitis.',
          homeCareTips: [
            'Sip warm decaf tea with a spoonful of honey and lemon to coat your throat',
            'Sleep with your head elevated on 2 pillows to ease coughing at night',
            'Use a cool-mist humidifier or take a steamy warm shower'
          ],
          doctorQuestions: [
            'Is my cough caused by a common viral cold, asthma, or seasonal allergies?',
            'Would an inhaler or prescription cough medicine help me rest?',
            'What specific signs mean I should be seen right away?'
          ]
        },
        {
          id: 'ref-derm',
          category: 'Skin & Rashes',
          title: 'Skin Rashes & Spots',
          subtitle: 'Bumps, Hives, Itchiness & Redness',
          accentHex: '#10b981',
          accentColorNum: 0x10b981,
          badge: 'Skin & Surface',
          bulletPoints: [
            'Healthy skin provides a natural protective barrier shield',
            'Compare: allergic hives vs dry eczema vs insect bites',
            'Soothing steps: cool damp compresses & gentle fragrance-free cream'
          ],
          details: 'A quick visual guide to common skin flare-ups, how to soothe sudden itchiness safely, and how to tell harmless irritations from rashes needing a prescription ointment.',
          modalityType: 'hallmarks',
          normalBaselineNote: 'Hydrated, even-toned skin without raised itchy bumps or painful cracks.',
          similarCaseNote: 'Notice the difference between mild heat rash and spreading hives or eczema.',
          homeCareTips: [
            'Apply a cool, damp washcloth for 10-15 minutes to reduce heat & itch',
            'Use a fragrance-free gentle moisturizer (ceramides or petroleum)',
            'Wear loose cotton clothing and avoid very hot showers'
          ],
          doctorQuestions: [
            'Do I need a prescription steroid cream or is gentle over-the-counter lotion sufficient?',
            'Could this be an allergic reaction to a new soap, food, or fabric?',
            'How many days before this rash should fade completely?'
          ]
        },
        {
          id: 'ref-cardio',
          category: 'Heart & Pulse',
          title: 'Heart & Energy',
          subtitle: 'Resting Pulse, Flutters & Stress',
          accentHex: '#f43f5e',
          accentColorNum: 0xf43f5e,
          badge: 'Heart & Rhythm',
          bulletPoints: [
            'Normal resting pulse is between 60 to 100 beats per minute',
            'Why dehydration, caffeine & stress trigger quick flutter sensations',
            'Box-breathing exercise: 4 sec in, 4 sec hold, 4 sec out'
          ],
          details: 'Understand how your pulse reacts to exercise, fever, and anxiety, why occasional fluttering is often harmless, and when to seek care.',
          modalityType: 'hallmarks',
          normalBaselineNote: 'Rhythmic, calm heart contractions with steady pulse.',
          similarCaseNote: 'Stress palpitations feel like a quick flutter; true chest pressure feels tight or heavy.',
          homeCareTips: [
            'Drink a large glass of cool water right away to rehydrate',
            'Sit down and practice 4-7-8 breathing to calm your nervous system',
            'Cut back on high-caffeine energy drinks and dark sodas'
          ],
          doctorQuestions: [
            'Are my occasional heart flutters harmless or should we do a quick ECG test?',
            'Could dehydration, low potassium, or my thyroid be causing this?',
            'Are there specific triggers or symptoms I should log?'
          ]
        },
        {
          id: 'ref-ent',
          category: 'Throat & Voice',
          title: 'Sore Throat & Cough',
          subtitle: 'Pain Swallowing & Raspy Voice',
          accentHex: '#ec4899',
          accentColorNum: 0xec4899,
          badge: 'Throat & Voice',
          bulletPoints: [
            'Common cold vs Strep throat: simple mirror check tips',
            'Swollen neck glands mean your immune system is actively fighting',
            'Warm salt-water gargle: proven natural swelling relief'
          ],
          details: 'How to tell whether a scratchy throat is from a viral cold, post-nasal drip, or bacterial strep, plus soothing home routines.',
          modalityType: 'similar-images',
          normalBaselineNote: 'Smooth, pink throat lining with painless swallowing.',
          similarCaseNote: 'Compare mild viral redness with white exudate patches seen in strep.',
          homeCareTips: [
            'Gargle warm salt water (1/2 tsp salt in 1 cup warm water) 3 times a day',
            'Suck on throat lozenges or fruit popsicles to numb acute irritation',
            'Drink plenty of soothing liquids like chicken broth or herbal tea'
          ],
          doctorQuestions: [
            'Should we do a quick strep swab or is this a routine viral cold?',
            'Do I need antibiotics or will it resolve on its own with rest?',
            'What pain reliever is best to ease swallowing pain?'
          ]
        },
        {
          id: 'ref-gi',
          category: 'Stomach & Belly',
          title: 'Stomach & Digestion',
          subtitle: 'Cramps, Reflux, Heartburn & Gas',
          accentHex: '#f59e0b',
          accentColorNum: 0xf59e0b,
          badge: 'Digestive Health',
          bulletPoints: [
            'Heartburn vs indigestion: how food & acid cause burning sensations',
            'Gentle recovery foods: bananas, rice, applesauce & toast (BRAT)',
            'Resting positions: lie on your left side to prevent acid backflow'
          ],
          details: 'A friendly guide to soothing sour stomachs, gas, and reflux, plus what to eat when your belly feels uneasy.',
          modalityType: 'therapeutics',
          normalBaselineNote: 'Calm digestion with painless gut motility and comfortable stomach.',
          similarCaseNote: 'Notice how acid reflux burns behind the breastbone after eating heavy meals.',
          homeCareTips: [
            'Eat small, frequent bland meals rather than heavy dinners',
            'Stay upright for at least 2 to 3 hours after eating',
            'Sip ginger or chamomile tea to settle gut cramps'
          ],
          doctorQuestions: [
            'Could this be acid reflux, a food sensitivity, or a stomach bug?',
            'Should I try an antacid or acid-reducing medicine for a few days?',
            'When would an ultrasound or stool test be helpful?'
          ]
        },
        {
          id: 'ref-neuro',
          category: 'Headache & Focus',
          title: 'Headaches & Dizziness',
          subtitle: 'Tension, Sinus Pressure & Migraine',
          accentHex: '#8b5cf6',
          accentColorNum: 0x8b5cf6,
          badge: 'Head & Energy',
          bulletPoints: [
            'Tension band vs throbbing migraine vs sinus fullness',
            '20-20-20 screen rule: rest your eyes every 20 minutes',
            'Dehydration is the #1 hidden cause of afternoon headaches'
          ],
          details: 'Identify what kind of headache you have, practical ways to ease head pressure without heavy pills, and warning signs to never ignore.',
          modalityType: 'pathology',
          normalBaselineNote: 'Clear, alert mental focus without pain, tension, or sensitivity to light.',
          similarCaseNote: 'Tension headaches feel like a tight band; migraines usually throb on one side.',
          homeCareTips: [
            'Drink a tall 16oz glass of cold water right away',
            'Rest in a quiet, dark room with a cool compress across your forehead',
            'Gently massage your temples and the back of your neck'
          ],
          doctorQuestions: [
            'Is this headache tension, migraine, or sinus related?',
            'Can you help me identify and track possible headache triggers?',
            'What safe preventive steps can stop these from returning?'
          ]
        }
      ];
    } else {
      // Clinical Reference Atlas (Doctor View)
      return [
        {
          id: 'ref-pulmonary',
          category: 'Pulmonary / Thoracic Imaging',
          title: 'Chest Radiography (CXR)',
          subtitle: 'Normal Adult Reference Atlas',
          accentHex: '#06b6d4',
          accentColorNum: 0x06b6d4,
          badge: 'Modality: Thoracic X-Ray',
          bulletPoints: [
            'Bilateral aerated lung fields without consolidation',
            'Sharp costophrenic angles and clear diaphragms',
            'Normal cardiothoracic ratio (< 0.50) & airway'
          ],
          details: 'Baseline thoracic radiography demonstrating physiological aeration, sharp bilateral costophrenic recesses, normal pulmonary vascular arborization, and normal cardiac silhouette dimensions.',
          modalityType: 'similar-images',
          clinicalHallmarks: [
            'Sharp costophrenic sulci bilaterally',
            'Normal tracheobronchial air bronchogram symmetry',
            'Unremarkable mediastinal and hilar contours'
          ],
          normalBaselineNote: 'Normal lung volume, patent central trachea, intact ribs and thoracic wall.',
          similarCaseNote: 'Compare with pulmonary consolidation in pneumonia or hyperinflation in asthma.'
        },
        {
          id: 'ref-derm',
          category: 'Dermatology & Skin Lesions',
          title: 'Dermoscopy & Skin Barrier',
          subtitle: 'Epidermal Integrity Reference',
          accentHex: '#10b981',
          accentColorNum: 0x10b981,
          badge: 'Modality: Dermoscopy',
          bulletPoints: [
            'Intact stratum corneum barrier & lipid matrix',
            'Uniform melanin network without atypical streaks',
            'Standard ABCDE clinical lesion benchmark'
          ],
          details: 'Dermoscopic reference standard for evaluating cutaneous lesions: assessing Asymmetry, Border irregularity, Color variegation, Diameter (>6mm), and Evolution (ABCDE rule).',
          modalityType: 'hallmarks',
          clinicalHallmarks: [
            'Uniform pigment reticulation pattern',
            'Intact epidermal moisture retention',
            'Absence of atypical vascular polymorphism'
          ],
          normalBaselineNote: 'Stratified keratinized epidermis with regular rete ridges and dermal papillae.',
          similarCaseNote: 'Compare with erythematous scaling in eczema vs micaceous plaques in psoriasis.'
        },
        {
          id: 'ref-cardio',
          category: 'Cardiovascular Hemodynamics',
          title: '12-Lead ECG & Rhythm Strip',
          subtitle: 'Normal Sinus Rhythm 60-100 BPM',
          accentHex: '#f43f5e',
          accentColorNum: 0xf43f5e,
          badge: 'Modality: Electrocardiography',
          bulletPoints: [
            'Synchronous P wave preceding each QRS complex',
            'Normal PR interval (120-200 ms) & QRS (<120 ms)',
            'Isoelectric ST segment without acute ischemic shift'
          ],
          details: 'Standard 12-lead electrocardiographic reference illustrating intact sinoatrial pacing, normal atrioventricular conduction velocity, and absence of repolarization abnormalities.',
          modalityType: 'hallmarks',
          clinicalHallmarks: [
            'Normal axis (+30° to +90°)',
            'ST segment at true isoelectric baseline',
            'Normal corrected QT interval (QTc < 440 ms)'
          ],
          normalBaselineNote: 'Normal ventricular myocardium contractility with 55-70% ejection fraction.',
          similarCaseNote: 'Compare with ST elevation in acute myocardial infarction or pericarditis.'
        },
        {
          id: 'ref-ent',
          category: 'Pharyngeal Airway & ENT',
          title: 'Otolaryngology Exam',
          subtitle: 'Normal Patent Oropharynx',
          accentHex: '#ec4899',
          accentColorNum: 0xec4899,
          badge: 'Modality: Pharyngoscopy',
          bulletPoints: [
            'Symmetrical pink palatine tonsillar pillars',
            'Midline uvula and moist posterior pharyngeal wall',
            'Patent supraglottic airway without stridor'
          ],
          details: 'Otolaryngological reference baseline illustrating healthy mucous membrane coloration, non-hypertrophic palatine tonsils (Grade 1), and absence of purulent crypt exudates or peritonsillar fullness.',
          modalityType: 'similar-images',
          clinicalHallmarks: [
            'Grade 1 tonsils within tonsillar fossa',
            'No follicular or membranous exudates',
            'Intact bilateral vocal fold excursion'
          ],
          normalBaselineNote: 'Normal deglutition and patent upper respiratory air conduit.',
          similarCaseNote: 'Compare with exudative palatine tonsillitis in Strep vs viral mononucleosis.'
        },
        {
          id: 'ref-gi',
          category: 'Gastrointestinal Tract',
          title: 'Gastric Mucosa & Endoscopy',
          subtitle: 'Mucosal Barrier Reference',
          accentHex: '#f59e0b',
          accentColorNum: 0xf59e0b,
          badge: 'Modality: Endoscopy',
          bulletPoints: [
            'Smooth glistening gastric mucosal rugal folds',
            'Competent lower esophageal sphincter (LES)',
            'Unimpeded enteral peristaltic transit'
          ],
          details: 'Endoscopic mucosal baseline confirming unhindered gastrointestinal motility, robust epithelial bicarbonate layer, and sharp squamocolumnar Z-line junction.',
          modalityType: 'therapeutics',
          clinicalHallmarks: [
            'Intact mucosal cytoprotection',
            'Absence of erosions, ulcer craters, or erythema',
            'Normal duodenal bulb architecture'
          ],
          normalBaselineNote: 'Normal gastric acid balance without esophageal retrograde reflux.',
          similarCaseNote: 'Compare with erosive antral gastritis or peptic mucosal ulcer crater.'
        },
        {
          id: 'ref-neuro',
          category: 'Neurological & Cranial Axis',
          title: 'Cerebral Neurovascular Perfusion',
          subtitle: 'Symmetric Cortical Reference',
          accentHex: '#8b5cf6',
          accentColorNum: 0x8b5cf6,
          badge: 'Modality: Neuroimaging',
          bulletPoints: [
            'Symmetric Circle of Willis arterial flow',
            'Normotensive cerebral blood flow autoregulation',
            'Intact sensorimotor cognitive processing'
          ],
          details: 'Cranial neurovascular reference showcasing balanced bilateral hemispheric oxygenation, intact cranial nerve conduction, and absence of meningeal irritation.',
          modalityType: 'pathology',
          clinicalHallmarks: [
            'Normal ventricular system dimensions',
            'Preserved grey-white matter differentiation',
            'Normal intracranial pressure homeostasis'
          ],
          normalBaselineNote: 'Normal cognitive executive function and symmetric motor coordination.',
          similarCaseNote: 'Compare with cortical spreading depression in migraine or ischemic stroke deficits.'
        }
      ];
    }
  }

  // -------------------------------------------------------------
  // DIAGNOSED MODE: CUSTOMIZED 3D DISEASE & SIMILAR IMAGES DOSSIER
  // -------------------------------------------------------------
  const topDiff1 = differentialMatches?.[0];
  const topDiff2 = differentialMatches?.[1];

  if (isPatientMode) {
    // 100% Patient-Friendly, Practical & Reassuring
    return [
      {
        id: 'diag-images',
        category: 'Visual Guide & Look',
        title: 'What It Looks Like',
        subtitle: `${conditionTitle} Visual Clues`,
        accentHex: '#38bdf8',
        accentColorNum: 0x38bdf8,
        badge: 'Visual Comparison',
        bulletPoints: [
          `Target area: ${primaryLesionSite ? primaryLesionSite.slice(0, 36) : 'Affected body region'}`,
          'Side-by-side comparison: condition vs healthy normal tissue',
          'What to check: color, swelling, texture, and borders'
        ],
        details: `A visual walkthrough for ${conditionTitle}. Compare how this typically looks against healthy tissue so you can easily spot key characteristics and track whether it is improving.`,
        modalityType: 'similar-images',
        comparativeNote: `Notice the differences in color and swelling in ${conditionTitle} compared to unaffected baseline tissue.`,
        normalBaselineNote: 'Healthy tissue displays uniform color, smooth texture, and intact borders.',
        similarCaseNote: topDiff1 ? `Compare with ${topDiff1.condition}: ${topDiff1.details}` : 'Inspect common look-alikes in Card 3.',
        homeCareTips: [
          'Take a clear, well-lit photo today to monitor if it changes over the next few days',
          'Avoid touching or picking at the area to prevent secondary irritation',
          'Keep the area clean, dry, and lightly protected'
        ]
      },
      {
        id: 'diag-pathology',
        category: 'Simple Explanation',
        title: 'Why You Feel This Way',
        subtitle: 'How your body is responding',
        accentHex: '#a855f7',
        accentColorNum: 0xa855f7,
        badge: 'Body Reaction',
        bulletPoints: [
          `Where it started: ${primaryLesionSite ? primaryLesionSite.slice(0, 34) : 'The affected body tissue'}`,
          'Natural immune reaction: rushes healing cells to fight irritation',
          `Areas feeling tired: ${(affectedDownstreamOrgans && affectedDownstreamOrgans.length > 0) ? affectedDownstreamOrgans[0].slice(0, 32) : 'Nearby muscles & nerves'}`
        ],
        details: `In plain words, your body is actively responding to an irritation or bug in ${primaryLesionSite || 'the affected area'}. The swelling, warmth, or tenderness you feel is your immune system working hard to heal and protect you.`,
        modalityType: 'pathology',
        clinicalHallmarks: (systemicSideEffects && systemicSideEffects.length > 0) ? systemicSideEffects : [
          'Localized immune activation',
          'Increased blood flow causing warmth and swelling',
          'Natural healing fatigue while body recovers'
        ]
      },
      {
        id: 'diag-differential',
        category: 'Check Other Possibilities',
        title: 'Could It Be Something Else?',
        subtitle: 'Common Look-Alikes & Differences',
        accentHex: '#f59e0b',
        accentColorNum: 0xf59e0b,
        badge: 'Look-Alikes',
        bulletPoints: [
          topDiff1 ? `Possibility 2: ${topDiff1.condition.slice(0, 30)}` : 'Alternative common causes evaluated',
          topDiff2 ? `Possibility 3: ${topDiff2.condition.slice(0, 28)}` : 'Similar seasonal or environmental causes',
          'Your doctor will check key signs to confirm the exact diagnosis'
        ],
        details: `Many health conditions share similar early signs. Here is how ${conditionTitle} compares to other possibilities, and what differences your doctor will look for.`,
        modalityType: 'differential',
        similarCaseNote: topDiff1 ? `${topDiff1.condition}: ${topDiff1.details}` : 'Inspect candidates to understand overlapping symptoms.'
      },
      {
        id: 'diag-homecare',
        category: 'Home Self-Care',
        title: 'What You Can Do Right Now',
        subtitle: 'Practical Steps & Quick Relief',
        accentHex: '#10b981',
        accentColorNum: 0x10b981,
        badge: 'Safe Home Relief',
        bulletPoints: [
          topDiff1?.typicalInterventions ? topDiff1.typicalInterventions.slice(0, 38) : 'Rest, plenty of fluids, and avoiding physical strain',
          `Recommended specialist: ${recDoctor || 'Family Doctor or General Practitioner'}`,
          'Comfort measures: gentle warmth/cooling, sleep & hydration'
        ],
        details: `Safe, everyday steps you can do at home today to soothe your discomfort, protect your body, and speed up your natural recovery.`,
        modalityType: 'home-care',
        homeCareTips: [
          'Stay thoroughly hydrated with water, warm broths, or herbal teas',
          'Rest in a comfortable, relaxed posture without heavy physical strain',
          'Ask your local pharmacist for safe over-the-counter options tailored to your history'
        ]
      },
      {
        id: 'diag-doctorquestions',
        category: 'Doctor Appointment Prep',
        title: 'What To Ask Your Doctor',
        subtitle: 'Smart Questions & Shareable Summary',
        accentHex: '#0284c7',
        accentColorNum: 0x0284c7,
        badge: 'Doctor Visit Prep',
        bulletPoints: [
          '1. "How many days should this take before I start improving?"',
          '2. "Do I need any simple tests (swab, blood, X-ray) to confirm?"',
          '3. "What over-the-counter or prescription care is best for me?"'
        ],
        details: `Walk into your doctor's appointment feeling confident and prepared. Use these 4 questions and the 1-click shareable appointment note to communicate clearly with your clinician.`,
        modalityType: 'doctor-questions',
        doctorQuestions: [
          'How many days before I should expect noticeable improvement?',
          'Do I need a confirmatory test (swab, blood work, or imaging)?',
          'Are there non-medicine or over-the-counter options safe to try first?',
          'What specific symptoms mean I need to come back or get urgent care?'
        ]
      },
      {
        id: 'diag-redflags',
        category: 'Safety Checklist',
        title: 'When To Get Immediate Care',
        subtitle: isDangerous === 'Dangerous' ? 'Urgent Medical Attention Advised' : 'Safe to Monitor at Home',
        accentHex: isDangerous === 'Dangerous' ? '#ef4444' : '#f97316',
        accentColorNum: isDangerous === 'Dangerous' ? 0xef4444 : 0xf97316,
        badge: isDangerous === 'Dangerous' ? 'URGENT CARE ALERT' : 'SAFETY CHECKLIST',
        bulletPoints: [
          (warningSigns && warningSigns.length > 0) ? warningSigns[0].slice(0, 36) : 'Sudden severe pain, chest tightness, or trouble breathing',
          (warningSigns && warningSigns.length > 1) ? warningSigns[1].slice(0, 36) : 'High fever that does not come down with fluids',
          'Trust your gut: if something feels severely wrong, seek emergency care'
        ],
        details: `A clear, anxiety-free safety checklist so you know with confidence when it is safe to rest at home versus when you should go directly to urgent care or the emergency room.`,
        modalityType: 'red-flags',
        clinicalHallmarks: (warningSigns && warningSigns.length > 0) ? warningSigns : [
          'Sudden escalation of pain, breathing distress, or fainting',
          'Rapidly spreading redness, swelling, or confusion',
          'High fever (>103°F) accompanied by stiff neck'
        ]
      }
    ];
  }

  // Clinical / Doctor View (Rigorous Physician CDS Dossier)
  return [
    {
      id: 'diag-images',
      category: 'Pathology & Tissue Examination',
      title: 'Clinical Pathology & Histology',
      subtitle: icd10Code ? `${conditionTitle} [ICD-10: ${icd10Code}]` : `${conditionTitle} Morphometry`,
      accentHex: '#38bdf8',
      accentColorNum: 0x38bdf8,
      badge: icd10Code ? `ICD-10: ${icd10Code}` : 'Verified Tissue',
      bulletPoints: [
        `Epicenter: ${primaryLesionSite ? primaryLesionSite.slice(0, 34) : 'Focal clinical lesion site'}`,
        `Comparison: Pathological tissue alteration vs homeostatic baseline`,
        `Correlated against patient history and attached scans`
      ],
      details: `High-fidelity clinical reference visualizer demonstrating verified pathological manifestations of ${conditionTitle}. Compares lesion morphology against homeostatic cellular baselines.`,
      modalityType: 'similar-images',
      icd10Code,
      clinicalHallmarks: [
        `Primary morphological lesion: ${primaryLesionSite || 'Regional tissue alteration'}`,
        `Surface characteristics & boundaries`,
        `Key clinical signs distinguishing from mimics`
      ],
      comparativeNote: `Sharp demarcation and cellular changes characteristic of ${conditionTitle} compared to normal tissue architecture.`,
      normalBaselineNote: 'Normal tissue architecture displays uniform cellularity and vascularization.',
      similarCaseNote: topDiff1 ? `Compare with ${topDiff1.condition}: ${topDiff1.details}` : 'Inspect differential candidate matrix in Card 3.'
    },
    {
      id: 'diag-pathology',
      category: 'Etiology & Pathophysiology',
      title: 'Pathophysiological Cascade',
      subtitle: `${affectedOrganSystem || 'Systemic'} Hemodynamics`,
      accentHex: '#a855f7',
      accentColorNum: 0xa855f7,
      badge: 'Cellular Cascade',
      bulletPoints: [
        `Epicenter: ${primaryLesionSite ? primaryLesionSite.slice(0, 32) : 'Localized tissue site'}`,
        `Collateral organs: ${(affectedDownstreamOrgans && affectedDownstreamOrgans.length > 0) ? affectedDownstreamOrgans[0].slice(0, 32) : 'Secondary microvasculature'}`,
        `Propagation: ${(propagationPathways && propagationPathways.length > 0) ? propagationPathways[0].slice(0, 32) : 'Inflammatory mediator release'}`
      ],
      details: `Pathological cascade initiated at ${primaryLesionSite || 'the primary anatomical site'}. Propagates via ${(propagationPathways && propagationPathways.length > 0) ? propagationPathways.join('; ') : 'local tissue mediators'}, with risk of collateral compromise in ${(affectedDownstreamOrgans && affectedDownstreamOrgans.length > 0) ? affectedDownstreamOrgans.join(', ') : 'neighboring systems'}.`,
      modalityType: 'pathology',
      clinicalHallmarks: (systemicSideEffects && systemicSideEffects.length > 0) ? systemicSideEffects : [
        'Acute cellular inflammatory cytokine release',
        'Microvascular permeability and regional edema',
        'Nociceptive pathway sensitization'
      ]
    },
    {
      id: 'diag-differential',
      category: 'Differential Matrix (DDx)',
      title: 'Differential Diagnoses & ICD-10',
      subtitle: 'Ranked Bayesian Rule-Outs',
      accentHex: '#f59e0b',
      accentColorNum: 0xf59e0b,
      badge: 'DDx Matrix',
      bulletPoints: [
        topDiff1 ? `Top DDx: ${topDiff1.condition.slice(0, 26)}` : 'Alternative differential conditions evaluated',
        topDiff2 ? `Secondary: ${topDiff2.condition.slice(0, 26)}` : 'Rule-out criteria applied by AI engine',
        'Clinical hallmarks identify decisive differentiating markers'
      ],
      details: `Clinical differential matrix evaluating candidate conditions with overlapping presentation. Differentiates ${conditionTitle} based on clinical onset, physical biomarkers, and diagnostic imaging.`,
      modalityType: 'differential',
      clinicalHallmarks: [
        topDiff1 ? `${topDiff1.condition}: ${topDiff1.details}` : 'Candidate 1 overlap',
        topDiff2 ? `${topDiff2.condition}: ${topDiff2.details}` : 'Candidate 2 overlap',
        'Specific biomarkers and confirmatory tests'
      ]
    },
    {
      id: 'diag-workup',
      category: 'Diagnostic Workup Orders',
      title: 'Workup & Diagnostic Orders',
      subtitle: 'Targeted Lab & Imaging Studies',
      accentHex: '#10b981',
      accentColorNum: 0x10b981,
      badge: 'Order Panel',
      bulletPoints: [
        clinicalWorkup?.labTests?.[0] ? `Lab: ${clinicalWorkup.labTests[0].slice(0, 32)}` : 'Targeted blood & metabolic panels',
        clinicalWorkup?.imagingStudies?.[0] ? `Imaging: ${clinicalWorkup.imagingStudies[0].slice(0, 30)}` : 'Diagnostic imaging (POCUS, CT, XR)',
        clinicalWorkup?.physicalSigns?.[0] ? `Sign: ${clinicalWorkup.physicalSigns[0].slice(0, 32)}` : 'Objective physical examination findings'
      ],
      details: `Structured clinical workup orders to confirm ${conditionTitle}. Prioritizes high-yield laboratory tests, targeted imaging studies, and specific physical maneuvers.`,
      modalityType: 'workup',
      clinicalHallmarks: [
        ...(clinicalWorkup?.labTests || ['Complete Blood Count (CBC)', 'Comprehensive Metabolic Panel (CMP)']),
        ...(clinicalWorkup?.imagingStudies || ['Targeted Point-of-Care Ultrasound (POCUS) / Radiograph']),
        ...(clinicalWorkup?.physicalSigns || ['Targeted auscultation and palpation signs'])
      ]
    },
    {
      id: 'diag-therapeutics',
      category: 'Guideline Pharmacotherapy',
      title: 'Pharmacotherapy & Dosing',
      subtitle: 'First-Line Regimens & Contraindications',
      accentHex: '#0284c7',
      accentColorNum: 0x0284c7,
      badge: 'Rx Regimens',
      bulletPoints: [
        pharmacotherapy?.firstLine ? `1st Line: ${pharmacotherapy.firstLine.slice(0, 32)}` : 'First-line guideline pharmacological regimen',
        pharmacotherapy?.alternative ? `Alt: ${pharmacotherapy.alternative.slice(0, 34)}` : 'Alternative allergy-sparing regimen',
        pharmacotherapy?.contraindications?.[0] ? `Avoid: ${pharmacotherapy.contraindications[0].slice(0, 30)}` : 'Contraindication and interaction screening'
      ],
      details: `Evidence-based therapeutics aligned with clinical guidelines. Specifies first-line dosing, alternative regimens for allergy/intolerance, and key contraindications.`,
      modalityType: 'therapeutics',
      clinicalHallmarks: [
        pharmacotherapy?.firstLine ? `1st Line: ${pharmacotherapy.firstLine}` : 'Standard first-line regimen',
        pharmacotherapy?.alternative ? `Alternative: ${pharmacotherapy.alternative}` : 'Allergy-sparing alternative',
        ...(pharmacotherapy?.contraindications || ['Screen for drug-drug interactions and organ clearance'])
      ]
    },
    {
      id: 'diag-redflags',
      category: 'Emergency Escalation & Red Flags',
      title: 'Critical Triage & Warning Signs',
      subtitle: isDangerous === 'Dangerous' ? 'Urgent Medical Attention' : 'Standard Routine Follow-up',
      accentHex: isDangerous === 'Dangerous' ? '#ef4444' : '#f97316',
      accentColorNum: isDangerous === 'Dangerous' ? 0xef4444 : 0xf97316,
      badge: isDangerous === 'Dangerous' ? 'EMERGENCY ALERT' : 'SAFETY PROTOCOL',
      bulletPoints: [
        (warningSigns && warningSigns.length > 0) ? warningSigns[0].slice(0, 36) : 'Immediate medical escalation criteria',
        (warningSigns && warningSigns.length > 1) ? warningSigns[1].slice(0, 36) : 'Thresholds for emergency room evaluation',
        'Safe home monitoring vs immediate hospital review'
      ],
      details: `Emergency triage protocol outlining red flag manifestations that require immediate in-person emergency department evaluation.`,
      modalityType: 'red-flags',
      clinicalHallmarks: (warningSigns && warningSigns.length > 0) ? warningSigns : [
        'Severe sudden escalation of pain or shortness of breath',
        'Hemodynamic instability, dizziness, or syncope',
        'Neurological alterations or rapidly spreading erythema'
      ]
    }
  ];
}

export const ThreeAnatomicalScanner: React.FC<ThreeAnatomicalScannerProps> = ({
  symptomArea,
  affectedOrganSystem,
  conditionTitle,
  isScanning = false,
  confidence,
  hasDiagnosedResult = false,
  height = 480,
  className = '',
  primaryLesionSite,
  affectedDownstreamOrgans,
  systemicSideEffects,
  propagationPathways,
  differentialMatches,
  patientUploadedImage,
  empatheticNarrative,
  warningSigns,
  recDoctor,
  isDangerous,
  icd10Code,
  clinicalWorkup,
  pharmacotherapy,
  soapNote,
  onSelectZone
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active selected card in the 3D ring
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'patient' | 'clinical'>('clinical');
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [selectedInspectTab, setSelectedInspectTab] = useState<'comparison' | 'home-relief' | 'differential' | 'doctor-note' | 'pathology' | 'treatment' | 'workup' | 'soap-note'>('pathology');
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [copiedDoctorNote, setCopiedDoctorNote] = useState<boolean>(false);
  const [copiedSoapNote, setCopiedSoapNote] = useState<boolean>(false);

  // Image cache for patient uploaded image in canvas
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (patientUploadedImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = patientUploadedImage;
      img.onload = () => {
        uploadedImageRef.current = img;
      };
    } else {
      uploadedImageRef.current = null;
    }
  }, [patientUploadedImage]);

  // Generate the active card datasets based on patient vs doctor view
  const cardsData = generateCardsData(
    hasDiagnosedResult,
    conditionTitle,
    affectedOrganSystem,
    primaryLesionSite,
    affectedDownstreamOrgans,
    systemicSideEffects,
    propagationPathways,
    differentialMatches,
    warningSigns,
    recDoctor,
    isDangerous,
    viewMode,
    icd10Code,
    clinicalWorkup,
    pharmacotherapy,
    soapNote
  );

  const activeCard = cardsData[activeCardIndex] || cardsData[0];

  // Three.js State Holder
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    carouselGroup: THREE.Group;
    cardMeshes: THREE.Mesh[];
    cardTextures: THREE.CanvasTexture[];
    targetCarouselRotation: number;
    isDragging: boolean;
    previousMouseX: number;
    rotationVelocity: number;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
  } | null>(null);

  // Initialize Three.js 3D Spatial Carousel Stage
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 600;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 6.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // 3. Clinical Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 6, 6);
    scene.add(dirLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 3.5, 20);
    cyanPointLight.position.set(-4, 2, 4);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 2.5, 20);
    purplePointLight.position.set(4, -2, 4);
    scene.add(purplePointLight);

    // 4. Ground Holographic Circular Pedestal
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.8, 0);
    scene.add(pedestalGroup);

    const outerRingGeo = new THREE.RingGeometry(3.6, 3.75, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    pedestalGroup.add(outerRing);

    const innerRingGeo = new THREE.RingGeometry(2.2, 2.3, 36);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    pedestalGroup.add(innerRing);

    const gridHelper = new THREE.GridHelper(7.5, 16, 0x0284c7, 0x1e293b);
    gridHelper.position.set(0, 0.01, 0);
    pedestalGroup.add(gridHelper);

    // 5. Floating Biomedical Data Particles
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. 3D Spatial Carousel Group
    const carouselGroup = new THREE.Group();
    carouselGroup.position.set(0, 0, 0);
    scene.add(carouselGroup);

    const radius = 3.3;
    const cardMeshes: THREE.Mesh[] = [];
    const cardTextures: THREE.CanvasTexture[] = [];
    const totalCards = 6;

    // Build 6 Cards in 3D Space
    for (let i = 0; i < totalCards; i++) {
      // Offscreen canvas for rendering card graphics
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 512;
      offCanvas.height = 700;

      const texture = new THREE.CanvasTexture(offCanvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      cardTextures.push(texture);

      const cardGeo = new THREE.PlaneGeometry(1.85, 2.52);
      const cardMat = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.08
      });

      const mesh = new THREE.Mesh(cardGeo, cardMat);
      // Position cards evenly along a cylindrical ring
      const angle = (i / totalCards) * Math.PI * 2;
      mesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
      mesh.rotation.y = angle + Math.PI;

      mesh.userData = { cardIndex: i };
      carouselGroup.add(mesh);
      cardMeshes.push(mesh);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    threeRef.current = {
      scene,
      camera,
      renderer,
      carouselGroup,
      cardMeshes,
      cardTextures,
      targetCarouselRotation: 0,
      isDragging: false,
      previousMouseX: 0,
      rotationVelocity: 0,
      raycaster,
      mouse
    };

    // Render loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!threeRef.current) return;
      const { carouselGroup, targetCarouselRotation, isDragging } = threeRef.current;

      // Auto rotation in idle mode
      if (autoRotate && !isDragging) {
        carouselGroup.rotation.y += delta * 0.22;
      } else if (!isDragging) {
        // Smoothly interpolate rotation to target
        carouselGroup.rotation.y += (threeRef.current.targetCarouselRotation - carouselGroup.rotation.y) * 0.08;
      }

      // Gentle floating oscillation on pedestal
      pedestalGroup.rotation.y += delta * 0.05;

      // Subtle particle drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = Math.sin(elapsed * 0.05) * 0.05;

      // Raycasting for interactive hover effect on 3D cards (throttled every 3 frames for peak performance)
      if (Math.floor(elapsed * 60) % 3 === 0) {
        threeRef.current.raycaster.setFromCamera(threeRef.current.mouse, camera);
        const intersects = threeRef.current.raycaster.intersectObjects(cardMeshes);

        cardMeshes.forEach((mesh) => {
          const isHovered = intersects.length > 0 && intersects[0].object === mesh;
          const targetScale = isHovered ? 1.05 : 1.0;
          mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0 && threeRef.current) {
          threeRef.current.camera.aspect = w / height;
          threeRef.current.camera.updateProjectionMatrix();
          threeRef.current.renderer.setSize(w, height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [height]);

  // Redraw Canvas Textures when cardsData or state changes
  useEffect(() => {
    if (!threeRef.current) return;
    const { cardTextures } = threeRef.current;

    cardsData.forEach((card, idx) => {
      const texture = cardTextures[idx];
      if (!texture) return;
      const canvas = texture.image as HTMLCanvasElement;
      if (canvas) {
        renderCardTexture(canvas, card, !hasDiagnosedResult, uploadedImageRef.current);
        texture.needsUpdate = true;
      }
    });
  }, [cardsData, hasDiagnosedResult]);

  // Smoothly rotate 3D Carousel to active card
  const rotateToCard = useCallback((cardIndex: number) => {
    soundFx.click();
    setActiveCardIndex(cardIndex);
    if (!threeRef.current) return;
    const totalCards = 6;
    // Calculate target angle to bring card directly in front of camera
    const cardAngle = (cardIndex / totalCards) * Math.PI * 2;
    threeRef.current.targetCarouselRotation = -cardAngle;
    setAutoRotate(false);
  }, []);

  // Pointer Drag & Click Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!threeRef.current) return;
    threeRef.current.isDragging = true;
    threeRef.current.previousMouseX = e.clientX;
    setAutoRotate(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!threeRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    threeRef.current.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    threeRef.current.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (threeRef.current.isDragging) {
      const deltaX = e.clientX - threeRef.current.previousMouseX;
      threeRef.current.carouselGroup.rotation.y += deltaX * 0.007;
      threeRef.current.targetCarouselRotation = threeRef.current.carouselGroup.rotation.y;
      threeRef.current.previousMouseX = e.clientX;
    }
  };

  const handlePointerUp = () => {
    if (!threeRef.current) return;
    threeRef.current.isDragging = false;

    // Detect which card is currently closest to the front
    const totalCards = 6;
    let currentY = threeRef.current.carouselGroup.rotation.y % (Math.PI * 2);
    if (currentY > 0) currentY -= Math.PI * 2;
    const normalizedAngle = (-currentY) % (Math.PI * 2);
    const closestCardIndex = Math.round((normalizedAngle / (Math.PI * 2)) * totalCards) % totalCards;
    const validIndex = (closestCardIndex + totalCards) % totalCards;
    setActiveCardIndex(validIndex);
  };

  // Canvas Click Event: raycast to select card or open inspect
  const handleCanvasClick = () => {
    if (!threeRef.current) return;
    const { raycaster, mouse, camera, cardMeshes } = threeRef.current;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cardMeshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const clickedIndex = clickedMesh.userData.cardIndex;
      if (typeof clickedIndex === 'number') {
        if (clickedIndex === activeCardIndex) {
          // Double tap / click on already active card -> open inspector!
          soundFx.click();
          setInspectModalOpen(true);
        } else {
          rotateToCard(clickedIndex);
        }
      }
    }
  };

  const handlePrevCard = () => {
    const nextIdx = (activeCardIndex - 1 + 6) % 6;
    rotateToCard(nextIdx);
  };

  const handleNextCard = () => {
    const nextIdx = (activeCardIndex + 1) % 6;
    rotateToCard(nextIdx);
  };

  const handleZoom = (factor: number) => {
    soundFx.click();
    if (!threeRef.current) return;
    const cam = threeRef.current.camera;
    cam.position.z = Math.max(3.8, Math.min(8.5, cam.position.z * factor));
  };

  const handleResetCamera = () => {
    soundFx.click();
    if (!threeRef.current) return;
    threeRef.current.camera.position.set(0, 0.3, 6.2);
    rotateToCard(0);
    setAutoRotate(true);
  };

  return (
    <div className={`relative w-full rounded-3xl bg-slate-950 border border-slate-800 text-white overflow-hidden shadow-2xl ${className}`}>
      
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full relative select-none" style={{ height }}>
        <canvas 
          ref={canvasRef} 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleCanvasClick}
          className="w-full h-full block cursor-grab active:cursor-grabbing focus:outline-none" 
        />

        {/* Ambient Vignette Gradients */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent to-slate-950/60" />
      </div>

      {/* TOP BAR: Clean, Informative, Zero Overlap */}
      <div className="absolute top-3 inset-x-3 z-20 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {hasDiagnosedResult ? (
              <div className="flex items-center gap-1.5 bg-blue-950/90 border border-blue-500/50 text-blue-200 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-mono font-bold shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>3D Guide: {conditionTitle}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-mono font-bold shadow-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>3D Health Reference Atlas • Standby</span>
              </div>
            )}
          </div>

          {/* Mode Switcher + Confidence pill */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-slate-900/90 border border-slate-700/80 rounded-xl backdrop-blur-md shadow-md text-xs">
              <button
                type="button"
                onClick={() => {
                  soundFx.click();
                  setViewMode('patient');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'patient'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Patient-friendly explanations, home care relief, and smart doctor visit questions"
              >
                <span>👤</span>
                <span className="hidden sm:inline">Patient Guide</span>
                <span className="sm:hidden">Patient</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.click();
                  setViewMode('clinical');
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'clinical'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Clinical data density, diagnostic criteria, and pathological cascades"
              >
                <span>🩺</span>
                <span className="hidden sm:inline">Doctor View</span>
                <span className="sm:hidden">Doctor</span>
              </button>
            </div>

            {hasDiagnosedResult && confidence ? (
              <div className="bg-blue-600 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white shadow-md border border-blue-400/40 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>{confidence}% Match</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 text-slate-400 px-2.5 py-1 rounded-xl text-[11px] font-mono backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Awaiting Symptoms</span>
              </div>
            )}
          </div>

        </div>

        {/* Secondary Bar: Active 3D Card Info & Direct Lightbox Button */}
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-md text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeCard.accentHex }} />
            <span className="text-slate-400 font-mono hidden sm:inline">Card {activeCardIndex + 1}/6:</span>
            <span className="font-bold text-white tracking-tight">{activeCard.title}</span>
          </div>

          {/* Quick Action: Inspect Current Card in High-Res Modal */}
          <button
            onClick={() => {
              soundFx.click();
              setInspectModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-400/40 shadow-sm transition-all cursor-pointer backdrop-blur-md"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{viewMode === 'patient' ? 'Open Patient Guide & Doctor Note' : 'Deep Inspect Card'}</span>
            <span className="sm:hidden">Open</span>
          </button>
        </div>
      </div>

      {/* Floating 3D Navigation Controls Dock (Top Right) */}
      <div className="absolute top-24 right-3 flex flex-col gap-1.5 z-20 pointer-events-auto">
        <button
          onClick={() => {
            soundFx.click();
            setAutoRotate(!autoRotate);
          }}
          title={autoRotate ? 'Pause 3D Rotation' : 'Resume 3D Auto-Spin'}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
            autoRotate 
              ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/30' 
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        </button>

        <button
          onClick={() => handleZoom(0.85)}
          title="Zoom In 3D View"
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleZoom(1.15)}
          title="Zoom Out 3D View"
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetCamera}
          title="Reset 3D Perspective"
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Left/Right Arrows for 3D Carousel Spin */}
      <button
        onClick={handlePrevCard}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 border border-slate-700/80 hover:border-blue-400 text-white shadow-lg backdrop-blur-md transition-all cursor-pointer"
        title="Previous 3D Card"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={handleNextCard}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 border border-slate-700/80 hover:border-blue-400 text-white shadow-lg backdrop-blur-md transition-all cursor-pointer"
        title="Next 3D Card"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* BOTTOM SELECTOR: Quick Jump Tabs to any 3D Card */}
      <div className="absolute bottom-3 inset-x-3 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800/90 shadow-xl">
          {cardsData.map((card, idx) => {
            const isSelected = idx === activeCardIndex;
            return (
              <button
                key={card.id}
                onClick={() => rotateToCard(idx)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md border border-blue-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: card.accentHex }} 
                />
                <span className="whitespace-nowrap">
                  {card.category.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-RES DEEP INSPECTOR & COMPARATIVE CLINICAL LIGHTBOX MODAL            */}
      {/* ========================================================================= */}
      {inspectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <span>{viewMode === 'patient' ? 'Patient Guide' : 'Clinical Inspector'}</span>
                    <span>•</span>
                    <span className="text-slate-400">{activeCard.category}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {activeCard.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode toggle inside modal */}
                <div className="flex items-center p-0.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.click();
                      setViewMode('patient');
                      if (selectedInspectTab === 'pathology' || selectedInspectTab === 'treatment') {
                        setSelectedInspectTab('home-relief');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'patient'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👤</span>
                    <span className="hidden sm:inline">Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.click();
                      setViewMode('clinical');
                      if (selectedInspectTab === 'home-relief' || selectedInspectTab === 'doctor-note') {
                        setSelectedInspectTab('pathology');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'clinical'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🩺</span>
                    <span className="hidden sm:inline">Doctor</span>
                  </button>
                </div>

                <button
                  onClick={() => setInspectModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setSelectedInspectTab('comparison')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedInspectTab === 'comparison'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👁️</span>
                <span>Visual Comparison</span>
              </button>

              {viewMode === 'patient' ? (
                <>
                  <button
                    onClick={() => setSelectedInspectTab('home-relief')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'home-relief'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>🩹</span>
                    <span>Home Relief & Care</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('differential')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'differential'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>⚖️</span>
                    <span>Could It Be Something Else?</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('doctor-note')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'doctor-note'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>📋</span>
                    <span>Show Your Doctor</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedInspectTab('pathology')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'pathology'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Pathology & Cascade</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('workup')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'workup'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Diagnostic Workup</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('differential')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'differential'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>DDx & ICD-10</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('treatment')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'treatment'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>Pharmacotherapy</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('soap-note')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'soap-note'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Hospital SOAP Note</span>
                  </button>
                  <button
                    onClick={() => setSelectedInspectTab('comparison')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedInspectTab === 'comparison'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Tissue vs Baseline</span>
                  </button>
                </>
              )}
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* TAB 1: SIDE BY SIDE COMPARISON */}
              {selectedInspectTab === 'comparison' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Left: Diagnosed or Target Presentation */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-400 uppercase font-mono tracking-wide">
                          {hasDiagnosedResult ? 'Diagnosed Presentation' : 'Reference Presentation'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Target Area</span>
                      </div>

                      <div className="aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                        {patientUploadedImage ? (
                          <img 
                            src={patientUploadedImage} 
                            alt="Patient Scan" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-4 text-center space-y-2">
                            <ImageIcon className="w-8 h-8 text-rose-400 mx-auto opacity-80" />
                            <p className="text-xs font-bold text-white">
                              {hasDiagnosedResult ? conditionTitle : activeCard.title}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Verified diagnostic presentation archive
                            </p>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-rose-300">
                          Primary Lesion Site: {primaryLesionSite || 'Regional tissue site'}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeCard.details}
                      </p>
                    </div>

                    {/* Right: Normal Physiological Baseline */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wide">
                          Normal Healthy Baseline
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400/80">Homeostatic Reference</span>
                      </div>

                      <div className="aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 p-4 relative flex flex-col items-center justify-center text-center space-y-2">
                        <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-80" />
                        <p className="text-xs font-bold text-white">
                          Unaffected Reference Standard
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {activeCard.normalBaselineNote || 'Normal tissue displays intact structural continuity and absence of acute inflammation.'}
                        </p>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1.5">
                        <div className="font-semibold text-slate-200">Normal Reference Benchmarks:</div>
                        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                          {activeCard.bulletPoints.map((bp, i) => (
                            <li key={i}>{bp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Visual Distinction Checkpoints */}
                  <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-blue-200 space-y-2 text-xs">
                    <div className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-400" />
                      <span>How to Tell the Difference</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="font-bold text-white block mb-0.5">Color & Margins:</span>
                        <span className="text-slate-300 text-[11px]">Healthy areas have even skin tone or clear mucosa; active conditions exhibit redness, pallor, or distinct demarcated borders.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="font-bold text-white block mb-0.5">Swelling & Symmetry:</span>
                        <span className="text-slate-300 text-[11px]">Normal anatomy is balanced bilaterally; swelling or asymmetric bulging indicates localized fluid, edema, or inflammation.</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                        <span className="font-bold text-white block mb-0.5">Sensation & Warmth:</span>
                        <span className="text-slate-300 text-[11px]">Affected tissue often radiates localized heat, tenderness to light pressure, throbbing, or altered sensation.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HOME CARE & RELIEF (Patient Mode) */}
              {selectedInspectTab === 'home-relief' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Safe, Immediate Home Comfort Steps</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      These supportive steps help soothe discomfort while monitoring your symptoms safely:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                        <span>💧</span>
                        <span>Hydration & Warm Liquids</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Drink plenty of water, electrolyte broths, or warm herbal teas. Proper hydration thins secretions and helps your immune system fight inflammation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                        <span>🛏️</span>
                        <span>Rest & Elevation</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Prioritize 7-9 hours of sleep. If swelling or head pressure is present, elevate the affected area with extra pillows to ease throbbing.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                        <span>🧊</span>
                        <span>Temperature Therapy</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        For acute swelling, apply a cloth-wrapped cold pack for 10-15 minutes. For stiff muscle aches or sinus tightness, a gentle warm shower or compress provides soothing relief.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                        <span>💊</span>
                        <span>Pharmacy OTC Guidance</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Ask your local pharmacist about suitable over-the-counter options (such as acetaminophen, ibuprofen, or saline sprays) that match your current medications and medical history.
                      </p>
                    </div>
                  </div>

                  {/* Red flags warning box */}
                  <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/40 text-rose-200 space-y-2">
                    <div className="font-bold text-xs text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>When Home Care Is Not Enough (Seek Immediate Medical Care)</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-rose-100">
                      {(warningSigns && warningSigns.length > 0) ? (
                        warningSigns.map((ws, i) => <li key={i}>{ws}</li>)
                      ) : (
                        <>
                          <li>Difficulty breathing, severe chest tightness, or blue lips</li>
                          <li>High persistent fever above 103°F (39.4°C) or confusion</li>
                          <li>Rapidly spreading redness, severe unrelenting pain, or inability to keep fluids down</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: SHOW YOUR DOCTOR (Patient Mode) */}
              {selectedInspectTab === 'doctor-note' && (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Doctor Visit Summary:</strong> Ready to show your clinician or message through your patient portal.
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const noteText = `PATIENT VISIT CLINICAL SUMMARY
Generated by Health Intelligence System

SUSPECTED PRESENTATION:
• Condition: ${conditionTitle || 'Pending Evaluation'}
• Match Confidence: ${confidence ? `${confidence}%` : 'Reference Stage'}
• Affected Area: ${primaryLesionSite || affectedOrganSystem || 'General Systemic'}

PATIENT SYMPTOM NARRATIVE:
${empatheticNarrative || 'Patient seeking symptom evaluation.'}

RECOMMENDED SPECIALIST:
${recDoctor || 'General Physician / Primary Care'}

KEY QUESTIONS FOR DOCTOR:
1. Does this diagnosis match what you see in physical examination?
2. How long should this typically take before I start feeling improvement?
3. Do you recommend any confirmatory tests (swab, blood panel, or scan)?
4. What specific warning signs should make me seek urgent emergency care?

SAFETY RED FLAGS SCREENED:
${(warningSigns && warningSigns.length > 0) ? warningSigns.join(', ') : 'Standard home care and monitoring'}

[Note: This is an AI-assisted health briefing prepared by the patient to assist clinical discussion.]`;

                          navigator.clipboard.writeText(noteText).then(() => {
                            soundFx.click();
                            setCopiedDoctorNote(true);
                            setTimeout(() => setCopiedDoctorNote(false), 2500);
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        {copiedDoctorNote ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Note</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          soundFx.click();
                          window.print();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Print this briefing sheet"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Printable / Displayable Clinical Note Box */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs font-mono">
                    <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                      <span className="text-blue-400 font-bold text-sm tracking-wide">
                        CLINICAL VISIT DOSSIER • {conditionTitle || 'PATIENT SUMMARY'}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Recommended Doctor: <span className="text-white font-bold">{recDoctor || 'Primary Care Physician'}</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">1. Chief Presentation</div>
                      <div className="text-slate-200 font-sans leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        {empatheticNarrative || `Patient reports active symptoms in the ${primaryLesionSite || affectedOrganSystem || 'primary'} anatomical region.`}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">2. Top 4 Questions to Ask During Your Visit</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                          <span className="font-bold text-blue-400 block mb-0.5">Q1: Verification</span>
                          "Does my physical exam confirm this condition, or could it be related to something else?"
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                          <span className="font-bold text-blue-400 block mb-0.5">Q2: Recovery Timeline</span>
                          "How long should I expect recovery to take, and when should I see first improvement?"
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                          <span className="font-bold text-blue-400 block mb-0.5">Q3: Medication Safety</span>
                          "Are there any prescription or OTC treatments that interact with my current medications?"
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
                          <span className="font-bold text-blue-400 block mb-0.5">Q4: Escalation Signs</span>
                          "What specific symptom changes should prompt me to contact your office or go to urgent care?"
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">3. Monitored Red Flags</div>
                      <div className="flex flex-wrap gap-1.5">
                        {(warningSigns && warningSigns.length > 0) ? (
                          warningSigns.map((ws, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px] font-sans">
                              ⚠️ {ws}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 font-sans text-[11px]">No acute emergency flags detected at standard baseline.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PATHOLOGY & SPREAD (Clinical Mode) */}
              {selectedInspectTab === 'pathology' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Anatomical Localization & Primary Lesion</span>
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      <strong>Primary Epicenter:</strong> {primaryLesionSite || 'Focal tissue site'}
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      <strong>Organ System:</strong> {affectedOrganSystem || 'Systemic Human Physiology'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">Collateral Organs Impacted:</span>
                      <ul className="list-disc list-inside text-slate-300 text-xs space-y-1">
                        {(affectedDownstreamOrgans && affectedDownstreamOrgans.length > 0) ? (
                          affectedDownstreamOrgans.map((org, i) => <li key={i}>{org}</li>)
                        ) : (
                          <li>No secondary organ compromise identified in standard baseline.</li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-bold text-sky-400 font-mono">Propagation Pathways:</span>
                      <ul className="list-disc list-inside text-slate-300 text-xs space-y-1">
                        {(propagationPathways && propagationPathways.length > 0) ? (
                          propagationPathways.map((p, i) => <li key={i}>{p}</li>)
                        ) : (
                          <li>Physiological negative feedback loops maintaining homeostasis.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: DIFFERENTIAL & SIMILAR CASES */}
              {selectedInspectTab === 'differential' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      Differential Diagnosis Candidate Matrix
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      Rule-out probabilities & clinical overlap
                    </span>
                  </div>

                  {differentialMatches && differentialMatches.length > 0 ? (
                    differentialMatches.map((diff, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{diff.condition}</span>
                          <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700/50">
                            {diff.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{diff.details}</p>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Typical Interventions: {diff.typicalInterventions}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                      <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                      <p className="text-xs font-bold text-white">No Differential Triggers Active</p>
                      <p className="text-xs text-slate-400">
                        Atlas is in physiological reference standby. Submit symptoms or an image to calculate differential probability vectors.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: DIAGNOSTIC WORKUP & LAB ORDERS */}
              {selectedInspectTab === 'workup' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>Physician Diagnostic Workup & Order Panel</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Evidence-based lab, imaging, and physical maneuvers tailored to {conditionTitle || 'clinical presentation'}
                      </p>
                    </div>
                    {icd10Code && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono text-xs font-bold">
                        ICD-10: {icd10Code}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Lab Tests */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                          <span>🧪</span> Laboratory Tests
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">STAT/Routine</span>
                      </div>
                      <ul className="space-y-2">
                        {(clinicalWorkup?.labTests && clinicalWorkup.labTests.length > 0 ? clinicalWorkup.labTests : [
                          'Complete Blood Count (CBC) with diff',
                          'Comprehensive Metabolic Panel (CMP)',
                          'C-Reactive Protein (CRP) / ESR inflammatory markers'
                        ]).map((lab, i) => (
                          <li key={i} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                            <span className="text-emerald-400 font-mono text-xs mt-0.5 font-bold">›</span>
                            <span>{lab}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Imaging Studies */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400 font-mono flex items-center gap-1.5">
                          <span>🩻</span> Imaging Modalities
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Radiology</span>
                      </div>
                      <ul className="space-y-2">
                        {(clinicalWorkup?.imagingStudies && clinicalWorkup.imagingStudies.length > 0 ? clinicalWorkup.imagingStudies : [
                          'Targeted Diagnostic Ultrasound / POCUS',
                          'Multi-view Plain Radiographs',
                          'Contrast CT / MRI as indicated by acuity'
                        ]).map((img, i) => (
                          <li key={i} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                            <span className="text-sky-400 font-mono text-xs mt-0.5 font-bold">›</span>
                            <span>{img}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Physical Signs */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                          <span>🩺</span> Physical Exam Signs
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Objective</span>
                      </div>
                      <ul className="space-y-2">
                        {(clinicalWorkup?.physicalSigns && clinicalWorkup.physicalSigns.length > 0 ? clinicalWorkup.physicalSigns : [
                          'Targeted auscultation and palpation for focal tenderness',
                          'Neurovascular and microcirculation check',
                          'Assessment for guarding, rebound, or focal swelling'
                        ]).map((sign, i) => (
                          <li key={i} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                            <span className="text-amber-400 font-mono text-xs mt-0.5 font-bold">›</span>
                            <span>{sign}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: GUIDELINE THERAPEUTICS (Clinical Mode) */}
              {selectedInspectTab === 'treatment' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        <span>Guideline Pharmacotherapy & Dosing Regimens</span>
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        Specialist: <strong className="text-white">{recDoctor || 'Internal Medicine'}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* First Line */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-400 font-mono uppercase tracking-wider block">
                          First-Line Regimen
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                          {pharmacotherapy?.firstLine || activeCard.details}
                        </p>
                      </div>

                      {/* Alternative */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-wider block">
                          Alternative (Allergy / Renal / Intolerance)
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                          {pharmacotherapy?.alternative || 'Second-line agent or desensitization protocol based on patient clearance.'}
                        </p>
                      </div>
                    </div>

                    {/* Contraindications */}
                    {pharmacotherapy?.contraindications && pharmacotherapy.contraindications.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                        <span className="text-[11px] font-bold text-rose-400 font-mono uppercase tracking-wider block">
                          Contraindications & Drug-Drug Interactions
                        </span>
                        <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-0.5">
                          {pharmacotherapy.contraindications.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {warningSigns && warningSigns.length > 0 && (
                    <div className="bg-rose-950/30 border border-rose-800/40 rounded-2xl p-4 space-y-2">
                      <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Emergency Escalation Triggers & Hospital Admission Criteria</span>
                      </h4>
                      <ul className="list-disc list-inside text-rose-200 text-xs space-y-1">
                        {warningSigns.map((ws, i) => (
                          <li key={i}>{ws}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: EMR SOAP CONSULT NOTE */}
              {selectedInspectTab === 'soap-note' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-400" />
                        <span>Hospital EMR SOAP Consult Documentation</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Ready for 1-click export to Epic, Cerner, or Meditech clinical notes
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const fullSoapText = [
                          `=== CLINICAL DECISION SUPPORT CONSULT NOTE ===`,
                          `DATE: ${new Date().toLocaleDateString()} | TIME: ${new Date().toLocaleTimeString()}`,
                          `CONDITION: ${conditionTitle || 'Undifferentiated presentation'}`,
                          icd10Code ? `ICD-10 CODE: ${icd10Code}` : '',
                          `SPECIALIST: ${recDoctor || 'Internal Medicine'}`,
                          '',
                          `[S] SUBJECTIVE:`,
                          soapNote?.subjective || 'Patient reports acute onset of focal symptoms as logged.',
                          '',
                          `[O] OBJECTIVE:`,
                          soapNote?.objective || 'Inspection reveals targeted tissue changes; laboratory/imaging pending.',
                          '',
                          `[A] ASSESSMENT:`,
                          soapNote?.assessment || `${conditionTitle || 'Clinical condition'} [ICD-10: ${icd10Code || 'Unspecified'}].`,
                          '',
                          `[P] PLAN:`,
                          soapNote?.plan || 'Initiate guideline pharmacotherapy, obtain confirmatory labs, close follow-up.',
                          '',
                          `CLINICIAN SIGN-OFF: ___________________ MD/DO`
                        ].filter(Boolean).join('\n');

                        navigator.clipboard.writeText(fullSoapText);
                        setCopiedSoapNote(true);
                        setTimeout(() => setCopiedSoapNote(false), 3000);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
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
                    {/* S */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-sky-400 block font-mono">
                        [S] SUBJECTIVE (Chief Complaint & History)
                      </span>
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {soapNote?.subjective || empatheticNarrative || 'Patient presents with regional discomfort and acute symptom onset. Detailed history and severity logged.'}
                      </p>
                    </div>

                    {/* O */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-400 block font-mono">
                        [O] OBJECTIVE (Vitals, Physical Exam & Scans)
                      </span>
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {soapNote?.objective || `Target lesion localized to ${primaryLesionSite || 'regional tissue'}. Inspection indicates focal alterations; diagnostic workup ordered.`}
                      </p>
                    </div>

                    {/* A */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          [A] ASSESSMENT (Diagnostic Impression & ICD-10)
                        </span>
                        {icd10Code && (
                          <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                            ICD-10: {icd10Code}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {soapNote?.assessment || `Primary diagnostic hypothesis: ${conditionTitle} (Confidence: ${confidence || 90}%). Differentials considered and ranked.`}
                      </p>
                    </div>

                    {/* P */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-purple-400 block font-mono">
                        [P] PLAN (Therapeutics, Workup & Disposition)
                      </span>
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {soapNote?.plan || `Initiate first-line regimen: ${pharmacotherapy?.firstLine || 'Guideline treatment'}. Complete diagnostic workup. Immediate escalation if red flag criteria met.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Click cards or drag in the 3D viewport to inspect all modalities
              </span>
              <button
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// Re-export as ThreeDiseaseExplorer as well for semantic clarity
export const ThreeDiseaseExplorer = ThreeAnatomicalScanner;
