/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Briefcase, CheckCircle2, RotateCw, Sparkles, Trophy } from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface ThreeCabinetDispenserProps {
  totalMeds?: number;
  adherencePct?: number;
  height?: number;
  className?: string;
  onDispense?: () => void;
}

export const ThreeCabinetDispenser: React.FC<ThreeCabinetDispenserProps> = ({
  totalMeds = 4,
  adherencePct = 85,
  height = 300,
  className = '',
  onDispense
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.9);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Translucent Amber / Medical Blue Pharmaceutical Bottle
    const bottleGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32);
    const bottleMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85, // Glass / frosted plastic translucency
      opacity: 0.9,
      transparent: true,
      ior: 1.45
    });
    const bottle = new THREE.Mesh(bottleGeo, bottleMat);
    bottle.position.y = -0.2;
    mainGroup.add(bottle);

    // Bottle Neck & Cap
    const neckGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.5, 32);
    const neck = new THREE.Mesh(neckGeo, bottleMat);
    neck.position.y = 1.4;
    mainGroup.add(neck);

    const capGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.45, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 1.7;
    mainGroup.add(cap);

    // 2. Medicine Label on Bottle with Debossed Cross
    const labelGeo = new THREE.CylinderGeometry(1.22, 1.22, 1.6, 32, 1, true, 0, Math.PI * 1.3);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.2;
    label.rotation.y = Math.PI * 0.35;
    mainGroup.add(label);

    // 3. Floating 3D Micro-Capsules Inside the Bottle
    const capsuleColors = [
      [0x3b82f6, 0xffffff],
      [0xef4444, 0xffffff],
      [0x10b981, 0xffffff],
      [0xf59e0b, 0x3b82f6]
    ];

    const pillsInside: THREE.Group[] = [];
    for (let i = 0; i < 8; i++) {
      const pillGrp = new THREE.Group();
      const [colA, colB] = capsuleColors[i % capsuleColors.length];

      const halfGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.35, 16);
      const capTopGeo = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);

      const matA = new THREE.MeshStandardMaterial({ color: colA, roughness: 0.2 });
      const matB = new THREE.MeshStandardMaterial({ color: colB, roughness: 0.2 });

      const meshA = new THREE.Mesh(halfGeo, matA);
      meshA.position.y = 0.175;
      const meshTop = new THREE.Mesh(capTopGeo, matA);
      meshTop.position.y = 0.35;

      const meshB = new THREE.Mesh(halfGeo, matB);
      meshB.position.y = -0.175;
      const meshBot = new THREE.Mesh(capTopGeo, matB);
      meshBot.position.y = -0.35;
      meshBot.rotation.x = Math.PI;

      pillGrp.add(meshA, meshTop, meshB, meshBot);

      pillGrp.position.set(
        (Math.random() - 0.5) * 1.2,
        -1.0 + Math.random() * 1.2,
        (Math.random() - 0.5) * 1.2
      );
      pillGrp.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      pillGrp.scale.setScalar(0.75);

      mainGroup.add(pillGrp);
      pillsInside.push(pillGrp);
    }

    // 4. Glowing Adherence Ring around the base
    const ringGeo = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.75
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.6;
    mainGroup.add(ring);

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
      targetRotY += dx * 0.012;
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

      if (!isDragging && isRotating) {
        targetRotY += delta * 0.5;
      }

      curRotY += (targetRotY - curRotY) * 0.08;
      mainGroup.rotation.y = curRotY;

      // Slight floating motion
      mainGroup.position.y = Math.sin(elapsed * 1.8) * 0.08;
      ring.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.04);

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
  }, [height, isRotating]);

  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-white overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      </div>

      {/* Top Overlay */}
      <div className="absolute top-3 inset-x-3 pointer-events-none flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-extrabold font-mono uppercase tracking-wider text-slate-200">
            3D Smart Pharmaceutical Bottle
          </span>
        </div>

        <button
          onClick={() => {
            soundFx.click();
            setIsRotating(!isRotating);
          }}
          className="pointer-events-auto p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Toggle 360° Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bottom Adherence Banner */}
      <div className="absolute bottom-3 inset-x-3 pointer-events-none flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">
            Adherence Compliance: <strong className="text-emerald-400 font-mono">{adherencePct}%</strong>
          </span>
        </div>

        <span className="text-[11px] font-mono text-blue-400">
          {totalMeds} Prescriptions Loaded
        </span>
      </div>
    </div>
  );
};
