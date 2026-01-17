'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthLayout from '@/components/AuthLayout';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Refresh router to sync server state (middleware) then navigate
            router.refresh();
            router.replace('/map');

        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to find your study crew."
        >
            <form onSubmit={handleSubmit}>
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="student@university.edu.au"
                    required
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                    <Link href="#" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', marginBottom: '24px', opacity: loading ? 0.7 : 1 }}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#8b949e' }}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
                        Sign Up
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
