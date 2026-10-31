/* ==========================================================================
   Zylo Digital - 3D Interactive Fibonacci Particle Sphere & Rainbow Graphics
   ========================================================================== */

(function () {
  'use strict';

  function initOrb() {
    let canvas = document.getElementById('particle-orb-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'particle-orb-canvas';
      canvas.className = 'particle-orb-canvas';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Responsive 3D Sphere radius
    const getRadius = () => {
      const minDim = Math.min(width, height);
      return width > 900 ? minDim * 0.28 : minDim * 0.35;
    };
    let SPHERE_RADIUS = getRadius();
    window.addEventListener('resize', () => {
      SPHERE_RADIUS = getRadius();
    }, { passive: true });

    // 1. Fibonacci Sphere Particles (340 points)
    const NUM_SPHERE = 340;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle ~2.39996323 rad
    const sphereParticles = [];

    for (let i = 0; i < NUM_SPHERE; i++) {
      const y = 1 - (i / (NUM_SPHERE - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      sphereParticles.push({
        x: x,
        y: y,
        z: z,
        baseSize: Math.random() * 2.5 + 1.4,
        hueOffset: (i / NUM_SPHERE) * 120, // Chromatic gradient across orb
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
      });
    }

    // 2. Concentric Gyro / Planetary Orbital Rings (140 particles)
    const ringParticles = [];
    const HALF_RINGS = 70;

    // Ring 1: Inclined at ~32 degrees
    for (let i = 0; i < HALF_RINGS; i++) {
      const angle = (i / HALF_RINGS) * Math.PI * 2;
      ringParticles.push({
        ringId: 1,
        angle: angle,
        rMult: 1.38 + Math.sin(i * 3) * 0.06,
        tiltX: 0.55,
        tiltY: 0.2,
        size: Math.random() * 2.6 + 1.6,
        hueOffset: (i / HALF_RINGS) * 90,
      });
    }

    // Ring 2: Polar inclination at -65 degrees
    for (let i = 0; i < HALF_RINGS; i++) {
      const angle = (i / HALF_RINGS) * Math.PI * 2;
      ringParticles.push({
        ringId: 2,
        angle: angle,
        rMult: 1.68 + Math.cos(i * 2) * 0.08,
        tiltX: -1.15,
        tiltY: 0.45,
        size: Math.random() * 2.2 + 1.3,
        hueOffset: 140 + (i / HALF_RINGS) * 100,
      });
    }

    // 3. Floating Ambient Rainbow Micro-Dust (60 particles)
    const ambientDust = [];
    const NUM_DUST = 60;
    for (let i = 0; i < NUM_DUST; i++) {
      ambientDust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2,
        size: Math.random() * 2.2 + 1.0,
        alpha: Math.random() * 0.5 + 0.2,
        hueOffset: Math.random() * 360,
      });
    }

    // 4. Interactive Mouse Parallax & Physics
    let rotX = 0.2;
    let rotY = 0.35;
    let targetRotX = 0.2;
    let targetRotY = 0.35;
    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const normX = (e.clientX / width - 0.5) * 2;
      const normY = (e.clientY / height - 0.5) * 2;
      targetRotY = normX * 0.95;
      targetRotX = -normY * 0.75;
    }, { passive: true });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const normX = (t.clientX / width - 0.5) * 2;
        const normY = (t.clientY / height - 0.5) * 2;
        targetRotY = normX * 0.95;
        targetRotX = -normY * 0.75;
      }
    }, { passive: true });

    // 5. Scroll-Driven Rainbow Hue Transition
    let currentScrollY = window.scrollY || 0;
    let targetScrollY = window.scrollY || 0;
    let scrollSpeed = 0;
    const baseHue = 84; // Zylo's neon lime default

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY || 0;
    }, { passive: true });

    // 3D Matrix Rotation (Euler Y then X)
    function rotatePoint3D(x, y, z, rx, ry) {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      return { x: x1, y: y2, z: z2 };
    }

    // 6. High-Performance Render Loop (60 FPS)
    let frame = 0;
    const FOV = 680;

    function render() {
      requestAnimationFrame(render);
      frame++;

      // Smooth scroll lerp
      scrollSpeed = (targetScrollY - currentScrollY) * 0.08;
      currentScrollY += scrollSpeed;

      // Full dynamic rainbow hue transition:
      // Neon Lime (84) -> Cyan (180) -> Electric Blue (220) -> Ultraviolet (270) -> Magenta (320) -> Orange (30) -> Gold (50)
      const rainbowHue = (baseHue + currentScrollY * 0.28 + frame * 0.15) % 360;

      // Update CSS variable --rainbow-hue every 3 frames for synchronized border/badge glow
      if (frame % 3 === 0) {
        document.documentElement.style.setProperty('--rainbow-hue', rainbowHue.toFixed(1));
      }

      // Smooth mouse rotation lerping + auto continuous orbital drift
      rotX += (targetRotX - rotX) * 0.045 + 0.001;
      rotY += (targetRotY - rotY) * 0.045 + 0.0035;

      ctx.clearRect(0, 0, width, height);

      // Dynamic Position:
      // In the hero, orb is positioned gracefully on the right/center
      // As user scrolls, it floats smoothly and drifts
      const isDesktop = width > 900;
      const heroX = isDesktop ? width * 0.58 : width * 0.5;
      const heroY = isDesktop ? Math.min(height * 0.46, 440) : height * 0.42;

      const centerX = heroX + Math.sin(frame * 0.008) * 16;
      const centerY = heroY - currentScrollY * 0.22 + Math.cos(frame * 0.01) * 12;

      const scrollProgress = Math.min(1, currentScrollY / 1400);
      const dynamicScale = Math.max(0.65, 1 - scrollProgress * 0.32);

      // A. Draw Luminous Core Nebula Radial Aura
      const auraRadius = SPHERE_RADIUS * 1.65 * dynamicScale;
      const auraGradient = ctx.createRadialGradient(
        centerX, centerY, SPHERE_RADIUS * 0.1 * dynamicScale,
        centerX, centerY, auraRadius
      );
      auraGradient.addColorStop(0, `hsla(${rainbowHue}, 100%, 65%, 0.25)`);
      auraGradient.addColorStop(0.35, `hsla(${(rainbowHue + 45) % 360}, 95%, 55%, 0.12)`);
      auraGradient.addColorStop(0.7, `hsla(${(rainbowHue + 90) % 360}, 90%, 45%, 0.04)`);
      auraGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // B. Project Fibonacci Sphere Particles
      const projectedSphere = [];
      for (let i = 0; i < NUM_SPHERE; i++) {
        const p = sphereParticles[i];
        p.pulsePhase += p.pulseSpeed;
        const breathing = Math.sin(p.pulsePhase) * 6;
        const currentR = SPHERE_RADIUS + breathing;

        const px = p.x * currentR;
        const py = p.y * currentR;
        const pz = p.z * currentR;

        const rot = rotatePoint3D(px, py, pz, rotX, rotY);
        const scale = FOV / (FOV + rot.z);

        projectedSphere.push({
          x2d: centerX + rot.x * scale * dynamicScale,
          y2d: centerY + rot.y * scale * dynamicScale,
          z: rot.z,
          size: p.baseSize * scale * dynamicScale,
          hue: (rainbowHue + p.hueOffset) % 360,
        });
      }

      // C. Project Concentric Gyro / Planetary Orbital Rings
      const projectedRings = [];
      const ringSpeed1 = frame * 0.009;
      const ringSpeed2 = -frame * 0.007;

      for (let i = 0; i < ringParticles.length; i++) {
        const rp = ringParticles[i];
        const curAngle = rp.angle + (rp.ringId === 1 ? ringSpeed1 : ringSpeed2);
        const r = SPHERE_RADIUS * rp.rMult;

        let rx = Math.cos(curAngle) * r;
        let rz = Math.sin(curAngle) * r;
        let ry = 0;

        if (rp.ringId === 1) {
          ry = rz * Math.sin(rp.tiltX);
          rz = rz * Math.cos(rp.tiltX);
        } else {
          ry = rx * Math.sin(rp.tiltX);
          rx = rx * Math.cos(rp.tiltX);
        }

        const rot = rotatePoint3D(rx, ry, rz, rotX, rotY);
        const scale = FOV / (FOV + rot.z);

        projectedRings.push({
          x2d: centerX + rot.x * scale * dynamicScale,
          y2d: centerY + rot.y * scale * dynamicScale,
          z: rot.z,
          size: rp.size * scale * dynamicScale,
          hue: (rainbowHue + rp.hueOffset) % 360,
          isRing: true,
        });
      }

      // Combine & Z-Sort for true depth
      const all3D = [...projectedSphere, ...projectedRings];
      all3D.sort((a, b) => b.z - a.z);

      // D. Draw Constellation / Neural Lines on Front Hemisphere
      ctx.lineWidth = 0.9;
      for (let i = 0; i < projectedSphere.length; i++) {
        const p1 = projectedSphere[i];
        if (p1.z > 30) continue; // Only front particles

        let connections = 0;
        for (let j = i + 1; j < projectedSphere.length; j++) {
          const p2 = projectedSphere[j];
          if (p2.z > 30) continue;

          const dx = p1.x2d - p2.x2d;
          const dy = p1.y2d - p2.y2d;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 52 * dynamicScale && connections < 2) {
            connections++;
            const lineAlpha = (1 - dist / (52 * dynamicScale)) * 0.35;
            ctx.strokeStyle = `hsla(${p1.hue}, 95%, 65%, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
          }
        }
      }

      // E. Render 3D Sphere & Ring Particles with Depth Glow
      for (let i = 0; i < all3D.length; i++) {
        const p = all3D[i];
        const depthNorm = (p.z + SPHERE_RADIUS * 1.7) / (SPHERE_RADIUS * 3.4);
        const alpha = Math.max(0.18, Math.min(0.98, 1 - depthNorm * 0.68));

        // Particle Core
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, Math.max(0.8, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
        ctx.fill();

        // Front-facing particles get a radiant outer aura
        if (p.z < -SPHERE_RADIUS * 0.2) {
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, p.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${alpha * 0.28})`;
          ctx.fill();
        }
      }

      // F. Render Ambient Floating Rainbow Micro-Dust
      for (let i = 0; i < ambientDust.length; i++) {
        const dust = ambientDust[i];
        dust.x += dust.vx;
        dust.y += dust.vy - scrollSpeed * 0.08;

        if (dust.x < 0) dust.x = width;
        if (dust.x > width) dust.x = 0;
        if (dust.y < 0) dust.y = height;
        if (dust.y > height) dust.y = 0;

        const dustHue = (rainbowHue + dust.hueOffset) % 360;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dustHue}, 95%, 72%, ${dust.alpha})`;
        ctx.fill();
      }
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrb);
  } else {
    initOrb();
  }
})();
