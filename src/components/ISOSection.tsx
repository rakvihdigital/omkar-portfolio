'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ISOSection() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            const isoTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".iso-section",
                    start: "top top",
                    end: "+=300%",
                    scrub: 1
                }
            });

            isoTl.from('.iso-header h2', { y: 50, opacity: 0, duration: 10, ease: "power2.out" }, 0)
                .from('.iso-underline', { scaleX: 0, duration: 10, ease: "power2.out" }, 0);

            isoTl.from('.iso-cert-left', { x: -150, y: 100, scale: 0.8, opacity: 0, rotation: -5, duration: 15, ease: "power3.out" }, 10)
                .from('.iso-cert-right', { x: 150, y: 100, scale: 0.8, opacity: 0, rotation: 5, duration: 15, ease: "power3.out" }, 10)
                .from('.iso-cert-center', { y: 150, scale: 0.8, opacity: 0, duration: 15, ease: "back.out(1.2)" }, 15);

            isoTl.to('.iso-cert-center', { scale: 1.15, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", duration: 15 }, 30)
                .to('.iso-cert-left, .iso-cert-right', { scale: 0.85, opacity: 0.6, zIndex: 1, duration: 15 }, 30);

            isoTl.fromTo('.iso-cert-center .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 10, ease: "none" }, 45);

            isoTl.to('.iso-cert-center', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 20px 50px rgba(0,0,0,0.4)", duration: 10 }, 55)
                .to('.iso-cert-left', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", duration: 10 }, 55);

            isoTl.fromTo('.iso-cert-left .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 62);

            isoTl.to('.iso-cert-left', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 20px 50px rgba(0,0,0,0.4)", duration: 10 }, 70)
                .to('.iso-cert-right', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", duration: 10 }, 70);

            isoTl.fromTo('.iso-cert-right .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 77);

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
                    scrub: 1
                }
            });

            isoTl.from('.iso-header h2', { y: 30, opacity: 0, duration: 10, ease: "power2.out" }, 0)
                .from('.iso-underline', { scaleX: 0, duration: 10, ease: "power2.out" }, 0);

            isoTl.from('.iso-cert-left', { x: -50, y: 50, scale: 0.8, opacity: 0, rotation: -2, duration: 15, ease: "power3.out" }, 10)
                .from('.iso-cert-right', { x: 50, y: 50, scale: 0.8, opacity: 0, rotation: 2, duration: 15, ease: "power3.out" }, 10)
                .from('.iso-cert-center', { y: 50, scale: 0.8, opacity: 0, duration: 15, ease: "back.out(1.2)" }, 15);

            isoTl.to('.iso-cert-center', { scale: 1.15, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", duration: 15 }, 30)
                .to('.iso-cert-left, .iso-cert-right', { scale: 0.85, opacity: 0.6, zIndex: 1, duration: 15 }, 30);

            isoTl.fromTo('.iso-cert-center .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 10, ease: "none" }, 45);

            isoTl.to('.iso-cert-center', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", duration: 10 }, 55)
                .to('.iso-cert-left', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", duration: 10 }, 55);

            isoTl.fromTo('.iso-cert-left .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 62);

            isoTl.to('.iso-cert-left', { scale: 0.85, opacity: 0.6, zIndex: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", duration: 10 }, 70)
                .to('.iso-cert-right', { scale: 1.15, opacity: 1, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.6)", duration: 10 }, 70);

            isoTl.fromTo('.iso-cert-right .iso-glass-sweep', { x: '-150%' }, { x: '150%', duration: 6, ease: "none" }, 77);

            isoTl.to('.iso-cert-right', { scale: 1, opacity: 1, zIndex: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.4)", duration: 15 }, 85)
                .to('.iso-cert-left', { scale: 1, opacity: 1, zIndex: 1, duration: 15 }, 85)
                .to('.iso-cert-center', { scale: 1, opacity: 1, zIndex: 5, duration: 15 }, 85);
        });

        const certs = document.querySelectorAll('.iso-cert');
        const modal = document.getElementById('isoModal');
        const modalImg = document.getElementById('isoModalImg') as HTMLImageElement;
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
                setTimeout(() => { modalImg.src = ''; }, 300);
            };

            modalClose.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
        
        return () => {
            mm.revert();
        };
    }, []);

    return (
        <>
            <section className="iso-section" id="isoSection">
                <div className="iso-sticky-container">
                    <div className="iso-background-top"></div>
                    <div className="iso-background-bottom"></div>

                    <div className="iso-header">
                        <h2>ISO CERTIFICATION</h2>
                        <div className="iso-underline"></div>
                    </div>

                    <div className="iso-certificates-container">
                        <div className="iso-cert iso-cert-left" data-src="/assets/iso/iso-cert-left.jpg">
                            <div className="iso-cert-frame">
                                <img src="/assets/iso/iso-cert-left.jpg" alt="ISO Certification Left" className="iso-cert-img" />
                                <div className="iso-glass-sweep"></div>
                            </div>
                        </div>

                        <div className="iso-cert iso-cert-center" data-src="/assets/iso/iso-cert-center.jpg">
                            <div className="iso-cert-frame">
                                <img src="/assets/iso/iso-cert-center.jpg" alt="ISO Certification Center" className="iso-cert-img" />
                                <div className="iso-glass-sweep"></div>
                            </div>
                        </div>

                        <div className="iso-cert iso-cert-right" data-src="/assets/iso/iso-cert-right.jpg">
                            <div className="iso-cert-frame">
                                <img src="/assets/iso/iso-cert-right.jpg" alt="ISO Certification Right" className="iso-cert-img" />
                                <div className="iso-glass-sweep"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="iso-modal" id="isoModal">
                <div className="iso-modal-close" id="isoModalClose">&times;</div>
                <div className="iso-modal-content">
                    <img alt="Full ISO Certificate" id="isoModalImg" />
                </div>
            </div>
        </>
    );
}
