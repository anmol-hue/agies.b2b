/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Stethoscope, Sparkles, Activity, ShieldCheck, Target, Radio } from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface ThreeAnatomicalScannerProps {
  symptomArea?: 'throat' | 'chest' | 'skin' | 'general';
  isScanning?: boolean;
  confidence?: number;
  height?: number;
  className?: string;
}

export const ThreeAnatomicalScanner: React.FC<ThreeAnatomicalScannerProps> = ({
  symptomArea = 'throat',
  isScanning = false,
  confidence = 92,
  height = 320,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeZone, setActiveZone] = useState<string>(symptomArea);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 20);
    cyanLight.position.set(2, 3, 4);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2, 20);
    blueLight.position.set(-2, -2, 4);
    scene.add(blueLight);

    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // 1. Anatomical Head & Neck Wireframe Structure
    const headGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 1.3;
    headMesh.scale.set(0.9, 1.15, 1.0);
    bodyGroup.add(headMesh);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.38, 0.45, 0.7, 16, 4, true);
    const neckMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const neckMesh = new THREE.Mesh(neckGeo, neckMat);
    neckMesh.position.y = 0.4;
    bodyGroup.add(neckMesh);

    // Torso / Chest
    const chestGeo = new THREE.CylinderGeometry(0.9, 0.75, 1.8, 20, 6, true);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const chestMesh = new THREE.Mesh(chestGeo, chestMat);
    chestMesh.position.y = -0.7;
    chestMesh.scale.set(1.4, 1.0, 0.85);
    bodyGroup.add(chestMesh);

    // 2. Targeted Diagnostic Scan Nodes (Throat, Lungs, Skin, Heart)
    const nodes = [
      { id: 'throat', name: 'Pharynx & Tonsils', pos: [0, 0.45, 0.42], color: 0xef4444 },
      { id: 'chest', name: 'Bronchial Tree', pos: [0, -0.4, 0.45], color: 0x38bdf8 },
      { id: 'heart', name: 'Cardiovascular Node', pos: [-0.3, -0.5, 0.42], color: 0xf43f5e },
      { id: 'skin', name: 'Epidermal Barrier', pos: [0.75, -0.3, 0.4], color: 0x10b981 }
    ];

    const nodeMeshes: { id: string; mesh: THREE.Mesh; halo: THREE.Mesh }[] = [];

    nodes.forEach(n => {
      const g = new THREE.SphereGeometry(0.09, 16, 16);
      const m = new THREE.MeshBasicMaterial({ color: n.color });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...n.pos as [number, number, number]);

      // Glowing pulsating halo
      const hG = new THREE.RingGeometry(0.12, 0.2, 24);
      const hM = new THREE.MeshBasicMaterial({
        color: n.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const halo = new THREE.Mesh(hG, hM);
      halo.position.set(...n.pos as [number, number, number]);
      halo.position.z += 0.02;

      bodyGroup.add(mesh);
      bodyGroup.add(halo);
      nodeMeshes.push({ id: n.id, mesh, halo });
    });

    // 3. Laser Scan Plane (Translucent Cyan Scan Bar)
    const scanPlaneGeo = new THREE.PlaneGeometry(3.6, 0.05);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    bodyGroup.add(scanPlane);

    // Glowing laser beam fan
    const fanGeo = new THREE.PlaneGeometry(3.6, 0.8);
    const fanMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    });
    const fanMesh = new THREE.Mesh(fanGeo, fanMat);
    fanMesh.position.y = -0.4;
    scanPlane.add(fanMesh);

    // 4. Background Holographic Reticle Rings
    const reticleGeo = new THREE.RingGeometry(2.4, 2.42, 64);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    scene.add(reticleMesh);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRotY = 0;
    let curRotY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      targetRotY += dx * 0.015;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Scan plane vertical sweep
      const scanY = Math.sin(elapsed * 2.2) * 1.8;
      scanPlane.position.y = scanY;

      // Pulse diagnostic nodes
      nodeMeshes.forEach((n, idx) => {
        const s = 1 + Math.sin(elapsed * 4 + idx) * 0.35;
        n.halo.scale.set(s, s, s);
        n.halo.rotation.z += delta * 0.5;
      });

      // Reticle rotation
      reticleMesh.rotation.z -= delta * 0.2;

      if (!isDragging) {
        targetRotY = Math.sin(elapsed * 0.6) * 0.35;
      }

      curRotY += (targetRotY - curRotY) * 0.08;
      bodyGroup.rotation.y = curRotY;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [height]);

  return (
    <div className={`relative w-full rounded-2xl bg-slate-950 border border-slate-800 text-white overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      </div>

      {/* Top Holographic Status */}
      <div className="absolute top-3 inset-x-3 pointer-events-none flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="font-extrabold uppercase font-mono tracking-wider text-blue-400">
            3D Holographic Anatomical Radar
          </span>
        </div>

        <div className="bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-mono font-bold text-white shadow-xs">
          Confidence {confidence}%
        </div>
      </div>

      {/* Bottom Target Nodes Quick Jump */}
      <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between gap-1 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
        {[
          { id: 'throat', label: 'Pharyngeal Node', color: 'bg-rose-500' },
          { id: 'chest', label: 'Bronchial Tree', color: 'bg-sky-400' },
          { id: 'skin', label: 'Epidermal Barrier', color: 'bg-emerald-400' }
        ].map(zone => (
          <button
            key={zone.id}
            onClick={() => {
              soundFx.click();
              setActiveZone(zone.id);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              activeZone === zone.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${zone.color}`} />
            <span>{zone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
