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
    onClose: () => void;
}

const ACTIVITIES_MAP: Record<string, { emoji: string; label: string }> = {
    'study': { emoji: '📚', label: 'Study' },
    'hoops': { emoji: '🏀', label: 'Shoot Hoops' },
    'coffee': { emoji: '☕️', label: 'Coffee Chat' },
    'food': { emoji: '🍔', label: 'Grab Food' },
    'walk': { emoji: '🚶', label: 'Walk' },
};

export default function MeetupConfirmedModal({ otherUser, activity, location, time, onClose }: MeetupConfirmedModalProps) {
    const actInfo = ACTIVITIES_MAP[activity] || { emoji: '✨', label: activity };

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
