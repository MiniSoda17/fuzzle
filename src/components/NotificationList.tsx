import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '../types';
import { UserIcon, ClockIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface NotificationListProps {
    currentUser: User;
    onClose: () => void;
    onSelectRequest?: (request: any) => void;
}

interface MeetupRecord {
    id: string;
    created_at: string;
    activity: string;
    status: 'pending' | 'accepted' | 'rejected';
    sender_id: string;
    receiver_id: string;
    contact_name?: string;
    contact_avatar?: string;
    meetup_time?: string;
    location_name?: string;
    message?: string;
}

const NotificationItem = ({
    item,
    currentUser,
    isExpanded,
    onToggle,
    onUpdateStatus
}: {
    item: MeetupRecord,
    currentUser: User,
    isExpanded: boolean,
    onToggle: () => void,
    onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void
}) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const isIncoming = item.sender_id !== currentUser.id;

    useEffect(() => {
        if (item.status === 'pending' && item.created_at) {
            const calculateTimeLeft = () => {
                const created = new Date(item.created_at).getTime();
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
    }, [item.status, item.created_at]);

    const handleAction = async (e: React.MouseEvent, status: 'accepted' | 'rejected') => {
        e.stopPropagation(); // Prevent toggling
        await onUpdateStatus(item.id, status);
    };

    return (
        <motion.div
            layout
            onClick={onToggle}
            style={{
                background: isExpanded ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'background 0.3s'
            }}
        >
            {/* Header / Collapsed View */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    overflow: 'hidden', border: '2px solid var(--primary-color)',
                    flexShrink: 0
                }}>
                    {item.contact_avatar ? (
                        <img src={item.contact_avatar} alt={item.contact_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserIcon width={20} />
                        </div>
                    )}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {isIncoming ? `From: ${item.contact_name}` : `To: ${item.contact_name}`}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#aaa', marginLeft: '8px' }}>
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '1rem' }}>
                            {item.activity === 'study' ? '📚' :
                                item.activity === 'hoops' ? '🏀' :
                                    item.activity === 'coffee' ? '☕️' : '✨'}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#ccc' }}>
                            {item.activity.charAt(0).toUpperCase() + item.activity.slice(1)}
                        </span>
                    </div>
                </div>

                <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                    {item.status === 'pending' ? (
                        <ChevronDownIcon width={20} color="#aaa" />
                    ) : item.status === 'accepted' ? (
                        <CheckCircleIcon width={24} color="var(--secondary-color)" />
                    ) : (
                        <XCircleIcon width={24} color="#ef4444" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>

                            {/* Detailed Info Grid */}
                            <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                                {(item.meetup_time || item.location_name) && (
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {item.meetup_time && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                                <ClockIcon width={14} color="#fbbf24" />
                                                <span>{item.meetup_time}</span>
                                            </div>
                                        )}
                                        {item.location_name && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <MapPinIcon width={14} color="#ef4444" />
                                                <span>{item.location_name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {item.message && (
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(50,50,50,0.3)', padding: '8px', borderRadius: '8px' }}>
                                        <ChatBubbleBottomCenterTextIcon width={14} style={{ marginTop: '2px', color: '#aaa' }} />
                                        <p style={{ fontSize: '0.85rem', color: '#ddd', margin: 0, fontStyle: 'italic' }}>"{item.message}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Status Line */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '0.85rem', color: '#bbb' }}>
                                    Status: <span style={{
                                        color: item.status === 'accepted' ? 'var(--secondary-color)' :
                                            item.status === 'rejected' ? '#ef4444' : '#fbbf24',
                                        fontWeight: 600
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                                {item.status === 'pending' && (
                                    <div style={{ fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <ClockIcon width={14} />
                                        {timeLeft}
                                    </div>
                                )}
                            </div>

                            {/* Actions (Only for Incoming Pending) */}
                            {item.status === 'pending' && isIncoming ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={(e) => handleAction(e, 'rejected')}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.08)', color: '#ef4444',
                                            border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
                                        }}
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={(e) => handleAction(e, 'accepted')}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px',
                                            background: 'var(--secondary-color)', color: 'white',
                                            border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
                                        }}
                                    >
                                        Accept
                                    </button>
                                </div>
                            ) : item.status === 'pending' && !isIncoming ? (
                                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#aaa', fontStyle: 'italic' }}>
                                    Waiting for response...
                                </p>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function NotificationList({ currentUser, onClose }: NotificationListProps) {
    const [meetups, setMeetups] = useState<MeetupRecord[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data, error } = await supabase
                .from('meetups')
                .select('*')
                .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                const userIds = new Set<string>();
                data.forEach(m => {
                    userIds.add(m.sender_id);
                    userIds.add(m.receiver_id);
                });

                // Fetch avatar_url too
                const { data: users } = await supabase.from('users').select('id, name, avatar_url').in('id', Array.from(userIds));
                const userMap = new Map(users?.map(u => [u.id, u]) || []);

                const enriched = data.map(m => {
                    const isSender = m.sender_id === currentUser.id;
                    const otherId = isSender ? m.receiver_id : m.sender_id;
                    const otherUser = userMap.get(otherId);
                    return {
                        ...m,
                        contact_name: otherUser?.name || 'Unknown',
                        contact_avatar: otherUser?.avatar_url
                    };
                });
                setMeetups(enriched as MeetupRecord[]);
            }
        };

        fetchHistory();
    }, [currentUser.id]);

    const handleUpdateStatus = async (id: string, status: 'accepted' | 'rejected') => {
        // Optimistic update
        setMeetups(prev => prev.map(m => m.id === id ? { ...m, status } : m));

        // DB Update
        await supabase.from('meetups').update({ status }).eq('id', id);
    };

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
                width: '85%',
                maxWidth: '340px',
                zIndex: 3000,
                padding: '24px',
                borderRadius: '20px 0 0 20px',
                borderLeft: '1px solid var(--border-color)',
                overflowY: 'auto'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Notifications</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meetups.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No history yet.</p>}

                {meetups.map(m => (
                    <NotificationItem
                        key={m.id}
                        item={m}
                        currentUser={currentUser}
                        isExpanded={expandedId === m.id}
                        onToggle={() => setExpandedId(expandedId === m.id ? null : m.id)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ))}
            </div>
        </motion.div>
    );
}
