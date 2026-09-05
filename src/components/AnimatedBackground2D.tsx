/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface AnimatedBackground2DProps {
  activeTab: string;
}

export const AnimatedBackground2D: React.FC<AnimatedBackground2DProps> = ({ activeTab }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let time = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ==========================================
    // TAB-SPECIFIC PARTICLES & STATE
    // ==========================================

    // 1. HOME: Telemetry nodes & connecting grid
    const homeNodes = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2
    }));

    // 2. PATIENTS: ECG Heartbeat Wave Generators
    let ecgX = 0;
    const ecgHistory: { x: number; y: number; alpha: number }[] = [];

    // 3. DIRECTORY: Chemical Hexagons & Floating Molecular Bonds
    const chemRings = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 24 + 16,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      label: ['C₁₆H₁₉N₃O₅S', 'C₁₃H₁₈O₂', 'C₃₃H₃₅FN₂O₅', 'C₂₁H₃₁N₃O₅', 'C₄H₁₁N₅', 'C₂₅H₂₅N₅O₄', 'C₂₅H₂₉I₂NO₃'][Math.floor(Math.random() * 7)]
    }));

    // 4. INTERACTIONS: Dual Colliding Enzyme Rings & Vectors
    const interactBeams = Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.004,
      distance: 80 + Math.random() * 140,
      color: i % 2 === 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.35)'
    }));

    // 5. SCANNER: LiDAR Reticles & Vertical Diagnostic Scan Line
    let scanY = 0;
    let scanDir = 1;

    // 6. CABINET: Floating 2D Capsule Pills
    const cabinetPills = Array.from({ length: 16 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.3 - Math.random() * 0.3, // slow upward float
      width: 28 + Math.random() * 12,
      height: 12 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      color1: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
      color2: '#f8fafc'
    }));

    // ==========================================
    // RENDER LOOP
    // ==========================================
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Subtle ambient background wash
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.fillRect(0, 0, width, height);

      if (activeTab === 'home') {
        // Render Telemetry Grid & Orbital Pulsing Waves
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Connecting nodes
        homeNodes.forEach((node, i) => {
          node.x += node.vx;
          node.y += node.vy;
          node.pulse += 0.03;

          if (node.x < 0) node.x = width;
          if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          if (node.y > height) node.y = 0;

          // Connect nearby nodes
          for (let j = i + 1; j < homeNodes.length; j++) {
            const other = homeNodes[j];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.18;
              ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }

          // Draw node
          const glow = Math.sin(node.pulse) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(59, 130, 246, ${0.25 + glow * 0.35})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + glow * 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Pulsing radar center near top
        const radarX = width * 0.82;
        const radarY = height * 0.22;
        for (let r = 1; r <= 3; r++) {
          const ringRad = ((time * 30 + r * 45) % 150) + 10;
          const ringAlpha = Math.max(0, 1 - ringRad / 150) * 0.15;
          ctx.strokeStyle = `rgba(37, 99, 235, ${ringAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(radarX, radarY, ringRad, 0, Math.PI * 2);
          ctx.stroke();
        }

      } else if (activeTab === 'patients') {
        // PATIENTS: Continuous Multi-Channel ECG Tracings & Ward Nodes
        const baseY1 = height * 0.35;
        const baseY2 = height * 0.72;

        // Draw background ECG subtle grid
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Draw animated ECG sine wave with P-Q-R-S-T spikes
        const drawLeadWave = (baseY: number, color: string, speedMult: number, offsetTime: number) => {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;

          for (let x = 0; x < width; x += 3) {
            const phase = ((x * 0.015 - (time * 1.8 * speedMult) + offsetTime) % 10);
            let yOffset = 0;

            if (phase > 0 && phase < 0.8) {
              // P wave
              yOffset = -Math.sin(phase * Math.PI / 0.8) * 6;
            } else if (phase >= 1.0 && phase < 1.2) {
              // Q wave
              yOffset = 5;
            } else if (phase >= 1.2 && phase < 1.5) {
              // R wave spike
              yOffset = -42 * Math.sin((phase - 1.2) * Math.PI / 0.3);
            } else if (phase >= 1.5 && phase < 1.8) {
              // S wave
              yOffset = 12 * Math.sin((phase - 1.5) * Math.PI / 0.3);
            } else if (phase >= 2.3 && phase < 3.2) {
              // T wave
              yOffset = -10 * Math.sin((phase - 2.3) * Math.PI / 0.9);
            }

            const y = baseY + yOffset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        };

        drawLeadWave(baseY1, 'rgba(16, 185, 129, 0.32)', 1.0, 0);
        drawLeadWave(baseY2, 'rgba(6, 182, 212, 0.28)', 0.85, 2.5);

        // Ward Pulse Rings
        const pingX = (time * 90) % width;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.beginPath();
        ctx.arc(pingX, baseY1, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.beginPath();
        ctx.arc(pingX, baseY1, 12, 0, Math.PI * 2);
        ctx.stroke();

      } else if (activeTab === 'directory') {
        // DIRECTORY: Floating Benzene Hexagons & Chemical Lattice
        chemRings.forEach((ring) => {
          ring.x += ring.vx;
          ring.y += ring.vy;
          ring.rotation += ring.rotSpeed;

          if (ring.x < -50) ring.x = width + 50;
          if (ring.x > width + 50) ring.x = -50;
          if (ring.y < -50) ring.y = height + 50;
          if (ring.y > height + 50) ring.y = -50;

          // Draw Benzene Hexagon
          ctx.save();
          ctx.translate(ring.x, ring.y);
          ctx.rotate(ring.rotation);

          ctx.strokeStyle = 'rgba(59, 130, 246, 0.22)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = Math.cos(angle) * ring.size;
            const hy = Math.sin(angle) * ring.size;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner resonance circle
          ctx.beginPath();
          ctx.arc(0, 0, ring.size * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
          ctx.stroke();

          // Chemical formula label
          ctx.font = '10px monospace';
          ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
          ctx.textAlign = 'center';
          ctx.fillText(ring.label, 0, ring.size + 14);

          ctx.restore();
        });

      } else if (activeTab === 'interactions') {
        // INTERACTIONS: Enzyme Receptor Active Site Collision Waves & Radar
        const cx = width * 0.5;
        const cy = height * 0.45;

        // Concentric receptor circles
        for (let r = 1; r <= 4; r++) {
          const radius = r * 80 + Math.sin(time * 2 + r) * 6;
          ctx.strokeStyle = r % 2 === 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Sweeping radar beam
        const sweepAngle = time * 1.2;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * 360, cy + Math.sin(sweepAngle) * 360);
        ctx.stroke();

        // Orbiting enzyme binding nodes
        interactBeams.forEach((beam) => {
          beam.angle += beam.speed;
          const bx = cx + Math.cos(beam.angle) * beam.distance;
          const by = cy + Math.sin(beam.angle) * beam.distance;

          ctx.fillStyle = beam.color;
          ctx.beginPath();
          ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = beam.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(bx, by);
          ctx.stroke();
        });

      } else if (activeTab === 'scanner') {
        // SCANNER: LiDAR Crosshairs, Concentric Diagnostic Reticles & Laser Sweep Line
        scanY += scanDir * 2.2;
        if (scanY > height) scanDir = -1;
        if (scanY < 0) scanDir = 1;

        // Glowing horizontal scan beam
        const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0)');
        grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 30, width, 60);

        ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();

        // Targeting Reticles in corners
        const reticleRadius = 40;
        const drawReticle = (rx: number, ry: number) => {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.28)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(rx, ry, reticleRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(rx - reticleRadius - 10, ry);
          ctx.lineTo(rx + reticleRadius + 10, ry);
          ctx.moveTo(rx, ry - reticleRadius - 10);
          ctx.lineTo(rx, ry + reticleRadius + 10);
          ctx.stroke();
        };

        drawReticle(width * 0.15, height * 0.25);
        drawReticle(width * 0.85, height * 0.7);

      } else if (activeTab === 'cabinet') {
        // CABINET: Floating 2D Capsule Pills & Adherence Stream
        cabinetPills.forEach((pill) => {
          pill.x += pill.vx;
          pill.y += pill.vy;
          pill.rotation += pill.rotSpeed;

          if (pill.y < -40) {
            pill.y = height + 40;
            pill.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(pill.x, pill.y);
          ctx.rotate(pill.rotation);

          // Left half capsule
          ctx.fillStyle = pill.color1;
          ctx.globalAlpha = 0.28;
          ctx.beginPath();
          ctx.arc(-pill.width * 0.25, 0, pill.height, Math.PI * 0.5, Math.PI * 1.5);
          ctx.lineTo(0, -pill.height);
          ctx.lineTo(0, pill.height);
          ctx.closePath();
          ctx.fill();

          // Right half capsule
          ctx.fillStyle = pill.color2;
          ctx.beginPath();
          ctx.arc(pill.width * 0.25, 0, pill.height, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.lineTo(0, pill.height);
          ctx.lineTo(0, -pill.height);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
          ctx.globalAlpha = 1.0;
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeTab]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.88 }}
    />
  );
};
