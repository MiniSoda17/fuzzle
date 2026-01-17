'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ActivityType, User } from '../types';
import { supabase } from '@/lib/supabase';
import { CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface MeetupFlowProps {
    targetUser: User;
    currentUser: User | null;
    onClose: () => void;
    onConfirm: () => void; // Called when meetup is finalized
}

const ACTIVITIES: { type: ActivityType; emoji: string; label: string }[] = [
    { type: 'study', emoji: '📚', label: 'Study' },
    { type: 'hoops', emoji: '🏀', label: 'Shoot Hoops' },
    { type: 'coffee', emoji: '☕️', label: 'Coffee Chat' },
    { type: 'food', emoji: '🍔', label: 'Grab Food' },
    { type: 'walk', emoji: '🚶', label: 'Walk' },
];

const MeetupFlow: React.FC<MeetupFlowProps> = ({ targetUser, currentUser, onClose, onConfirm }) => {
    const [step, setStep] = useState<'select' | 'waiting' | 'accepted'>('select');
    const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
    const [meetupId, setMeetupId] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(30 * 60);

    // Timer logic
    useEffect(() => {
        if (step === 'waiting') {
            const timer = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [step]);

    // Cleanup subscription on unmount or success
    useEffect(() => {
        if (!meetupId) return;

        const channel = supabase
            .channel(`meetup:${meetupId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'meetups',
                filter: `id=eq.${meetupId}`
            }, (payload) => {
                if (payload.new.status === 'accepted') {
                    setStep('accepted');
                } else if (payload.new.status === 'rejected') {
                    alert('Request declined.');
                    onClose();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [meetupId, onClose]);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const handleSend = async () => {
        if (selectedActivity && currentUser) {
            try {
                const { data, error } = await supabase
                    .from('meetups')
                    .insert({
                        sender_id: currentUser.id,
                        receiver_id: targetUser.id,
                        activity: selectedActivity,
                        status: 'pending'
                    })
                    .select()
                    .single();

                if (error) throw error;
                if (data) {
                    setMeetupId(data.id);
                    setStep('waiting');
                }
            } catch (err: any) {
                alert('Failed to send request: ' + err.message);
            }
        }
    };

    if (step === 'select') {
        return (
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>What do you want to do?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {ACTIVITIES.map((act) => (
                        <button
                            key={act.type}
                            onClick={() => setSelectedActivity(act.type)}
                            style={{
                                background: selectedActivity === act.type ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${selectedActivity === act.type ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                borderRadius: '16px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'var(--text-color)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>{act.emoji}</span>
                            <span style={{ fontWeight: 500 }}>{act.label}</span>
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '50px',
                            background: 'transparent',
                            color: '#aaa',
                            fontWeight: 600,
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        style={{ flex: 2, opacity: selectedActivity ? 1 : 0.5, pointerEvents: selectedActivity ? 'auto' : 'none' }}
                        onClick={handleSend}
                    >
                        Send Request
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'waiting') {
        return (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ fontSize: '48px', marginBottom: '16px' }}
                >
                    ⏳
                </motion.div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Waiting for {targetUser.name}...</h2>
                <p style={{ color: '#aaa', marginBottom: '24px' }}>Request expires in</p>
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    marginBottom: '32px',
                    color: 'var(--primary-color)'
                }}>
                    {formatTime(timeLeft)}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '50px',
                        background: 'var(--surface-color)',
                        color: '#aaa',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    Cancel Request
                </button>
            </div>
        );
    }

    // Accepted Step
    return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}
            >
                <CheckCircleIcon style={{ width: '80px', height: '80px', color: 'var(--secondary-color)' }} />
            </motion.div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary-color)', marginBottom: '16px' }}>Accepted!</h2>

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
                        {ACTIVITIES.find(a => a.type === selectedActivity)?.emoji} {ACTIVITIES.find(a => a.type === selectedActivity)?.label} with {targetUser.name}
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
                onClick={onConfirm}
            >
                Lets Go!
            </button>
        </div>
    );
};

export default MeetupFlow;
