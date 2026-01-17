'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/ui/Input';
import Autocomplete from '@/components/ui/Autocomplete';
import { DEGREES, INTERESTS, Course } from '../../data/courses';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
        degree: '',
        year: 1,
        subjects: [] as string[],
        interests: [] as string[]
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
        }
    };

    const handleNext = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const uploadAvatar = async (userId: string): Promise<string | null> => {
        if (!avatarFile) return null;
        try {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            return null;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let avatarUrl = `/student_profile_${Math.floor(Math.random() * 4) + 1}_1768606123923.png`; // Default

            // If file selected, we need to upload. 
            // BUT, strictly speaking, we can't upload to a user's folder until they exist (RLS might block if using 'authenticated' policy and user isn't auth'd yet).
            // Actually, `supabase.auth.signUp` returns a session if auto-confirm is on.
            // AND we can't upload BEFORE signup if RLS requires auth.
            // Strategy: Signup first, then Upload if we have a session? 
            // DB Trigger runs ON signup. So we need the URL *during* signup for the trigger to insert it.
            // Catch-22? 
            // Solution: 
            // 1. Allow public uploads? No, insecure.
            // 2. Upload AFTER signup using the returned session, then UPDATE the profile?
            //    - Trigger creates profile with default avatar.
            //    - Client uploads image.
            //    - Client updates profile with new URL.
            // This is safer. 

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        university: formData.university,
                        degree: formData.degree,
                        year: formData.year,
                        subjects: formData.subjects,
                        interests: formData.interests,
                        // Don't pass avatar_url here if we are uploading later, 
                        // or pass null to let trigger use default, then update.
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user && avatarFile) {
                // Now upload
                const uploadedUrl = await uploadAvatar(authData.user.id);
                if (uploadedUrl) {
                    await supabase
                        .from('users')
                        .update({ avatar_url: uploadedUrl })
                        .eq('id', authData.user.id);
                }
            }

            window.location.href = '/';

        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    // Step Variants
    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 })
    };

    return (
        <AuthLayout title="Join Fuzzle" subtitle={`Step ${step} of 5`}>
            {/* Step Content */}
            {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', color: 'white' }}>Account Details</h3>
                    <Input label="Full Name" name="name" value={formData.name} onChange={e => updateField('name', e.target.value)} required />
                    <Input label="University Email" name="email" value={formData.email} onChange={e => updateField('email', e.target.value)} required />
                    <Input label="Password" name="password" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} required />
                    <button type="button" onClick={handleNext} className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>Next: Education</button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', color: 'white' }}>Education</h3>

                    {/* University */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>University</label>
                        <select
                            value={formData.university}
                            onChange={e => updateField('university', e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white', outline: 'none'
                            }}
                        >
                            <option value="" disabled>Select Campus</option>
                            <option value="UQ">University of Queensland</option>
                            <option value="QUT">Queensland University of Technology</option>
                            <option value="Griffith">Griffith University</option>
                        </select>
                    </div>

                    {/* Degree */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Degree</label>
                        <select
                            value={formData.degree}
                            onChange={e => updateField('degree', e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white', outline: 'none'
                            }}
                        >
                            <option value="" disabled>Select Degree</option>
                            {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Year */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Year</label>
                        <select
                            value={formData.year}
                            onChange={e => updateField('year', parseInt(e.target.value))}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'white', outline: 'none'
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                                transition: 'background 0.2s'
                            }}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="btn-primary"
                            style={{ flex: 1 }}
                            disabled={!formData.university}
                        >
                            Next: Subjects
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>Current Subjects</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Add the courses you are taking this semester.</p>

                    <Autocomplete
                        label="Search Course Codes"
                        university={formData.university || 'UQ'}
                        onSelect={(c) => {
                            if (!formData.subjects.includes(c.code)) {
                                updateField('subjects', [...formData.subjects, c.code]);
                            }
                        }}
                    />

                    {/* Selected Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                        {formData.subjects.map(s => (
                            <span key={s} style={{
                                padding: '4px 12px', borderRadius: '50px',
                                background: 'rgba(124, 58, 237, 0.2)', color: '#ddd6fe',
                                border: '1px solid rgba(124, 58, 237, 0.5)', fontSize: '0.9rem',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                {s}
                                <button
                                    onClick={() => updateField('subjects', formData.subjects.filter(Sub => Sub !== s))}
                                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                                transition: 'background 0.2s'
                            }}
                        >
                            Back
                        </button>
                        <button type="button" onClick={handleNext} className="btn-primary" style={{ flex: 1 }}>Next: Interests</button>
                    </div>
                </motion.div>
            )}

            {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>Interests</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Select at least 3 interests.</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', maxHeight: '240px', overflowY: 'auto' }}>
                        {INTERESTS.map(interest => {
                            const isSelected = formData.interests.includes(interest);
                            return (
                                <button
                                    key={interest}
                                    type="button"
                                    onClick={() => {
                                        if (isSelected) updateField('interests', formData.interests.filter(i => i !== interest));
                                        else updateField('interests', [...formData.interests, interest]);
                                    }}
                                    style={{
                                        padding: '6px 12px', borderRadius: '50px', fontSize: '0.9rem',
                                        border: isSelected ? '1px solid var(--primary-color)' : '1px solid rgba(255,255,255,0.1)',
                                        background: isSelected ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                        color: isSelected ? 'white' : 'rgba(255,255,255,0.8)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {interest}
                                </button>
                            )
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                                transition: 'background 0.2s'
                            }}
                        >
                            Back
                        </button>
                        <button type="button" onClick={handleNext} className="btn-primary" style={{ flex: 1 }}>Next: Profile Photo</button>
                    </div>
                </motion.div>
            )}

            {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>Profile Photo</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>Show your face to the world!</p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', marginBottom: '16px', position: 'relative'
                        }}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '3rem', opacity: 0.3 }}>📷</span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="avatar-upload"
                            style={{
                                padding: '8px 16px', borderRadius: '50px',
                                background: 'rgba(255,255,255,0.1)', color: 'white',
                                fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                            className="hover:bg-white/20"
                        >
                            {avatarFile ? 'Change Photo' : 'Upload Photo'}
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.1)', color: 'white',
                                transition: 'background 0.2s'
                            }}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn-primary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Creating Profile...' : (avatarFile ? 'Next: Finish' : 'Skip & Finish')}
                        </button>
                    </div>
                </motion.div>
            )}

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#8b949e' }}>
                Already have an account? <Link href="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            </div>
        </AuthLayout>
    );
}
