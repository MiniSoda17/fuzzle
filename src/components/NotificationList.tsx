'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '../types';
import { UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface NotificationListProps {
    currentUser: User;
    onClose: () => void;
}

interface MeetupRecord {
    id: string;
    created_at: string;
    activity: string;
    status: 'pending' | 'accepted' | 'rejected';
    sender_id: string;
    receiver_id: string;
    contact_name?: string; // Derived
}

export default function NotificationList({ currentUser, onClose }: NotificationListProps) {
    const [meetups, setMeetups] = useState<MeetupRecord[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from('meetups')
                .select('*')
                .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                // Fetch user names for context
                const userIds = new Set<string>();
                data.forEach(m => {
                    userIds.add(m.sender_id);
                    userIds.add(m.receiver_id);
                });

                const { data: users } = await supabase.from('users').select('id, name').in('id', Array.from(userIds));
                const userMap = new Map(users?.map(u => [u.id, u.name]) || []);

                const enriched = data.map(m => {
                    const isSender = m.sender_id === currentUser.id;
                    const otherId = isSender ? m.receiver_id : m.sender_id;
                    return { ...m, contact_name: userMap.get(otherId) || 'Unknown User' };
                });
                setMeetups(enriched as MeetupRecord[]);
            }
        };

        fetchHistory();
    }, [currentUser.id]);

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="glass-panel"
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '80%',
                maxWidth: '320px',
                zIndex: 3000,
                padding: '24px',
                borderRadius: '20px 0 0 20px',
                borderLeft: '1px solid var(--border-color)',
                overflowY: 'auto'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Notifications</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.5rem' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meetups.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No history yet.</p>}

                {meetups.map(m => (
                    <div key={m.id} style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {m.sender_id === currentUser.id ? `To: ${m.contact_name}` : `From: ${m.contact_name}`}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>
                                {m.activity === 'study' ? '📚' :
                                    m.activity === 'hoops' ? '🏀' :
                                        m.activity === 'coffee' ? '☕️' :
                                            m.activity === 'food' ? '🍔' : '🚶'}
                            </span>
                            <span style={{ fontSize: '0.9rem', color: '#ccc', flex: 1 }}>
                                {m.activity.charAt(0).toUpperCase() + m.activity.slice(1)}
                            </span>
                            {m.status === 'accepted' ? <CheckCircleIcon width={20} color="var(--secondary-color)" /> :
                                m.status === 'rejected' ? <XCircleIcon width={20} color="#ef4444" /> :
                                    <ClockIcon width={20} color="#fbbf24" />}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
