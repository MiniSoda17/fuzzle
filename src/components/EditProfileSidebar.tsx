'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { User } from '../types';
import {
    XMarkIcon,
    CheckIcon,
    CameraIcon
} from '@heroicons/react/24/solid';
import Input from './ui/Input';

interface EditProfileSidebarProps {
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
}

const EditProfileSidebar: React.FC<EditProfileSidebarProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User>(user);

    // Animation variants (reused for consistency)
    const desktopVariants = {
        hidden: { x: '-100%', opacity: 0.5 }, // Slide from LEFT for editing
        visible: { x: 0, opacity: 1 },
        exit: { x: '-100%', opacity: 0.5 }
    };

    const mobileVariants = {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '100%' }
    };

    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
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
                position: 'absolute',
                top: isMobile ? 'auto' : '16px',
                bottom: isMobile ? '0' : '16px',
                left: isMobile ? '0' : '16px',
                right: isMobile ? 'auto' : 'auto',
                width: isMobile ? '100%' : '400px',
                height: isMobile ? '70vh' : 'auto',
                maxHeight: isMobile ? '85vh' : 'calc(100vh - 32px)',
                zIndex: 1002, // Higher than other sidebars
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderBottomLeftRadius: '24px',
                borderBottomRightRadius: '24px',
                borderTopLeftRadius: isMobile ? '24px' : '24px',
                borderTopRightRadius: isMobile ? '24px' : '24px',
                boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
            }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Profile</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-color)'
                        }}
                    >
                        <XMarkIcon style={{ width: '18px' }} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>

                    {/* Avatar Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                            <img
                                src={formData.avatar_url}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }}
                            />
                            <button
                                type="button"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    background: 'var(--primary-color)',
                                    borderRadius: '50%',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    border: '2px solid var(--surface-color)'
                                }}
                            >
                                <CameraIcon style={{ width: '16px' }} />
                            </button>
                        </div>
                    </div>

                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-color)', opacity: 0.8 }}>
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                color: 'var(--text-color)',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-color)', opacity: 0.8 }}>
                                Degree
                            </label>
                            <input
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: 'var(--text-color)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-color)', opacity: 0.8 }}>
                                Year
                            </label>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: 'var(--text-color)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                            </select>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <CheckIcon style={{ width: '20px' }} />
                        Save Changes
                    </button>
                </div>

            </form>
        </motion.div>
    );
};

export default EditProfileSidebar;
