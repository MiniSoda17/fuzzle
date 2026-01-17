'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroDemo from '@/components/landing/HeroDemo';
import styles from './landing.module.css';

export default function LandingPage() {
    return (
        <div className={styles.landingPage}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.navContent}>
                        <Link href="/" className={styles.logo}>
                            <img src="/logo-dark-2.svg" alt="Colleko" />
                            Colleko
                        </Link>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Link href="/map" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                                Login
                            </Link>
                            <Link href="/signup" className={styles.btnSecondary}>
                                Join now
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <motion.h1
                            className={styles.heroHeadline}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Meet nearby students<br />
                            <span className={styles.accent}>spontaneously</span>
                        </motion.h1>
                        <motion.p
                            className={styles.heroSubtext}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            See who's open to meet on campus right now. Tap, invite, connect. No swiping, no planning, just real moments.
                        </motion.p>
                        <motion.div
                            className={styles.heroCta}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link href="/signup" className={styles.btnPrimary}>
                                Join now
                            </Link>
                            <p className={styles.note}>University students only • Free to join</p>
                        </motion.div>
                    </div>

                    <HeroDemo />
                </div>
            </section>

            {/* How it Works */}
            <section className={`${styles.section} ${styles.howItWorks}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>How it works</h2>
                    <div className={styles.steps}>
                        <motion.div
                            className={styles.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className={styles.stepNumber}>1</div>
                            <h3 className={styles.stepTitle}>Check who's near</h3>
                            <p className={styles.stepDescription}>
                                Open the app to see a live map of students on campus who're near you.
                            </p>
                        </motion.div>

                        <motion.div
                            className={styles.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className={styles.stepNumber}>2</div>
                            <h3 className={styles.stepTitle}>Tap to view details</h3>
                            <p className={styles.stepDescription}>
                                See shared interests, what they're up to, and check if you vibe.
                            </p>
                        </motion.div>

                        <motion.div
                            className={styles.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className={styles.stepNumber}>3</div>
                            <h3 className={styles.stepTitle}>Send a quick invite</h3>
                            <p className={styles.stepDescription}>
                                Send a meetup invite with activity and time. If they accept, you're on!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Safety & Privacy */}
            <section className={`${styles.section} ${styles.safety}`}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Safety & privacy</h2>
                    <div className={styles.safetyGrid}>
                        <div className={styles.safetyItem}>
                            <h3 className={styles.safetyTitle}>University-only access</h3>
                            <p>Only verified university students can join via edu email.</p>
                        </div>
                        <div className={styles.safetyItem}>
                            <h3 className={styles.safetyTitle}>One-tap block</h3>
                            <p>Block or report anyone instantly. We take safety seriously.</p>
                        </div>
                        <div className={styles.safetyItem}>
                            <h3 className={styles.safetyTitle}>Privacy-first design</h3>
                            <p>Built from the ground up with your privacy in mind. Always.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <div className={styles.container}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaHeadline}>
                            Turn your campus into<br />
                            <span className={styles.accent}>your community</span>
                        </h2>
                        <p className={styles.ctaSubtext}>
                            Join thousands of students making spontaneous connections. No pressure, just real moments.
                        </p>
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <Link href="/signup" className={styles.btnPrimary}>
                                Join now
                            </Link>
                        </div>
                        <p className={styles.ctaNote}>University students only • Free to join</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        <div className={styles.footerBrand}>Colleko</div>
                        <div className={styles.footerLinks}>
                            <a href="#" className={styles.footerLink}>Privacy</a>
                            <a href="#" className={styles.footerLink}>Terms</a>
                            <a href="#" className={styles.footerLink}>Safety</a>
                        </div>
                    </div>
                    <p className={styles.footerCopyright}>© 2025 Colleko. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
