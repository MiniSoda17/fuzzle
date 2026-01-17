import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const isAuthPage = request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/login';
    const isHomePage = request.nextUrl.pathname === '/';

    // If user is not authenticated and trying to access home page, redirect to signup
    if (!user && isHomePage) {
        const signupUrl = new URL('/signup', request.url);
        return NextResponse.redirect(signupUrl);
    }

    // If user is authenticated and trying to access auth pages, redirect to home
    if (user && isAuthPage) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }

    return response;
}

export const config = {
    matcher: ['/', '/signup', '/login'],
};
