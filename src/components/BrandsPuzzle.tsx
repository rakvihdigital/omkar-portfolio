'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

export default function BrandsPuzzle() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, Flip);

        const section = document.getElementById('brandsPuzzleSection');
        const cards = gsap.utils.toArray('.puzzle-card') as HTMLElement[];

        if (!section || cards.length === 0) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=200%",
                scrub: 1.2
            }
        });

        cards.forEach((card, i) => {
            gsap.set(card, {
                opacity: 0,
                scale: 0.2,
                x: () => (Math.random() - 0.5) * 800,
                y: () => (Math.random() - 0.5) * 800 + 400,
                rotation: () => (Math.random() - 0.5) * 120
            });

            const interX = (Math.random() - 0.5) * 1000;
            const interY = (Math.random() - 0.5) * 1000;
            const interRot = (Math.random() - 0.5) * 60;

            tl.to(card, {
                opacity: 1,
                scale: (Math.random() * 0.4) + 0.6,
                x: interX,
                y: interY,
                rotation: interRot,
                ease: "power2.out",
                duration: 25
            }, i * 0.5);

            tl.to(card, {
                x: interX + (Math.random() - 0.5) * 150,
                y: interY + (Math.random() - 0.5) * 150,
                rotation: interRot + (Math.random() - 0.5) * 15,
                duration: 20,
                ease: "sine.inOut"
            }, 25);

            tl.to(card, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                ease: "power3.inOut",
                duration: 35
            }, 45);

            tl.to(card, {
                duration: 20
            }, 80);
        });

        const clickHandler = () => {
            const state = Flip.getState(cards);
            const ids = cards.map(c => c.id);

            for (let i = ids.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [ids[i], ids[j]] = [ids[j], ids[i]];
            }

            cards.forEach((c, i) => {
                c.id = ids[i];
            });

            Flip.from(state, {
                duration: 1.2,
                ease: "power3.inOut",
                absolute: true,
                stagger: 0.02,
                spin: true
            });
        };

        cards.forEach(card => {
            card.addEventListener('click', clickHandler);
        });
        
        return () => {
            cards.forEach(card => card.removeEventListener('click', clickHandler));
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === section) trigger.kill();
            });
        };
    }, []);

    return (
        <>
            <div className="interstitial-gap">
                <h2 className="interstitial-title" style={{ color: "#4FC3A0" }}>OUR HONORABLE BRANDS SIGNAGES</h2>
                <p className="interstitial-desc">Trusted by industry leaders.</p>
            </div>

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

            <div className="brands-puzzle-section" id="brandsPuzzleSection">
                <div className="brands-puzzle-sticky">
                    <div className="brands-puzzle-content">
                        <h2 className="puzzle-heading">BRANDS THAT<br />TRUST US</h2>

                        <div className="puzzle-grid" id="puzzleGrid">
                            <div className="puzzle-card" id="card-calvinklein">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/calvin_klein.png" alt="Calvin Klein" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-aditya">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/aditya_birla_madura.png" alt="Aditya Birla" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-samsung">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/samsung.png" alt="Samsung" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-mi">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/mi.png" alt="Mi" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-giva">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/giva.png" alt="Giva" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-max">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/max.png" alt="Max" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-zeiss">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/zeiss.png" alt="Zeiss" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-prestige">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/prestige.png" alt="Prestige" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-bata">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/bata.png" alt="Bata" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-hafele">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/hafele.png" alt="Hafele" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-asianpaints">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/asianpaints.png" alt="Asian Paints" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-arvind">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/arvind.png" alt="Arvind" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-bosch">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/bosch.png" alt="Bosch" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-mia">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/mia_by_tanishq.png" alt="Mia by Tanishq" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-sobha">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/sobha.png" alt="Sobha" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-kushals">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/kushals.png" alt="Kushals" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-tigc">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/tigc_indian_garage.png" alt="TIGC" className="puzzle-logo-img" /></div>
                            </div>
                            <div className="puzzle-card" id="card-easybuy">
                                <div className="puzzle-card-inner"><img src="/assets/brand_logos_diamond/easybuy.png" alt="Easybuy" className="puzzle-logo-img" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
