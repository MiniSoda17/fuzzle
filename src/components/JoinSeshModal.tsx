import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Sesh, User } from '@/types';

interface JoinSeshModalProps {
    sesh: Sesh;
    currentUser: User;
    onClose: () => void;
    onJoined: () => void;
}

const JoinSeshModal: React.FC<JoinSeshModalProps> = ({ sesh, currentUser, onClose, onJoined }) => {
    const [isJoining, setIsJoining] = useState(false);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            // Check if already joined (optional, but good for validation)
            const { data: existing } = await supabase
                .from('sesh_participants')
                .select('*')
                .eq('sesh_id', sesh.id)
                .eq('user_id', currentUser.id)
                .single();

            if (existing) {
                alert('You are already in this sesh!');
                onJoined();
                return;
            }

            const { error } = await supabase
                .from('sesh_participants')
                .insert({
                    sesh_id: sesh.id,
                    user_id: currentUser.id
                });

            if (error) throw error;

            // Optimistically update count or wait for realtime?
            // Realtime will handle it, but let's notify parent
            onJoined();
        } catch (err) {
            console.error('Error joining sesh:', err);
            alert('Failed to join sesh. It might be full!');
        } finally {
            setIsJoining(false);
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
                maxWidth: '320px',
                padding: '24px',
                zIndex: 1003,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                textAlign: 'center'
            }}
        >
            <div style={{
                fontSize: '3rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--primary-color)'
            }}>
                {getActivityEmoji(sesh.activity_type)}
            </div>

            <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{sesh.title}</h3>
                <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                    {sesh.current_count} / {sesh.max_participants} people joined
                </p>
                {sesh.creator_id === currentUser.id && (
                    <p style={{ color: 'var(--accent-color)', fontSize: '0.8rem', marginTop: '4px' }}>
                        You started this sesh
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                    onClick={onClose}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '12px',
                        borderRadius: '50px',
                        color: '#8b949e',
                        fontWeight: '600'
                    }}
                >
                    Close
                </button>
                {sesh.creator_id !== currentUser.id && (
                    <button
                        onClick={handleJoin}
                        disabled={isJoining}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            opacity: isJoining ? 0.7 : 1
                        }}
                    >
                        {isJoining ? 'Joining...' : 'Join Sesh'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default JoinSeshModal;
