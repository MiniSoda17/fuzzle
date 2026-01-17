'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/ui/Input';
import Autocomplete from '@/components/ui/Autocomplete';
import { DEGREES, INTERESTS, Course, UNIVERSITIES } from '../../data/courses';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error'>('idle');
    const [userId, setUserId] = useState<string | null>(null);

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

    const handleCreateAccount = async () => {
        setLoading(true);
        try {
            let avatarUrl = '/default-avatar.svg'; // Default Smiley Face

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

            // Get default location based on university
            // Get default location from UNIVERSITIES data
            const selectedUni = UNIVERSITIES.find(u => u.id === formData.university);
            const defaultLocation = selectedUni?.location || { lat: -27.4975, lng: 153.0137 };

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
                        bio: '',  // Default empty bio, user can fill later
                        lat: defaultLocation.lat,
                        lng: defaultLocation.lng,
                        is_online: true,
                        avatar_url: avatarUrl  // Use the default avatar
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                setUserId(authData.user.id);

                // Upload avatar if selected
                if (avatarFile) {
                    const uploadedUrl = await uploadAvatar(authData.user.id);
                    if (uploadedUrl) {
                        await supabase
                            .from('users')
                            .update({ avatar_url: uploadedUrl })
                            .eq('id', authData.user.id);
                    }
                }

                // Move to location step
                setStep(6);
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const requestLocation = async () => {
        if (!userId) {
            setStep(7);
            return;
        }

        setLocationStatus('requesting');

        if (!navigator.geolocation) {
            setLocationStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Save to Supabase
                await supabase
                    .from('users')
                    .update({ lat: latitude, lng: longitude })
                    .eq('id', userId);

                setLocationStatus('granted');

                // Redirect after brief delay to show success
                setTimeout(() => {
                    setStep(7);
                }, 1000);
            },
            (error) => {
                console.error('Location error:', error);
                setLocationStatus('denied');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const skipLocation = () => {
        setStep(7);
    };

    const handleSubscription = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                }),
            });

            const { url, error } = await response.json();
            if (error) throw new Error(error);
            if (url) window.location.href = url;

        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleFreePlan = () => {
        router.push('/map');
    };

    // Step Variants
    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 })
    };

    return (
        <AuthLayout title={step === 7 ? "Choose Your Plan" : "Join Colleko"} subtitle={step === 7 ? "Start your journey" : `Step ${step} of 6`}>

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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                            {UNIVERSITIES.map(uni => {
                                const isSelected = formData.university === uni.id;
                                return (
                                    <button
                                        key={uni.id}
                                        type="button"
                                        onClick={() => updateField('university', uni.id)}
                                        style={{
                                            border: isSelected ? `2px solid ${uni.color}` : '1px solid rgba(255,255,255,0.1)',
                                            background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{
                                            width: '60px', height: '60px', borderRadius: '8px',
                                            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px'
                                        }}>
                                            <img src={uni.logo} alt={uni.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'white', textAlign: 'center', fontWeight: 500 }}>
                                            {uni.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
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
                            onClick={handleCreateAccount}
                            className="btn-primary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? 'Creating Profile...' : 'Next: Location'}
                        </button>
                    </div>
                </motion.div>
            )}

            {step === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>Enable Location</h3>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                        Share your location to see students near you and be discovered by others.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                        {/* Location Status Icon */}
                        <div style={{
                            width: '100px', height: '100px', borderRadius: '50%',
                            background: locationStatus === 'granted' ? 'rgba(34, 197, 94, 0.2)' :
                                locationStatus === 'denied' || locationStatus === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                                    'rgba(255,255,255,0.1)',
                            border: `2px solid ${locationStatus === 'granted' ? 'rgba(34, 197, 94, 0.5)' :
                                locationStatus === 'denied' || locationStatus === 'error' ? 'rgba(239, 68, 68, 0.5)' :
                                    'rgba(255,255,255,0.2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px', transition: 'all 0.3s'
                        }}>
                            {locationStatus === 'requesting' ? (
                                <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>📍</span>
                            ) : locationStatus === 'granted' ? (
                                <span style={{ fontSize: '2.5rem' }}>✅</span>
                            ) : locationStatus === 'denied' || locationStatus === 'error' ? (
                                <span style={{ fontSize: '2.5rem' }}>❌</span>
                            ) : (
                                <span style={{ fontSize: '2.5rem' }}>📍</span>
                            )}
                        </div>

                        {/* Status Message */}
                        <p style={{
                            fontSize: '0.95rem',
                            color: locationStatus === 'granted' ? '#22c55e' :
                                locationStatus === 'denied' ? '#ef4444' : 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            marginBottom: '8px'
                        }}>
                            {locationStatus === 'idle' && 'Tap the button below to share your location'}
                            {locationStatus === 'requesting' && 'Requesting location access...'}
                            {locationStatus === 'granted' && 'Location enabled! Redirecting to map...'}
                            {locationStatus === 'denied' && 'Location access denied. You can still use the app.'}
                            {locationStatus === 'error' && 'Could not get location. You can try again or skip.'}
                        </p>
                    </div>

                    {locationStatus !== 'granted' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                            <button
                                type="button"
                                onClick={requestLocation}
                                className="btn-primary"
                                style={{ width: '100%' }}
                                disabled={locationStatus === 'requesting'}
                            >
                                {locationStatus === 'requesting' ? 'Getting Location...' :
                                    locationStatus === 'denied' || locationStatus === 'error' ? 'Try Again' : 'Enable Location'}
                            </button>

                            {(locationStatus === 'idle' || locationStatus === 'denied' || locationStatus === 'error') && (
                                <button
                                    type="button"
                                    onClick={skipLocation}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '8px',
                                        background: 'transparent', color: 'rgba(255,255,255,0.6)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.2s', cursor: 'pointer'
                                    }}
                                >
                                    Skip for now
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: '#8b949e' }}>
                Already have an account? <Link href="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
            </div>
            {step === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {/* Early Bird Plan */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(244, 63, 94, 0.2))',
                            border: '1px solid var(--primary-color)',
                            borderRadius: '16px',
                            padding: '24px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', top: '12px', right: '12px',
                                background: 'var(--accent-color)', color: 'white',
                                fontSize: '0.7rem', fontWeight: 700, padding: '4px 8px', borderRadius: '50px'
                            }}>
                                EARLY BIRD
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 8px', color: 'white' }}>Premium</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>
                                $7.99<span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>/mo</span>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', display: 'grid', gap: '8px' }}>
                                <li style={{ display: 'flex', gap: '8px' }}>✅ Unlimited Meetups</li>
                                <li style={{ display: 'flex', gap: '8px' }}>✅ See Who's Nearby</li>
                                <li style={{ display: 'flex', gap: '8px' }}>✅ Early Adopter Badge</li>
                                <li style={{ display: 'flex', gap: '8px' }}>✅ Support Development</li>
                            </ul>
                            <button
                                onClick={handleSubscription}
                                className="btn-primary"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Get Early Bird Offer'}
                            </button>
                        </div>

                        {/* Free Plan */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            padding: '20px'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 4px', color: 'white' }}>Free Tier</h3>
                            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                                Basic access to map and meetups but with limited features.
                            </p>
                            <button
                                onClick={handleFreePlan}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px',
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white', cursor: 'pointer', fontWeight: 500
                                }}
                            >
                                Continue for Free
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AuthLayout>
    );
}
