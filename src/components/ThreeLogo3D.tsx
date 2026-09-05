/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeLogo3DProps {
  className?: string;
  size?: number;
}

export const ThreeLogo3D: React.FC<ThreeLogo3DProps> = ({ className = '', size = 42 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = size;
    const height = size;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5.2;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all rotating elements
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // 1. Central 3D Medical Core (Faceted Polyhedron with glowing medical cross motif)
    const coreGeo = new THREE.OctahedronGeometry(1.05, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb, // Royal Blue
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    logoGroup.add(coreMesh);

    // Wireframe overlay for molecular tech look
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa, // Sky Blue
      transparent: true,
      opacity: 0.65
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    coreMesh.add(wireMesh);

    // 2. Orbital Ring 1 (Tilted molecular orbit)
    const ring1Geo = new THREE.TorusGeometry(1.8, 0.055, 16, 48);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Cyan
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    logoGroup.add(ring1);

    // Satellite atom on Ring 1
    const sat1Geo = new THREE.SphereGeometry(0.18, 16, 16);
    const sat1Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald Green (Life/Clinical)
      emissive: 0x059669,
      emissiveIntensity: 0.8
    });
    const sat1 = new THREE.Mesh(sat1Geo, sat1Mat);
    sat1.position.x = 1.8;
    ring1.add(sat1);

    // 3. Orbital Ring 2 (Perpendicular cross-orbit)
    const ring2Geo = new THREE.TorusGeometry(1.6, 0.045, 16, 48);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8, // Indigo
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.3
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 4;
    logoGroup.add(ring2);

    // Satellite atom on Ring 2
    const sat2Geo = new THREE.SphereGeometry(0.14, 16, 16);
    const sat2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9
    });
    const sat2 = new THREE.Mesh(sat2Geo, sat2Mat);
    sat2.position.y = 1.6;
    ring2.add(sat2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x93c5fd, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 2.0, 10);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // Interaction Listeners
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      mouseRef.current = { x: 0, y: 0 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Spin speed increases smoothly when hovered
      const targetSpeed = isHoveredRef.current ? 3.5 : 1.0;
      const rotationStep = delta * targetSpeed;

      // Base rotation
      logoGroup.rotation.y += rotationStep * 0.9;
      logoGroup.rotation.x += rotationStep * 0.35;

      // Individual ring counter-rotations
      ring1.rotation.z += delta * 1.5;
      ring2.rotation.z -= delta * 1.8;

      // Pulse core like a gentle heartbeat
      const heartBeat = Math.sin(elapsedTime * 3.5);
      const pulseScale = 1.0 + (heartBeat > 0 ? Math.pow(heartBeat, 3) * 0.08 : 0);
      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Smoothly tilt toward cursor on hover
      if (isHoveredRef.current) {
        logoGroup.rotation.x = THREE.MathUtils.lerp(logoGroup.rotation.x, mouseRef.current.y * 0.8, 0.1);
        logoGroup.rotation.y = THREE.MathUtils.lerp(logoGroup.rotation.y, mouseRef.current.x * 0.8, 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousemove', handleMouseMove);

      // Dispose geometries and materials
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      sat1Geo.dispose();
      sat1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      sat2Geo.dispose();
      sat2Mat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 select-none ${className}`}
      style={{ width: size, height: size }}
      title="tpis.agies 3D Engine"
    />
  );
};
