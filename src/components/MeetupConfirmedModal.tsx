'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import type { User } from '../types';

interface MeetupConfirmedModalProps {
    otherUser: User;
    activity: string;
    location?: string;
    time?: string;
    isPremium?: boolean;
    onClose: () => void;
}

const ACTIVITIES_MAP: Record<string, { emoji: string; label: string }> = {
    'study': { emoji: '📚', label: 'Study' },
    'hoops': { emoji: '🏀', label: 'Shoot Hoops' },
    'coffee': { emoji: '☕️', label: 'Coffee Chat' },
    'food': { emoji: '🍔', label: 'Grab Food' },
    'walk': { emoji: '🚶', label: 'Walk' },
};

export default function MeetupConfirmedModal({ otherUser, activity, location, time, isPremium, onClose }: MeetupConfirmedModalProps) {
    const actInfo = ACTIVITIES_MAP[activity] || { emoji: '✨', label: activity };
    const [hasAccess, setHasAccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        // Check props or URL for access
        if (isPremium) {
            setHasAccess(true);
        } else if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('payment_success') === 'true') {
                setHasAccess(true);
            }
        }
    }, [isPremium]);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'current_user', email: 'user@example.com' })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            console.error(e);
            alert('Payment failed');
            setLoading(false);
        }
    };

    if (!hasAccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel"
                style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '90%', maxWidth: '400px', padding: '32px', zIndex: 2002, textAlign: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontSize: '64px' }}>💎</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Unlock Details</h2>
                <p style={{ color: '#aaa', marginBottom: '24px' }}>Subscribe to see the meeting point and time.</p>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>Monthly Plan</span>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--secondary-color)' }}>$7.99</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Cancel anytime.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #555', borderRadius: '12px', color: '#aaa' }}>Close</button>
                    <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="btn-primary"
                        style={{ flex: 2, background: 'var(--secondary-color)', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Redirecting...' : 'Subscribe Now'}
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel"
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '400px',
                padding: '32px',
                zIndex: 2002,
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}
            >
                <CheckCircleIcon style={{ width: '80px', height: '80px', color: 'var(--secondary-color)' }} />
            </motion.div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary-color)', marginBottom: '8px' }}>Accepted!</h2>
            <p style={{ color: '#aaa', marginBottom: '24px' }}>Get ready to meet up.</p>

            <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--secondary-color)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '4px' }}>Activity</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{actInfo.emoji}</span>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {actInfo.label} with {otherUser.name}
                        </p>
                    </div>
                </div>

                <div>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '4px' }}>Meeting Point</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPinIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{location || 'Main Library Entrance'}</p>
                    </div>
                </div>

                {time && (
                    <div style={{ marginTop: '16px' }}>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '4px' }}>Time</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ClockIcon style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{time}</p>
                        </div>
                    </div>
                )}
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%', background: 'var(--secondary-color)', fontSize: '1.1rem', padding: '16px' }}
                onClick={onClose}
            >
                Lets Go!
            </button>
        </motion.div>
    );
}
