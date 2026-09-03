/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3DField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 110;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Ambient and Point lights for floating 3D objects
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 3, 200);
    blueLight.position.set(50, 40, 60);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2, 200);
    cyanLight.position.set(-60, -30, 40);
    scene.add(cyanLight);

    // 1. Drifting 3D Wireframe Molecular Polyhedra
    const polyhedraGroup = new THREE.Group();
    scene.add(polyhedraGroup);

    const polyhedraList: {
      mesh: THREE.Mesh | THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      origY: number;
      speedY: number;
      floatPhase: number;
    }[] = [];

    // Create 4 delicate drifting 3D structures
    const shapes = [
      { geo: new THREE.IcosahedronGeometry(7, 1), x: -65, y: 30, z: -20, color: 0x3b82f6 },
      { geo: new THREE.OctahedronGeometry(6, 1), x: 70, y: -25, z: -30, color: 0x0ea5e9 },
      { geo: new THREE.TorusGeometry(8, 0.25, 16, 64), x: 55, y: 45, z: -40, color: 0x6366f1 },
      { geo: new THREE.DodecahedronGeometry(5, 0), x: -50, y: -40, z: -25, color: 0x10b981 }
    ];

    shapes.forEach((s, idx) => {
      const g = new THREE.Group();
      g.position.set(s.x, s.y, s.z);

      const wireGeo = new THREE.WireframeGeometry(s.geo);
      const wireMat = new THREE.LineBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.22
      });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      g.add(wireMesh);

      // Inner faint glowing node
      const coreGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({
        color: s.color,
        transparent: true,
        opacity: 0.3
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      g.add(core);

      polyhedraGroup.add(g);

      polyhedraList.push({
        mesh: g,
        rotSpeedX: (Math.random() - 0.5) * 0.006,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        rotSpeedZ: (Math.random() - 0.5) * 0.005,
        origY: s.y,
        speedY: 0.003 + Math.random() * 0.002,
        floatPhase: idx * Math.PI * 0.5
      });
    });

    // 2. Interactive Particle Cloud
    const count = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 190;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
      speeds.push({
        x: (Math.random() - 0.5) * 0.06,
        y: (Math.random() - 0.5) * 0.06,
        z: (Math.random() - 0.5) * 0.03
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 2.2,
      transparent: true,
      opacity: 0.4,
      blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Dynamic Synapse/Molecular Line Connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12
    });

    const maxLines = 140;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    scene.add(lines);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 18;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 18;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Animate floating 3D polyhedra
      polyhedraList.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.rotation.z += item.rotSpeedZ;
        item.mesh.position.y = item.origY + Math.sin(elapsed * 0.7 + item.floatPhase) * 4;
      });

      // Animate particles & lines
      const posArr = geometry.attributes.position.array as Float32Array;
      const linePosArr = lineGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;

      for (let i = 0; i < count; i++) {
        posArr[i * 3] += speeds[i].x;
        posArr[i * 3 + 1] += speeds[i].y;
        posArr[i * 3 + 2] += speeds[i].z;

        if (Math.abs(posArr[i * 3]) > 95) speeds[i].x *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 70) speeds[i].y *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 45) speeds[i].z *= -1;

        if (lineIdx < maxLines * 6 - 6) {
          for (let j = i + 1; j < count; j++) {
            const dx = posArr[i * 3] - posArr[j * 3];
            const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
            const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < 380 && lineIdx < maxLines * 6 - 6) {
              linePosArr[lineIdx++] = posArr[i * 3];
              linePosArr[lineIdx++] = posArr[i * 3 + 1];
              linePosArr[lineIdx++] = posArr[i * 3 + 2];
              linePosArr[lineIdx++] = posArr[j * 3];
              linePosArr[lineIdx++] = posArr[j * 3 + 1];
              linePosArr[lineIdx++] = posArr[j * 3 + 2];
            }
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx / 3);
      lineGeo.attributes.position.needsUpdate = true;

      // Parallax camera movement
      camera.position.x = currentMouseX;
      camera.position.y = -currentMouseY;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      // Clean up geometries
      geometry.dispose();
      material.dispose();
      lineGeo.dispose();
      lineMaterial.dispose();
      shapes.forEach(s => s.geo.dispose());

      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75 select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
