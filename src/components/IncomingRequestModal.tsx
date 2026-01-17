'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '../types';

interface IncomingRequestModalProps {
    request: {
        id: string;
        sender_id: string;
        activity: string;
    };
    onClose: () => void;
}

export default function IncomingRequestModal({ request, onClose }: IncomingRequestModalProps) {
    const [sender, setSender] = useState<User | null>(null);

    useEffect(() => {
        const fetchSender = async () => {
            const { data } = await supabase.from('users').select('*').eq('id', request.sender_id).single();
            if (data) setSender(data as User);
        };
        fetchSender();
    }, [request.sender_id]);

    const handleResponse = async (status: 'accepted' | 'rejected') => {
        await supabase.from('meetups').update({ status }).eq('id', request.id);
        onClose();
    };

    if (!sender) return null;

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
                <img src={sender.avatarUrl} alt={sender.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
