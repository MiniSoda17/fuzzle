'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/ui/Input';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        console.log('Sign Up Attempt:', data);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Sign up data logged to console! Backend integration ready.');
        }, 1000);
    };

    return (
        <AuthLayout
            title="Join Fuzzle"
            subtitle="Connect with students on your campus."
        >
            <form onSubmit={handleSubmit}>
                <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    required
                />
                <Input
                    label="University Email"
                    name="email"
                    type="email"
                    placeholder="student@university.edu.au"
                    required
                />

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-color)', opacity: 0.8 }}>
                        University
                    </label>
                    <select
                        name="university"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'rgba(255, 255, 255, 0.03)',
                            color: 'var(--text-color)',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                        required
                    >
                        <option value="" disabled selected>Select your campus</option>
                        <option value="UQ">University of Queensland (UQ)</option>
                        <option value="QUT">Queensland University of Technology (QUT)</option>
                        <option value="Griffith">Griffith University</option>
                    </select>
                </div>

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                />

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', marginBottom: '24px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#8b949e' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                        Sign In
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
