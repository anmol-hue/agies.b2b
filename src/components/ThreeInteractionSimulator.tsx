/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldAlert, Zap, Atom, CheckCircle2, RotateCw, RefreshCw } from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface ThreeInteractionSimulatorProps {
  drugAName: string;
  drugBName: string;
  severity: 'Severe' | 'Moderate' | 'Safe';
  height?: number;
  className?: string;
}

export const ThreeInteractionSimulator: React.FC<ThreeInteractionSimulatorProps> = ({
  drugAName = 'Warfarin',
  drugBName = 'Ibuprofen',
  severity = 'Severe',
  height = 300,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dockingProgress, setDockingProgress] = useState(100);
  const [isSimulating, setIsSimulating] = useState(true);

  const severityColor = severity === 'Severe' 
    ? 0xef4444 
    : severity === 'Moderate' 
    ? 0xf59e0b 
    : 0x10b981;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 2, 20);
    pointLight1.position.set(3, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(severityColor, 3, 20);
    pointLight2.position.set(-3, -2, 3);
    scene.add(pointLight2);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Large Enzymatic Active Pocket (Wireframe Bio-Cavity)
    const pocketGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const pocketMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.5
    });
    const pocketMesh = new THREE.Mesh(pocketGeo, pocketMat);
    mainGroup.add(pocketMesh);

    // 2. Molecule A Group (e.g. Left Ligand - Blue)
    const molAGroup = new THREE.Group();
    const aAtoms = [
      { pos: [-1.4, 0.4, 0], color: 0x3b82f6, r: 0.35 },
      { pos: [-0.9, -0.4, 0.2], color: 0x60a5fa, r: 0.28 },
      { pos: [-1.8, -0.6, -0.2], color: 0x93c5fd, r: 0.26 },
      { pos: [-2.3, 0.5, 0.1], color: 0x2563eb, r: 0.3 }
    ];

    aAtoms.forEach(a => {
      const g = new THREE.SphereGeometry(a.r, 16, 16);
      const m = new THREE.MeshStandardMaterial({ color: a.color, roughness: 0.2, metalness: 0.2 });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...(a.pos as [number, number, number]));
      molAGroup.add(mesh);
    });

    // Molecule A bonds
    for (let i = 0; i < aAtoms.length - 1; i++) {
      const p1 = new THREE.Vector3(...aAtoms[i].pos as [number, number, number]);
      const p2 = new THREE.Vector3(...aAtoms[i + 1].pos as [number, number, number]);
      const dist = p1.distanceTo(p2);
      const bGeo = new THREE.CylinderGeometry(0.06, 0.06, dist, 12);
      const bMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.copy(new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5));
      bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
      molAGroup.add(bMesh);
    }
    mainGroup.add(molAGroup);

    // 3. Molecule B Group (e.g. Right Ligand - Red / Amber / Green)
    const molBGroup = new THREE.Group();
    const bAtoms = [
      { pos: [1.4, 0.3, 0], color: severityColor, r: 0.35 },
      { pos: [0.8, -0.3, -0.2], color: severityColor, r: 0.28 },
      { pos: [1.7, -0.7, 0.2], color: 0xf87171, r: 0.26 },
      { pos: [2.2, 0.6, -0.1], color: severityColor, r: 0.3 }
    ];

    bAtoms.forEach(b => {
      const g = new THREE.SphereGeometry(b.r, 16, 16);
      const m = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.2, metalness: 0.2 });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...(b.pos as [number, number, number]));
      molBGroup.add(mesh);
    });

    for (let i = 0; i < bAtoms.length - 1; i++) {
      const p1 = new THREE.Vector3(...bAtoms[i].pos as [number, number, number]);
      const p2 = new THREE.Vector3(...bAtoms[i + 1].pos as [number, number, number]);
      const dist = p1.distanceTo(p2);
      const bGeo = new THREE.CylinderGeometry(0.06, 0.06, dist, 12);
      const bMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.copy(new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5));
      bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
      molBGroup.add(bMesh);
    }
    mainGroup.add(molBGroup);

    // 4. Glowing Inter-Molecular Collision / Conflict Laser Beam
    const laserCurve = new THREE.LineCurve3(
      new THREE.Vector3(-0.9, -0.4, 0.2),
      new THREE.Vector3(0.8, -0.3, -0.2)
    );
    const laserGeo = new THREE.TubeGeometry(laserCurve, 20, 0.04, 8, false);
    const laserMat = new THREE.MeshBasicMaterial({
      color: severityColor,
      transparent: true,
      opacity: 0.8
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    mainGroup.add(laserMesh);

    // 5. Orbiting Enzyme Substrate Nodes
    const orbitalCount = 24;
    const orbGeo = new THREE.BufferGeometry();
    const orbPos = new Float32Array(orbitalCount * 3);
    for (let i = 0; i < orbitalCount; i++) {
      const angle = (i / orbitalCount) * Math.PI * 2;
      orbPos[i * 3] = Math.cos(angle) * 2.2;
      orbPos[i * 3 + 1] = Math.sin(angle * 2) * 0.4;
      orbPos[i * 3 + 2] = Math.sin(angle) * 2.2;
    }
    orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPos, 3));
    const orbMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.85
    });
    const orbSystem = new THREE.Points(orbGeo, orbMat);
    mainGroup.add(orbSystem);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRot = { x: 0.1, y: 0 };
    let curRot = { x: 0.1, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      targetRot.y += dx * 0.012;
      targetRot.x += dy * 0.012;
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

      if (!isDragging && isSimulating) {
        targetRot.y += delta * 0.4;
        targetRot.x = Math.sin(elapsed * 0.5) * 0.15 + 0.1;
      }

      curRot.x += (targetRot.x - curRot.x) * 0.08;
      curRot.y += (targetRot.y - curRot.y) * 0.08;

      mainGroup.rotation.x = curRot.x;
      mainGroup.rotation.y = curRot.y;

      // Pulse molecules towards and away during binding simulation
      const osc = Math.sin(elapsed * 2.5);
      molAGroup.position.x = osc * 0.15;
      molBGroup.position.x = -osc * 0.15;
      laserMesh.scale.set(1, 1 + osc * 0.4, 1);

      orbSystem.rotation.y += delta * 0.6;
      pocketMesh.rotation.z += delta * 0.1;

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
  }, [drugAName, drugBName, severity, height, isSimulating]);

  return (
    <div className={`relative w-full rounded-2xl bg-slate-950 border border-slate-800 text-white overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      </div>

      {/* Top Header Simulation Overlay */}
      <div className="absolute top-3 inset-x-3 pointer-events-none flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className={`w-2 h-2 rounded-full ${
            severity === 'Severe' ? 'bg-rose-500 animate-ping' : severity === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          <span className="font-bold text-slate-200">
            {drugAName} <span className="text-slate-400">×</span> {drugBName}
          </span>
          <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
            severity === 'Severe' ? 'bg-rose-950 text-rose-300 border border-rose-800' : severity === 'Moderate' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            {severity} Cross-Binding
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.click();
            setIsSimulating(!isSimulating);
          }}
          className="pointer-events-auto p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Toggle Simulation Motion"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bottom Simulation Legend */}
      <div className="absolute bottom-3 inset-x-3 pointer-events-none flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-2">
          <span className="text-blue-400">● Ligand A: {drugAName}</span>
          <span className="text-slate-600">|</span>
          <span className={severity === 'Severe' ? 'text-rose-400' : 'text-amber-400'}>● Ligand B: {drugBName}</span>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
          CYP450 Enzyme Pocket Active
        </div>
      </div>
    </div>
  );
};
