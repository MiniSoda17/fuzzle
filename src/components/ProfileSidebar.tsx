'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { User } from '../types';
import {
    XMarkIcon,
    AcademicCapIcon,
    SparklesIcon,
    MapPinIcon,
    ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/solid';

interface ProfileSidebarProps {
    user: User;
    onClose: () => void;
    onOffer: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, onClose, onOffer }) => {
    // Animation variants
    const desktopVariants = {
        hidden: { x: '100%', opacity: 0.5 },
        visible: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0.5 }
    };

    const mobileVariants = {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '100%' }
    };

    // Need to handle window check carefully in Next.js SSR
    // But since this is 'use client' and likely only rendered after interaction/mount, it might be ok.
    // Safer to use a hook or default to desktop if window undefined, but Framer Motion handles variants well.
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={isMobile ? mobileVariants : desktopVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel"
            style={{
                position: 'absolute',
                top: isMobile ? 'auto' : '16px',
                bottom: isMobile ? '0' : '16px',
                right: isMobile ? '0' : '16px',
                left: isMobile ? '0' : 'auto',
                width: isMobile ? '100%' : '400px',
                height: isMobile ? '70vh' : 'auto', // Bottom sheet on mobile
                maxHeight: isMobile ? '85vh' : 'calc(100vh - 32px)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderBottomLeftRadius: isMobile ? 0 : '24px',
                borderBottomRightRadius: isMobile ? 0 : '24px',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                boxShadow: '-4px 0 24px rgba(0,0,0,0.2)'
            }}
        >
            {/* Header Image */}
            <div style={{ position: 'relative', height: '220px', flexShrink: 0 }}>
                <img
                    src={user.avatar_url}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(13, 17, 23, 1))'
                }} />

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <XMarkIcon style={{ width: '20px' }} />
                </button>

                <div style={{ position: 'absolute', bottom: '16px', left: '24px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>{user.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}>
                        <MapPinIcon style={{ width: '16px' }} />
                        <span>{user.university}, Year {user.year}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#ddd' }}>{user.bio}</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary-color)', fontWeight: 600 }}>
                        <AcademicCapIcon style={{ width: '20px' }} />
                        Studying
                    </h3>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>{user.degree}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {user.subjects.map(sub => (
                            <span key={sub} style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '4px 12px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                border: '1px solid var(--border-color)'
                            }}>
                                {sub}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--accent-color)', fontWeight: 600 }}>
                        <SparklesIcon style={{ width: '20px' }} />
                        Interests
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {user.interests.map(int => (
                            <span key={int} style={{
                                background: 'rgba(244, 63, 94, 0.15)',
                                color: '#ff9bb3',
                                padding: '6px 14px',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}>
                                {int}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
                <button
                    className="btn-primary"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={onOffer}
                >
                    <ChatBubbleBottomCenterTextIcon style={{ width: '20px' }} />
                    Meetup
                </button>
            </div>

        </motion.div>
    );
};

export default ProfileSidebar;
