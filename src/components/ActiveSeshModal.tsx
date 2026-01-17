import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Sesh, User } from '@/types';

interface ActiveSeshModalProps {
    sesh: Sesh;
    currentUser: User;
    onClose: () => void;
    onLeave: () => void;
}

const ActiveSeshModal: React.FC<ActiveSeshModalProps> = ({ sesh, currentUser, onClose, onLeave }) => {
    const [participants, setParticipants] = useState<User[]>([]);
    const [isLeaving, setIsLeaving] = useState(false);
    const [duration, setDuration] = useState<string>('');

    // Fetch Participants
    useEffect(() => {
        const fetchParticipants = async () => {
            const { data: relations } = await supabase
                .from('sesh_participants')
                .select('user_id')
                .eq('sesh_id', sesh.id);

            const joinedUserIds = relations?.map(r => r.user_id) || [];
            // Creator is always a participant
            const allUserIds = Array.from(new Set([...joinedUserIds, sesh.creator_id]));

            if (allUserIds.length > 0) {
                const { data: users } = await supabase
                    .from('users')
                    .select('*')
                    .in('id', allUserIds);
                if (users) setParticipants(users as User[]);
            }
        };
        fetchParticipants();
    }, [sesh.id, sesh.creator_id]);

    // Timer Logic
    useEffect(() => {
        const calculateDuration = () => {
            const start = new Date(sesh.created_at).getTime();
            const now = new Date().getTime();
            const diff = Math.floor((now - start) / 1000); // seconds

            if (diff < 0) {
                setDuration('Just started');
                return;
            }

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);

            if (hours > 0) {
                setDuration(`${hours}h ${minutes}m`);
            } else {
                setDuration(`${minutes}m`);
            }
        };

        calculateDuration();
        const interval = setInterval(calculateDuration, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [sesh.created_at]);

    const handleLeave = async () => {
        const isCreator = sesh.creator_id === currentUser.id;
        const message = isCreator
            ? "Since you are the host, leaving will END the sesh for everyone. Are you sure?"
            : "Are you sure you want to leave this sesh?";

        if (!confirm(message)) return;
        setIsLeaving(true);

        try {
            if (isCreator) {
                // Determine if we should delete or just set status='ended'
                // For MVP, let's delete (or update status if you prefer soft delete)
                // Let's trying updating status first so it disappears from 'active' queries
                const { error } = await supabase
                    .from('seshes')
                    .update({ status: 'ended' }) // or .delete() if you want it gone gone
                    .eq('id', sesh.id);

                if (error) throw error;
            } else {
                // Delete from participants table
                const { error } = await supabase
                    .from('sesh_participants')
                    .delete()
                    .eq('sesh_id', sesh.id)
                    .eq('user_id', currentUser.id);

                if (error) throw error;
            }
            onLeave();
        } catch (err) {
            console.error('Error leaving sesh:', err);
            alert('Failed to leave sesh.');
        } finally {
            setIsLeaving(false);
        }
    };

    const getActivityEmoji = (activity: string) => {
        switch (activity) {
            case 'sports': return '🏀';
            case 'study': return '📚';
            case 'coffee': return '☕';
            case 'food': return '🍕';
            case 'party': return '🎉';
            case 'other': return '✨';
            default: return '📍';
        }
    };

    // Check for mobile
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    // Animation variants
    const desktopVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    const mobileVariants = {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '100%' }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={isMobile ? mobileVariants : desktopVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel"
            style={{
                position: 'fixed',
                top: isMobile ? 'auto' : '50%',
                bottom: isMobile ? '0' : 'auto',
                left: isMobile ? '0' : '50%',
                right: isMobile ? '0' : 'auto',
                transform: isMobile ? 'none' : 'translate(-50%, -50%)',
                width: isMobile ? '100%' : '90%',
                maxWidth: isMobile ? '100%' : '360px',
                padding: '24px',
                zIndex: 1003,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                textAlign: 'center',
                borderBottomLeftRadius: isMobile ? 0 : '24px',
                borderBottomRightRadius: isMobile ? 0 : '24px'
            }}
        >
            <div style={{
                fontSize: '3.5rem',
                background: 'rgba(124, 58, 237, 0.2)', // Primary color tint
                borderRadius: '50%',
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--primary-color)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'
            }}>
                {getActivityEmoji(sesh.activity_type)}
            </div>

            <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{sesh.title}</h3>
                <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    marginTop: '8px',
                    fontSize: '0.9rem',
                    color: '#e2e8f0'
                }}>
                    ⏱️ Ongoing for {duration}
                </div>
            </div>

            {/* Participants list */}
            {participants.length > 0 && (
                <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
                    <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '8px', textAlign: 'left', paddingLeft: '4px' }}>
                        Who's here ({participants.length})
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', paddingLeft: '4px' }}>
                        {participants.map(p => (
                            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px' }}>
                                <img
                                    src={p.avatar_url}
                                    alt={p.name}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid var(--border-color)'
                                    }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60px' }}>
                                    {p.name.split(' ')[0]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: 'auto' }}>
                <button
                    onClick={onClose}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '14px',
                        borderRadius: '16px',
                        color: '#8b949e',
                        fontWeight: '600'
                    }}
                >
                    Close
                </button>
                <button
                    onClick={handleLeave}
                    disabled={isLeaving}
                    style={{
                        flex: 2,
                        background: 'rgba(239, 68, 68, 0.2)', // Red tint for destructive
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        padding: '14px',
                        borderRadius: '16px',
                        color: '#f87171',
                        fontWeight: '600',
                        opacity: isLeaving ? 0.7 : 1,
                        cursor: isLeaving ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLeaving ? 'Leaving...' : 'Leave Sesh'}
                </button>
            </div>
        </motion.div>
    );
};

export default ActiveSeshModal;
