// @ts-nocheck
'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

export default function ClientHome() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, Flip);

    /* ============================================
   OMKAR ENTERPRISES — 5-MACHINE 3D SCROLL ENGINE
   True HTML Gap Architecture
   ============================================ */

(function () {
    'use strict';

    // Sequence 1: Mimaki
    const FRAMES_MIMAKI = 941;
    const PATH_MIMAKI = '/assets/frames/frame_';

    // Sequence 2: TPS-CNC
    const FRAMES_TPS = 291;
    const PATH_TPS = '/assets/frames-2k/frame_';

    // Sequence 3: New Machine (Grey)
    const FRAMES_SEQ3 = 236;
    const PATH_SEQ3 = '/assets/frames-2k-19/frame_';

    // Sequence 4: Ultimate Machine (Yellow/Dark)
    const FRAMES_SEQ4 = 236;
    const PATH_SEQ4 = '/assets/frames-2k-20/frame_';

    // Sequence 5: Our Expansions
    const FRAMES_SEQ5 = 424;
    const PATH_SEQ5 = '/assets/frames-2k-21/frame_';

    const FRAME_EXT = '.webp';

    const state = {
        images: new Array(FRAMES_MIMAKI),
        imagesTPS: new Array(FRAMES_TPS),
        imagesSeq3: new Array(FRAMES_SEQ3),
        imagesSeq4: new Array(FRAMES_SEQ4),
        imagesSeq5: new Array(FRAMES_SEQ5),
        currentGlobalFrame: -1, // We'll just track if a new draw is needed
        canvas: null,
        ctx: null,
        isReady: false,
    };

    const scrollConfigs = [
        { id: 'section-1', frames: state.images, numOverlays: 10, panelId: 'finalSlidePanel', panelDir: 'left' },
        { id: 'section-2', frames: state.imagesTPS, numOverlays: 5, panelId: 'tpsSlidePanel', panelDir: 'left' },
        { id: 'section-3', frames: state.imagesSeq3, numOverlays: 5, panelId: 'seq3SlidePanel', panelDir: 'left' },
        { id: 'section-4', frames: state.imagesSeq4, numOverlays: 5, panelId: 'seq4SlidePanel', panelDir: 'left' },
        { id: 'section-5', frames: state.imagesSeq5, numOverlays: 5, panelId: 'seq5SlidePanel', panelDir: 'right' }
    ];

    function padFrame(num) {
        return String(num).padStart(6, '0');
    }

    // =====================
    // Preload all frames
    // =====================
    function preloadImages() {
        const preloader = document.getElementById('preloader');
        const percentEl = document.getElementById('preloaderPercent');
        const QUICK_LOAD = 100; // Only block preloader for first 100 Mimaki frames

        return new Promise((resolve) => {
            let mimakiLoaded = 0;
            let dismissed = false;

            const checkMimakiProgress = () => {
                mimakiLoaded++;
                const percent = Math.min(100, Math.round((mimakiLoaded / QUICK_LOAD) * 100));
                if (percentEl) percentEl.textContent = `${percent}%`;

                // Dismiss preloader after first 100 frames — near instant
                if (mimakiLoaded >= QUICK_LOAD && !dismissed) {
                    dismissed = true;
                    state.isReady = true;
                    setTimeout(() => {
                        preloader.classList.add('loaded');
                        resolve();
                    }, 300);
                }
            };

            // Load ALL sequences IN PARALLEL from the very start
            // This way they all download simultaneously
            
            // Sequence 1: Mimaki (tracks progress for preloader)
            for (let i = 1; i <= FRAMES_MIMAKI; i++) {
                const img = new Image();
                img.src = `${PATH_MIMAKI}${padFrame(i)}${FRAME_EXT}`;
                img.onload = checkMimakiProgress;
                img.onerror = checkMimakiProgress;
                state.images[i - 1] = img;
            }

            // Sequences 2-5: Start loading immediately (no waiting)
            const loadSilent = (count, path, arr) => {
                for (let i = 1; i <= count; i++) {
                    const img = new Image();
                    img.src = `${path}${padFrame(i)}${FRAME_EXT}`;
                    arr[i - 1] = img;
                }
            };

            loadSilent(FRAMES_TPS, PATH_TPS, state.imagesTPS);
            loadSilent(FRAMES_SEQ3, PATH_SEQ3, state.imagesSeq3);
            loadSilent(FRAMES_SEQ4, PATH_SEQ4, state.imagesSeq4);
            loadSilent(FRAMES_SEQ5, PATH_SEQ5, state.imagesSeq5);
        });
    }

    // =====================
    // Canvas Setup
    // =====================
    function setupCanvas() {
        state.canvas = document.getElementById('hero-canvas');
        state.ctx = state.canvas.getContext('2d');

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            state.canvas.width = window.innerWidth * dpr;
            state.canvas.height = window.innerHeight * dpr;
            state.ctx.scale(dpr, dpr);
            // Trigger a re-draw on resize
            onScroll();
        }

        resize();
        window.addEventListener('resize', resize);
    }

    // =====================
    // Draw frame on canvas
    // =====================
    function drawImageRaw(img) {
        if (!state.ctx || !img || !img.complete || !img.naturalWidth) return;

        const canvasW = state.canvas.width / (window.devicePixelRatio || 1);
        const canvasH = state.canvas.height / (window.devicePixelRatio || 1);

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

        state.ctx.clearRect(0, 0, canvasW, canvasH);
        state.ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // =====================
    // Text Overlay Animation
    // =====================
    function updateSectionOverlays(sectionEl, config, progress) {
        const overlays = sectionEl.querySelectorAll('.hero-text-overlay');
        const totalSlots = config.numOverlays;
        const slotDur = 1 / totalSlots;
        const fadeDur = slotDur * 0.28;

        overlays.forEach((overlay, i) => {
            const wStart = i * slotDur;
            const wEnd = (i + 1) * slotDur;
            const isFirst = (i === 0);

            let opacity = 0;
            let yOffset = 0;
            let scale = 1;

            // Only compute fade values if progress is within this overlay's window
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
            // Outside the window: opacity stays 0, yOffset stays 0, scale stays 1

            overlay.style.opacity = opacity;
            overlay.style.transform = `translateY(${yOffset}px) scale(${scale})`;
            overlay.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
        });

        // Update Panel if exists (last slot)
        if (config.panelId) {
            const panel = document.getElementById(config.panelId);
            if (panel) {
                const start = (totalSlots - 1) * slotDur;
                const dir = config.panelDir === 'right' ? 1 : -1;
                if (progress >= start) {
                    const slide = (progress - start) / slotDur;
                    panel.style.transform = `translateX(${dir * 100 * (1 - slide)}%)`;
                } else {
                    panel.style.transform = `translateX(${dir * 100}%)`;
                }
            }
        }
    }

    // =====================
    // Scroll Handler
    // =====================
    function onScroll() {
        // Intro section logic runs independently of canvas state to prevent initial jump
        const introSection = document.getElementById('intro-section');
        const introSticky = introSection?.querySelector('.intro-sticky');
        const navLogo = document.getElementById('navLogo');
        if (introSection && introSticky && navLogo) {
            const rect = introSection.getBoundingClientRect();
            const sectionHeight = introSection.offsetHeight - window.innerHeight;
            const scrolled = -rect.top;
            let progress = 0;
            if (sectionHeight > 0) {
                progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
            }
            
            // Background blur fades out
            let introOpacity = 1 - progress;
            introSticky.style.opacity = Math.max(0, Math.min(1, introOpacity));
            introSticky.style.pointerEvents = introOpacity > 0 ? 'auto' : 'none';
            
            // Animate Logo from center to top-left corner without scale() to prevent blur
            const maxScale = window.innerWidth < 768 ? 1.8 : 3.5;
            const currentScale = 1 + ((maxScale - 1) * (1 - progress));
            
            const img = navLogo.querySelector('.logo-img');
            const desc = navLogo.querySelector('.logo-desc');
            if (img) img.style.height = `${40 * currentScale}px`;
            if (desc) desc.style.fontSize = `${0.65 * currentScale}rem`;
            
            const currentWidth = navLogo.offsetWidth || 150;
            const currentHeight = navLogo.offsetHeight || 40;
            
            const targetX = 28; // from CSS left: 28px
            const targetY = 24; // from CSS top: 24px
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const startLeft = centerX - currentWidth / 2;
            const startTop = centerY - currentHeight / 2;
            
            const currentTranslateX = (startLeft - targetX) * (1 - progress);
            const currentTranslateY = (startTop - targetY) * (1 - progress);
            
            navLogo.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px)`;
        }

        if (!state.isReady) return;

        let activeConfig = null;
        let activeProgress = 0;

        // Determine which section is currently driving the canvas
        // A section is active if its top is above the viewport bottom and its bottom is below the viewport top.
        // But for sticky-like progress, we care about when it hits the top of the viewport.
        for (let config of scrollConfigs) {
            const el = document.getElementById(config.id);
            if (!el) continue;

            const rect = el.getBoundingClientRect();
            // scroll progress for the section: 0 when rect.top == 0, 1 when rect.bottom == window.innerHeight
            const sectionHeight = el.offsetHeight - window.innerHeight;
            if (sectionHeight <= 0) continue; // safety

            const scrolled = -rect.top;

            // If the section is above the bottom of viewport and below the top of viewport
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                // It's visible. Calculate precise local progress clamped between 0 and 1
                let progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

                // If rect.top is exactly 0 or negative, it is the primary driving section
                if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                    activeConfig = config;
                    activeProgress = progress;
                } else if (rect.top > 0 && !activeConfig) {
                    // It's coming up, but hasn't reached the top yet. Keep holding the first frame.
                    activeConfig = config;
                    activeProgress = 0;
                } else if (rect.bottom < window.innerHeight && !activeConfig) {
                    // It's passed, but no other section has taken over. Keep holding the last frame.
                    activeConfig = config;
                    activeProgress = 1;
                }
            }
        }

        if (!activeConfig && scrollConfigs.length > 0) {
            const firstRect = document.getElementById(scrollConfigs[0].id)?.getBoundingClientRect();
            if (firstRect && firstRect.top > 0) {
                // Above first section (e.g. during intro)
                activeConfig = scrollConfigs[0];
                activeProgress = 0;
            } else {
                // Below last section (e.g. at footer)
                activeConfig = scrollConfigs[scrollConfigs.length - 1];
                activeProgress = 1;
            }
        }

        if (activeConfig) {
            // Draw corresponding frame
            const maxIdx = activeConfig.frames.length - 1;
            const frameIndex = Math.max(0, Math.min(maxIdx, Math.floor(activeProgress * maxIdx)));
            const img = activeConfig.frames[frameIndex];
            if (img) {
                drawImageRaw(img);
            }
        }

        // Update overlays for ALL sections (so they slide in/out correctly if partially visible)
        for (let config of scrollConfigs) {
            const el = document.getElementById(config.id);
            if (!el) continue;

            const rect = el.getBoundingClientRect();
            const sectionHeight = el.offsetHeight - window.innerHeight;

            if (sectionHeight > 0 && rect.top <= window.innerHeight && rect.bottom >= 0) {
                // Section is visible — animate overlays normally
                const scrolled = -rect.top;
                const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
                updateSectionOverlays(el, config, progress);
            } else {
                // Section is completely off-screen — force-hide all its overlays
                const overlays = el.querySelectorAll('.hero-text-overlay');
                overlays.forEach((overlay) => {
                    overlay.style.opacity = 0;
                    overlay.style.transform = 'translateY(0px) scale(1)';
                });
                // Also hide any panels
                if (config.panelId) {
                    const panel = document.getElementById(config.panelId);
                    if (panel) {
                        const dir = config.panelDir === 'right' ? 1 : -1;
                        panel.style.transform = `translateX(${dir * 100}%)`;
                    }
                }
            }
        }

        // Hide scroll indicator after first scroll
        const scrollIndicator = document.getElementById('scrollIndicator');
        if (scrollIndicator) {
            if (window.scrollY > 10) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    }

    // =====================
    // Initialize
    // =====================
    async function init() {
        setupCanvas();

        // Preload all frames
        await preloadImages();

        // Attach scroll
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        console.log('🖨️ Omkar Enterprises — True Interstitial Scroll Engine Initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ==========================================
// GSAP BRANDS PUZZLE ANIMATION
// ==========================================
function initBrandsPuzzle() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('brandsPuzzleSection');
    const cards = gsap.utils.toArray('.puzzle-card');

    if (!section || cards.length === 0) return;

    // Create the main scroll-linked timeline
    // We treat the total duration as 100 for easy percentage math
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=200%", // 200vh scroll duration
            scrub: 1.2, // Smooth scrubbing
            pin: ".brands-puzzle-sticky",
            anticipatePin: 1
        }
    });

    cards.forEach((card, i) => {
        // Initial State (Hidden, scattered downwards)
        gsap.set(card, {
            opacity: 0,
            scale: 0.2,
            x: () => (Math.random() - 0.5) * 800,
            y: () => (Math.random() - 0.5) * 800 + 400,
            rotation: () => (Math.random() - 0.5) * 120
        });

        // Calculate a random intermediate position for the "Float" phase
        const interX = (Math.random() - 0.5) * 1000;
        const interY = (Math.random() - 0.5) * 1000;
        const interRot = (Math.random() - 0.5) * 60;

        // Phase 1: POP IN (0 - 25%)
        tl.to(card, {
            opacity: 1,
            scale: (Math.random() * 0.4) + 0.6, // random sizes between 0.6 and 1.0
            x: interX,
            y: interY,
            rotation: interRot,
            ease: "power2.out",
            duration: 25
        }, i * 0.5); // Add a small stagger based on index

        // Phase 2: FLOAT (25% - 45%)
        tl.to(card, {
            x: interX + (Math.random() - 0.5) * 150,
            y: interY + (Math.random() - 0.5) * 150,
            rotation: interRot + (Math.random() - 0.5) * 15,
            duration: 20,
            ease: "sine.inOut"
        }, 25);

        // Phase 3: PUZZLE SHUFFLE (45% - 80%)
        // Tween to exact CSS Grid layout (x:0, y:0, rotation:0, scale:1)
        tl.to(card, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            ease: "power3.inOut",
            duration: 35
        }, 45);

        // Phase 4: FINAL LOCK (80% - 100%)
        // Empty tween to hold the final state for the remaining scroll distance
        tl.to(card, {
            duration: 20
        }, 80);
    });

    // Add Interactive Flip Shuffle on Click
    if (typeof Flip !== 'undefined') {
        gsap.registerPlugin(Flip);

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Get the current layout state
                const state = Flip.getState(cards);

                // Collect all current IDs (which dictate grid-area in CSS)
                const ids = cards.map(c => c.id);

                // Shuffle the IDs randomly
                for (let i = ids.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [ids[i], ids[j]] = [ids[j], ids[i]];
                }

                // Re-assign the shuffled IDs to swap their grid positions
                cards.forEach((c, i) => {
                    c.id = ids[i];
                });

                // Smoothly animate the cards to their new spots!
                Flip.from(state, {
                    duration: 1.2,
                    ease: "power3.inOut",
                    absolute: true,
                    stagger: 0.02,
                    spin: true // Adds a slight spin if they move across
                });
            });
        });
    }
}

    initBrandsPuzzle();
    initISOSection();

function initISOSection() {
    let mm = gsap.matchMedia();

    // 1. Scroll Animation Logic
    mm.add("(min-width: 769px)", () => {
        const isoTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".iso-section",
                start: "top top",
                end: "+=300%",
                scrub: 1,
                pin: ".iso-sticky-container",
                anticipatePin: 1
            }
        });

        // Step 1: Reveal Header & Underline
        isoTl.from('.iso-header h2', { y: 50, opacity: 0, duration: 10, ease: "power2.out" }, 0)
            .from('.iso-underline', { scaleX: 0, duration: 10, ease: "power2.out" }, 0);

        // Step 2: Bring Certificates into position
        isoTl.from('.iso-cert-left', { x: -150, y: 100, scale: 0.8, opacity: 0, rotation: -5, duration: 15, ease: "power3.out" }, 10)
            .from('.iso-cert-right', { x: 150, y: 100, scale: 0.8, opacity: 0, rotation: 5, duration: 15, ease: "power3.out" }, 10)
            .from('.iso-cert-center', { y: 150, scale: 0.8, opacity: 0, duration: 15, ease: "back.out(1.2)" }, 15);

        // Step 3: Scroll-to-focus on Center Certificate
        isoTl.to('.iso-cert-center', { scale: 1.15, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", duration: 15 }, 30)
            .to('.iso-cert-left, .iso-cert-right', { scale: 0.85, opacity: 0.6, zIndex: 1, duration: 15 }, 30);

        // Step 4: Light Sweep on Center
        isoTl.fromTo('.iso-cert-center .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 10, ease: "none" }, 45);

        // Step 5: Shift focus to Left
        isoTl.to('.iso-cert-center', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 20px 50px rgba(0,0,0,0.4)", duration: 10 }, 55)
            .to('.iso-cert-left', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", duration: 10 }, 55);

        // Light Sweep on Left
        isoTl.fromTo('.iso-cert-left .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 62);

        // Step 6: Shift focus to Right
        isoTl.to('.iso-cert-left', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 20px 50px rgba(0,0,0,0.4)", duration: 10 }, 70)
            .to('.iso-cert-right', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", duration: 10 }, 70);

        // Light Sweep on Right
        isoTl.fromTo('.iso-cert-right .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 77);

        // Step 7: Final state
        isoTl.to('.iso-cert-right', { scale: 1, opacity: 1, zIndex: 1, boxShadow: "0 20px 50px rgba(0,0,0,0.4)", duration: 15 }, 85)
            .to('.iso-cert-left', { scale: 1, opacity: 1, zIndex: 1, duration: 15 }, 85)
            .to('.iso-cert-center', { scale: 1, opacity: 1, zIndex: 5, duration: 15 }, 85);
    });

    mm.add("(max-width: 768px)", () => {
        const isoTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".iso-section",
                start: "top top",
                end: "+=300%",
                scrub: 1,
                pin: ".iso-sticky-container",
                anticipatePin: 1
            }
        });

        // Step 1: Reveal Header
        isoTl.from('.iso-header h2', { y: 30, opacity: 0, duration: 10, ease: "power2.out" }, 0)
            .from('.iso-underline', { scaleX: 0, duration: 10, ease: "power2.out" }, 0);

        // Step 2: Entrance (Horizontal just like desktop, but smaller x values)
        isoTl.from('.iso-cert-left', { x: -50, y: 50, scale: 0.8, opacity: 0, rotation: -2, duration: 15, ease: "power3.out" }, 10)
            .from('.iso-cert-right', { x: 50, y: 50, scale: 0.8, opacity: 0, rotation: 2, duration: 15, ease: "power3.out" }, 10)
            .from('.iso-cert-center', { y: 50, scale: 0.8, opacity: 0, duration: 15, ease: "back.out(1.2)" }, 15);

        // Step 3: Focus Center
        isoTl.to('.iso-cert-center', { scale: 1.15, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", duration: 15 }, 30)
            .to('.iso-cert-left, .iso-cert-right', { scale: 0.85, opacity: 0.6, zIndex: 1, duration: 15 }, 30);

        // Step 4: Sweep Center
        isoTl.fromTo('.iso-cert-center .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 10, ease: "none" }, 45);

        // Step 5: Focus Left
        isoTl.to('.iso-cert-center', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", duration: 10 }, 55)
            .to('.iso-cert-left', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", duration: 10 }, 55);

        // Sweep Left
        isoTl.fromTo('.iso-cert-left .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 62);

        // Step 6: Focus Right
        isoTl.to('.iso-cert-left', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", duration: 10 }, 70)
            .to('.iso-cert-right', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", duration: 10 }, 70);

        // Sweep Right
        isoTl.fromTo('.iso-cert-right .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 77);

        // Step 7: Final
        isoTl.to('.iso-cert-right', { scale: 1, opacity: 1, zIndex: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", duration: 15 }, 85)
            .to('.iso-cert-left', { scale: 1, opacity: 1, zIndex: 1, duration: 15 }, 85)
            .to('.iso-cert-center', { scale: 1, opacity: 1, zIndex: 5, duration: 15 }, 85);
    });
    // 2. Interactive Modal Logic
    // 2. Interactive Modal Logic
    const certs = document.querySelectorAll('.iso-cert');
    const modal = document.getElementById('isoModal');
    const modalImg = document.getElementById('isoModalImg');
    const modalClose = document.getElementById('isoModalClose');

    if (modal && modalImg && modalClose) {
        certs.forEach(cert => {
            cert.addEventListener('click', () => {
                const src = cert.getAttribute('data-src');
                if (src) {
                    modalImg.src = src;
                    modal.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => { modalImg.src = ''; }, 300); // Clear image after fade out
        };

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(); // Close if clicked on background
        });
    }
}

  }, []);

  return (
    <>
      

    {/*  Preloader  */}
    <div id="preloader">
        <div className="preloader-inner">
            <div className="preloader-ring"></div>
            <div className="preloader-ring"></div>
            <div className="preloader-ring"></div>
            <p className="preloader-text">Loading Experience</p>
            <p className="preloader-percent" id="preloaderPercent">0%</p>
        </div>
    </div>

    <canvas className="hero-canvas" id="hero-canvas"></canvas>

    {/*  Logo — Fixed Top Left  */}
    <a href="#" className="nav-logo" id="navLogo">
        <img src="/assets/logo.png" alt="Omkar Enterprises Logo" className="logo-img" />
        <span className="logo-desc">Our Professional<br />Portfolio</span>
    </a>

    {/*  Intro Section — Logo fades out on initial scroll  */}
    <div id="intro-section" className="scroll-section" style={{ height: "150vh", zIndex: 50 }}>
        <div className="sticky-wrapper intro-sticky">
        </div>
    </div>

    {/*  Scroll Section — pinned canvas + text overlays  */}
    <div className="scroll-section" id="section-1" style={{ height: "1000vh" }}>
        <div className="sticky-wrapper">

            {/*  Sticky Canvas  */}


            {/*  Text Overlay 0 — First / Intro  */}
            <div className="hero-text-overlay text-first" data-index="0">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Omkar Enterprises</span>
                </div>
                <h1 className="hero-title-bold">
                    <span className="text-accent">MIMAKI</span> <span className="text-white">JFX600-2513</span>
                </h1>
                <p className="hero-desc">Step into the future of UV flatbed printing with unmatched precision and power.</p>
            </div>

            {/*  Text Overlay 1  */}
            <div className="hero-text-overlay hero-text-right" data-index="1">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Industrial Scale</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">MASSIVE</span> <span className="text-white">FORMAT</span>
                </h2>
                <p className="hero-desc">2500 × 1300mm print area engineered for large-format production demands.</p>
            </div>

            {/*  Text Overlay 2  */}
            <div className="hero-text-overlay hero-text-right pos-top-right" data-index="2">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Precision Print</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">1200 DPI</span> <span className="text-white">CLARITY</span>
                </h2>
                <p className="hero-desc">Photographic-quality resolution that captures the finest details with stunning
                    accuracy.</p>
            </div>

            {/*  Text Overlay 3  */}
            <div className="hero-text-overlay hero-text-right" data-index="3">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Speed</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">RAPID</span> <span className="text-white">OUTPUT</span>
                </h2>
                <p className="hero-desc">Up to 27.2 m²/h production speed that redefines workflow efficiency.</p>
            </div>

            {/*  Text Overlay 4  */}
            <div className="hero-text-overlay hero-text-right pos-top-right" data-index="4">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Print Head</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">PIEZO</span> <span className="text-white">INKJET</span>
                </h2>
                <p className="hero-desc">Advanced piezoelectric print head assembly with micron-level precision movement.
                </p>
            </div>

            {/*  Text Overlay 5  */}
            <div className="hero-text-overlay hero-text-right" data-index="5">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">UV Technology</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">LED UV</span> <span className="text-white">CURING</span>
                </h2>
                <p className="hero-desc">Energy-efficient instant drying with vibrant, durable prints and exceptional color
                    gamut.</p>
            </div>

            {/*  Text Overlay 6  */}
            <div className="hero-text-overlay hero-text-right pos-top-right" data-index="6">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Ink System</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">6 COLOR</span> <span className="text-white">SYSTEM</span>
                </h2>
                <p className="hero-desc">CMYK plus White and Clear inks for textured, embossed, and layered effects.</p>
            </div>

            {/*  Text Overlay 7  */}
            <div className="hero-text-overlay hero-text-right" data-index="7">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Innovation</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">MAPS4</span> <span className="text-white">TECH</span>
                </h2>
                <p className="hero-desc">Mimaki Advanced Pass System eliminates banding for seamless photographic output.
                </p>
            </div>

            {/*  Text Overlay 8  */}
            <div className="hero-text-overlay hero-text-right pos-top-right" data-index="8">
                <div className="hero-accent-line">
                    <div className="accent-bar"></div>
                    <span className="accent-label">Texture</span>
                </div>
                <h2 className="hero-title-bold hero-title-md">
                    <span className="text-accent">2.5D</span> <span className="text-white">PRINT</span>
                </h2>
                <p className="hero-desc">Create tactile textures and embossed effects with layered clear ink application.
                </p>
            </div>

            {/*  Final Slide-in Panel  */}
            <div className="final-slide-panel" id="finalSlidePanel">
                <div className="panel-content">
                    <h2 className="panel-title">MIMAKI - JFX600-2513</h2>
                    <h3 className="panel-subtitle">UV FLATBED 16 HEAD MACHINE</h3>

                    <ul className="panel-features">
                        <li>Amazingly high productivity: Up to 330% higher speed</li>
                        <li>Rich color expression: 6 color inks, including light colors</li>
                        <li>Supporting media as thick as 80 mm</li>
                        <li>"2.5D Texture Maker" Smooth expression of bumpy textures can be achieved using multiple
                            layers of UV ink.</li>
                        <li>This allows you to create realistic and eye-catching graphics</li>
                    </ul>


                </div>
            </div>

        </div>

    </div> {/*  close sticky-wrapper  */}

    {/*  Gap 1  */}
    <div className="interstitial-gap">
        <h2 className="interstitial-title">TPS-CNC BENDER</h2>
        <p className="interstitial-desc">Fully automatic CNC processing technology.</p>
    </div>

    <div className="scroll-section" id="section-2" style={{ height: "500vh" }}>
        <div className="sticky-wrapper">
            {/*  ============================================  */}
            {/*  TPS-CNC SEQUENCE (data-index 10-14)           */}
            {/*  ============================================  */}

            {/*  Text Overlay 10 (TPS First)  */}
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

            {/*  Text Overlay 11  */}
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

            {/*  Text Overlay 12  */}
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

            {/*  Text Overlay 13 (Pre-Panel)  */}
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

            {/*  Final Slide-in Panel (TPS-CNC) data-index="14" essentially  */}
            <div className="tps-slide-panel" id="tpsSlidePanel">
                <div className="panel-content">
                    <h2 className="panel-title">TPS-CNC</h2>
                    <h3 className="panel-subtitle">CHANNEL LETTER BENDING MACHINE</h3>

                    <ul className="panel-features">
                        <li>Automatic feed, automatic notch, automatic bend, fully automatic</li>
                        <li>CNC Processing technology of 16 axises linkage, fully achieve the machine multi function and
                            automatically</li>
                    </ul>


                </div>
            </div>
        </div>

    </div> {/*  close sticky-wrapper  */}

    {/*  Gap 2  */}
    <div className="interstitial-gap">
        <h2 className="interstitial-title">NEXT GEN SYSTEM</h2>
        <p className="interstitial-desc">Uncompromised speed and reliability.</p>
    </div>

    <div className="scroll-section" id="section-3" style={{ height: "500vh" }}>
        <div className="sticky-wrapper">
            {/*  ============================================  */}
            {/*  SEQUENCE 3 (data-index 15-19)                 */}
            {/*  ============================================  */}

            {/*  Text Overlay 15 (Seq3 First)  */}
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

            {/*  Text Overlay 16  */}
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

            {/*  Text Overlay 17  */}
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

            {/*  Text Overlay 18 (Pre-Panel)  */}
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

            {/*  Final Slide-in Panel (Seq 3) data-index="19" essentially  */}
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

    </div> {/*  close sticky-wrapper  */}

    {/*  Gap 3  */}
    <div className="interstitial-gap">
        <h2 className="interstitial-title">ULTIMATE SERIES</h2>
        <p className="interstitial-desc">Pushing the boundaries of automation.</p>
    </div>

    <div className="scroll-section" id="section-4" style={{ height: "500vh" }}>
        <div className="sticky-wrapper">
            {/*  ============================================  */}
            {/*  SEQUENCE 4 (data-index 20-24)                 */}
            {/*  ============================================  */}

            {/*  Text Overlay 20 (Seq4 First)  */}
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

            {/*  Text Overlay 21  */}
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

            {/*  Text Overlay 22  */}
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

            {/*  Text Overlay 23 (Pre-Panel)  */}
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

            {/*  Final Slide-in Panel (Seq 4) data-index="24" essentially  */}
            <div className="seq4-slide-panel" id="seq4SlidePanel">
                <div className="panel-content">
                    <h2 className="panel-title">HEXA-CNC</h2>
                    <h3 className="panel-subtitle">ROUTER MACHINE - 2 NOS.</h3>

                    <p className="panel-spec">WORKING AREA - 1300X2500MM</p>

                    <ul className="panel-features">
                        <li>Suitable for High volume processing of nonferrous metal sheet, PVC board, Acrylic,
                            Insulation materials, Wood and Composite panels</li>
                        <li>Sheet Processing, Cutting, Slotting, Engraving</li>
                    </ul>


                </div>
            </div>


        </div>

    </div> {/*  close sticky-wrapper  */}

    {/*  Gap 4  */}
    <div className="interstitial-gap">
        <h2 className="interstitial-title" style={{ color: "#4FC3A0" }}>OUR EXPANSIONS</h2>
        <p className="interstitial-desc">Providing unparalleled service throughout India.</p>
    </div>

    <div className="scroll-section" id="section-5" style={{ height: "500vh" }}>
        <div className="sticky-wrapper">
            {/*  ============================================  */}
            {/*  SEQUENCE 5 (data-index 25-29) - EXPANSIONS    */}
            {/*  ============================================  */}

            {/*  Text Overlay 25 (Seq5 First)  */}
            <div className="hero-text-overlay text-first" data-index="25" style={{ top: "20%" }}>
                <h1 className="hero-title-bold" style={{ textAlign: "center", width: "100vw", marginLeft: "-5vw" }}>
                    <span style={{ color: "#4FC3A0" }}>NATIONWIDE</span> <span className="text-white">REACH</span>
                </h1>
            </div>

            {/*  Text Overlay 26  */}
            <div className="hero-text-overlay hero-text-right pos-top-right" data-index="26" style={{ top: "30%" }}>
                <h2 className="hero-title-bold hero-title-md">
                    <span style={{ color: "#4FC3A0" }}>24/7</span> <span className="text-white">SUPPORT</span>
                </h2>
            </div>

            {/*  Text Overlay 27  */}
            <div className="hero-text-overlay hero-text-right" data-index="27" style={{ top: "20%" }}>
                <h2 className="hero-title-bold hero-title-md">
                    <span style={{ color: "#4FC3A0" }}>RAPID</span> <span className="text-white">DEPLOYMENT</span>
                </h2>
            </div>

            {/*  Text Overlay 28 (Pre-Panel)  */}
            <div className="hero-text-overlay hero-text-right pos-top-right" data-index="28" style={{ top: "30%" }}>
                <h2 className="hero-title-bold hero-title-md">
                    <span style={{ color: "#4FC3A0" }}>INDUSTRY</span> <span className="text-white">LEADERS</span>
                </h2>
            </div>

            {/*  Final Slide-in Panel (Seq 5) — Compact Right Panel  */}
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

            {/*  Scroll Indicator  */}
            <div className="scroll-indicator" id="scrollIndicator">
                <div className="scroll-line"></div>
                <span className="scroll-text">Scroll to explore</span>
            </div>

            {/*  Frame Counter  */}
            <div className="hero-counter" id="heroCounter">
                <span className="counter-current" id="counterCurrent">01</span>
                <div className="counter-divider"></div>
                <span className="counter-total">10</span>
            </div>

        </div> {/*  close sticky-wrapper  */}
    </div> {/*  Close Section 5  */}

    {/*  ISO Certification Section  */}
    <section className="iso-section" id="isoSection">
        <div className="iso-sticky-container">
            <div className="iso-background-top"></div>
            <div className="iso-background-bottom"></div>

            <div className="iso-header">
                <h2>ISO CERTIFICATION</h2>
                <div className="iso-underline"></div>
            </div>

            <div className="iso-certificates-container">
                {/*  Left Certificate  */}
                <div className="iso-cert iso-cert-left" data-src="/assets/iso/iso-cert-left.jpg">
                    <div className="iso-cert-frame">
                        <img src="/assets/iso/iso-cert-left.jpg" alt="ISO Certification Left" className="iso-cert-img"
                            />
                        <div className="iso-glass-sweep"></div>
                    </div>
                </div>

                {/*  Center Certificate  */}
                <div className="iso-cert iso-cert-center" data-src="/assets/iso/iso-cert-center.jpg">
                    <div className="iso-cert-frame">
                        <img src="/assets/iso/iso-cert-center.jpg" alt="ISO Certification Center" className="iso-cert-img"
                            />
                        <div className="iso-glass-sweep"></div>
                    </div>
                </div>

                {/*  Right Certificate  */}
                <div className="iso-cert iso-cert-right" data-src="/assets/iso/iso-cert-right.jpg">
                    <div className="iso-cert-frame">
                        <img src="/assets/iso/iso-cert-right.jpg" alt="ISO Certification Right" className="iso-cert-img"
                            />
                        <div className="iso-glass-sweep"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  Gap 5  */}
    {/*  Gap 5  */}
    <div className="interstitial-gap">
        <h2 className="interstitial-title" style={{ color: "#4FC3A0" }}>OUR HONORABLE BRANDS SIGNAGES</h2>
        <p className="interstitial-desc">Trusted by industry leaders.</p>
    </div>

    {/*  Brands Gallery Section  */}
    <section className="brands-section">
        <div className="brands-gallery">
            <div className="brand-card">
                <img src="/assets/brands/lifestyle.jpg" alt="Lifestyle" className="brand-img" />
                <h3 className="brand-name">LIFESTYLE</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/samsung.jpg" alt="Samsung" className="brand-img" />
                <h3 className="brand-name">SAMSUNG</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/adidas.jpg" alt="Adidas" className="brand-img" />
                <h3 className="brand-name">ADIDAS</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/mia-tanishq.png" alt="Mia by Tanishq" className="brand-img" />
                <h3 className="brand-name">MIA BY TANISHQ</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/max.jpg" alt="Max" className="brand-img" />
                <h3 className="brand-name">MAX</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/shubh.jpg" alt="Tanishq" className="brand-img" />
                <h3 className="brand-name">TANISHQ</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/bata.jpg" alt="Bata" className="brand-img" />
                <h3 className="brand-name">BATA</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/trends.jpg" alt="Trends" className="brand-img" />
                <h3 className="brand-name">TRENDS</h3>
            </div>
            <div className="brand-card">
                <img src="/assets/brands/kushals.jpg" alt="Kushal's" className="brand-img" />
                <h3 className="brand-name">KUSHAL'S</h3>
            </div>
        </div>
    </section>
    {/*  GSAP Brands Puzzle Section  */}
    <div className="brands-puzzle-section" id="brandsPuzzleSection">
        <div className="brands-puzzle-sticky">
            <div className="brands-puzzle-content">
                <h2 className="puzzle-heading">BRANDS THAT<br />TRUST US</h2>

                <div className="puzzle-grid" id="puzzleGrid">
                    <div className="puzzle-card" id="card-calvinklein">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/calvin_klein.png"
                                alt="Calvin Klein" className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-aditya">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/aditya_birla_madura.png"
                                alt="Aditya Birla" className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-samsung">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/samsung.png" alt="Samsung"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-mi">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/mi.png" alt="Mi"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-giva">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/giva.png" alt="Giva"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-max">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/max.png" alt="Max"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-zeiss">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/zeiss.png" alt="Zeiss"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-prestige">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/prestige.png" alt="Prestige"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-bata">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/bata.png" alt="Bata"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-hafele">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/hafele.png" alt="Hafele"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-asianpaints">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/asianpaints.png"
                                alt="Asian Paints" className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-arvind">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/arvind.png" alt="Arvind"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-bosch">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/bosch.png" alt="Bosch"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-mia">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/mia_by_tanishq.png"
                                alt="Mia by Tanishq" className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-sobha">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/sobha.png" alt="Sobha"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-kushals">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/kushals.png" alt="Kushals"
                                className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-tigc">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/tigc_indian_garage.png"
                                alt="TIGC" className="puzzle-logo-img" /></div>
                    </div>
                    <div className="puzzle-card" id="card-easybuy">
                        <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/easybuy.png" alt="Easybuy"
                                className="puzzle-logo-img" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/*  ISO Modal Viewer  */}
    <div className="iso-modal" id="isoModal">
        <div className="iso-modal-close" id="isoModalClose">&times;</div>
        <div className="iso-modal-content">
            <img  alt="Full ISO Certificate" id="isoModalImg" />
        </div>
    </div>

    
    </>
  );
}
