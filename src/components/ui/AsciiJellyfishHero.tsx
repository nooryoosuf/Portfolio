"use client";
import { useEffect, useRef } from "react";

/**
 * Procedural 3D / Parametric ASCII Jellyfish for the Homepage Hero section.
 * - Rhythmic propulsion bell contraction + glide cycle
 * - 8 bioluminescent radial bell ribs + ruffled bell rim
 * - Trailing multi-harmonic tentacles & frilly oral arms
 * - Interactive cursor current (tentacles & bell gently react to pointer)
 * - Ambient drifting deep-sea ASCII plankton motes
 * - Pauses automatically when scrolled out of view; respects prefers-reduced-motion
 */
export default function AsciiJellyfishHero() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
        x: 0,
        y: 0,
        active: false,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const section = canvas.parentElement;

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5,
                y: (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5,
                active: true,
            };
        };
        const onLeave = () => {
            pointerRef.current.active = false;
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        if (section) section.addEventListener("mouseleave", onLeave, { passive: true });

        let width = 0;
        let height = 0;
        let cols = 0;
        let rows = 0;
        const cellW = 9.5;
        const cellH = 12.5;

        let intensityBuf = new Float32Array(0);
        let hueBuf = new Uint8Array(0); // 0 = neutral, 1 = razzmatazz, 2 = violet/cyan

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            width = Math.max(1, Math.floor(rect.width));
            height = Math.max(1, Math.floor(rect.height));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(width / cellW);
            rows = Math.ceil(height / cellH);
            intensityBuf = new Float32Array(cols * rows);
            hueBuf = new Uint8Array(cols * rows);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        let visible = true;
        const io = new IntersectionObserver(
            (entries) => {
                visible = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0.02 }
        );
        io.observe(canvas);

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const ramp = " ·.:-=+*#%@";
        const numTentacles = 16;
        const numPlankton = 28;
        const plankton = Array.from({ length: numPlankton }, (_, i) => ({
            x: ((i * 73) % 100) / 100,
            y: ((i * 41) % 100) / 100,
            speed: 0.015 + (i % 5) * 0.006,
            phase: i * 1.3,
        }));

        let rafId = 0;
        const start = performance.now();
        let smoothPtrX = 0;
        let smoothPtrY = 0;

        const putSample = (
            gx: number,
            gy: number,
            val: number,
            hue: number,
            radius = 1.15
        ) => {
            const c0 = Math.max(0, Math.floor(gx - radius));
            const c1 = Math.min(cols - 1, Math.ceil(gx + radius));
            const r0 = Math.max(0, Math.floor(gy - radius));
            const r1 = Math.min(rows - 1, Math.ceil(gy + radius));
            for (let r = r0; r <= r1; r++) {
                for (let c = c0; c <= c1; c++) {
                    const dx = c - gx;
                    const dy = r - gy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d <= radius) {
                        const falloff = (1 - d / radius) * val;
                        const idx = r * cols + c;
                        if (falloff > intensityBuf[idx]) {
                            intensityBuf[idx] = falloff;
                            hueBuf[idx] = hue;
                        }
                    }
                }
            }
        };

        const render = (now: number) => {
            if (!visible && !reduceMotion) {
                rafId = requestAnimationFrame(render);
                return;
            }

            const t = (now - start) * 0.001;
            const isDark = document.documentElement.classList.contains("dark");

            const targetX = pointerRef.current.active ? pointerRef.current.x : 0;
            const targetY = pointerRef.current.active ? pointerRef.current.y : 0;
            smoothPtrX += (targetX - smoothPtrX) * 0.05;
            smoothPtrY += (targetY - smoothPtrY) * 0.05;

            intensityBuf.fill(0);
            hueBuf.fill(0);

            // Jellyfish center in grid coordinates (positioned predominantly on the right half on desktop, centered-right on mobile)
            const isDesktop = width >= 768;
            const baseCx = cols * (isDesktop ? 0.73 : 0.62);
            const baseCy = rows * (isDesktop ? 0.36 : 0.34);

            // Propulsion rhythm: asymmetric contraction + slow recovery glide
            const cycle = t * 1.65;
            const pulseRaw = Math.sin(cycle) + 0.28 * Math.sin(cycle * 2 - 0.6);
            // Bobbing vertical & slight horizontal swim motion
            const swimY = Math.cos(cycle) * 2.1 + smoothPtrY * 3.5;
            const swimX = Math.sin(t * 0.6) * 2.2 + smoothPtrX * 5.0;

            const cx = baseCx + swimX;
            const cy = baseCy + swimY;

            // Slight tilt angle of the jellyfish bell
            const tilt = -0.18 + Math.sin(t * 0.55) * 0.08 + smoothPtrX * 0.16;
            const cosT = Math.cos(tilt);
            const sinT = Math.sin(tilt);

            const scale = Math.min(cols * (isDesktop ? 0.23 : 0.34), rows * 0.28);
            const bellWidth = scale * (1.0 - pulseRaw * 0.15);
            const bellHeight = scale * (0.72 + pulseRaw * 0.12);

            // 1. Sample 3D Parametric Jellyfish Bell (Umbrella + 8 Radial Bioluminescent Ribs + Ruffled Skirt)
            const uSteps = 44; // azimuth around the bell
            const vSteps = 26; // zenith from crown (0) to rim (1)

            for (let iv = 0; iv <= vSteps; iv++) {
                const v = iv / vSteps; // 0 = top of dome, 1 = bottom rim
                const phi = v * Math.PI * 0.54;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                // Ruffled margin at the rim (v near 1)
                const rimFlare = v > 0.78 ? Math.sin((v - 0.78) * 14) * 0.08 : 0;

                for (let iu = 0; iu < uSteps; iu++) {
                    const theta = (iu / uSteps) * Math.PI * 2 + t * 0.32;
                    const cosTheta = Math.cos(theta);
                    const sinTheta = Math.sin(theta);

                    // 8 radial ribs along the umbrella
                    const ribWave = Math.pow(Math.abs(Math.cos(theta * 4)), 3);
                    const rHoriz = (sinPhi + rimFlare) * (1 + ribWave * 0.07);

                    const lx = rHoriz * cosTheta * bellWidth;
                    const lz = rHoriz * sinTheta * bellWidth; // depth toward viewer
                    const ly = -cosPhi * bellHeight + (v === 1 ? Math.sin(theta * 8 + t * 2) * 0.45 : 0);

                    // Rotate by tilt in 2D screen plane
                    const sx = cx + (lx * cosT - ly * sinT);
                    const sy = cy + (lx * sinT + ly * cosT) * 0.85 + lz * 0.18;

                    // Lighting & Fresnel Rim + Bioluminescent Rib Intensity
                    const depthFactor = (lz / Math.max(1, bellWidth) + 1) * 0.5; // 0 back, 1 front
                    const rimGlow = Math.pow(sinPhi, 1.6) * 0.55;
                    const crownGlow = (1 - v) * 0.35;
                    const ribGlow = ribWave * 0.45;
                    const totalVal = Math.min(
                        1,
                        (0.22 + rimGlow + crownGlow + ribGlow) * (0.45 + 0.55 * depthFactor)
                    );

                    const hue = ribWave > 0.65 || v > 0.86 ? 1 : v < 0.25 ? 2 : 0;
                    putSample(sx, sy, totalVal, hue, 0.95);
                }
            }

            // Inner subumbrella core glow (gonads / manubrium)
            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * Math.PI * 2 + t * 0.5;
                const gx = cx + Math.cos(a) * bellWidth * 0.25;
                const gy = cy - bellHeight * 0.22 + Math.sin(a) * bellHeight * 0.12;
                putSample(gx, gy, 0.92, 1, 1.5);
            }

            // 2. Trailing Tentacles & Frilly Oral Arms
            const tentacleLen = rows * 0.52;
            const segs = 36;

            for (let i = 0; i < numTentacles; i++) {
                const isOralArm = i % 4 === 0;
                const baseAngle = (i / numTentacles) * Math.PI * 2 + t * 0.25;
                const ringR = isOralArm ? bellWidth * 0.36 : bellWidth * 0.82;
                const anchorLX = Math.cos(baseAngle) * ringR;
                const anchorLZ = Math.sin(baseAngle) * ringR;
                const anchorLY = bellHeight * 0.05;

                const depth = (anchorLZ / Math.max(1, bellWidth) + 1) * 0.5;

                for (let s = 0; s <= segs; s++) {
                    const p = s / segs; // 0 at bell rim, 1 at tentacle tip
                    // Travelling wave down the tentacle lagging behind the propulsion pulse
                    const wave1 =
                        Math.sin(p * 6.5 - cycle * 1.3 + i * 0.9) * (p * scale * 0.32);
                    const wave2 =
                        Math.cos(p * 11.0 - t * 2.6 + i * 1.7) * (p * scale * 0.11);
                    const cursorPull = -smoothPtrX * p * p * 7.5;

                    const lx = anchorLX * (1 - p * 0.25) + wave1 + wave2 + cursorPull;
                    const ly = anchorLY + p * tentacleLen * (isOralArm ? 0.78 : 1.0);

                    const sx = cx + (lx * cosT - ly * sinT);
                    const sy = cy + (lx * sinT + ly * cosT) * 0.85 + anchorLZ * 0.15;

                    const fade = (1 - p * 0.78) * (0.42 + 0.58 * depth);
                    const pulseBead =
                        Math.sin(p * 14 - t * 3.5 + i) > 0.65 ? 0.28 : 0;
                    const val = Math.min(1, (isOralArm ? 0.72 : 0.52) * fade + pulseBead);
                    const hue = isOralArm || pulseBead > 0 ? 1 : 0;

                    putSample(sx, sy, val, hue, isOralArm ? 1.15 : 0.78);
                }
            }

            // 3. Ambient Bioluminescent Plankton Motes
            for (let i = 0; i < plankton.length; i++) {
                const pt = plankton[i];
                const py = ((pt.y - t * pt.speed) % 1 + 1) % 1;
                const px =
                    (pt.x + Math.sin(t * 0.6 + pt.phase) * 0.03 + 1) % 1;
                const gx = px * cols;
                const gy = py * rows;
                const twinkle = 0.25 + 0.35 * Math.sin(t * 2.2 + pt.phase);
                if (twinkle > 0.2) {
                    putSample(gx, gy, twinkle, i % 3 === 0 ? 1 : 0, 0.6);
                }
            }

            // 4. Render ASCII Character Matrix to Canvas
            ctx.clearRect(0, 0, width, height);
            ctx.font =
                "600 10.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
            ctx.textBaseline = "top";

            for (let r = 0; r < rows; r++) {
                const y = r * cellH;
                for (let c = 0; c < cols; c++) {
                    const idx = r * cols + c;
                    const val = intensityBuf[idx];
                    if (val < 0.08) continue;

                    const charIdx = Math.min(
                        ramp.length - 1,
                        Math.max(1, Math.floor(val * ramp.length))
                    );
                    const ch = ramp[charIdx];
                    const hue = hueBuf[idx];

                    if (hue === 1 && val > 0.38) {
                        // Bioluminescent Razzmatazz (#F7095E)
                        ctx.fillStyle = "#F7095E";
                        ctx.globalAlpha = isDark
                            ? Math.min(0.92, 0.35 + val * 0.65)
                            : Math.min(0.82, 0.28 + val * 0.58);
                    } else if (hue === 2 && val > 0.35) {
                        // Crown accent
                        ctx.fillStyle = isDark ? "#fb7185" : "#e11d48";
                        ctx.globalAlpha = isDark ? 0.5 + val * 0.4 : 0.4 + val * 0.4;
                    } else {
                        ctx.fillStyle = isDark ? "#e4e4e7" : "#3f3f46";
                        ctx.globalAlpha = isDark
                            ? Math.min(0.62, 0.14 + val * 0.48)
                            : Math.min(0.46, 0.1 + val * 0.36);
                    }

                    ctx.fillText(ch, c * cellW, y);
                }
            }

            ctx.globalAlpha = 1;

            if (!reduceMotion) {
                rafId = requestAnimationFrame(render);
            }
        };

        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            io.disconnect();
            window.removeEventListener("mousemove", onMove);
            if (section) section.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        >
            {/* Subtle ambient glow behind the jellyfish */}
            <div className="absolute right-[8%] top-[14%] h-72 w-72 rounded-full bg-razzmatazz/10 blur-3xl dark:bg-razzmatazz/15" />

            <canvas
                ref={canvasRef}
                className="h-full w-full opacity-90 transition-opacity duration-500"
            />

            {/* Soft readability gradient so left-aligned hero headline stays 100% crisp */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/70 to-transparent md:via-[var(--background)]/45" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent" />
        </div>
    );
}
