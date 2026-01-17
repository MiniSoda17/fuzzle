'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '../types';
import { CheckCircleIcon, MapPinIcon, ClockIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

interface IncomingRequestModalProps {
    request: {
        id: string;
        sender_id: string;
        activity: string;
        status?: string;
        created_at?: string;
        meetup_time?: string;
        location_name?: string;
        message?: string;
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
    const [currentStatus, setCurrentStatus] = useState(request.status || 'pending');
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [hasAccess, setHasAccess] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);

    useEffect(() => {
        const fetchSender = async () => {
            const { data } = await supabase.from('users').select('*').eq('id', request.sender_id).single();
            if (data) setSender(data as User);
        };
        fetchSender();
    }, [request.sender_id]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('payment_success') === 'true') {
                setHasAccess(true);
            }
        }
    }, []);

    useEffect(() => {
        if (currentStatus === 'pending' && request.created_at) {
            const calculateTimeLeft = () => {
                const created = new Date(request.created_at!).getTime();
                const now = new Date().getTime();
                const expiresAt = created + (30 * 60 * 1000); // 30 mins expiry
                const diff = Math.floor((expiresAt - now) / 1000);

                if (diff <= 0) {
                    setTimeLeft('Expired');
                } else {
                    const mins = Math.floor(diff / 60);
                    const secs = diff % 60;
                    setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
                }
            };
            calculateTimeLeft();
            const interval = setInterval(calculateTimeLeft, 1000);
            return () => clearInterval(interval);
        }
    }, [currentStatus, request.created_at]);

    const handleSubscribe = async () => {
        setLoadingPayment(true);
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
            setLoadingPayment(false);
        }
    };

    const handleResponse = async (status: 'accepted' | 'rejected') => {
        await supabase.from('meetups').update({ status }).eq('id', request.id);
        setCurrentStatus(status);
        if (status === 'rejected') {
            setTimeout(onClose, 2000); // Close after 2s if rejected
        }
    };

    if (!sender) return null;

    if (currentStatus === 'accepted') {
        const actInfo = ACTIVITIES_MAP[request.activity] || { emoji: '✨', label: request.activity };

        if (!hasAccess) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel"
                    style={{
                        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                        width: '90%', maxWidth: '400px', padding: '32px', zIndex: 2000, textAlign: 'center'
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
                            disabled={loadingPayment}
                            className="btn-primary"
                            style={{ flex: 2, background: 'var(--secondary-color)', opacity: loadingPayment ? 0.7 : 1 }}
                        >
                            {loadingPayment ? 'Redirecting...' : 'Subscribe Now'}
                        </button>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%" }}
                exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
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
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{request.location_name || 'Main Library Entrance'}</p>
                        </div>
                    </div>
                    {request.meetup_time && (
                        <div style={{ marginTop: '12px' }}>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Time</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ClockIcon style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
                                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{request.meetup_time}</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', background: 'var(--secondary-color)' }}
                    onClick={onClose}
                >
                    Close
                </button>
            </motion.div>
        );
    }

    if (currentStatus === 'rejected') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%" }}
                className="glass-panel"
                style={{
                    position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                    width: '90%', maxWidth: '400px', padding: '32px', zIndex: 2000, textAlign: 'center'
                }}
            >
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>Request Declined</h2>
                <p>Closing...</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: "-50%" }}
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

            {/* Request Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
                {(request.meetup_time || request.location_name) && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        {request.meetup_time && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                                <ClockIcon width={16} color="#fbbf24" />
                                <span>{request.meetup_time}</span>
                            </div>
                        )}
                        {request.location_name && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                                <MapPinIcon width={16} color="#ef4444" />
                                <span>{request.location_name}</span>
                            </div>
                        )}
                    </div>
                )}
                {request.message && (
                    <div style={{ display: 'flex', gap: '6px', maxWidth: '100%' }}>
                        <ChatBubbleBottomCenterTextIcon width={16} color="#aaa" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontStyle: 'italic', color: '#ddd', fontSize: '0.9rem' }}>
                            "{request.message}"
                        </p>
                    </div>
                )}
            </div>

            {timeLeft && (
                <p style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '20px' }}>
                    ⏰ Expires in {timeLeft}
                </p>
            )}

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
