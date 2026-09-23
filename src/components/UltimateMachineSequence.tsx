'use client';

import React, { useEffect, useRef } from 'react';

const FRAMES_SEQ4 = 236;
const PATH_SEQ4 = '/assets/frames-2k-20/frame_';
const FRAME_EXT = '.webp';
const SKIP_STEP = 2;
const LOAD_SEQ4 = Math.ceil(FRAMES_SEQ4 / SKIP_STEP);

function padFrame(num: number) {
    return String(num).padStart(6, '0');
}

export default function UltimateMachineSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const images: HTMLImageElement[] = new Array(LOAD_SEQ4);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let idx = 0;
        for (let i = 1; i <= FRAMES_SEQ4; i += SKIP_STEP) {
            const img = new Image();
            img.src = `${PATH_SEQ4}${padFrame(i)}${FRAME_EXT}`;
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

            const panel = document.getElementById('seq4SlidePanel');
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
                <h2 className="interstitial-title">ULTIMATE SERIES</h2>
                <p className="interstitial-desc">Pushing the boundaries of automation.</p>
            </div>

            <div className="scroll-section" id="section-4" ref={sectionRef} style={{ height: "500vh" }}>
                <div className="sticky-wrapper">
                    <canvas ref={canvasRef} className="hero-canvas"></canvas>

                    <div className="hero-text-overlay text-first" data-index="20">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#eab308" }}></div>
                            <span className="accent-label" style={{ color: "#eab308" }}>Future Ready</span>
                        </div>
                        <h1 className="hero-title-bold">
                            <span style={{ color: "#eab308" }}>SMART</span> <span className="text-white">FACTORY</span>
                        </h1>
                        <p className="hero-desc">Elevate your production with our state-of-the-art machinery.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="21">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#eab308" }}></div>
                            <span className="accent-label" style={{ color: "#eab308" }}>Innovation</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#eab308" }}>NEXT</span> <span className="text-white">LEVEL</span>
                        </h2>
                        <p className="hero-desc">Pushing the boundaries of automated manufacturing.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right" data-index="22">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#eab308" }}></div>
                            <span className="accent-label" style={{ color: "#eab308" }}>Reliability</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#eab308" }}>ZERO</span> <span className="text-white">DOWNTIME</span>
                        </h2>
                        <p className="hero-desc">Built to run 24/7 with minimal maintenance required.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="23">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#eab308" }}></div>
                            <span className="accent-label" style={{ color: "#eab308" }}>Scalability</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#eab308" }}>GROW</span> <span className="text-white">FASTER</span>
                        </h2>
                        <p className="hero-desc">Adapt to increasing demands with flexible processing.</p>
                    </div>

                    <div className="seq4-slide-panel" id="seq4SlidePanel">
                        <div className="panel-content">
                            <h2 className="panel-title">HEXA-CNC</h2>
                            <h3 className="panel-subtitle">ROUTER MACHINE - 2 NOS.</h3>

                            <p className="panel-spec">WORKING AREA - 1300X2500MM</p>

                            <ul className="panel-features">
                                <li>Suitable for High volume processing of nonferrous metal sheet, PVC board, Acrylic, Insulation materials, Wood and Composite panels</li>
                                <li>Sheet Processing, Cutting, Slotting, Engraving</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
