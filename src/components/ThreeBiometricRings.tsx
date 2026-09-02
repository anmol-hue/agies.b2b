/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Zap, Shield, Heart } from 'lucide-react';
import { soundFx } from '../lib/soundFx';

interface ThreeBiometricRingsProps {
  height?: number;
  interactive?: boolean;
  className?: string;
}

export const ThreeBiometricRings: React.FC<ThreeBiometricRingsProps> = ({
  height = 240,
  interactive = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMetric, setActiveMetric] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient and Point lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2.5, 20);
    blueLight.position.set(2, 4, 3);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 1.8, 20);
    cyanLight.position.set(-2, -3, 2);
    scene.add(cyanLight);

    // Group for all rings
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central glowing nucleus / core
    const coreGeo = new THREE.IcosahedronGeometry(0.65, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: false
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 2. Concentric Biometric Torus Rings
    const rings: {
      mesh: THREE.Mesh;
      speedX: number;
      speedY: number;
      speedZ: number;
      radius: number;
    }[] = [];

    const ringConfigs = [
      { radius: 1.15, tube: 0.025, color: 0x3b82f6, speedX: 0.6, speedY: 0.8, speedZ: 0.4 },
      { radius: 1.6, tube: 0.022, color: 0x06b6d4, speedX: -0.5, speedY: 0.4, speedZ: -0.7 },
      { radius: 2.05, tube: 0.018, color: 0x6366f1, speedX: 0.4, speedY: -0.6, speedZ: 0.5 },
      { radius: 2.45, tube: 0.014, color: 0x10b981, speedX: -0.3, speedY: 0.5, speedZ: -0.3 }
    ];

    ringConfigs.forEach((cfg) => {
      const torusGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const torusMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: cfg.color,
        emissiveIntensity: 0.25
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = Math.random() * Math.PI;
      torus.rotation.y = Math.random() * Math.PI;
      mainGroup.add(torus);

      rings.push({
        mesh: torus,
        speedX: cfg.speedX,
        speedY: cfg.speedY,
        speedZ: cfg.speedZ,
        radius: cfg.radius
      });

      // Add orbit nodes along the ring
      const nodeCount = 3;
      for (let n = 0; n < nodeCount; n++) {
        const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const angle = (n / nodeCount) * Math.PI * 2;
        node.position.set(Math.cos(angle) * cfg.radius, Math.sin(angle) * cfg.radius, 0);
        torus.add(node);
      }
    });

    // 3. Orbiting Particle Cloud
    const particleCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.0 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pPos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pPos[i * 3 + 1] = r * Math.sin(phi);
      pPos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    mainGroup.add(pSystem);

    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let targetRot = { x: 0.2, y: 0 };
    let currentRot = { x: 0.2, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !interactive) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      targetRot.y += dx * 0.01;
      targetRot.x += dy * 0.01;
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

      // Rotate core
      coreMesh.rotation.x += delta * 0.4;
      coreMesh.rotation.y += delta * 0.6;
      innerMesh.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.12);

      // Rotate concentric rings
      rings.forEach((r, idx) => {
        r.mesh.rotation.x += delta * r.speedX * 0.5;
        r.mesh.rotation.y += delta * r.speedY * 0.5;
        r.mesh.rotation.z += delta * r.speedZ * 0.5;
      });

      pSystem.rotation.y += delta * 0.2;

      if (!isDragging) {
        targetRot.y += delta * 0.25;
        targetRot.x = Math.sin(elapsed * 0.5) * 0.15 + 0.2;
      }

      currentRot.x += (targetRot.x - currentRot.x) * 0.08;
      currentRot.y += (targetRot.y - currentRot.y) * 0.08;

      mainGroup.rotation.x = currentRot.x;
      mainGroup.rotation.y = currentRot.y;

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
  }, [height, interactive]);

  const metricsData = [
    { title: 'Neural Core Sync', value: '100% Locked', icon: Zap, color: 'text-blue-500' },
    { title: 'Kinetic Latency', value: '0.02s Vector', icon: Activity, color: 'text-cyan-500' },
    { title: 'CYP450 Matrix', value: 'Zero Conflict', icon: Shield, color: 'text-indigo-500' }
  ];

  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white overflow-hidden shadow-sm ${className}`}>
      {/* Top Header */}
      <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
        <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-blue-400">
          3D Kinetic Biometric Telemetry
        </span>
      </div>

      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full flex items-center justify-center" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      </div>

      {/* Metric Selector Tabs Bottom */}
      <div className="absolute bottom-2.5 inset-x-3 z-10 flex items-center justify-between gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-800/80">
        {metricsData.map((m, idx) => {
          const Icon = m.icon;
          const isSelected = activeMetric === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                soundFx.click();
                setActiveMetric(idx);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{m.title}</span>
              <span className="font-mono text-blue-200">{m.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
