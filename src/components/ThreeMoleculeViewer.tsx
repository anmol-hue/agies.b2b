/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Sparkles, 
  Atom, 
  Activity, 
  Maximize2, 
  Minimize2, 
  Info,
  RefreshCw
} from 'lucide-react';
import { soundFx } from '../lib/soundFx';

// Atom coordinates data for clinical molecules
interface AtomData {
  element: 'C' | 'H' | 'O' | 'N' | 'S' | 'Cl' | 'F';
  pos: [number, number, number];
  name: string;
}

interface BondData {
  from: number;
  to: number;
  order?: 1 | 2;
}

interface MoleculeStructure {
  name: string;
  formula: string;
  weight: string;
  atoms: AtomData[];
  bonds: BondData[];
}

const ELEMENT_COLORS: Record<string, number> = {
  C: 0x334155, // Carbon (dark slate)
  H: 0xf8fafc, // Hydrogen (white)
  O: 0xef4444, // Oxygen (red)
  N: 0x3b82f6, // Nitrogen (blue)
  S: 0xf59e0b, // Sulfur (yellow/amber)
  Cl: 0x10b981, // Chlorine (green)
  F: 0x8b5cf6  // Fluorine (purple)
};

const ELEMENT_RADII: Record<string, number> = {
  C: 0.35,
  H: 0.22,
  O: 0.32,
  N: 0.34,
  S: 0.42,
  Cl: 0.40,
  F: 0.30
};

// Preset clinical molecule coordinates
const MOLECULE_PRESETS: Record<string, MoleculeStructure> = {
  amoxicillin: {
    name: "Amoxicillin",
    formula: "C₁₆H₁₉N₃O₅S",
    weight: "365.4 g/mol",
    atoms: [
      { element: 'S', pos: [0, 0.8, 0], name: 'Sulfur S1' },
      { element: 'C', pos: [1.1, 0.4, 0.3], name: 'Carbon C2' },
      { element: 'C', pos: [0.9, -0.9, 0.1], name: 'Carbon C3' },
      { element: 'N', pos: [-0.4, -0.8, 0.2], name: 'Nitrogen N4' },
      { element: 'C', pos: [-1.2, 0.3, -0.1], name: 'Carbon C5' },
      { element: 'C', pos: [-1.0, -1.9, 0], name: 'Carbon C6' },
      { element: 'O', pos: [-0.5, -2.9, 0.4], name: 'Carbonyl Oxygen O7' },
      { element: 'O', pos: [-2.2, -1.7, -0.4], name: 'Hydroxyl Oxygen O8' },
      { element: 'N', pos: [2.1, -1.4, 0], name: 'Amino Nitrogen N9' },
      { element: 'C', pos: [2.8, -0.4, 0.4], name: 'Carbon C10' },
      { element: 'O', pos: [3.9, -0.6, 0.7], name: 'Oxygen O11' },
      { element: 'C', pos: [2.4, 1.0, 0.2], name: 'Carbon C12' },
      { element: 'C', pos: [3.3, 2.0, 0.5], name: 'Phenyl C13' },
      { element: 'C', pos: [2.9, 3.3, 0.3], name: 'Phenyl C14' },
      { element: 'O', pos: [3.7, 4.3, 0.6], name: 'Phenolic OH' },
      { element: 'C', pos: [1.6, 3.6, -0.2], name: 'Phenyl C16' },
      { element: 'C', pos: [0.7, 2.6, -0.4], name: 'Phenyl C17' },
      { element: 'C', pos: [1.1, 1.3, -0.2], name: 'Phenyl C18' },
      { element: 'H', pos: [-1.8, 0.6, 0.7], name: 'Hydrogen' },
      { element: 'H', pos: [1.7, 0.6, 1.1], name: 'Hydrogen' }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 0 },
      { from: 3, to: 5 },
      { from: 5, to: 6, order: 2 },
      { from: 5, to: 7 },
      { from: 2, to: 8 },
      { from: 8, to: 9 },
      { from: 9, to: 10, order: 2 },
      { from: 9, to: 11 },
      { from: 11, to: 12 },
      { from: 12, to: 13, order: 2 },
      { from: 13, to: 14 },
      { from: 13, to: 15 },
      { from: 15, to: 16, order: 2 },
      { from: 16, to: 17 },
      { from: 17, to: 11, order: 2 },
      { from: 4, to: 18 },
      { from: 1, to: 19 }
    ]
  },
  ibuprofen: {
    name: "Ibuprofen",
    formula: "C₁₃H₁₈O₂",
    weight: "206.29 g/mol",
    atoms: [
      { element: 'C', pos: [-2.8, -0.4, 0], name: 'Isobutyl C1' },
      { element: 'C', pos: [-2.2, 0.9, 0.5], name: 'Isobutyl C2' },
      { element: 'C', pos: [-2.5, -1.5, -0.9], name: 'Methyl C3' },
      { element: 'C', pos: [-1.2, 0.8, -0.6], name: 'Methylene C4' },
      { element: 'C', pos: [0.1, 0.2, -0.2], name: 'Phenyl C5' },
      { element: 'C', pos: [0.5, -1.1, 0.2], name: 'Phenyl C6' },
      { element: 'C', pos: [1.8, -1.4, 0.4], name: 'Phenyl C7' },
      { element: 'C', pos: [2.7, -0.4, 0.1], name: 'Phenyl C8' },
      { element: 'C', pos: [2.3, 0.9, -0.4], name: 'Phenyl C9' },
      { element: 'C', pos: [1.0, 1.2, -0.5], name: 'Phenyl C10' },
      { element: 'C', pos: [4.1, -0.8, 0.4], name: 'Propionate C11' },
      { element: 'C', pos: [4.5, -2.1, -0.3], name: 'Methyl C12' },
      { element: 'C', pos: [5.1, 0.2, 0.1], name: 'Carboxyl C13' },
      { element: 'O', pos: [5.0, 1.3, -0.4], name: 'Carbonyl O14' },
      { element: 'O', pos: [6.3, -0.2, 0.5], name: 'Hydroxyl O15' }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5, order: 2 },
      { from: 5, to: 6 },
      { from: 6, to: 7, order: 2 },
      { from: 7, to: 8 },
      { from: 8, to: 9, order: 2 },
      { from: 9, to: 4 },
      { from: 7, to: 10 },
      { from: 10, to: 11 },
      { from: 10, to: 12 },
      { from: 12, to: 13, order: 2 },
      { from: 12, to: 14 }
    ]
  },
  warfarin: {
    name: "Warfarin",
    formula: "C₁₉H₁₆O₄",
    weight: "308.33 g/mol",
    atoms: [
      { element: 'O', pos: [-1.8, 1.2, 0], name: 'Lactone O' },
      { element: 'C', pos: [-1.4, 0, 0], name: 'Coumarin C2' },
      { element: 'O', pos: [-2.1, -0.9, 0], name: 'Carbonyl O' },
      { element: 'C', pos: [-0.05, -0.1, 0], name: 'Coumarin C3' },
      { element: 'C', pos: [0.8, 1.0, 0], name: 'Coumarin C4' },
      { element: 'O', pos: [0.4, 2.2, 0], name: '4-Hydroxy O' },
      { element: 'C', pos: [-0.7, 2.2, 0], name: 'Coumarin C9' },
      { element: 'C', pos: [0.5, -1.4, 0.2], name: 'Chiral C' },
      { element: 'C', pos: [1.8, -1.5, -0.6], name: 'Phenyl C' },
      { element: 'C', pos: [0.7, -1.8, 1.6], name: 'Acetonyl C' },
      { element: 'C', pos: [1.9, -2.6, 1.9], name: 'Carbonyl C' },
      { element: 'O', pos: [2.8, -2.6, 1.1], name: 'Ketone O' },
      { element: 'C', pos: [2.0, -3.4, 3.2], name: 'Methyl C' }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2, order: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4, order: 2 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 6, to: 0 },
      { from: 3, to: 7 },
      { from: 7, to: 8 },
      { from: 7, to: 9 },
      { from: 9, to: 10 },
      { from: 10, to: 11, order: 2 },
      { from: 10, to: 12 }
    ]
  },
  atorvastatin: {
    name: "Atorvastatin",
    formula: "C₃₃H₃₅FN₂O₅",
    weight: "558.64 g/mol",
    atoms: [
      { element: 'N', pos: [0, 0, 0], name: 'Pyrrole N' },
      { element: 'C', pos: [1.2, 0.6, 0], name: 'Pyrrole C2' },
      { element: 'C', pos: [0.8, 1.9, 0], name: 'Pyrrole C3' },
      { element: 'C', pos: [-0.6, 1.9, 0], name: 'Pyrrole C4' },
      { element: 'C', pos: [-1.0, 0.6, 0], name: 'Pyrrole C5' },
      { element: 'F', pos: [3.4, 1.0, 0.4], name: 'Fluorine' },
      { element: 'C', pos: [2.5, 0.1, 0.2], name: 'Phenyl C' },
      { element: 'C', pos: [-2.3, 0.2, -0.1], name: 'Isopropyl C' },
      { element: 'C', pos: [0, -1.4, 0], name: 'Heptanoic Chain' },
      { element: 'O', pos: [0.8, -2.4, 0.5], name: '3-OH' },
      { element: 'O', pos: [-0.8, -3.5, -0.5], name: '5-OH' },
      { element: 'O', pos: [0.5, -4.8, 0], name: 'Carboxylate O' }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2, order: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, order: 2 },
      { from: 4, to: 0 },
      { from: 1, to: 6 },
      { from: 6, to: 5 },
      { from: 4, to: 7 },
      { from: 0, to: 8 },
      { from: 8, to: 9 },
      { from: 8, to: 10 },
      { from: 10, to: 11 }
    ]
  }
};

interface ThreeMoleculeViewerProps {
  medicineId?: string;
  medicineName?: string;
  height?: number;
  autoRotate?: boolean;
  className?: string;
}

export const ThreeMoleculeViewer: React.FC<ThreeMoleculeViewerProps> = ({
  medicineId = 'amoxicillin',
  medicineName = 'Amoxicillin',
  height = 280,
  autoRotate = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hoveredAtom, setHoveredAtom] = useState<AtomData | null>(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [activePresetKey, setActivePresetKey] = useState<string>(
    MOLECULE_PRESETS[medicineId.toLowerCase()] ? medicineId.toLowerCase() : 'amoxicillin'
  );

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const molGroupRef = useRef<THREE.Group | null>(null);
  const atomMeshesRef = useRef<{ mesh: THREE.Mesh; data: AtomData }[]>([]);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotTargetRef = useRef({ x: 0.2, y: 0.4 });
  const curRotRef = useRef({ x: 0.2, y: 0.4 });

  const activeStructure = MOLECULE_PRESETS[activePresetKey] || MOLECULE_PRESETS.amoxicillin;

  const buildMolecularMesh = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (molGroupRef.current) {
      scene.remove(molGroupRef.current);
    }

    const molGroup = new THREE.Group();
    molGroupRef.current = molGroup;
    atomMeshesRef.current = [];

    const structure = MOLECULE_PRESETS[activePresetKey] || MOLECULE_PRESETS.amoxicillin;

    // Calculate centroid to center molecule
    let cx = 0, cy = 0, cz = 0;
    structure.atoms.forEach(a => {
      cx += a.pos[0];
      cy += a.pos[1];
      cz += a.pos[2];
    });
    cx /= structure.atoms.length;
    cy /= structure.atoms.length;
    cz /= structure.atoms.length;

    // 1. Build Atoms (Spheres)
    structure.atoms.forEach((atomData, idx) => {
      const radius = ELEMENT_RADII[atomData.element] || 0.3;
      const color = ELEMENT_COLORS[atomData.element] || 0x64748b;

      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: color,
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      });

      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(
        atomData.pos[0] - cx,
        atomData.pos[1] - cy,
        atomData.pos[2] - cz
      );
      sphere.userData = { atomData, index: idx };

      // Add gentle atom glow aura
      const auraGeo = new THREE.SphereGeometry(radius * 1.3, 16, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.12,
        wireframe: true
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
      sphere.add(aura);

      molGroup.add(sphere);
      atomMeshesRef.current.push({ mesh: sphere, data: atomData });
    });

    // 2. Build Bonds (Cylinders)
    structure.bonds.forEach((bond) => {
      const a1 = structure.atoms[bond.from];
      const a2 = structure.atoms[bond.to];
      if (!a1 || !a2) return;

      const p1 = new THREE.Vector3(a1.pos[0] - cx, a1.pos[1] - cy, a1.pos[2] - cz);
      const p2 = new THREE.Vector3(a2.pos[0] - cx, a2.pos[1] - cy, a2.pos[2] - cz);

      const distance = p1.distanceTo(p2);
      const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

      const bondGeo = new THREE.CylinderGeometry(0.08, 0.08, distance, 16);
      const bondMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.4
      });

      const cylinder = new THREE.Mesh(bondGeo, bondMat);
      cylinder.position.copy(midPoint);

      // Orient cylinder between points
      const orientation = new THREE.Matrix4();
      const offsetTarget = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      orientation.lookAt(p1, p2, up);

      cylinder.quaternion.setFromUnitVectors(up, offsetTarget);
      molGroup.add(cylinder);

      // If double bond, add parallel bond
      if (bond.order === 2) {
        const doubleCyl = new THREE.Mesh(bondGeo, bondMat);
        doubleCyl.position.copy(midPoint);
        doubleCyl.quaternion.setFromUnitVectors(up, offsetTarget);
        doubleCyl.scale.set(0.6, 1, 0.6);
        doubleCyl.position.x += 0.12;
        molGroup.add(doubleCyl);
      }
    });

    scene.add(molGroup);
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 300;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(6, 6, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 0.8);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    buildMolecularMesh();

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!isDraggingRef.current && isRotating) {
        rotTargetRef.current.y += delta * 0.8;
        rotTargetRef.current.x = Math.sin(elapsed * 0.6) * 0.2;
      }

      curRotRef.current.x += (rotTargetRef.current.x - curRotRef.current.x) * 0.1;
      curRotRef.current.y += (rotTargetRef.current.y - curRotRef.current.y) * 0.1;

      if (molGroupRef.current) {
        molGroupRef.current.rotation.x = curRotRef.current.x;
        molGroupRef.current.rotation.y = curRotRef.current.y;

        // Subtle thermal vibration effect
        molGroupRef.current.position.y = Math.sin(elapsed * 2) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activePresetKey, height]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - prevMouseRef.current.x;
    const dy = e.clientY - prevMouseRef.current.y;

    rotTargetRef.current.y += dx * 0.015;
    rotTargetRef.current.x += dy * 0.015;

    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 text-white ${className}`}
      style={{ height }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Molecule Header Info Overlay */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-mono font-extrabold text-blue-400">
            {activeStructure.formula}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {activeStructure.weight}
          </span>
        </div>
        <div className="text-sm font-extrabold text-white">
          {activeStructure.name} 3D Lattice
        </div>
      </div>

      {/* Preset Selector Top Right */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {Object.keys(MOLECULE_PRESETS).map((key) => (
          <button
            key={key}
            onClick={() => {
              soundFx.click();
              setActivePresetKey(key);
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activePresetKey === key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {key.slice(0, 4)}
          </button>
        ))}
      </div>

      {/* Element Legend Bottom */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
            <span>C</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>O</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>N</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>S</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Cl</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundFx.click();
            setIsRotating(!isRotating);
          }}
          className="pointer-events-auto p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Toggle rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
