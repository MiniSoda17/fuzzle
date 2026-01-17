import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // default
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const authHeader = req.headers.get('Authorization');

    if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    if (!authHeader) return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            const userId = session.metadata?.userId;

            if (userId) {
                // Initialize Supabase with User's Token to respect RLS
                const token = authHeader.replace('Bearer ', '');
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        global: { headers: { Authorization: `Bearer ${token}` } }
                    }
                );

                const { error } = await supabase.from('users').update({ is_premium: true }).eq('id', userId);
                if (error) throw error;
            }

            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ success: false, status: session.payment_status });
    } catch (err: any) {
        console.error('Verify Payment Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
