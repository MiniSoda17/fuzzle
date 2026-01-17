'use client';

import { motion } from 'framer-motion';
import styles from '@/app/landing.module.css';

export default function HeroDemo() {
    return (
        <div className={styles.heroVisual} style={{ perspective: '1000px' }}>
            <motion.div
                className={styles.mapContainer}
                initial={{ rotateX: 20, rotateY: -10, scale: 0.9, opacity: 0 }}
                animate={{ rotateX: 5, rotateY: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Animated Map Pins */}
                <MapPin top="20%" left="25%" delay={0} color="#F43F5E" />
                <MapPin top="45%" left="60%" delay={0.5} color="#F43F5E" />
                <MapPin top="70%" left="35%" delay={1} color="#F43F5E" />
                <MapPin top="50%" left="80%" delay={1.5} color="#F43F5E" />

                {/* Floating Cards - "Million Dollar" Look */}
                <FloatingCard
                    top="15%"
                    left="15%"
                    delay={0.2}
                    name="Alex"
                    activity="Coffee • 15 min"
                    emoji="☕"
                    avatarColor="linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)"
                />

                <FloatingCard
                    top="60%"
                    right="20%"
                    delay={1.2}
                    name="Sam"
                    activity="Study • 30 min"
                    emoji="📚"
                    avatarColor="linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
                />

                <FloatingCard
                    top="35%"
                    left="50%"
                    delay={2.5}
                    name="Jordan"
                    activity="Tennis • Now"
                    emoji="🎾"
                    avatarColor="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                />

            </motion.div>
        </div>
    );
}

function MapPin({ top, left, delay, color }: { top: string; left: string; delay: number; color: string }) {
    return (
        <motion.div
            className={styles.mapPin}
            style={{ top, left, background: color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: 1 }}
            transition={{
                duration: 2,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
        />
    );
}

function FloatingCard({ top, left, right, delay, name, activity, emoji, avatarColor }: any) {
    return (
        <motion.div
            className={styles.floatingCard}
            style={{
                position: 'absolute',
                top,
                left,
                right,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                padding: '12px 16px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '180px',
                zIndex: 10,
                border: '1px solid rgba(255,255,255,0.6)'
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.8, delay }
            }}
        >
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
            }}>
                {emoji}
            </div>
            <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#1A1D29' }}>{name}</div>
                <div style={{ fontSize: '12px', color: '#6B7A8F' }}>{activity}</div>
            </div>
        </motion.div>
    );
}
