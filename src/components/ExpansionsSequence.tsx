'use client';

import React, { useEffect, useRef } from 'react';

const FRAMES_SEQ5 = 424;
const PATH_SEQ5 = '/assets/frames-2k-21/frame_';
const FRAME_EXT = '.webp';
const SKIP_STEP = 2;
const LOAD_SEQ5 = Math.ceil(FRAMES_SEQ5 / SKIP_STEP);

function padFrame(num: number) {
    return String(num).padStart(6, '0');
}

export default function ExpansionsSequence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const images: HTMLImageElement[] = new Array(LOAD_SEQ5);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let idx = 0;
        for (let i = 1; i <= FRAMES_SEQ5; i += SKIP_STEP) {
            const img = new Image();
            img.src = `${PATH_SEQ5}${padFrame(i)}${FRAME_EXT}`;
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

            const panel = document.getElementById('seq5SlidePanel');
            if (panel) {
                const start = (numOverlays - 1) * slotDur;
                if (progress >= start) {
                    const slide = (progress - start) / slotDur;
                    // Note: Panel slides in from right for seq 5
                    panel.style.transform = `translateX(${100 * (1 - slide)}%)`;
                } else {
                    panel.style.transform = `translateX(100%)`;
                }
            }
            
            // Frame Counter update
            const counterCurrent = document.getElementById('counterCurrent');
            if (counterCurrent) {
                const frameIndex = Math.max(0, Math.floor(progress * numOverlays) + 1);
                counterCurrent.textContent = String(Math.min(frameIndex, numOverlays)).padStart(2, '0');
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
                <h2 className="interstitial-title" style={{ color: "#4FC3A0" }}>OUR EXPANSIONS</h2>
                <p className="interstitial-desc">Providing unparalleled service throughout India.</p>
            </div>

            <div className="scroll-section" id="section-5" ref={sectionRef} style={{ height: "500vh" }}>
                <div className="sticky-wrapper">
                    <canvas ref={canvasRef} className="hero-canvas"></canvas>

                    <div className="hero-text-overlay text-first" data-index="25" style={{ top: "20%" }}>
                        <h1 className="hero-title-bold" style={{ textAlign: "center", width: "100vw", marginLeft: "-5vw" }}>
                            <span style={{ color: "#4FC3A0" }}>NATIONWIDE</span> <span className="text-white">REACH</span>
                        </h1>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="26" style={{ top: "30%" }}>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#4FC3A0" }}>24/7</span> <span className="text-white">SUPPORT</span>
                        </h2>
                    </div>

                    <div className="hero-text-overlay hero-text-right" data-index="27" style={{ top: "20%" }}>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#4FC3A0" }}>RAPID</span> <span className="text-white">DEPLOYMENT</span>
                        </h2>
                    </div>

                    <div className="hero-text-overlay hero-text-right pos-top-right" data-index="28" style={{ top: "30%" }}>
                        <h2 className="hero-title-bold hero-title-md">
                            <span style={{ color: "#4FC3A0" }}>INDUSTRY</span> <span className="text-white">LEADERS</span>
                        </h2>
                    </div>

                    <div className="seq5-slide-panel" id="seq5SlidePanel">
                        <div className="panel-content">
                            <div className="seq5-accent-line">
                                <div className="accent-bar" style={{ background: "#4FC3A0" }}></div>
                                <span className="accent-label" style={{ color: "#4FC3A0" }}>Omkar Enterprises</span>
                            </div>
                            <h2 className="panel-title">OUR SERVICES</h2>
                            <h3 className="panel-subtitle">ACROSS THE CITIES</h3>

                            <div className="state-tags">
                                <span className="state-tag">Bangalore</span>
                                <span className="state-tag">Kochi</span>
                                <span className="state-tag">Chennai</span>
                                <span className="state-tag">Hyderabad</span>
                            </div>

                            <div className="panel-footer">
                                <a href="#" className="website-link">www.omkarenterprises.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="scroll-indicator" id="scrollIndicator">
                        <div className="scroll-line"></div>
                        <span className="scroll-text">Scroll to explore</span>
                    </div>

                    <div className="hero-counter" id="heroCounter">
                        <span className="counter-current" id="counterCurrent">01</span>
                        <div className="counter-divider"></div>
                        <span className="counter-total">10</span>
                    </div>

                </div>
            </div>
        </>
    );
}
