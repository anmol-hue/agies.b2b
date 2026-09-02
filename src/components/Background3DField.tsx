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
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false, // optimize for background
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));

    // Particle Cloud
    const count = 60;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds: { x: number; y: number }[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      speeds.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 1.8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Subtle line connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.08
    });

    const maxLines = 120;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    scene.add(lines);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 15;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const posArr = geometry.attributes.position.array as Float32Array;
      const linePosArr = lineGeo.attributes.position.array as Float32Array;
      let lineIdx = 0;

      for (let i = 0; i < count; i++) {
        posArr[i * 3] += speeds[i].x;
        posArr[i * 3 + 1] += speeds[i].y;

        if (Math.abs(posArr[i * 3]) > 80) speeds[i].x *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 60) speeds[i].y *= -1;

        if (lineIdx < maxLines * 6 - 6) {
          for (let j = i + 1; j < count; j++) {
            const dx = posArr[i * 3] - posArr[j * 3];
            const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
            const distSq = dx * dx + dy * dy;
            if (distSq < 320 && lineIdx < maxLines * 6 - 6) {
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

      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

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
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
