/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useId } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Layers, 
  Sparkles, 
  Sun, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

export type PillShape3D = 'Capsule' | 'Round' | 'Oval' | 'Oblong';
export type RenderMode3D = 'solid' | 'wireframe' | 'xray' | 'exploded';

interface ThreePillCanvasProps {
  shape?: PillShape3D;
  colorPrimary?: string;
  colorSecondary?: string;
  imprint?: string;
  score?: 'None' | 'Single' | 'Cross';
  height?: number | string;
  interactive?: boolean;
  autoRotateInit?: boolean;
  showControls?: boolean;
  className?: string;
}

export const ThreePillCanvas: React.FC<ThreePillCanvasProps> = ({
  shape = 'Capsule',
  colorPrimary = '#2563eb',
  colorSecondary = '#ffffff',
  imprint = 'TPIS 500',
  score = 'Single',
  height = 320,
  interactive = true,
  autoRotateInit = true,
  showControls = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 3D State
  const [currentShape, setCurrentShape] = useState<PillShape3D>(shape);
  const [renderMode, setRenderMode] = useState<RenderMode3D>('solid');
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotateInit);
  const [rotationSpeed, setRotationSpeed] = useState(1.2);
  const [explosionAmount, setExplosionAmount] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(1.4);
  const [showOptionsBar, setShowOptionsBar] = useState(false);

  // Synchronize incoming props
  useEffect(() => {
    setCurrentShape(shape);
  }, [shape]);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pillGroupRef = useRef<THREE.Group | null>(null);
  const topHalfRef = useRef<THREE.Group | null>(null);
  const bottomHalfRef = useRef<THREE.Group | null>(null);
  const pelletsGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  
  // Mouse Drag Interaction references
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.3, y: 0.6 });
  const currentRotationRef = useRef({ x: 0.3, y: 0.6 });
  const zoomLevelRef = useRef(4.2);

  // Helper to create an imprint texture from 2D Canvas
  const createImprintTexture = (text: string, bgColor: string, textColor: string, hasScore: 'None' | 'Single' | 'Cross' | string = 'None') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 512);

    // Score line
    if (hasScore === 'Single') {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(256, 40);
      ctx.lineTo(256, 472);
      ctx.stroke();

      // Highlight line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(259, 40);
      ctx.lineTo(259, 472);
      ctx.stroke();
    } else if (hasScore === 'Cross') {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(256, 40);
      ctx.lineTo(256, 472);
      ctx.moveTo(40, 256);
      ctx.lineTo(472, 256);
      ctx.stroke();
    }

    // Debossed Imprint Text
    if (text) {
      ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow deboss
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillText(text, 257, 259);

      // Light deboss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText(text, 255, 253);

      // Main Text
      ctx.fillStyle = textColor;
      ctx.fillText(text, 256, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Rebuild 3D Mesh when parameters change
  const buildPillMesh = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean existing group
    if (pillGroupRef.current) {
      scene.remove(pillGroupRef.current);
      pillGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    const rootGroup = new THREE.Group();
    pillGroupRef.current = rootGroup;

    const topGroup = new THREE.Group();
    const bottomGroup = new THREE.Group();
    const pelletsGroup = new THREE.Group();
    topHalfRef.current = topGroup;
    bottomHalfRef.current = bottomGroup;
    pelletsGroupRef.current = pelletsGroup;

    rootGroup.add(topGroup);
    rootGroup.add(bottomGroup);
    rootGroup.add(pelletsGroup);

    const isWire = renderMode === 'wireframe';
    const isXray = renderMode === 'xray';

    // Materials
    const pColor = new THREE.Color(colorPrimary);
    const sColor = new THREE.Color(colorSecondary);

    const getMaterial = (color: THREE.Color, texture?: THREE.Texture | null) => {
      if (isWire) {
        return new THREE.MeshBasicMaterial({
          color: 0x3b82f6,
          wireframe: true
        });
      }
      if (isXray) {
        return new THREE.MeshPhysicalMaterial({
          color: color,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          transmission: 0.85,
          ior: 1.4,
          reflectivity: 0.6,
          depthWrite: false
        });
      }
      // Solid Photorealistic
      return new THREE.MeshPhysicalMaterial({
        color: color,
        map: texture || undefined,
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
        reflectivity: 0.5
      });
    };

    const topTexture = createImprintTexture(imprint, colorPrimary, '#ffffff', score);
    const botTexture = createImprintTexture('', colorSecondary, '#000000', 'None');

    const topMat = getMaterial(pColor, topTexture);
    const botMat = getMaterial(sColor, botTexture);

    if (currentShape === 'Capsule') {
      // 3D Capsule: Two interlocking halves with dome caps
      const radius = 0.65;
      const cylHeight = 0.95;

      // Top Half: Cylinder + Hemisphere dome
      const topCylGeo = new THREE.CylinderGeometry(radius, radius, cylHeight, 36, 1, true);
      const topCyl = new THREE.Mesh(topCylGeo, topMat);
      topCyl.position.y = cylHeight / 2;

      const topDomeGeo = new THREE.SphereGeometry(radius, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
      const topDome = new THREE.Mesh(topDomeGeo, topMat);
      topDome.position.y = cylHeight;

      // Joint ring
      const ringGeo = new THREE.TorusGeometry(radius + 0.02, 0.025, 16, 40);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;

      topGroup.add(topCyl);
      topGroup.add(topDome);
      topGroup.add(ring);

      // Bottom Half: Cylinder + Hemisphere dome (inverted)
      const botCylGeo = new THREE.CylinderGeometry(radius * 0.98, radius * 0.98, cylHeight, 36, 1, true);
      const botCyl = new THREE.Mesh(botCylGeo, botMat);
      botCyl.position.y = -cylHeight / 2;

      const botDomeGeo = new THREE.SphereGeometry(radius * 0.98, 36, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const botDome = new THREE.Mesh(botDomeGeo, botMat);
      botDome.position.y = -cylHeight;

      bottomGroup.add(botCyl);
      bottomGroup.add(botDome);

      // Micro-pellets inside for X-Ray or Exploded view
      if (isXray || explosionAmount > 0) {
        const pelletCount = 45;
        const pelletColors = [0x3b82f6, 0xef4444, 0xf59e0b, 0x10b981, 0xffffff];
        const pelletGeo = new THREE.SphereGeometry(0.065, 8, 8);

        for (let i = 0; i < pelletCount; i++) {
          const mat = new THREE.MeshStandardMaterial({
            color: pelletColors[i % pelletColors.length],
            roughness: 0.3
          });
          const pellet = new THREE.Mesh(pelletGeo, mat);
          const r = Math.random() * (radius * 0.7);
          const theta = Math.random() * Math.PI * 2;
          const y = (Math.random() - 0.5) * (cylHeight * 1.5);

          pellet.position.set(r * Math.cos(theta), y, r * Math.sin(theta));
          pelletsGroup.add(pellet);
        }
      }

      rootGroup.rotation.z = Math.PI / 4; // Tilted aesthetic

    } else if (currentShape === 'Round') {
      // 3D Round Tablet with beveled/chamfered edges
      const radius = 1.05;
      const tabletHeight = 0.45;

      const topCylGeo = new THREE.CylinderGeometry(radius, radius, tabletHeight / 2, 48);
      const topCyl = new THREE.Mesh(topCylGeo, topMat);
      topCyl.position.y = tabletHeight / 4;
      topGroup.add(topCyl);

      const botCylGeo = new THREE.CylinderGeometry(radius, radius, tabletHeight / 2, 48);
      const botCyl = new THREE.Mesh(botCylGeo, botMat);
      botCyl.position.y = -tabletHeight / 4;
      bottomGroup.add(botCyl);

      // Chamfer Torus Bevels
      const bevelGeo = new THREE.TorusGeometry(radius, 0.08, 16, 48);
      const bevelMat = topMat;
      const topBevel = new THREE.Mesh(bevelGeo, bevelMat);
      topBevel.rotation.x = Math.PI / 2;
      topBevel.position.y = tabletHeight / 2;
      topGroup.add(topBevel);

      const botBevel = new THREE.Mesh(bevelGeo, botMat);
      botBevel.rotation.x = Math.PI / 2;
      botBevel.position.y = -tabletHeight / 2;
      bottomGroup.add(botBevel);

      rootGroup.rotation.x = Math.PI / 6;

    } else if (currentShape === 'Oval') {
      // 3D Oval Caplet
      const geo = new THREE.SphereGeometry(0.9, 36, 24);
      geo.scale(1.4, 0.55, 0.85);

      const meshTop = new THREE.Mesh(geo, topMat);
      topGroup.add(meshTop);

      rootGroup.rotation.z = Math.PI / 6;
      rootGroup.rotation.x = Math.PI / 6;

    } else if (currentShape === 'Oblong') {
      // 3D Oblong Rounded Capsule-Caplet
      const radius = 0.6;
      const length = 1.4;
      
      const cylGeo = new THREE.CylinderGeometry(radius, radius, length, 32);
      cylGeo.scale(1, 1, 0.7); // Flattened oblong

      const topDomeGeo = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      topDomeGeo.scale(1, 1, 0.7);

      const botDomeGeo = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      botDomeGeo.scale(1, 1, 0.7);

      const topCyl = new THREE.Mesh(cylGeo, topMat);
      const topDome = new THREE.Mesh(topDomeGeo, topMat);
      topDome.position.y = length / 2;

      topGroup.add(topCyl);
      topGroup.add(topDome);

      const botDome = new THREE.Mesh(botDomeGeo, botMat);
      botDome.position.y = -length / 2;
      bottomGroup.add(botDome);

      rootGroup.rotation.z = Math.PI / 4;
    }

    scene.add(rootGroup);
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 300;
    const computedHeight = typeof height === 'number' ? height : 320;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / computedHeight, 0.1, 100);
    camera.position.set(0, 0, zoomLevelRef.current);
    cameraRef.current = camera;

    // Renderer with high pixel ratio and transparency
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, computedHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, lightIntensity);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);
    dirLightRef.current = dirLight1;

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.8); // soft blue rim light
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x60a5fa, 0.6, 10);
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // Initial Mesh Build
    buildPillMesh();

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth rotation interpolation
      if (!isDraggingRef.current) {
        if (isAutoRotating) {
          targetRotationRef.current.y += delta * rotationSpeed;
          targetRotationRef.current.x = 0.25 + Math.sin(clock.getElapsedTime() * 0.8) * 0.15;
        }
      }

      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;

      if (pillGroupRef.current) {
        pillGroupRef.current.rotation.x = currentRotationRef.current.x;
        pillGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Explode animation translation
      if (topHalfRef.current && bottomHalfRef.current) {
        const explOffset = (renderMode === 'exploded' ? 0.85 : 0) + explosionAmount * 1.5;
        topHalfRef.current.position.y = THREE.MathUtils.lerp(topHalfRef.current.position.y, explOffset, 0.1);
        bottomHalfRef.current.position.y = THREE.MathUtils.lerp(bottomHalfRef.current.position.y, -explOffset, 0.1);
      }

      // Animated Pellets floating if X-Ray or Exploded
      if (pelletsGroupRef.current && pelletsGroupRef.current.children.length > 0) {
        pelletsGroupRef.current.children.forEach((p, idx) => {
          p.position.y += Math.sin(clock.getElapsedTime() * 2 + idx) * 0.002;
          p.rotation.x += 0.02;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = typeof height === 'number' ? height : container.clientHeight || 320;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [currentShape, renderMode, colorPrimary, colorSecondary, imprint, score, height]);

  // Handle Drag Interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    soundFx.click();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.012;
    targetRotationRef.current.x += deltaY * 0.012;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Reset 3D View
  const handleResetView = () => {
    soundFx.pillFlip();
    targetRotationRef.current = { x: 0.3, y: 0.6 };
    zoomLevelRef.current = 4.2;
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 4.2);
    }
  };

  const handleToggleAutoRotate = () => {
    soundFx.click();
    setIsAutoRotating(!isAutoRotating);
  };

  const handleModeChange = (mode: RenderMode3D) => {
    soundFx.pillFlip();
    setRenderMode(mode);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden select-none bg-gradient-to-b from-slate-900/5 via-slate-900/[0.02] to-transparent border border-slate-200/80 ${className}`}
      style={{ height }}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating 3D HUD Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          <span>3D WebGL Model: {currentShape}</span>
        </div>
        <div className="text-[10px] font-bold text-slate-500 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200">
          Drag to rotate 360°
        </div>
      </div>

      {/* Interactive Quick Controls Toolbar */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Render Mode Pills */}
          <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm">
            {(['solid', 'wireframe', 'xray', 'exploded'] as RenderMode3D[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  renderMode === mode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {mode === 'xray' ? 'X-Ray Core' : mode}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleAutoRotate}
              title={isAutoRotating ? 'Pause auto-spin' : 'Start auto-spin'}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isAutoRotating
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleResetView}
              title="Reset 3D Camera"
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowOptionsBar(!showOptionsBar)}
              title="Customize 3D parameters"
              className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                showOptionsBar 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Expanded 3D Customizer Drawer */}
      {showOptionsBar && (
        <div className="absolute top-12 right-3 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-900">3D Morphology Engine</span>
            <span className="text-[10px] font-mono text-blue-600 font-bold">Studio v3.4</span>
          </div>

          {/* Shape Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Geometry</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Capsule', 'Round', 'Oval', 'Oblong'] as PillShape3D[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    soundFx.click();
                    setCurrentShape(s);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    currentShape === s
                      ? 'bg-blue-50 border border-blue-300 text-blue-700'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Explode / Separation slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Capsule Separation</span>
              <span className="font-mono">{Math.round(explosionAmount * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explosionAmount}
              onChange={(e) => setExplosionAmount(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Studio Light Intensity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Studio Key Light</span>
              <span className="font-mono">{lightIntensity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={lightIntensity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setLightIntensity(val);
                if (dirLightRef.current) dirLightRef.current.intensity = val;
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};
