'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-color)'
        }}>
            {/* Abstract Background */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 60%)',
                opacity: 0.15,
                filter: 'blur(80px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, var(--secondary-color) 0%, transparent 60%)',
                opacity: 0.1,
                filter: 'blur(80px)'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="glass-panel"
                style={{
                    width: '90%',
                    maxWidth: '420px',
                    padding: '40px',
                    zIndex: 10,
                    background: 'rgba(22, 27, 34, 0.8)', // Slightly less opaque than map for depth
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 16px auto' }}>
                        <img src="/colleko-logo.svg" alt="Colleko" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
                        {title}
                    </h1>
                    <p style={{ color: '#8b949e', fontSize: '1rem' }}>
                        {subtitle}
                    </p>
                </div>

                {children}

            </motion.div>
        </div>
    );
};

export default AuthLayout;
