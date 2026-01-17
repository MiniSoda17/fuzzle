'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '../types';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface IncomingRequestModalProps {
    request: {
        id: string;
        sender_id: string;
        activity: string;
    };
    onClose: () => void;
}



const ACTIVITIES_MAP: Record<string, { emoji: string; label: string }> = {
    'study': { emoji: '📚', label: 'Study' },
    'hoops': { emoji: '🏀', label: 'Shoot Hoops' },
    'coffee': { emoji: '☕️', label: 'Coffee Chat' },
    'food': { emoji: '🍔', label: 'Grab Food' },
    'walk': { emoji: '🚶', label: 'Walk' },
};

export default function IncomingRequestModal({ request, onClose }: IncomingRequestModalProps) {
    const [sender, setSender] = useState<User | null>(null);
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const fetchSender = async () => {
            const { data } = await supabase.from('users').select('*').eq('id', request.sender_id).single();
            if (data) setSender(data as User);
        };
        fetchSender();
    }, [request.sender_id]);

    const handleResponse = async (status: 'accepted' | 'rejected') => {
        await supabase.from('meetups').update({ status }).eq('id', request.id);
        if (status === 'accepted') {
            setIsAccepted(true);
        } else {
            onClose();
        }
    };

    if (!sender) return null;

    if (isAccepted) {
        const actInfo = ACTIVITIES_MAP[request.activity] || { emoji: '✨', label: request.activity };

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel"
                style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '400px',
                    padding: '32px',
                    zIndex: 2000,
                    textAlign: 'center'
                }}
            >
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <CheckCircleIcon style={{ width: '80px', height: '80px', color: 'var(--secondary-color)' }} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary-color)', marginBottom: '8px' }}>Accepted!</h2>

                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--secondary-color)',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '24px',
                    textAlign: 'left'
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Activity</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {actInfo.emoji} {actInfo.label} with {sender.name}
                        </p>
                    </div>
                    <div>
                        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Meeting Point</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPinIcon style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Main Library Entrance</p>
                        </div>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', background: 'var(--secondary-color)' }}
                    onClick={onClose}
                >
                    Lets Go!
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="glass-panel"
            style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '400px',
                padding: '24px',
                zIndex: 2000,
                textAlign: 'center'
            }}
        >
            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                border: '3px solid var(--primary-color)',
                margin: '0 auto 16px auto', overflow: 'hidden'
            }}>
                <img src={sender.avatar_url} alt={sender.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                {sender.name} wants to <span style={{ color: 'var(--primary-color)' }}>{request.activity}</span>!
            </h3>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                    onClick={() => handleResponse('rejected')}
                    style={{
                        flex: 1, padding: '12px', borderRadius: '50px',
                        background: 'rgba(255,255,255,0.1)', color: 'white',
                        border: 'none', fontWeight: 600
                    }}
                >
                    Decline
                </button>
                <button
                    onClick={() => handleResponse('accepted')}
                    className="btn-primary"
                    style={{ flex: 1, background: 'var(--secondary-color)' }}
                >
                    Accept
                </button>
            </div>
        </motion.div>
    );
}
