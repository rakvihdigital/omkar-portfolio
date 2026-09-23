'use client';

import React, { useEffect, useRef, useState } from 'react';

const FRAMES_TPS = 291;
const PATH_TPS = '/assets/frames-2k/frame_';
const FRAME_EXT = '.webp';
const SKIP_STEP = 2;
const LOAD_TPS = Math.ceil(FRAMES_TPS / SKIP_STEP);

function padFrame(num: number) {
    return String(num).padStart(6, '0');
}

export default function TPSSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const images: HTMLImageElement[] = new Array(LOAD_TPS);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let idx = 0;
        for (let i = 1; i <= FRAMES_TPS; i += SKIP_STEP) {
            const img = new Image();
            img.src = `${PATH_TPS}${padFrame(i)}${FRAME_EXT}`;
            images[idx] = img;
            idx++;
        }


        const drawImageRaw = (img: HTMLImageElement) => {
            if (!ctx || !img || !img.complete || !img.naturalWidth) return;
            const canvasW = canvas.width / (window.devicePixelRatio || 1);
            const canvasH = canvas.height / (window.devicePixelRatio || 1);
            const imgRatio = img.naturalWidth / img.naturalHeight;
            const canvasRatio = canvasW / canvasH;
            let drawW, drawH, drawX, drawY;

            if (canvasRatio > imgRatio) {
                drawW = canvasW;
                drawH = canvasW / imgRatio;
                drawX = 0;
                drawY = (canvasH - drawH) / 2;
            } else {
                drawH = canvasH;
                drawW = canvasH * imgRatio;
                drawX = (canvasW - drawW) / 2;
                drawY = 0;
            }

            ctx.clearRect(0, 0, canvasW, canvasH);
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
        };

        const updateOverlays = (progress: number) => {
            if (!sectionRef.current) return;
            const overlays = sectionRef.current.querySelectorAll('.hero-text-overlay') as NodeListOf<HTMLElement>;
            const numOverlays = 5;
            const slotDur = 1 / numOverlays;
            const fadeDur = slotDur * 0.28;

            overlays.forEach((overlay, i) => {
                const wStart = i * slotDur;
                const wEnd = (i + 1) * slotDur;
                const isFirst = (i === 0);

                let opacity = 0;
                let yOffset = 0;
                let scale = 1;

                if (progress >= wStart && progress <= wEnd) {
                    if (isFirst) {
                        const holdEnd = wStart + slotDur * 0.65;
                        const fadeOutStart = wEnd - fadeDur - (slotDur * 0.05);

                        if (progress <= holdEnd) {
                            opacity = 1;
                            yOffset = 0;
                            scale = 1;
                        } else if (progress <= wEnd) {
                            const fadeProgress = Math.min(1, (progress - fadeOutStart) / fadeDur);
                            opacity = Math.max(0, 1 - fadeProgress);
                            yOffset = -25 * fadeProgress;
                            scale = 1 + 0.02 * fadeProgress;
                        }
                    } else {
                        const fadeInEnd = wStart + fadeDur;
                        const fadeOutStart = wEnd - fadeDur - (slotDur * 0.05);

                        if (progress >= wStart && progress < fadeInEnd) {
                            const fadeProgress = (progress - wStart) / fadeDur;
                            opacity = fadeProgress;
                            yOffset = 25 * (1 - fadeProgress);
                            scale = 0.98 + 0.02 * fadeProgress;
                        } else if (progress >= fadeInEnd && progress < fadeOutStart) {
                            opacity = 1;
                            yOffset = 0;
                            scale = 1;
                        } else if (progress >= fadeOutStart && progress <= wEnd) {
                            const fadeProgress = (progress - fadeOutStart) / fadeDur;
                            opacity = Math.max(0, 1 - fadeProgress);
                            yOffset = -25 * fadeProgress;
                            scale = 1 + 0.02 * fadeProgress;
                        }
                    }
                }
                overlay.style.opacity = opacity.toString();
                overlay.style.transform = `translateY(${yOffset}px) scale(${scale})`;
                overlay.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
            });

            const panel = document.getElementById('tpsSlidePanel');
            if (panel) {
                const start = (numOverlays - 1) * slotDur;
                if (progress >= start) {
                    const slide = (progress - start) / slotDur;
                    panel.style.transform = `translateX(${-100 * (1 - slide)}%)`;
                } else {
                    panel.style.transform = `translateX(-100%)`;
                }
            }
        };

        const onScroll = () => {
            if (!sectionRef.current) return;
            const el = sectionRef.current;
            const rect = el.getBoundingClientRect();
            const sectionHeight = el.offsetHeight - window.innerHeight;
            if (sectionHeight <= 0) return;

            const scrolled = -rect.top;
            let progress = scrolled / sectionHeight;
            progress = Math.max(0, Math.min(1, progress));

            const maxIdx = images.length - 1;
            const frameIndex = Math.max(0, Math.min(maxIdx, Math.floor(progress * maxIdx)));
            const img = images[frameIndex];
            if (img) {
                drawImageRaw(img);
            }

            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                if (canvas) canvas.style.visibility = 'visible';
                updateOverlays(progress);
            } else {
                if (canvas) canvas.style.visibility = 'hidden';
                updateOverlays(progress > 0.5 ? 1 : 0);
            }
        };

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            onScroll();
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('scroll', onScroll, { passive: true });

        const interval = setInterval(() => {
            if (images[0] && images[0].complete) {
                onScroll();
            }
        }, 100);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', resize);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <div className="interstitial-gap">
                <h2 className="interstitial-title">TPS-CNC BENDER</h2>
                <p className="interstitial-desc">Fully automatic CNC processing technology.</p>
            </div>

            <div className="scroll-section" id="section-2" ref={sectionRef} style={{ height: "500vh" }}>
                <div className="sticky-wrapper">
                    <canvas ref={canvasRef} className="hero-canvas"></canvas>

                    <div className="hero-text-overlay text-first" data-index="10">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#2F9CBE" }}></div>
                            <span className="accent-label" style={{ color: "#2F9CBE" }}>Omkar Enterprises</span>
                        </div>
                        <h1 className="hero-title-bold">
                            <span style={{ color: "#2F9CBE" }}>TPS-CNC</span> <span className="text-white">BENDER</span>
                        </h1>
                        <p className="hero-desc">Fully automatic CNC processing technology for channel letter bending.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="11">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#2F9CBE" }}></div>
                            <span className="accent-label" style={{ color: "#2F9CBE" }}>Automatic</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#2F9CBE" }}>FULL</span> <span className="text-white">FUNCTION</span>
                        </h2>
                        <p className="hero-desc">Automatic feed, notch, and bend using 16 axis linkage.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right" data-index="12">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#2F9CBE" }}></div>
                            <span className="accent-label" style={{ color: "#2F9CBE" }}>Precision</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#2F9CBE" }}>HIGH</span> <span className="text-white">ACCURACY</span>
                        </h2>
                        <p className="hero-desc">Achieve flawless multi-function automatic processing.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="13">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#2F9CBE" }}></div>
                            <span className="accent-label" style={{ color: "#2F9CBE" }}>Efficiency</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#2F9CBE" }}>SMOOTH</span> <span className="text-white">WORKFLOW</span>
                        </h2>
                        <p className="hero-desc">Experience the pinnacle of sign-making automation.</p>
                    </div>

                    <div className="tps-slide-panel" id="tpsSlidePanel">
                        <div className="panel-content">
                            <h2 className="panel-title">TPS-CNC</h2>
                            <h3 className="panel-subtitle">CHANNEL LETTER BENDING MACHINE</h3>

                            <ul className="panel-features">
                                <li>Automatic feed, automatic notch, automatic bend, fully automatic</li>
                                <li>CNC Processing technology of 16 axises linkage, fully achieve the machine multi function and automatically</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
