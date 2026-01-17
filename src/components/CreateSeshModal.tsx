import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { SeshActivityType, User } from '@/types';

interface CreateSeshModalProps {
    currentUser: User;
    onClose: () => void;
    onCreated: () => void;
}

const ACTIVITIES: { type: SeshActivityType; emoji: string; label: string }[] = [
    { type: 'sports', emoji: '🏀', label: 'Sports' },
    { type: 'study', emoji: '📚', label: 'Study' },
    { type: 'coffee', emoji: '☕', label: 'Coffee' },
    { type: 'food', emoji: '🍕', label: 'Food' },
    { type: 'party', emoji: '🎉', label: 'Party' },
    { type: 'other', emoji: '✨', label: 'Other' },
];

const CreateSeshModal: React.FC<CreateSeshModalProps> = ({ currentUser, onClose, onCreated }) => {
    const [title, setTitle] = useState('');
    const [selectedActivity, setSelectedActivity] = useState<SeshActivityType>('study');
    const [maxParticipants, setMaxParticipants] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);

        try {
            const { error } = await supabase.from('seshes').insert({
                creator_id: currentUser.id,
                activity_type: selectedActivity,
                title: title,
                lat: currentUser.lat,
                lng: currentUser.lng,
                max_participants: maxParticipants,
                current_count: 1, // Creator counts as 1
                status: 'active'
            });

            if (error) throw error;
            onCreated();
        } catch (err) {
            console.error('Error creating sesh:', err);
            alert('Failed to start sesh. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if mobile
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
                maxWidth: isMobile ? '100%' : '440px',
                maxHeight: isMobile ? '85vh' : '90vh',
                padding: '24px',
                zIndex: 1002,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                borderBottomLeftRadius: isMobile ? 0 : '24px',
                borderBottomRightRadius: isMobile ? 0 : '24px',
                overflowY: 'auto'
            }}
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>Start a Sesh</h2>

            {/* Title Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#8b949e' }}>What are we doing?</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Late night study grind"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Activity Picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', color: '#8b949e' }}>Vibe Check</label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '10px'
                }}>
                    {ACTIVITIES.map((activity) => (
                        <button
                            key={activity.type}
                            onClick={() => setSelectedActivity(activity.type)}
                            style={{
                                background: selectedActivity === activity.type ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                border: selectedActivity === activity.type ? 'none' : '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.2s ease',
                                color: 'white'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{activity.emoji}</span>
                            <span style={{ fontSize: '0.8rem' }}>{activity.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Participant Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.9rem', color: '#8b949e' }}>How many people?</label>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{maxParticipants}</span>
                </div>
                <input
                    type="range"
                    min="2"
                    max="20"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        accentColor: 'var(--primary-color)',
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                        outline: 'none'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#8b949e' }}>
                    <span>2</span>
                    <span>20</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                    onClick={onClose}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        padding: '14px',
                        borderRadius: '50px',
                        color: '#8b949e',
                        fontWeight: '600'
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreate}
                    disabled={!title.trim() || isSubmitting}
                    className="btn-primary"
                    style={{
                        flex: 2,
                        opacity: (!title.trim() || isSubmitting) ? 0.5 : 1,
                        cursor: (!title.trim() || isSubmitting) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isSubmitting ? 'Starting...' : 'Start Sesh'}
                </button>
            </div>
        </motion.div>
    );
};

export default CreateSeshModal;
