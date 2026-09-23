'use client';

import React, { useEffect, useRef } from 'react';

const FRAMES_SEQ3 = 236;
const PATH_SEQ3 = '/assets/frames-2k-19/frame_';
const FRAME_EXT = '.webp';
const SKIP_STEP = 2;
const LOAD_SEQ3 = Math.ceil(FRAMES_SEQ3 / SKIP_STEP);

function padFrame(num: number) {
    return String(num).padStart(6, '0');
}

export default function GreyMachineSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const images: HTMLImageElement[] = new Array(LOAD_SEQ3);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let idx = 0;
        for (let i = 1; i <= FRAMES_SEQ3; i += SKIP_STEP) {
            const img = new Image();
            img.src = `${PATH_SEQ3}${padFrame(i)}${FRAME_EXT}`;
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

            const panel = document.getElementById('seq3SlidePanel');
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
                <h2 className="interstitial-title">NEXT GEN SYSTEM</h2>
                <p className="interstitial-desc">Uncompromised speed and reliability.</p>
            </div>

            <div className="scroll-section" id="section-3" ref={sectionRef} style={{ height: "500vh" }}>
                <div className="sticky-wrapper">
                    <canvas ref={canvasRef} className="hero-canvas"></canvas>

                    <div className="hero-text-overlay text-first" data-index="15">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#9ca3af" }}></div>
                            <span className="accent-label" style={{ color: "#9ca3af" }}>Next Generation</span>
                        </div>
                        <h1 className="hero-title-bold">
                            <span style={{ color: "#9ca3af" }}>NEW</span> <span className="text-white">SYSTEM</span>
                        </h1>
                        <p className="hero-desc">Discover the capabilities of our latest industrial machine series.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="16">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#9ca3af" }}></div>
                            <span className="accent-label" style={{ color: "#9ca3af" }}>Performance</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#9ca3af" }}>PEAK</span> <span className="text-white">OUTPUT</span>
                        </h2>
                        <p className="hero-desc">Uncompromised speed and reliability for heavy workloads.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right" data-index="17">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#9ca3af" }}></div>
                            <span className="accent-label" style={{ color: "#9ca3af" }}>Design</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#9ca3af" }}>ROBUST</span> <span className="text-white">BUILD</span>
                        </h2>
                        <p className="hero-desc">Engineered for durability and long-lasting precision.</p>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="18">
                        <div className="hero-accent-line">
                            <div className="accent-bar" style={{ background: "#9ca3af" }}></div>
                            <span className="accent-label" style={{ color: "#9ca3af" }}>Integration</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#9ca3af" }}>SEAMLESS</span> <span className="text-white">CONTROL</span>
                        </h2>
                        <p className="hero-desc">Advanced software interfaces for effortless operation.</p>
                    </div>

                    <div className="seq3-slide-panel" id="seq3SlidePanel">
                        <div className="panel-content">
                            <h2 className="panel-title">UV PRINT MACHINE</h2>
                            <h3 className="panel-subtitle">MIMAKI UJV100-160 - 2 NOS.</h3>

                            <ul className="panel-features">
                                <li>Water based UV LED Ink Print Head</li>
                                <li>CMYKx2, CMYK LC LM W (White ink) colour mode</li>
                                <li>Maximum Resolution 1200x1200 - 300 - 500 Sqft / Hour</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
